from typing import Literal, Optional

from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.fleet import FleetUser
from src.models.user import User

UserRole = Literal["motorista", "gestor_frota", "admin"]


class UserRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_by_id(self, id: int) -> Optional[User]:
        result = await self.session.execute(select(User).where(User.id == id))
        return result.scalar_one_or_none()

    async def get_by_email(self, email: str) -> Optional[User]:
        result = await self.session.execute(select(User).where(User.email == email))
        return result.scalar_one_or_none()

    async def get_all(self) -> list[User]:
        result = await self.session.execute(select(User))
        return list(result.scalars().all())

    async def get_all_filtered(
        self,
        role: UserRole | None = None,
        organization_id: int | None = None,
        search: str | None = None,
        fleet_id: int | None = None,
    ) -> list[User]:
        query = select(User)

        if role is not None:
            query = query.where(User.role == role)

        if organization_id is not None:
            query = query.where(
                User.organization_id == organization_id
            )

        if fleet_id is not None:
            query = query.join(
                FleetUser, FleetUser.user_id == User.id
            ).where(FleetUser.fleet_id == fleet_id)

        if search:
            query = query.where(
                or_(
                    User.name.ilike(f"%{search}%"),
                    User.email.ilike(f"%{search}%"),
                )
            )

        result = await self.session.execute(query)

        return list(result.scalars().all())

    async def get_paginated(
        self,
        page: int = 1,
        page_size: int = 20,
        role: UserRole | None = None,
        organization_id: int | None = None,
        search: str | None = None,
        linkable_to_organization_id: int | None = None,
        fleet_id: int | None = None,
    ) -> tuple[list[User], int]:
        query = select(User)

        if role is not None:
            query = query.where(User.role == role)

        if organization_id is not None:
            query = query.where(
                User.organization_id == organization_id
            )

        if fleet_id is not None:
            query = query.join(
                FleetUser, FleetUser.user_id == User.id
            ).where(FleetUser.fleet_id == fleet_id)

        if linkable_to_organization_id is not None:
            query = query.where(
                or_(
                    User.organization_id.is_(None),
                    User.organization_id != linkable_to_organization_id,
                )
            )

        if search:
            query = query.where(
                or_(
                    User.name.ilike(f"%{search}%"),
                    User.email.ilike(f"%{search}%"),
                )
            )

        total_result = await self.session.execute(
            select(func.count()).select_from(query.subquery())
        )
        total = total_result.scalar_one()
        offset = (page - 1) * page_size
        result = await self.session.execute(
            query.order_by(User.name).offset(offset).limit(page_size)
        )
        return list(result.scalars().all()), total

    async def create(
        self,
        name: str,
        email: str,
        password_hash: str,
        role: UserRole = "motorista",
        organization_id: int | None = None,
    ) -> User:
        user = User(
            name=name,
            email=email,
            password_hash=password_hash,
            role=role,
            organization_id=organization_id,
        )

        self.session.add(user)
        await self.session.flush()

        return user

    async def update(
        self,
        id: int,
        name: str | None = None,
        email: str | None = None,
        role: UserRole | None = None,
        organization_id: int | None = None,
        set_organization_id: bool = False,
        email_alerts: bool | None = None,
        push_alerts: bool | None = None,
        weekly_report: bool | None = None,
    ) -> Optional[User]:
        user = await self.get_by_id(id)

        if user is None:
            return None

        if name is not None:
            user.name = name

        if email is not None:
            user.email = email

        if role is not None:
            user.role = role

        if set_organization_id:
            user.organization_id = organization_id

        if email_alerts is not None:
            user.email_alerts = email_alerts

        if push_alerts is not None:
            user.push_alerts = push_alerts

        if weekly_report is not None:
            user.weekly_report = weekly_report

        await self.session.flush()

        return user

    async def delete(self, id: int) -> bool:
        user = await self.get_by_id(id)

        if user is None:
            return False

        await self.session.delete(user)
        await self.session.flush()

        return True