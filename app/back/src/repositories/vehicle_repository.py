from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.dto.vehicle import VehicleIn, VehicleUpdate
from src.models.vehicle import Vehicle


class VehicleRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_by_id(self, vehicle_id: int) -> Vehicle | None:
        result = await self.session.execute(
            select(Vehicle).where(Vehicle.id == vehicle_id)
        )

        return result.scalar_one_or_none()

    async def get_by_license_plate(self, license_plate: str) -> Vehicle | None:
        result = await self.session.execute(
            select(Vehicle).where(Vehicle.license_plate == license_plate)
        )

        return result.scalar_one_or_none()

    async def get_by_tag(self, id_tag: str) -> Vehicle | None:
        result = await self.session.execute(
            select(Vehicle).where(Vehicle.id_tag == id_tag)
        )

        return result.scalar_one_or_none()

    async def get_all(self) -> list[Vehicle]:
        result = await self.session.execute(select(Vehicle))
        return list(result.scalars().all())

    async def get_paginated(
        self,
        page: int = 1,
        page_size: int = 10,
        search: str | None = None,
    ) -> tuple[list[Vehicle], int]:
        query = select(Vehicle)
        if search:
            like = f"%{search}%"
            query = query.where(
                Vehicle.license_plate.ilike(like) | Vehicle.model.ilike(like)
            )
        total_result = await self.session.execute(
            select(func.count()).select_from(query.subquery())
        )
        total = total_result.scalar_one()
        offset = (page - 1) * page_size
        result = await self.session.execute(
            query.offset(offset).limit(page_size)
        )
        return list(result.scalars().all()), total

    async def create(self, vehicle_in: VehicleIn) -> Vehicle:
        vehicle = Vehicle(**vehicle_in.model_dump())

        self.session.add(vehicle)
        await self.session.flush()

        return vehicle

    async def update(
        self,
        vehicle_id: int,
        vehicle_update: VehicleUpdate,
    ) -> Vehicle | None:
        vehicle = await self.get_by_id(vehicle_id)

        if vehicle is None:
            return None

        for key, value in vehicle_update.model_dump(exclude_unset=True).items():
            setattr(vehicle, key, value)

        self.session.add(vehicle)
        await self.session.flush()

        return vehicle

    async def delete(self, vehicle_id: int) -> bool:
        vehicle = await self.get_by_id(vehicle_id)

        if vehicle is None:
            return False

        await self.session.delete(vehicle)
        await self.session.flush()

        return True
