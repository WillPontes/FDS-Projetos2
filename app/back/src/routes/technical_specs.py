from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from src.database.connection import get_db
from src.providers.official_source_provider import OfficialSourceProvider
from src.repositories.fuel_prices_repository import FuelPricesRepository
from src.repositories.technical_specs_repository import TechnicalSpecsRepository

router = APIRouter(tags=["Technical Specs"])


@router.get("/technical-specs")
async def get_technical_specs(db: AsyncSession = Depends(get_db)):
    technical_specs_repository = TechnicalSpecsRepository(db)
    fuel_prices_repository = FuelPricesRepository(db)

    provider = OfficialSourceProvider(
        technical_specs_repository=technical_specs_repository,
        fuel_prices_repository=fuel_prices_repository,
    )

    specs = await provider.get_all_specs()

    if not specs:
        raise HTTPException(
            status_code=404,
            detail="Technical specs não encontradas.",
        )

    return {
        "message": "Technical specs carregadas com sucesso",
        "data": specs,
    }