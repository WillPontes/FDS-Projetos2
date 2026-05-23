from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from src.database.connection import get_db
from src.models.organization import OrganizationPublic
from src.repositories.organization_repository import OrganizationRepository

router = APIRouter(tags=["Organizations"])


@router.get("/organizations")
async def get_organizations(db: AsyncSession = Depends(get_db)):
    repository = OrganizationRepository(db)

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
            detail="Organização não encontrada.",
        )

    return {
        "message": "Organização carregada com sucesso",
        "data": OrganizationPublic.model_validate(organization),
    }


@router.post("/organizations")
async def create_organization(
    name: str,
    cnpj: str | None = None,
    db: AsyncSession = Depends(get_db),
):
    repository = OrganizationRepository(db)

    organization = await repository.create(
        name=name,
        cnpj=cnpj,
    )

    return {
        "message": "Organização criada com sucesso",
        "data": OrganizationPublic.model_validate(organization),
    }