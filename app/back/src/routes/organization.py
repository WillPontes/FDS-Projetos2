from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.database.connection import get_db
from src.errors import messages as err
from src.dto.transactions import TransactionPublic
from src.models.organization import OrganizationPublic
from src.models.transaction import Transaction
from src.models.user import User, UserPublic
from src.models.vehicle import Vehicle
from src.middleware.dev_auth import get_current_user_dev
from src.repositories.organization_repository import OrganizationRepository
from src.repositories.transaction_repository import TransactionRepository
from src.repositories.user_repository import UserRepository
from src.services.paper_savings import compute_paper_saved_meters

router = APIRouter(tags=["Organizations"])


class OrganizationBody(BaseModel):
    name: str
    cnpj: str | None = None


class OrganizationUpdate(BaseModel):
    name: str | None = None
    cnpj: str | None = None


@router.get("/organizations")
async def get_organizations(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    search: str | None = Query(default=None),
    paginate: bool = Query(default=False),
    db: AsyncSession = Depends(get_db),
):
    repository = OrganizationRepository(db)

    if paginate:
        organizations, total = await repository.get_paginated(page, page_size, search)
        return {
            "items": [OrganizationPublic.model_validate(o) for o in organizations],
            "total": total,
        }

    organizations = await repository.get_all()

    return {
        "message": "Organizações carregadas com sucesso",
        "data": [
            OrganizationPublic.model_validate(organization)
            for organization in organizations
        ],
    }


@router.get("/organizations/{organization_id}")
async def get_organization_by_id(
    organization_id: int,
    db: AsyncSession = Depends(get_db),
):
    repository = OrganizationRepository(db)

    organization = await repository.get_by_id(organization_id)

    if not organization:
        raise HTTPException(
            status_code=404,
            detail=err.ORGANIZATION_NOT_FOUND,
        )

    return {
        "message": "Organização carregada com sucesso",
        "data": OrganizationPublic.model_validate(organization),
    }


@router.get("/organizations/{organization_id}/summary")
async def get_organization_summary(
    organization_id: int,
    db: AsyncSession = Depends(get_db),
):
    repository = OrganizationRepository(db)
    organization = await repository.get_by_id(organization_id)
    if not organization:
        raise HTTPException(status_code=404, detail=err.ORGANIZATION_NOT_FOUND)

    vehicle_count_result = await db.execute(
        select(func.count()).where(Vehicle.organization_id == organization_id)
    )
    vehicle_count = vehicle_count_result.scalar_one()

    driver_count_result = await db.execute(
        select(func.count()).where(User.organization_id == organization_id)
    )
    driver_count = driver_count_result.scalar_one()

    tx_result = await db.execute(
        select(
            func.count(),
            func.coalesce(func.sum(Transaction.financial_savings_brl), 0),
            func.coalesce(func.sum(Transaction.co2_avoided_kg), 0),
            func.coalesce(func.sum(Transaction.fuel_saved_liters), 0),
        ).where(Transaction.organization_id == organization_id)
    )
    transaction_count, total_savings, co2_total, fuel_total = tx_result.one()

    digital_count_result = await db.execute(
        select(func.count()).where(
            Transaction.organization_id == organization_id,
            Transaction.is_digital.is_(True),
        )
    )
    digital_count = int(digital_count_result.scalar_one())
    paper_saved_meters = await compute_paper_saved_meters(
        db,
        digital_transaction_count=digital_count,
    )

    return {
        "vehicle_count": vehicle_count,
        "driver_count": driver_count,
        "transaction_count": transaction_count,
        "total_savings_brl": float(total_savings),
        "co2_total_kg": float(co2_total),
        "fuel_total_liters": float(fuel_total),
        "paper_saved_meters": paper_saved_meters,
    }


@router.get("/organizations/{organization_id}/transactions")
async def get_organization_transactions(
    organization_id: int,
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=10, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    repository = OrganizationRepository(db)
    organization = await repository.get_by_id(organization_id)
    if not organization:
        raise HTTPException(status_code=404, detail=err.ORGANIZATION_NOT_FOUND)

    tx_repo = TransactionRepository(db)
    items, total = await tx_repo.get_by_organization_paginated(organization_id, page, page_size)
    return {
        "items": [TransactionPublic.model_validate(t) for t in items],
        "total": total,
    }


@router.post("/organizations")
async def create_organization(
    body: OrganizationBody,
    db: AsyncSession = Depends(get_db),
):
    repository = OrganizationRepository(db)

    organization = await repository.create(
        name=body.name,
        cnpj=body.cnpj,
    )

    return {
        "message": "Organização criada com sucesso",
        "data": OrganizationPublic.model_validate(organization),
    }


@router.patch("/organizations/{organization_id}")
async def update_organization(
    organization_id: int,
    body: OrganizationUpdate,
    db: AsyncSession = Depends(get_db),
):
    repository = OrganizationRepository(db)
    organization = await repository.update(organization_id, name=body.name, cnpj=body.cnpj)
    if organization is None:
        raise HTTPException(status_code=404, detail=err.ORGANIZATION_NOT_FOUND)
    await db.commit()
    return {
        "message": "Organização atualizada com sucesso",
        "data": OrganizationPublic.model_validate(organization),
    }


@router.delete("/organizations/{organization_id}", status_code=204)
async def delete_organization(
    organization_id: int,
    db: AsyncSession = Depends(get_db),
):
    repository = OrganizationRepository(db)
    deleted = await repository.delete(organization_id)
    if not deleted:
        raise HTTPException(status_code=404, detail=err.ORGANIZATION_NOT_FOUND)
    await db.commit()


@router.get("/organizations/{organization_id}/users", response_model=list[UserPublic])
async def list_organization_users(
    organization_id: int,
    db: AsyncSession = Depends(get_db),
):
    organization = await OrganizationRepository(db).get_by_id(organization_id)
    if not organization:
        raise HTTPException(status_code=404, detail=err.ORGANIZATION_NOT_FOUND)
    users = await UserRepository(db).get_all_filtered(organization_id=organization_id)
    return [UserPublic.model_validate(u) for u in users]


@router.post("/organizations/{organization_id}/users/{user_id}", status_code=201)
async def link_organization_user(
    organization_id: int,
    user_id: int,
    db: AsyncSession = Depends(get_db),
):
    organization = await OrganizationRepository(db).get_by_id(organization_id)
    if not organization:
        raise HTTPException(status_code=404, detail=err.ORGANIZATION_NOT_FOUND)
    user = await UserRepository(db).get_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail=err.USER_NOT_FOUND)
    user.organization_id = organization_id
    await db.commit()
    return {"message": "Usuário vinculado à organização."}


@router.delete("/organizations/{organization_id}/users/{user_id}", status_code=204)
async def unlink_organization_user(
    organization_id: int,
    user_id: int,
    db: AsyncSession = Depends(get_db),
):
    user = await UserRepository(db).get_by_id(user_id)
    if not user or user.organization_id != organization_id:
        raise HTTPException(status_code=404, detail=err.USER_NOT_LINKED_TO_ORG)
    user.organization_id = None
    await db.commit()