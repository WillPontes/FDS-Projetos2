"""Dev auth: resolve current user from X-User-Id header (persona mock)."""

from fastapi import Depends, Header, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from src.database.connection import get_db
from src.models.user import User, UserRole
from src.repositories.user_repository import UserRepository


async def get_current_user_dev(
    x_user_id: int | None = Header(default=None, alias="X-User-Id"),
    db: AsyncSession = Depends(get_db),
) -> User | None:
    if x_user_id is None:
        return None
    user = await UserRepository(db).get_by_id(x_user_id)
    if not user:
        raise HTTPException(status_code=401, detail="Usuário não encontrado.")
    return user


def apply_org_scope_for_gestor(
    user: User | None,
    organization_id: int | None,
) -> int | None:
    if user is None or user.role == UserRole.admin:
        return organization_id
    if user.role == UserRole.gestor_frota:
        return user.organization_id
    return organization_id


def scoped_user_id_for_motorista(user: User | None, requested_user_id: int | None) -> int | None:
    if user is None or user.role != UserRole.motorista:
        return requested_user_id
    return user.id
