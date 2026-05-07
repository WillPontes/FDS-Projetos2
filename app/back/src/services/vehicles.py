from collections.abc import Sequence

from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from src.models.vehicle import Car

async def list_vehicle (session: AsyncSession) -> Sequence[Car]:
    result = await session.execute(select(Car))
    return result.scalars().all()


async def get_vehicle_by_id(session: AsyncSession, vehicle_id: int) -> Car | None:
    result = await session.execute(select(Car).where(Car.id == vehicle_id))
    return result.scalar_one_or_none()

async def get_vehicle_by_placa(session: AsyncSession, placa: str) -> Car | None:
    result = await session.execute(select(Car).where(Car.placa == placa))
    return result.scalar_one_or_none()

async def get_vehicle_by_tag(session: AsyncSession, id_tag: str) -> Car | None:
    result = await session.execute(select(Car).where(Car.id_tag == id_tag))

    return result.scalar_one_or_none()

async def create_vehicle(session: AsyncSession, car: Car) -> Car: 
    session.add(car)

    await session.commit()
    await session.refresh(car)

    return car

async def update_vehicle(session: AsyncSession, vehicle_id: int, data: dict) -> Car | None:
    vehicle = await get_vehicle_by_id(session, vehicle_id)

    if not vehicle:
        return None
    
    for key, value in data.items():
        setattr(vehicle, key, value)
    session.add(vehicle)

    await session.commit()
    await session.refresh(vehicle)
    return vehicle

async def delete_vehicle(session: AsyncSession, vehicle_id: int) -> bool:
    vehicle = await get_vehicle_by_id(session, vehicle_id)

    if not vehicle:
        return False
    await session.delete(vehicle)
    await session.commit()
    return True