from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from src.database.connection import get_db
from src.dto.vehicle import VehicleIn, VehicleUpdate
from src.middleware.dev_auth import apply_org_scope_for_gestor, get_current_user_dev
from src.models.user import User, UserRole
from src.models.vehicle import VehicleListPublic, VehiclePublic
from src.repositories.transaction_repository import TransactionRepository
from src.services.vehicles import (
    list_vehicles_paginated as list_vehicles_paginated_svc,
    get_vehicle_by_id as get_vehicle_by_id_svc,
    create_vehicle as create_vehicle_svc,
    update_vehicle as update_vehicle_svc,
    delete_vehicle as delete_vehicle_svc,
    get_vehicle_by_license_plate as get_vehicle_by_license_plate_svc,
    get_vehicle_by_tag as get_vehicle_by_tag_svc,
)

router = APIRouter(prefix="/vehicles", tags=["vehicles"])


def _assert_vehicle_access(user: User | None, vehicle: VehiclePublic | object) -> None:
    if user is None or user.role == UserRole.admin:
        return
    if user.role == UserRole.gestor_frota:
        org_id = getattr(vehicle, "organization_id", None)
        if org_id != user.organization_id:
            raise HTTPException(status_code=403, detail="Acesso negado.")


@router.get("/", response_model=VehicleListPublic)
async def list_vehicles(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=10, ge=1, le=100),
    search: str | None = Query(default=None),
    organization_id: int | None = Query(default=None),
    fleet_id: int | None = Query(default=None),
    fuel_type: str | None = Query(default=None),
    sem_frota: bool | None = Query(default=None),
    session: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_current_user_dev),
):
    org_scope = apply_org_scope_for_gestor(current_user, organization_id)
    if current_user and current_user.role == UserRole.gestor_frota:
        sem_frota = False
    items, total = await list_vehicles_paginated_svc(
        session, page, page_size, search, org_scope, fleet_id, fuel_type, sem_frota
    )
    return VehicleListPublic(items=[VehiclePublic.model_validate(v) for v in items], total=total)


@router.get("/{vehicle_id}", response_model=VehiclePublic)
async def get_vehicle(
    vehicle_id: int,
    session: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_current_user_dev),
):
    vehicle = await get_vehicle_by_id_svc(session, vehicle_id)
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    _assert_vehicle_access(current_user, vehicle)
    return VehiclePublic.model_validate(vehicle)


@router.post("/", response_model=VehiclePublic, status_code=201)
async def create_vehicle(
    vehicle_in: VehicleIn,
    session: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_current_user_dev),
):
    if current_user and current_user.role == UserRole.gestor_frota:
        if vehicle_in.fleet_id is None and vehicle_in.organization_id != current_user.organization_id:
            raise HTTPException(status_code=403, detail="Gestor deve vincular veículo à própria org/frota.")
    existing_plate = await get_vehicle_by_license_plate_svc(session, vehicle_in.license_plate)
    if existing_plate:
        raise HTTPException(status_code=409, detail="License plate already exists")
    existing_tag = await get_vehicle_by_tag_svc(session, vehicle_in.id_tag)
    if existing_tag:
        raise HTTPException(status_code=409, detail="Tag already exists")
    try:
        vehicle = await create_vehicle_svc(session, vehicle_in)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e
    await session.commit()
    return VehiclePublic.model_validate(vehicle)


@router.patch("/{vehicle_id}", response_model=VehiclePublic)
async def update_vehicle(
    vehicle_id: int,
    vehicle_update: VehicleUpdate,
    session: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_current_user_dev),
):
    existing = await get_vehicle_by_id_svc(session, vehicle_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    _assert_vehicle_access(current_user, existing)
    try:
        vehicle = await update_vehicle_svc(session, vehicle_id, vehicle_update)
    except ValueError as e:
        msg = str(e)
        status = 409 if "already exists" in msg else 400
        raise HTTPException(status_code=status, detail=msg) from e
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    await session.commit()
    return VehiclePublic.model_validate(vehicle)


@router.get("/{vehicle_id}/summary")
async def get_vehicle_summary(
    vehicle_id: int,
    session: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_current_user_dev),
):
    from sqlalchemy import func, select
    from src.models.transaction import Transaction

    vehicle = await get_vehicle_by_id_svc(session, vehicle_id)
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    _assert_vehicle_access(current_user, vehicle)
    result = await session.execute(
        select(
            func.count(),
            func.coalesce(func.sum(Transaction.co2_avoided_kg), 0),
            func.coalesce(func.sum(Transaction.fuel_saved_liters), 0),
            func.coalesce(func.sum(Transaction.financial_savings_brl), 0),
            func.coalesce(func.sum(Transaction.time_saved_sec), 0),
        ).where(Transaction.vehicle_id == vehicle_id)
    )
    count, co2, fuel, financial, time_sec = result.one()
    return {
        "transaction_count": int(count),
        "co2_total_kg": float(co2),
        "fuel_total_liters": float(fuel),
        "financial_total_brl": float(financial),
        "time_total_sec": float(time_sec),
    }


@router.get("/{vehicle_id}/transactions")
async def list_vehicle_transactions(
    vehicle_id: int,
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=10, ge=1, le=100),
    session: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_current_user_dev),
):
    vehicle = await get_vehicle_by_id_svc(session, vehicle_id)
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    _assert_vehicle_access(current_user, vehicle)
    repo = TransactionRepository(session)
    items, total = await repo.get_by_vehicle_paginated(vehicle_id, page, page_size)
    from src.dto.transactions import TransactionPublic
    return {
        "items": [TransactionPublic.model_validate(t) for t in items],
        "total": total,
    }


@router.delete("/{vehicle_id}", response_model=dict)
async def delete_vehicle(
    vehicle_id: int,
    session: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_current_user_dev),
):
    existing = await get_vehicle_by_id_svc(session, vehicle_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    _assert_vehicle_access(current_user, existing)
    deleted = await delete_vehicle_svc(session, vehicle_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    await session.commit()
    return {"message": "Vehicle deleted"}
