from typing import List, Optional

from sqlalchemy import select
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