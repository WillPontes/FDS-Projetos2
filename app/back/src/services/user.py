from sqlalchemy.ext.asyncio import AsyncSession

from src.models.user import User
from src.repositories.user_repository import UserRepository


async def list_users(db: AsyncSession) -> list[User]:
    return await UserRepository(db).get_all()
