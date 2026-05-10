from sqlalchemy.ext.asyncio import AsyncSession

from src.dto.vehicle import VehicleIn, VehicleUpdate
from src.models.vehicle import Vehicle
from src.repositories.vehicle_repository import VehicleRepository


async def list_vehicles(session: AsyncSession) -> list[Vehicle]:
    return await VehicleRepository(session).get_all()


async def get_vehicle_by_id(session: AsyncSession, vehicle_id: int) -> Vehicle | None:
    return await VehicleRepository(session).get_by_id(vehicle_id)


async def get_vehicle_by_license_plate(session: AsyncSession, license_plate: str) -> Vehicle | None:
    return await VehicleRepository(session).get_by_license_plate(license_plate)


async def get_vehicle_by_tag(session: AsyncSession, id_tag: str) -> Vehicle | None:
    return await VehicleRepository(session).get_by_tag(id_tag)


async def create_vehicle(session: AsyncSession, vehicle_in: VehicleIn) -> Vehicle:
    return await VehicleRepository(session).create(vehicle_in)


async def update_vehicle(session: AsyncSession, vehicle_id: int, vehicle_update: VehicleUpdate) -> Vehicle | None:
    return await VehicleRepository(session).update(vehicle_id, vehicle_update)


async def delete_vehicle(session: AsyncSession, vehicle_id: int) -> bool:
    return await VehicleRepository(session).delete(vehicle_id)
