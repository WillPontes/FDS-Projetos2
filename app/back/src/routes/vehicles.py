from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from src.database.connection import get_db
from src.dto.vehicle import VehicleIn, VehicleUpdate
from src.models.vehicle import Vehicle
from src.services.vehicles import (
    list_vehicles as list_vehicles_svc,
    get_vehicle_by_id as get_vehicle_by_id_svc,
    create_vehicle as create_vehicle_svc,
    update_vehicle as update_vehicle_svc,
    delete_vehicle as delete_vehicle_svc,
    get_vehicle_by_license_plate as get_vehicle_by_license_plate_svc,
    get_vehicle_by_tag as get_vehicle_by_tag_svc,
)

router = APIRouter(prefix="/vehicles", tags=["vehicles"])


@router.get("/", response_model=list[Vehicle])
async def list_vehicles(session: AsyncSession = Depends(get_db)):
    return await list_vehicles_svc(session)


@router.get("/{vehicle_id}", response_model=Vehicle)
async def get_vehicle(
    vehicle_id: int,
    session: AsyncSession = Depends(get_db),
):
    vehicle = await get_vehicle_by_id_svc(session, vehicle_id)
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return vehicle


@router.post("/", response_model=Vehicle)
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
    return await create_vehicle_svc(session, vehicle_in)


@router.patch("/{vehicle_id}", response_model=Vehicle)
async def update_vehicle(
    vehicle_id: int,
    vehicle_update: VehicleUpdate,
    session: AsyncSession = Depends(get_db),
):
    vehicle = await update_vehicle_svc(session, vehicle_id, vehicle_update)
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return vehicle


@router.delete("/{vehicle_id}", response_model=dict)
async def delete_vehicle(
    vehicle_id: int,
    session: AsyncSession = Depends(get_db),
):
    deleted = await delete_vehicle_svc(session, vehicle_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return {"message": "Vehicle deleted"}
