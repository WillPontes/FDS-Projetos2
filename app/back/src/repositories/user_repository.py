from typing import Literal, Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

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

    async def create(
        self,
        name: str,
        email: str,
        role: UserRole = "motorista",
        organization_id: int | None = None,
    ) -> User:
        user = User(
            name=name,
            email=email,
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

        if organization_id is not None:
            user.organization_id = organization_id

        await self.session.flush()

        return user

    async def delete(self, id: int) -> bool:
        user = await self.get_by_id(id)

        if user is None:
            return False

        await self.session.delete(user)
        await self.session.flush()

        return True
