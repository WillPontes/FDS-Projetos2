from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.database.connection import get_db
from src.providers.official_source_provider import OfficialSourceProvider
from src.repositories.technical_specs_repository import TechnicalSpecsRepository

router = APIRouter(tags=["Technical Specs"])


@router.get("/technical-specs")
async def get_technical_specs(db: AsyncSession = Depends(get_db)):
    repository = TechnicalSpecsRepository(db)
    provider = OfficialSourceProvider(repository)

    specs = await provider.get_all_specs()

    return {
        "message": "Technical specs carregadas com sucesso",
        "data": specs,
    }

@router.post("/technical-specs/sync-fuel-prices")
async def sync_fuel_prices(db: AsyncSession = Depends(get_db)):
    repository = TechnicalSpecsRepository(db)
    provider = OfficialSourceProvider(repository)

    await provider._sync_fuel_prices_from_bq()

    specs = await provider.get_all_specs()

    return {
        "message": "Preços de combustíveis sincronizados com sucesso",
        "fuel_prices_by_uf": specs.get("fuel_prices_by_uf"),
        "fuel_prices_meta": specs.get("fuel_prices_meta"),
    }