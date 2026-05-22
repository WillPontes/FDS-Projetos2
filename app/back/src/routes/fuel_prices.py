from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from src.database.connection import get_db
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
        raise HTTPException(status_code=404, detail="Fuel prices not found.")
    return {"data": data}


@router.get("/{uf}", response_model=dict[str, Any])
async def get_fuel_price_by_uf(uf: str, db: AsyncSession = Depends(get_db)) -> dict[str, Any]:
    data = await get_fuel_price(db, uf)
    if not data:
        raise HTTPException(
            status_code=404,
            detail=f"Fuel prices for UF {uf.upper()} not found.",
        )
    return {"data": data}
