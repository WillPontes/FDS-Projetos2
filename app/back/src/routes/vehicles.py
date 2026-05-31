from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from src.database.connection import get_db
from src.dto.vehicle import VehicleIn, VehicleUpdate
from src.models.vehicle import VehicleListPublic, VehiclePublic
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


@router.get("/", response_model=VehicleListPublic)
async def list_vehicles(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=10, ge=1, le=100),
    search: str | None = Query(default=None),
    session: AsyncSession = Depends(get_db),
):
    items, total = await list_vehicles_paginated_svc(session, page, page_size, search)
    return VehicleListPublic(items=[VehiclePublic.model_validate(v) for v in items], total=total)


@router.get("/{vehicle_id}", response_model=VehiclePublic)
async def get_vehicle(
    vehicle_id: int,
    session: AsyncSession = Depends(get_db),
):
    vehicle = await get_vehicle_by_id_svc(session, vehicle_id)
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return VehiclePublic.model_validate(vehicle)


@router.post("/", response_model=VehiclePublic, status_code=201)
async def create_vehicle(
    vehicle_in: VehicleIn,
    session: AsyncSession = Depends(get_db),
):
    existing_plate = await get_vehicle_by_license_plate_svc(
        session, vehicle_in.license_plate
    )
    if existing_plate:
        raise HTTPException(status_code=400, detail="License plate already exists")
    existing_tag = await get_vehicle_by_tag_svc(session, vehicle_in.id_tag)
    if existing_tag:
        raise HTTPException(status_code=400, detail="Tag already exists")
    vehicle = await create_vehicle_svc(session, vehicle_in)
    return VehiclePublic.model_validate(vehicle)


@router.patch("/{vehicle_id}", response_model=VehiclePublic)
async def update_vehicle(
    vehicle_id: int,
    vehicle_update: VehicleUpdate,
    session: AsyncSession = Depends(get_db),
):
    vehicle = await update_vehicle_svc(session, vehicle_id, vehicle_update)
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return VehiclePublic.model_validate(vehicle)


@router.delete("/{vehicle_id}", response_model=dict)
async def delete_vehicle(
    vehicle_id: int,
    session: AsyncSession = Depends(get_db),
):
    deleted = await delete_vehicle_svc(session, vehicle_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return {"message": "Vehicle deleted"}
