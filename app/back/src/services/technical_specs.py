from typing import Any

from sqlalchemy.ext.asyncio import AsyncSession

from src.engine.exceptions import CalcEngineError
from src.providers.official_source_provider import OfficialSourceProvider
from src.repositories.fuel_prices_repository import FuelPricesRepository
from src.repositories.technical_specs_repository import TechnicalSpecsRepository


def _build_provider(db: AsyncSession) -> OfficialSourceProvider:
    return OfficialSourceProvider(
        technical_specs_repository=TechnicalSpecsRepository(db),
        fuel_prices_repository=FuelPricesRepository(db),
    )


async def get_technical_specs_bundle(db: AsyncSession) -> dict[str, Any]:
    provider = _build_provider(db)
    specs = await provider.get_technical_specs_bundle()

    if specs is None:
        raise CalcEngineError("Technical specs não encontradas.")

    return specs.model_dump(mode="json")


async def get_all_specs(db: AsyncSession) -> dict[str, Any]:
    provider = _build_provider(db)
    return await provider.get_specs_for_calc_engine()