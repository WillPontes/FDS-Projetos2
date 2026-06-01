from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.fleet import Fleet, FleetUser
from src.models.transaction import Transaction
from src.models.user import User
from src.models.vehicle import Vehicle


class FleetRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_by_id(self, fleet_id: int) -> Fleet | None:
        result = await self.session.execute(select(Fleet).where(Fleet.id == fleet_id))
        return result.scalar_one_or_none()

    async def get_all(
        self,
        organization_id: int | None = None,
        search: str | None = None,
    ) -> list[Fleet]:
        query = select(Fleet)
        if organization_id is not None:
            query = query.where(Fleet.organization_id == organization_id)
        if search:
            query = query.where(Fleet.name.ilike(f"%{search}%"))
        result = await self.session.execute(query.order_by(Fleet.name))
        return list(result.scalars().all())

    async def get_paginated(
        self,
        page: int,
        page_size: int,
        organization_id: int | None = None,
        search: str | None = None,
    ) -> tuple[list[Fleet], int]:
        query = select(Fleet)
        if organization_id is not None:
            query = query.where(Fleet.organization_id == organization_id)
        if search:
            query = query.where(Fleet.name.ilike(f"%{search}%"))
        total = (await self.session.execute(select(func.count()).select_from(query.subquery()))).scalar_one()
        offset = (page - 1) * page_size
        result = await self.session.execute(query.order_by(Fleet.name).offset(offset).limit(page_size))
        return list(result.scalars().all()), total

    async def create(self, name: str, organization_id: int) -> Fleet:
        fleet = Fleet(name=name, organization_id=organization_id)
        self.session.add(fleet)
        await self.session.flush()
        return fleet

    async def update(self, fleet_id: int, name: str | None = None) -> Fleet | None:
        fleet = await self.get_by_id(fleet_id)
        if fleet is None:
            return None
        if name is not None:
            fleet.name = name
        await self.session.flush()
        return fleet

    async def delete(self, fleet_id: int) -> bool:
        fleet = await self.get_by_id(fleet_id)
        if fleet is None:
            return False
        await self.session.delete(fleet)
        await self.session.flush()
        return True

    async def link_user(self, fleet_id: int, user_id: int) -> FleetUser:
        existing = await self.session.execute(
            select(FleetUser).where(
                FleetUser.fleet_id == fleet_id,
                FleetUser.user_id == user_id,
            )
        )
        row = existing.scalar_one_or_none()
        if row:
            return row
        link = FleetUser(fleet_id=fleet_id, user_id=user_id)
        self.session.add(link)
        await self.session.flush()
        return link

    async def unlink_user(self, fleet_id: int, user_id: int) -> bool:
        result = await self.session.execute(
            select(FleetUser).where(
                FleetUser.fleet_id == fleet_id,
                FleetUser.user_id == user_id,
            )
        )
        row = result.scalar_one_or_none()
        if row is None:
            return False
        await self.session.delete(row)
        await self.session.flush()
        return True

    async def get_users(self, fleet_id: int) -> list[User]:
        result = await self.session.execute(
            select(User)
            .join(FleetUser, FleetUser.user_id == User.id)
            .where(FleetUser.fleet_id == fleet_id)
        )
        return list(result.scalars().all())

    async def link_vehicle(self, fleet_id: int, vehicle_id: int) -> Vehicle | None:
        fleet = await self.get_by_id(fleet_id)
        vehicle = await self.session.get(Vehicle, vehicle_id)
        if fleet is None or vehicle is None:
            return None
        vehicle.fleet_id = fleet_id
        vehicle.organization_id = fleet.organization_id
        await self.session.flush()
        return vehicle

    async def unlink_vehicle(self, fleet_id: int, vehicle_id: int) -> Vehicle | None:
        vehicle = await self.session.get(Vehicle, vehicle_id)
        if vehicle is None or vehicle.fleet_id != fleet_id:
            return None
        vehicle.fleet_id = None
        vehicle.organization_id = None
        await self.session.flush()
        return vehicle

    async def get_vehicles(self, fleet_id: int) -> list[Vehicle]:
        result = await self.session.execute(select(Vehicle).where(Vehicle.fleet_id == fleet_id))
        return list(result.scalars().all())

    async def get_summary(self, fleet_id: int) -> dict:
        vehicle_count = (
            await self.session.execute(
                select(func.count()).where(Vehicle.fleet_id == fleet_id)
            )
        ).scalar_one()
        driver_count = (
            await self.session.execute(
                select(func.count()).select_from(FleetUser).where(FleetUser.fleet_id == fleet_id)
            )
        ).scalar_one()
        tx_stats = (
            await self.session.execute(
                select(
                    func.count(),
                    func.coalesce(func.sum(Transaction.co2_avoided_kg), 0),
                    func.coalesce(func.sum(Transaction.fuel_saved_liters), 0),
                    func.coalesce(func.sum(Transaction.financial_savings_brl), 0),
                ).where(Transaction.vehicle_id.in_(
                    select(Vehicle.id).where(Vehicle.fleet_id == fleet_id)
                ))
            )
        ).one()
        count, co2, fuel, savings = tx_stats
        return {
            "vehicle_count": int(vehicle_count),
            "driver_count": int(driver_count),
            "transaction_count": int(count),
            "co2_total_kg": float(co2),
            "fuel_total_liters": float(fuel),
            "total_savings_brl": float(savings),
        }
