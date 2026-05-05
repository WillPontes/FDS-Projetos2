from typing import Any, Dict, Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.technical_specs import TechnicalSpecs


class TechnicalSpecsRepository:
    """
    Repository responsável por salvar e buscar technical_specs no PostgreSQL.
    """

    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_current_technical_specs(self) -> Optional[Dict[str, Any]]:
        result = await self.session.execute(
            select(TechnicalSpecs).where(TechnicalSpecs.id == 1)
        )

        specs = result.scalar_one_or_none()

        if specs is None:
            return None

        return specs.data

    async def save_technical_specs(self, data: Dict[str, Any]) -> None:
        result = await self.session.execute(
            select(TechnicalSpecs).where(TechnicalSpecs.id == 1)
        )

        specs = result.scalar_one_or_none()

        if specs is None:
            specs = TechnicalSpecs(id=1, data=data)
            self.session.add(specs)
        else:
            specs.data = data

        await self.session.commit()