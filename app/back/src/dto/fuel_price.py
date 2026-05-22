from __future__ import annotations

from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict

from src.models.fuel_prices import FuelPriceByUF

FUEL_PRICES_META_SOURCE = "basedosdados:br_anp_precos_combustiveis"
FUEL_PRICES_META_AGGREGATION = "avg_by_uf_last_30_days"


class FuelPriceByUFDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    uf: str
    price_diesel_s10: float | None = None
    price_gasolina_c: float | None = None
    price_etanol: float | None = None
    updated_at: datetime


class FuelPriceCreate(BaseModel):
    uf: str
    price_diesel_s10: float | None = None
    price_gasolina_c: float | None = None
    price_etanol: float | None = None


class FuelPriceUpdate(BaseModel):
    price_diesel_s10: float | None = None
    price_gasolina_c: float | None = None
    price_etanol: float | None = None


def fuel_price_row_to_dto(row: FuelPriceByUF) -> FuelPriceByUFDTO:
    return FuelPriceByUFDTO(
        uf=row.uf,
        price_diesel_s10=_num_or_none(row.price_diesel_s10),
        price_gasolina_c=_num_or_none(row.price_gasolina_c),
        price_etanol=_num_or_none(row.price_etanol),
        updated_at=row.updated_at,
    )


def fuel_prices_rows_to_by_uf_dict(
    rows: list[FuelPriceByUF],
) -> dict[str, FuelPriceByUFDTO]:
    return {row.uf: fuel_price_row_to_dto(row) for row in rows}


def fuel_rows_to_engine_prices_map(
    rows: list[FuelPriceByUF],
) -> dict[str, dict[str, float]]:
    """Mapa UF -> fuel_type -> R$/L omitindo preços ausentes."""
    out: dict[str, dict[str, float]] = {}
    for row in rows:
        inner: dict[str, float] = {}
        if row.price_diesel_s10 is not None:
            inner["diesel_s10"] = float(row.price_diesel_s10)
        if row.price_gasolina_c is not None:
            inner["gasolina_c"] = float(row.price_gasolina_c)
        if row.price_etanol is not None:
            inner["etanol"] = float(row.price_etanol)
        if inner:
            out[row.uf] = inner
    return out


def _num_or_none(v: Any) -> float | None:
    if v is None:
        return None
    return float(v)
