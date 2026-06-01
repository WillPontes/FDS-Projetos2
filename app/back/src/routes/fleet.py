from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from src.database.connection import get_db
from src.errors import messages as err
from src.middleware.dev_auth import apply_org_scope_for_gestor, get_current_user_dev
from src.models.fleet import FleetPublic
from src.models.user import User, UserPublic
from src.models.vehicle import VehiclePublic
from src.repositories.fleet_repository import FleetRepository
from src.repositories.transaction_repository import TransactionRepository

router = APIRouter(prefix="/fleets", tags=["Fleets"])


class FleetBody(BaseModel):
    name: str
    organization_id: int


class FleetUpdate(BaseModel):
    name: str | None = None


@router.get("/")
async def list_fleets(
    organization_id: int | None = Query(default=None),
    search: str | None = Query(default=None),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    paginate: bool = Query(default=False),
    db: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_current_user_dev),
):
    org_scope = apply_org_scope_for_gestor(current_user, organization_id)
    repo = FleetRepository(db)
    if paginate:
        items, total = await repo.get_paginated(page, page_size, org_scope, search)
        return {
            "items": [FleetPublic.model_validate(f) for f in items],
            "total": total,
        }
    fleets = await repo.get_all(org_scope, search)
    return {"data": [FleetPublic.model_validate(f) for f in fleets]}


@router.get("/{fleet_id}")
async def get_fleet(
    fleet_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_current_user_dev),
):
    fleet = await FleetRepository(db).get_by_id(fleet_id)
    if not fleet:
        raise HTTPException(status_code=404, detail=err.FLEET_NOT_FOUND)
    org_scope = apply_org_scope_for_gestor(current_user, None)
    if org_scope is not None and fleet.organization_id != org_scope:
        raise HTTPException(status_code=403, detail=err.ACCESS_DENIED)
    return {"data": FleetPublic.model_validate(fleet)}


@router.get("/{fleet_id}/summary")
async def get_fleet_summary(
    fleet_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_current_user_dev),
):
    fleet = await FleetRepository(db).get_by_id(fleet_id)
    if not fleet:
        raise HTTPException(status_code=404, detail=err.FLEET_NOT_FOUND)
    org_scope = apply_org_scope_for_gestor(current_user, None)
    if org_scope is not None and fleet.organization_id != org_scope:
        raise HTTPException(status_code=403, detail=err.ACCESS_DENIED)
    return await FleetRepository(db).get_summary(fleet_id)


@router.get("/{fleet_id}/transactions")
async def get_fleet_transactions(
    fleet_id: int,
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=10, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_current_user_dev),
):
    fleet = await FleetRepository(db).get_by_id(fleet_id)
    if not fleet:
        raise HTTPException(status_code=404, detail=err.FLEET_NOT_FOUND)
    org_scope = apply_org_scope_for_gestor(current_user, None)
    if org_scope is not None and fleet.organization_id != org_scope:
        raise HTTPException(status_code=403, detail=err.ACCESS_DENIED)
    vehicles = await FleetRepository(db).get_vehicles(fleet_id)
    vehicle_ids = [v.id for v in vehicles if v.id is not None]
    if not vehicle_ids:
        return {"items": [], "total": 0}
    repo = TransactionRepository(db)
    items, total = await repo.get_by_vehicle_ids_paginated(vehicle_ids, page, page_size)
    from src.dto.transactions import TransactionPublic
    return {
        "items": [TransactionPublic.model_validate(t) for t in items],
        "total": total,
    }


@router.post("/", status_code=201)
async def create_fleet(
    body: FleetBody,
    db: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_current_user_dev),
):
    org_scope = apply_org_scope_for_gestor(current_user, body.organization_id)
    if org_scope is not None and body.organization_id != org_scope:
        raise HTTPException(status_code=403, detail=err.ACCESS_DENIED)
    fleet = await FleetRepository(db).create(body.name, body.organization_id)
    await db.commit()
    return {"data": FleetPublic.model_validate(fleet)}


@router.patch("/{fleet_id}")
async def update_fleet(
    fleet_id: int,
    body: FleetUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_current_user_dev),
):
    fleet = await FleetRepository(db).get_by_id(fleet_id)
    if not fleet:
        raise HTTPException(status_code=404, detail=err.FLEET_NOT_FOUND)
    org_scope = apply_org_scope_for_gestor(current_user, None)
    if org_scope is not None and fleet.organization_id != org_scope:
        raise HTTPException(status_code=403, detail=err.ACCESS_DENIED)
    updated = await FleetRepository(db).update(fleet_id, body.name)
    await db.commit()
    return {"data": FleetPublic.model_validate(updated)}


@router.delete("/{fleet_id}", status_code=204)
async def delete_fleet(
    fleet_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_current_user_dev),
):
    fleet = await FleetRepository(db).get_by_id(fleet_id)
    if not fleet:
        raise HTTPException(status_code=404, detail=err.FLEET_NOT_FOUND)
    org_scope = apply_org_scope_for_gestor(current_user, None)
    if org_scope is not None and fleet.organization_id != org_scope:
        raise HTTPException(status_code=403, detail=err.ACCESS_DENIED)
    await FleetRepository(db).delete(fleet_id)
    await db.commit()


@router.get("/{fleet_id}/users", response_model=list[UserPublic])
async def list_fleet_users(
    fleet_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_current_user_dev),
):
    fleet = await FleetRepository(db).get_by_id(fleet_id)
    if not fleet:
        raise HTTPException(status_code=404, detail=err.FLEET_NOT_FOUND)
    org_scope = apply_org_scope_for_gestor(current_user, None)
    if org_scope is not None and fleet.organization_id != org_scope:
        raise HTTPException(status_code=403, detail=err.ACCESS_DENIED)
    users = await FleetRepository(db).get_users(fleet_id)
    return [UserPublic.model_validate(u) for u in users]


@router.post("/{fleet_id}/users/{user_id}", status_code=201)
async def link_fleet_user(
    fleet_id: int,
    user_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_current_user_dev),
):
    fleet = await FleetRepository(db).get_by_id(fleet_id)
    if not fleet:
        raise HTTPException(status_code=404, detail=err.FLEET_NOT_FOUND)
    org_scope = apply_org_scope_for_gestor(current_user, None)
    if org_scope is not None and fleet.organization_id != org_scope:
        raise HTTPException(status_code=403, detail=err.ACCESS_DENIED)
    await FleetRepository(db).link_user(fleet_id, user_id)
    await db.commit()
    return {"message": "Usuário vinculado."}


@router.delete("/{fleet_id}/users/{user_id}", status_code=204)
async def unlink_fleet_user(
    fleet_id: int,
    user_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_current_user_dev),
):
    fleet = await FleetRepository(db).get_by_id(fleet_id)
    if not fleet:
        raise HTTPException(status_code=404, detail=err.FLEET_NOT_FOUND)
    org_scope = apply_org_scope_for_gestor(current_user, None)
    if org_scope is not None and fleet.organization_id != org_scope:
        raise HTTPException(status_code=403, detail=err.ACCESS_DENIED)
    await FleetRepository(db).unlink_user(fleet_id, user_id)
    await db.commit()


@router.get("/{fleet_id}/vehicles", response_model=list[VehiclePublic])
async def list_fleet_vehicles(
    fleet_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_current_user_dev),
):
    fleet = await FleetRepository(db).get_by_id(fleet_id)
    if not fleet:
        raise HTTPException(status_code=404, detail=err.FLEET_NOT_FOUND)
    org_scope = apply_org_scope_for_gestor(current_user, None)
    if org_scope is not None and fleet.organization_id != org_scope:
        raise HTTPException(status_code=403, detail=err.ACCESS_DENIED)
    vehicles = await FleetRepository(db).get_vehicles(fleet_id)
    return [VehiclePublic.model_validate(v) for v in vehicles]


@router.post("/{fleet_id}/vehicles/{vehicle_id}", status_code=201)
async def link_fleet_vehicle(
    fleet_id: int,
    vehicle_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_current_user_dev),
):
    fleet = await FleetRepository(db).get_by_id(fleet_id)
    if not fleet:
        raise HTTPException(status_code=404, detail=err.FLEET_NOT_FOUND)
    org_scope = apply_org_scope_for_gestor(current_user, None)
    if org_scope is not None and fleet.organization_id != org_scope:
        raise HTTPException(status_code=403, detail=err.ACCESS_DENIED)
    vehicle = await FleetRepository(db).link_vehicle(fleet_id, vehicle_id)
    if vehicle is None:
        raise HTTPException(status_code=404, detail=err.VEHICLE_NOT_FOUND)
    await db.commit()
    return {"data": VehiclePublic.model_validate(vehicle)}


@router.delete("/{fleet_id}/vehicles/{vehicle_id}", status_code=204)
async def unlink_fleet_vehicle(
    fleet_id: int,
    vehicle_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_current_user_dev),
):
    fleet = await FleetRepository(db).get_by_id(fleet_id)
    if not fleet:
        raise HTTPException(status_code=404, detail=err.FLEET_NOT_FOUND)
    org_scope = apply_org_scope_for_gestor(current_user, None)
    if org_scope is not None and fleet.organization_id != org_scope:
        raise HTTPException(status_code=403, detail=err.ACCESS_DENIED)
    vehicle = await FleetRepository(db).unlink_vehicle(fleet_id, vehicle_id)
    if vehicle is None:
        raise HTTPException(status_code=404, detail=err.VEHICLE_NOT_LINKED_TO_FLEET)
    await db.commit()
