from collections.abc import Sequence

from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from src.models.user import User


async def list_users(session: AsyncSession) -> Sequence[User]:
    result = await session.execute(select(User))
    return result.scalars().all()

