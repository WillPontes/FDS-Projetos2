from typing import Any, Dict, List, Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.fuel_prices import FuelPriceByUF


class FuelPricesRepository:
    """Uma linha por UF (uf único); PK numérica id."""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_uf(self, uf: str) -> Optional[FuelPriceByUF]:
        uf = uf.upper().strip()
        result = await self.session.execute(
            select(FuelPriceByUF).where(FuelPriceByUF.uf == uf)
        )
        return result.scalar_one_or_none()

    async def get_all(self) -> List[FuelPriceByUF]:
        result = await self.session.execute(select(FuelPriceByUF))
        return list(result.scalars().all())

    async def upsert_by_uf(
        self,
        uf: str,
        *,
        price_diesel_s10: float | None,
        price_gasolina_c: float | None,
        price_etanol: float | None,
    ) -> FuelPriceByUF:
        uf = uf.upper().strip()
        result = await self.session.execute(
            select(FuelPriceByUF).where(FuelPriceByUF.uf == uf)
        )
        row = result.scalar_one_or_none()
        if row is None:
            row = FuelPriceByUF(
                uf=uf,
                price_diesel_s10=price_diesel_s10,
                price_gasolina_c=price_gasolina_c,
                price_etanol=price_etanol,
            )
            self.session.add(row)
        else:
            row.price_diesel_s10 = price_diesel_s10
            row.price_gasolina_c = price_gasolina_c
            row.price_etanol = price_etanol
        await self.session.commit()
        await self.session.refresh(row)
        return row

    async def delete_by_uf(self, uf: str) -> bool:
        result = await self.session.execute(
            select(FuelPriceByUF).where(FuelPriceByUF.uf == uf)
        )
        row = result.scalar_one_or_none()
        if row is None:
            return False
        await self.session.delete(row)
        await self.session.commit()
        return True
