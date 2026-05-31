from typing import List, Optional

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.organization import Organization


class OrganizationRepository:
    """
    Repository responsável por operações de banco da tabela organizations.
    Usa métodos padronizados: get_by_id, get_all e create.
    """

    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_id(self, id: int) -> Optional[Organization]:
        result = await self.session.execute(
            select(Organization).where(Organization.id == id)
        )

        return result.scalar_one_or_none()

    async def get_all(self) -> List[Organization]:
        result = await self.session.execute(select(Organization))

        return list(result.scalars().all())

    async def get_paginated(
        self,
        page: int = 1,
        page_size: int = 20,
        search: str | None = None,
    ) -> tuple[List[Organization], int]:
        query = select(Organization)
        if search:
            query = query.where(Organization.name.ilike(f"%{search}%"))
        total_result = await self.session.execute(
            select(func.count()).select_from(query.subquery())
        )
        total = total_result.scalar_one()
        offset = (page - 1) * page_size
        result = await self.session.execute(
            query.order_by(Organization.name).offset(offset).limit(page_size)
        )
        return list(result.scalars().all()), total

    async def update(self, id: int, name: str | None = None, cnpj: str | None = None) -> Optional[Organization]:
        org = await self.get_by_id(id)
        if org is None:
            return None
        if name is not None:
            org.name = name
        if cnpj is not None:
            org.cnpj = cnpj
        await self.session.flush()
        return org

    async def delete(self, id: int) -> bool:
        org = await self.get_by_id(id)
        if org is None:
            return False
        await self.session.delete(org)
        await self.session.flush()
        return True

    async def create(
        self,
        name: str,
        cnpj: str | None = None,
    ) -> Organization:
        organization = Organization(
            name=name,
            cnpj=cnpj,
        )

        self.session.add(organization)

        await self.session.commit()

        return organization