from typing import Any, Dict, List, Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.fuel_prices import FuelPriceByUF


class FuelPricesRepository:
    """
    Repository responsável por operações da tabela fuel_prices_by_uf.
    Cada UF é persistida em uma linha própria.
    Usa métodos padronizados: get_by_id, get_all, create, update, delete e upsert_by_id.
    """

    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_id(self, uf: str) -> Optional[Dict[str, Any]]:
        uf = uf.upper()

        result = await self.session.execute(
            select(FuelPriceByUF).where(FuelPriceByUF.uf == uf)
        )

        fuel_price = result.scalar_one_or_none()

        if fuel_price is None:
            return None

        return self._to_dict(fuel_price)

    async def get_all(self) -> List[Dict[str, Any]]:
        result = await self.session.execute(select(FuelPriceByUF))

        rows = result.scalars().all()

        return [self._to_dict(row) for row in rows]

    async def create(
        self,
        uf: str,
        prices: Dict[str, Any],
        meta: Dict[str, Any],
    ) -> Dict[str, Any]:
        fuel_price = FuelPriceByUF(
            uf=uf.upper(),
            prices=prices,
            meta=meta,
        )

        self.session.add(fuel_price)

        await self.session.commit()
        await self.session.refresh(fuel_price)

        return self._to_dict(fuel_price)

    async def update(
        self,
        uf: str,
        prices: Dict[str, Any],
        meta: Dict[str, Any],
    ) -> Optional[Dict[str, Any]]:
        uf = uf.upper()

        result = await self.session.execute(
            select(FuelPriceByUF).where(FuelPriceByUF.uf == uf)
        )

        fuel_price = result.scalar_one_or_none()

        if fuel_price is None:
            return None

        fuel_price.prices = prices
        fuel_price.meta = meta

        await self.session.commit()
        await self.session.refresh(fuel_price)

        return self._to_dict(fuel_price)

    async def delete(self, uf: str) -> bool:
        uf = uf.upper()

        result = await self.session.execute(
            select(FuelPriceByUF).where(FuelPriceByUF.uf == uf)
        )

        fuel_price = result.scalar_one_or_none()

        if fuel_price is None:
            return False

        await self.session.delete(fuel_price)
        await self.session.commit()

        return True

    async def upsert_by_id(
        self,
        uf: str,
        prices: Dict[str, Any],
        meta: Dict[str, Any],
    ) -> Dict[str, Any]:
        uf = uf.upper()

        result = await self.session.execute(
            select(FuelPriceByUF).where(FuelPriceByUF.uf == uf)
        )

        fuel_price = result.scalar_one_or_none()

        if fuel_price is None:
            fuel_price = FuelPriceByUF(
                uf=uf,
                prices=prices,
                meta=meta,
            )
            self.session.add(fuel_price)
        else:
            fuel_price.prices = prices
            fuel_price.meta = meta

        await self.session.commit()
        await self.session.refresh(fuel_price)

        return self._to_dict(fuel_price)

    def _to_dict(self, fuel_price: FuelPriceByUF) -> Dict[str, Any]:
        return {
            "uf": fuel_price.uf,
            "prices": fuel_price.prices,
            "meta": fuel_price.meta,
            "created_at": fuel_price.created_at,
            "updated_at": fuel_price.updated_at,
        }