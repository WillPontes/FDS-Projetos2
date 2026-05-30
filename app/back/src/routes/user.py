from typing import Literal

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from src.database.connection import get_db
from src.models.user import UserPublic
from src.repositories.user_repository import UserRepository
from src.services.user import list_users

router = APIRouter(prefix="/users", tags=["Users"])

UserRole = Literal[
    "motorista",
    "gestor_frota",
    "admin",
]


@router.get("/", response_model=list[UserPublic])
async def get_users(
    role: UserRole | None = None,
    organization_id: int | None = None,
    db: AsyncSession = Depends(get_db),
) -> list[UserPublic]:
    rows = await list_users(
        db,
        role=role,
        organization_id=organization_id,
    )

    return [
        UserPublic.model_validate(row)
        for row in rows
    ]


@router.post("/", response_model=UserPublic)
async def create_user(
    name: str,
    email: str,
    role: UserRole = "motorista",
    organization_id: int | None = None,
    db: AsyncSession = Depends(get_db),
) -> UserPublic:
    repository = UserRepository(db)

    existing_user = await repository.get_by_email(email)

    if existing_user:
        raise HTTPException(
            status_code=409,
            detail="Já existe um usuário com este email.",
        )

    user = await repository.create(
        name=name,
        email=email,
        role=role,
        organization_id=organization_id,
    )

    await db.commit()

    return UserPublic.model_validate(user)