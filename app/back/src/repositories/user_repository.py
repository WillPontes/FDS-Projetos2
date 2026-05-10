from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.user import User


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

    async def create(self, name: str, email: str) -> User:
        user = User(name=name, email=email)
        self.session.add(user)
        await self.session.flush()
        return user

    async def update(self, id: int, name: str | None = None, email: str | None = None) -> Optional[User]:
        user = await self.get_by_id(id)
        if user is None:
            return None
        if name is not None:
            user.name = name
        if email is not None:
            user.email = email
        await self.session.flush()
        return user

    async def delete(self, id: int) -> bool:
        user = await self.get_by_id(id)
        if user is None:
            return False
        self.session.delete(user)
        return True
