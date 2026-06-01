from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from src.database.connection import get_db
from src.dto.user import UserUpdate
from src.middleware.dev_auth import apply_org_scope_for_gestor, get_current_user_dev
from src.models.user import User, UserPublic, UserRole
from src.models.vehicle import Vehicle
from src.repositories.user_repository import UserRepository
from src.services.user import list_users

router = APIRouter(prefix="/users", tags=["Users"])

UserRoleLiteral = Literal["motorista", "gestor_frota", "admin"]


class UserVehiclesUpdate(BaseModel):
    vehicle_ids: list[int]


@router.get("/", response_model=list[UserPublic])
async def get_users(
    role: UserRoleLiteral | None = None,
    organization_id: int | None = None,
    include_common: bool = Query(default=False),
    search: str | None = None,
    db: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_current_user_dev),
) -> list[UserPublic]:
    org_scope = apply_org_scope_for_gestor(current_user, organization_id)

    if current_user and current_user.role == UserRole.gestor_frota and role == "motorista":
        repo = UserRepository(db)
        org_drivers = await repo.get_all_filtered(role="motorista", organization_id=org_scope, search=search)
        common = await repo.get_all_filtered(role="motorista", organization_id=None, search=search) if include_common or True else []
        seen = {u.id for u in org_drivers}
        merged = org_drivers + [u for u in common if u.id not in seen]
        return [UserPublic.model_validate(row) for row in merged]

    rows = await list_users(db, role=role, organization_id=org_scope, search=search)
    return [UserPublic.model_validate(row) for row in rows]


@router.get("/{user_id}", response_model=UserPublic)
async def get_user_by_id(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_current_user_dev),
) -> UserPublic:
    user = await UserRepository(db).get_by_id(user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado.")
    if current_user and current_user.role == UserRole.gestor_frota:
        if user.organization_id not in (None, current_user.organization_id):
            raise HTTPException(status_code=403, detail="Acesso negado.")
    return UserPublic.model_validate(user)


@router.post("/", response_model=UserPublic)
async def create_user(
    name: str,
    email: str,
    role: UserRoleLiteral = "motorista",
    organization_id: int | None = None,
    db: AsyncSession = Depends(get_db),
) -> UserPublic:
    repository = UserRepository(db)
    existing_user = await repository.get_by_email(email)
    if existing_user:
        raise HTTPException(status_code=409, detail="Já existe um usuário com este email.")
    user = await repository.create(name=name, email=email, role=role, organization_id=organization_id)
    await db.commit()
    return UserPublic.model_validate(user)


@router.patch("/{user_id}", response_model=UserPublic)
async def update_user(
    user_id: int,
    payload: UserUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_current_user_dev),
) -> UserPublic:
    repository = UserRepository(db)
    existing = await repository.get_by_id(user_id)
    if existing is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado.")
    if current_user and current_user.role == UserRole.gestor_frota:
        if existing.organization_id not in (None, current_user.organization_id):
            raise HTTPException(status_code=403, detail="Acesso negado.")

    data = payload.model_dump(exclude_unset=True)
    user = await repository.update(
        id=user_id,
        name=data.get("name"),
        email=data.get("email"),
        role=data.get("role"),
        organization_id=data["organization_id"] if "organization_id" in data else None,
        set_organization_id="organization_id" in data,
    )
    if user is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado.")
    await db.commit()
    return UserPublic.model_validate(user)


@router.patch("/{user_id}/vehicles", response_model=dict)
async def update_user_vehicles(
    user_id: int,
    body: UserVehiclesUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_current_user_dev),
) -> dict:
    user = await UserRepository(db).get_by_id(user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado.")
    if user.role != UserRole.motorista:
        raise HTTPException(status_code=400, detail="Apenas motoristas podem ter veículos vinculados.")
    if user.organization_id is not None and len(body.vehicle_ids) > 1:
        raise HTTPException(status_code=400, detail="Motorista de org só pode ter um veículo.")
    if user.organization_id is None and current_user and current_user.role == UserRole.gestor_frota:
        pass

    result = await db.execute(select(Vehicle).where(Vehicle.assigned_driver_id == user_id))
    current = list(result.scalars().all())
    for v in current:
        v.assigned_driver_id = None
    if body.vehicle_ids:
        vehicles = await db.execute(select(Vehicle).where(Vehicle.id.in_(body.vehicle_ids)))
        for v in vehicles.scalars().all():
            v.assigned_driver_id = user_id
    await db.commit()
    return {"message": "Veículos atualizados.", "vehicle_ids": body.vehicle_ids}


@router.delete("/{user_id}", status_code=204)
async def delete_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),
) -> None:
    repository = UserRepository(db)
    deleted = await repository.delete(user_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Usuário não encontrado.")
    await db.commit()
