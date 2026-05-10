from typing import Any

from sqlalchemy.ext.asyncio import AsyncSession

from src.providers.official_source_provider import OfficialSourceProvider
from src.repositories.fuel_prices_repository import FuelPricesRepository
from src.repositories.technical_specs_repository import TechnicalSpecsRepository


def _build_provider(db: AsyncSession) -> OfficialSourceProvider:
    return OfficialSourceProvider(
        technical_specs_repository=TechnicalSpecsRepository(db),
        fuel_prices_repository=FuelPricesRepository(db),
    )


async def sync_fuel_prices(db: AsyncSession) -> dict[str, Any]:
    provider = _build_provider(db)
    await provider.sync_all_sources()
    return await provider.get_all_fuel_prices_dict()


async def list_fuel_prices(db: AsyncSession) -> dict[str, Any]:
    provider = _build_provider(db)
    return await provider.get_all_fuel_prices_dict()


async def get_fuel_price(db: AsyncSession, uf: str) -> dict[str, Any] | None:
    provider = _build_provider(db)
    return await provider.get_fuel_price_by_uf_dict(uf)
