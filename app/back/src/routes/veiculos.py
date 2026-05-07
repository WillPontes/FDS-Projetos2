from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from src.lib.db import get_session
from src.models.vehicle import Car
from src.services.vehicles import (
    list_vehicle,
    get_vehicle_by_id,
    create_vehicle,
    update_vehicle,
    delete_vehicle,
    get_vehicle_by_placa,
    get_vehicle_by_tag
)

router = APIRouter(tags=["vehicle"])

@router.get("/vehicle", response_model=list[Car])
async def get_veiculos(session: AsyncSession = Depends(get_session)):
    return await list_vehicle(session)

@router.get("/vehicle/{vehicle_id}", response_model=Car)
async def get_vehicle(
    vehicle_id = int,
    session: AsyncSession = Depends(get_session)
):
    vehicle = await get_vehicle_by_id(session, vehicle_id)
    
    if not vehicle:
        raise HTTPException(
            status_code=404,
            detail = "Vehicle not found"
        )
    return vehicle
    

@router.post("/vehicle", response_model=Car)
async def create_vehicle(
    car: Car,
    session: AsyncSession = Depends(get_session)
):
    existing_placa = await get_vehicle_by_placa(session, car.placa)
    if existing_placa:
        raise HTTPException(
            status_code = 400,
            datail = "Plate already exists"
        )
    existing_tag = await get_vehicle_by_tag(
        session,
        car.placa
    )
    if existing_placa:
        raise HTTPException(
            status_code = 400,
            datail = "Tag already exists"
        )

    return await create_vehicle(session, car)

@router.patch("/vehicle/{vehicle_id}", response_model=Car)
async def update_vehicle(
    vehicle_id: int,
    data: dict,
    session: AsyncSession = Depends(get_session)
):
    vehicle = await update_vehicle(
        session,
        vehicle_id,
        data
    )
    if not vehicle:
        raise HTTPException(
            status_code=404,
            datail="Vehicle not found"
        )
    return vehicle

@router.delete("/vehicle/{vehicle_id}")
async def delete_vehicle(
    vehicle_id: int,
    session: AsyncSession = Depends(get_session)
):
    deleted = await delete_vehicle(
        session,
        vehicle_id
    )
    if not deleted:
        raise HTTPException(
            status_code=404,
            datail="Vehicle not found"
        )
    return {"message": "Vehicle deleted"}


'''
@router.post
async def create_veiculos(session: AsyncSession = Depends(get_session)):
pass
    cretae

@router.delete

@router.patch
'''