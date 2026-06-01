from sqlalchemy.ext.asyncio import AsyncSession

from src.dto.vehicle import VehicleIn, VehicleUpdate
from src.models.vehicle import Vehicle
from src.repositories.fleet_repository import FleetRepository
from src.repositories.vehicle_repository import VehicleRepository


async def _resolve_fleet_fields(
    session: AsyncSession,
    fleet_id: int | None,
    organization_id: int | None,
) -> tuple[int | None, int | None]:
    """If fleet_id set, derive organization_id. If fleet_id explicitly null, clear org."""
    if fleet_id is None:
        return organization_id, fleet_id
    fleet = await FleetRepository(session).get_by_id(fleet_id)
    if fleet is None:
        raise ValueError("Fleet not found")
    return fleet.organization_id, fleet_id


async def list_vehicles(session: AsyncSession) -> list[Vehicle]:
    return await VehicleRepository(session).get_all()


async def list_vehicles_paginated(
    session: AsyncSession,
    page: int = 1,
    page_size: int = 10,
    search: str | None = None,
    organization_id: int | None = None,
    fleet_id: int | None = None,
    fuel_type: str | None = None,
    sem_frota: bool | None = None,
) -> tuple[list[Vehicle], int]:
    return await VehicleRepository(session).get_paginated(
        page, page_size, search, organization_id, fleet_id, fuel_type, sem_frota
    )


async def get_vehicle_by_id(session: AsyncSession, vehicle_id: int) -> Vehicle | None:
    return await VehicleRepository(session).get_by_id(vehicle_id)


async def get_vehicle_by_license_plate(session: AsyncSession, license_plate: str) -> Vehicle | None:
    return await VehicleRepository(session).get_by_license_plate(license_plate)


async def get_vehicle_by_tag(session: AsyncSession, id_tag: str) -> Vehicle | None:
    return await VehicleRepository(session).get_by_tag(id_tag)


async def _assert_unique_on_update(
    session: AsyncSession,
    vehicle_id: int,
    license_plate: str | None,
    id_tag: str | None,
) -> None:
    if license_plate:
        existing = await get_vehicle_by_license_plate(session, license_plate)
        if existing and existing.id != vehicle_id:
            raise ValueError("License plate already exists")
    if id_tag:
        existing = await get_vehicle_by_tag(session, id_tag)
        if existing and existing.id != vehicle_id:
            raise ValueError("Tag already exists")


async def create_vehicle(session: AsyncSession, vehicle_in: VehicleIn) -> Vehicle:
    org_id, fleet_id = await _resolve_fleet_fields(
        session, vehicle_in.fleet_id, vehicle_in.organization_id
    )
    data = vehicle_in.model_dump()
    data["organization_id"] = org_id
    data["fleet_id"] = fleet_id
    return await VehicleRepository(session).create(VehicleIn(**data))


async def update_vehicle(session: AsyncSession, vehicle_id: int, vehicle_update: VehicleUpdate) -> Vehicle | None:
    await _assert_unique_on_update(
        session,
        vehicle_id,
        vehicle_update.license_plate,
        vehicle_update.id_tag,
    )
    payload = vehicle_update.model_dump(exclude_unset=True)

    if "fleet_id" in payload:
        org_id, fleet_id = await _resolve_fleet_fields(
            session,
            payload.get("fleet_id"),
            payload.get("organization_id"),
        )
        payload["fleet_id"] = fleet_id
        payload["organization_id"] = org_id if fleet_id is not None else None

    return await VehicleRepository(session).update(vehicle_id, VehicleUpdate(**payload))


async def delete_vehicle(session: AsyncSession, vehicle_id: int) -> bool:
    return await VehicleRepository(session).delete(vehicle_id)
