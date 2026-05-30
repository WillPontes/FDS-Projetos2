from sqlalchemy.ext.asyncio import AsyncSession

from src.models.user import User
from src.repositories.user_repository import UserRepository, UserRole


async def list_users(
    db: AsyncSession,
    role: UserRole | None = None,
    organization_id: int | None = None,
) -> list[User]:
    return await UserRepository(db).get_all_filtered(
        role=role,
        organization_id=organization_id,
    )