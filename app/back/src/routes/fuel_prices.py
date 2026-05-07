from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from src.database.connection import get_db
from src.providers.official_source_provider import OfficialSourceProvider
from src.repositories.fuel_prices_repository import FuelPricesRepository
from src.repositories.technical_specs_repository import TechnicalSpecsRepository

router = APIRouter(tags=["Fuel Prices"])


@router.post("/fuel-prices/sync")
async def sync_fuel_prices(db: AsyncSession = Depends(get_db)):
    technical_specs_repository = TechnicalSpecsRepository(db)
    fuel_prices_repository = FuelPricesRepository(db)

    provider = OfficialSourceProvider(
        technical_specs_repository=technical_specs_repository,
        fuel_prices_repository=fuel_prices_repository,
    )

    await provider.sync_all_sources()

    fuel_prices = await provider.get_all_fuel_prices()

    return {
        "message": "Preços de combustíveis sincronizados com sucesso",
        "data": fuel_prices,
    }


@router.get("/fuel-prices")
async def get_fuel_prices(db: AsyncSession = Depends(get_db)):
    technical_specs_repository = TechnicalSpecsRepository(db)
    fuel_prices_repository = FuelPricesRepository(db)

    provider = OfficialSourceProvider(
        technical_specs_repository=technical_specs_repository,
        fuel_prices_repository=fuel_prices_repository,
    )

    fuel_prices = await provider.get_all_fuel_prices()

    if not fuel_prices:
        raise HTTPException(
            status_code=404,
            detail="Preços de combustíveis não encontrados.",
        )

    return {
        "message": "Preços de combustíveis carregados com sucesso",
        "data": fuel_prices,
    }


@router.get("/fuel-prices/{uf}")
async def get_fuel_price_by_uf(
    uf: str,
    db: AsyncSession = Depends(get_db),
):
    technical_specs_repository = TechnicalSpecsRepository(db)
    fuel_prices_repository = FuelPricesRepository(db)

    provider = OfficialSourceProvider(
        technical_specs_repository=technical_specs_repository,
        fuel_prices_repository=fuel_prices_repository,
    )

    fuel_price = await provider.get_fuel_price_by_uf(uf)

    if not fuel_price:
        raise HTTPException(
            status_code=404,
            detail=f"Preços de combustíveis da UF {uf.upper()} não encontrados.",
        )

    return {
        "message": f"Preços de combustíveis da UF {uf.upper()} carregados com sucesso",
        "data": fuel_price,
    }