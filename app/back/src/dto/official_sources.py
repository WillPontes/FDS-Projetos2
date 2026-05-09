"""DTOs para respostas da API e montagem do contrato da CalcEngine."""

from __future__ import annotations

from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict

from src.constants.ludic_metaphors import METAPHOR_IDS_ORDER, METAPHOR_LABELS
from src.models.fuel_prices import FuelPriceByUF
from src.models.technical_specs import TechnicalSpecs

FUEL_PRICES_META_SOURCE = "basedosdados:br_anp_precos_combustiveis"
FUEL_PRICES_META_AGGREGATION = "median_by_uf_last_week"


class FuelPriceByUFDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    uf: str
    price_diesel_s10: float | None = None
    price_gasolina_c: float | None = None
    price_etanol: float | None = None
    updated_at: datetime


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


class TechnicalSpecsDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    emission_factor_diesel_s10: float
    emission_factor_gasolina_c: float
    emission_factor_etanol: float
    idle_rate_leve: float
    idle_rate_pesado: float
    paper_co2_per_ticket: float
    paper_water_per_ticket: float
    ludic_tree_year_absorption: float
    ludic_phone_charge_factor: float
    ludic_coffee_factor: float
    ludic_metaphor_units: dict[str, Any]
    baseline_pedagio_avg_wait_sec: int
    baseline_estacionamento_avg_wait_sec: int
    maint_cost_leve: float
    maint_cost_pesado: float
    accel_surge_leve: float
    accel_surge_pesado: float
    benchmark_kg_co2_per_km_car: float
    benchmark_kg_co2_per_burger: float
    created_at: datetime
    updated_at: datetime


def technical_specs_row_to_dto(row: TechnicalSpecs) -> TechnicalSpecsDTO:
    return TechnicalSpecsDTO(
        id=row.id,  # type: ignore[arg-type]
        emission_factor_diesel_s10=float(row.emission_factor_diesel_s10),
        emission_factor_gasolina_c=float(row.emission_factor_gasolina_c),
        emission_factor_etanol=float(row.emission_factor_etanol),
        idle_rate_leve=float(row.idle_rate_leve),
        idle_rate_pesado=float(row.idle_rate_pesado),
        paper_co2_per_ticket=float(row.paper_co2_per_ticket),
        paper_water_per_ticket=float(row.paper_water_per_ticket),
        ludic_tree_year_absorption=float(row.ludic_tree_year_absorption),
        ludic_phone_charge_factor=float(row.ludic_phone_charge_factor),
        ludic_coffee_factor=float(row.ludic_coffee_factor),
        ludic_metaphor_units=dict(row.ludic_metaphor_units or {}),
        baseline_pedagio_avg_wait_sec=int(row.baseline_pedagio_avg_wait_sec),
        baseline_estacionamento_avg_wait_sec=int(
            row.baseline_estacionamento_avg_wait_sec
        ),
        maint_cost_leve=float(row.maint_cost_leve),
        maint_cost_pesado=float(row.maint_cost_pesado),
        accel_surge_leve=float(row.accel_surge_leve),
        accel_surge_pesado=float(row.accel_surge_pesado),
        benchmark_kg_co2_per_km_car=float(row.benchmark_kg_co2_per_km_car),
        benchmark_kg_co2_per_burger=float(row.benchmark_kg_co2_per_burger),
        created_at=row.created_at,
        updated_at=row.updated_at,
    )


class TechnicalSpecsBundleDTO(BaseModel):
    specs: TechnicalSpecsDTO
    fuel_prices_by_uf: dict[str, FuelPriceByUFDTO]
    # ISO8601 do max(updated_at) das linhas de preço, ou "".
    fuel_prices_as_of: str = ""


_UNIT_KEY_BY_AXIS = {
    "carbon": "kg_co2_per_unit",
    "water": "liters_per_unit",
    "paper": "tickets_per_unit",
}


def merge_ludic_metaphor_units_with_labels(
    units_from_db: dict[str, Any] | None,
) -> dict[str, list[dict[str, Any]]]:
    """
    Junta unidades da BD com labels das constants (formato CalcEngine).
    Sem preenchimento automático: falta de unidade ou label → erro.
    """
    from src.engine.exceptions import CalcEngineError

    raw = dict(units_from_db or {})
    out: dict[str, list[dict[str, Any]]] = {
        "carbon": [],
        "water": [],
        "paper": [],
    }

    for axis in ("carbon", "water", "paper"):
        unit_key = _UNIT_KEY_BY_AXIS[axis]
        axis_units_db = raw.get(axis)
        if not isinstance(axis_units_db, dict):
            raise CalcEngineError(
                f"ludic_metaphor_units[{axis}] deve ser um objeto com ids numéricos."
            )

        for mid in METAPHOR_IDS_ORDER.get(axis, ()):
            unit_val = axis_units_db.get(mid)
            if unit_val is None:
                raise CalcEngineError(
                    f"ludic_metaphor_units incompleto: eixo {axis!r} sem id {mid!r}."
                )

            label = METAPHOR_LABELS.get(axis, {}).get(mid)
            if not label:
                raise CalcEngineError(
                    f"Constante METAPHOR_LABELS sem label: axis={axis!r} id={mid!r}."
                )

            item: dict[str, Any] = {
                "id": mid,
                "label": label,
                unit_key: float(unit_val),
            }
            out[axis].append(item)

    return out


def technical_specs_to_engine_dict(
    row: TechnicalSpecs,
    fuel_prices_by_uf: dict[str, dict[str, float]],
    *,
    fuel_prices_as_of: str,
) -> dict[str, Any]:
    ludic_metaphors = merge_ludic_metaphor_units_with_labels(
        row.ludic_metaphor_units
    )

    return {
        "emission_factors": {
            "diesel_s10": float(row.emission_factor_diesel_s10),
            "gasolina_c": float(row.emission_factor_gasolina_c),
            "etanol": float(row.emission_factor_etanol),
        },
        "idle_rates": {
            "leve": float(row.idle_rate_leve),
            "pesado": float(row.idle_rate_pesado),
        },
        "paper_impact": {
            "co2_per_ticket": float(row.paper_co2_per_ticket),
            "water_per_ticket": float(row.paper_water_per_ticket),
        },
        "ludic_factors": {
            "tree_year_absorption": float(row.ludic_tree_year_absorption),
            "phone_charge_factor": float(row.ludic_phone_charge_factor),
            "coffee_factor": float(row.ludic_coffee_factor),
        },
        "ludic_metaphors": ludic_metaphors,
        "baselines": {
            "pedagio": {
                "avg_wait_sec": int(row.baseline_pedagio_avg_wait_sec),
            },
            "estacionamento": {
                "avg_wait_sec": int(row.baseline_estacionamento_avg_wait_sec),
            },
        },
        "maint_costs": {
            "leve": float(row.maint_cost_leve),
            "pesado": float(row.maint_cost_pesado),
        },
        "accel_surge": {
            "leve": float(row.accel_surge_leve),
            "pesado": float(row.accel_surge_pesado),
        },
        "benchmarks": {
            "kg_co2_per_km_car": float(row.benchmark_kg_co2_per_km_car),
            "kg_co2_per_burger": float(row.benchmark_kg_co2_per_burger),
        },
        "fuel_prices_by_uf": fuel_prices_by_uf,
        "fuel_prices_meta": {
            "as_of": fuel_prices_as_of,
            "source": FUEL_PRICES_META_SOURCE,
            "aggregation": FUEL_PRICES_META_AGGREGATION,
        },
    }


def _num_or_none(v: Any) -> float | None:
    if v is None:
        return None
    return float(v)
