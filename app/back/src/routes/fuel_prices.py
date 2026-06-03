from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from src.database.connection import get_db
from src.dto.fuel_price import FuelPriceUpdate, fuel_price_row_to_dto
from src.errors import messages as err
from src.repositories.fuel_prices_repository import FuelPricesRepository
from src.services.fuel_prices import get_fuel_price, list_fuel_prices, sync_fuel_prices

router = APIRouter(prefix="/fuel-prices", tags=["Fuel Prices"])


@router.post("/sync", response_model=dict[str, Any])
async def sync_fuel_prices_route(db: AsyncSession = Depends(get_db)) -> dict[str, Any]:
    data = await sync_fuel_prices(db)
    return {"data": data}


@router.get("/", response_model=dict[str, Any])
async def get_fuel_prices(db: AsyncSession = Depends(get_db)) -> dict[str, Any]:
    data = await list_fuel_prices(db)
    if not data:
        raise HTTPException(status_code=404, detail=err.FUEL_PRICES_NOT_FOUND)
    return {"data": data}


@router.put("/{uf}", response_model=dict[str, Any])
async def update_fuel_price_by_uf(
    uf: str, payload: FuelPriceUpdate, db: AsyncSession = Depends(get_db)
) -> dict[str, Any]:
    repo = FuelPricesRepository(db)
    row = await repo.upsert_by_uf(
        uf=uf.upper(),
        price_diesel_s10=payload.price_diesel_s10,
        price_gasolina_c=payload.price_gasolina_c,
        price_etanol=payload.price_etanol,
    )
    await db.commit()
    return {"data": fuel_price_row_to_dto(row).model_dump(mode="json")}


@router.get("/{uf}", response_model=dict[str, Any])
async def get_fuel_price_by_uf(uf: str, db: AsyncSession = Depends(get_db)) -> dict[str, Any]:
    data = await get_fuel_price(db, uf)
    if not data:
        raise HTTPException(
            status_code=404,
            detail=err.fuel_prices_uf_not_found(uf),
        )
    return {"data": data}
