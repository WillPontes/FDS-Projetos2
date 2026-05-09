from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from src.database.connection import get_db
from src.engine import CalcEngineError
from src.providers.official_source_provider import OfficialSourceProvider
from src.repositories.fuel_prices_repository import FuelPricesRepository
from src.repositories.technical_specs_repository import TechnicalSpecsRepository

router = APIRouter(tags=["technical_specs"])


@router.get("/technical-specs")
async def get_technical_specs(db: AsyncSession = Depends(get_db)):
    technical_specs_repository = TechnicalSpecsRepository(db)
    fuel_prices_repository = FuelPricesRepository(db)

    provider = OfficialSourceProvider(
        technical_specs_repository=technical_specs_repository,
        fuel_prices_repository=fuel_prices_repository,
    )

    try:
        specs = await provider.get_technical_specs_bundle()
    except CalcEngineError as e:
        raise HTTPException(status_code=422, detail=str(e)) from e

    if specs is None:
        raise HTTPException(
            status_code=404,
            detail="Technical specs não encontradas.",
        )

    return {
        "data": specs.model_dump(mode="json"),
    }
