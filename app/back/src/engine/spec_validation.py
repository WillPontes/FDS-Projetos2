"""Validação estrita do dict `technical_specs` injetado na CalcEngine."""

from __future__ import annotations

from typing import Any

from src.engine.exceptions import CalcEngineError

_REQUIRED_FUEL_TYPES = ("diesel_s10", "gasolina_c", "etanol")
_REQUIRED_CATEGORIES = ("leve", "pesado")
_REQUIRED_CONTEXTS = ("pedagio", "estacionamento")
_LUDIC_AXES = ("carbon", "water", "paper")
_UNIT_KEY = {
    "carbon": "kg_co2_per_unit",
    "water": "liters_per_unit",
    "paper": "tickets_per_unit",
}


def validate_engine_specs(specs: dict[str, Any]) -> None:
    if not isinstance(specs, dict):
        raise CalcEngineError("technical_specs deve ser um dict.")

    ef = specs.get("emission_factors")
    if not isinstance(ef, dict):
        raise CalcEngineError("emission_factors em falta ou inválido.")
    for k in _REQUIRED_FUEL_TYPES:
        if k not in ef:
            raise CalcEngineError(f"emission_factors sem chave obrigatória: {k}")
        v = float(ef[k])
        if v <= 0:
            raise CalcEngineError(f"emission_factors[{k}] deve ser > 0.")

    idle = specs.get("idle_rates")
    if not isinstance(idle, dict):
        raise CalcEngineError("idle_rates em falta ou inválido.")
    for k in _REQUIRED_CATEGORIES:
        if k not in idle:
            raise CalcEngineError(f"idle_rates sem chave obrigatória: {k}")
        if float(idle[k]) < 0:
            raise CalcEngineError(f"idle_rates[{k}] não pode ser negativo.")

    accel = specs.get("accel_surge")
    if not isinstance(accel, dict):
        raise CalcEngineError("accel_surge em falta ou inválido.")
    for k in _REQUIRED_CATEGORIES:
        if k not in accel:
            raise CalcEngineError(f"accel_surge sem chave obrigatória: {k}")
        if float(accel[k]) < 0:
            raise CalcEngineError(f"accel_surge[{k}] não pode ser negativo.")

    maint = specs.get("maint_costs")
    if not isinstance(maint, dict):
        raise CalcEngineError("maint_costs em falta ou inválido.")
    for k in _REQUIRED_CATEGORIES:
        if k not in maint:
            raise CalcEngineError(f"maint_costs sem chave obrigatória: {k}")

    pi = specs.get("paper_impact")
    if not isinstance(pi, dict):
        raise CalcEngineError("paper_impact em falta ou inválido.")
    for key in ("co2_per_ticket", "water_per_ticket"):
        if key not in pi:
            raise CalcEngineError(f"paper_impact sem {key}.")
    if float(pi["co2_per_ticket"]) <= 0:
        raise CalcEngineError("paper_impact.co2_per_ticket deve ser > 0.")
    if float(pi["water_per_ticket"]) == 0:
        raise CalcEngineError("paper_impact.water_per_ticket não pode ser zero.")

    lf = specs.get("ludic_factors")
    if not isinstance(lf, dict):
        raise CalcEngineError("ludic_factors em falta ou inválido.")
    for key in ("tree_year_absorption", "phone_charge_factor", "coffee_factor"):
        if key not in lf:
            raise CalcEngineError(f"ludic_factors sem {key}.")
    if float(lf["tree_year_absorption"]) <= 0:
        raise CalcEngineError("ludic_factors.tree_year_absorption deve ser > 0.")

    bench = specs.get("benchmarks")
    if not isinstance(bench, dict):
        raise CalcEngineError("benchmarks em falta ou inválido.")
    for key in ("kg_co2_per_km_car", "kg_co2_per_burger"):
        if key not in bench:
            raise CalcEngineError(f"benchmarks sem {key}.")
        if float(bench[key]) <= 0:
            raise CalcEngineError(f"benchmarks[{key}] deve ser > 0.")

    bl = specs.get("baselines")
    if not isinstance(bl, dict):
        raise CalcEngineError("baselines em falta ou inválido.")
    for ctx in _REQUIRED_CONTEXTS:
        if ctx not in bl or not isinstance(bl[ctx], dict):
            raise CalcEngineError(f"baselines sem contexto {ctx}.")
        if "avg_wait_sec" not in bl[ctx]:
            raise CalcEngineError(f"baselines.{ctx} sem avg_wait_sec.")
        if int(bl[ctx]["avg_wait_sec"]) < 0:
            raise CalcEngineError(f"baselines.{ctx}.avg_wait_sec inválido.")

    lm = specs.get("ludic_metaphors")
    if not isinstance(lm, dict):
        raise CalcEngineError("ludic_metaphors em falta ou inválido.")
    for axis in _LUDIC_AXES:
        items = lm.get(axis)
        if not isinstance(items, list) or len(items) < 3:
            raise CalcEngineError(
                f"ludic_metaphors[{axis}] deve ser lista com pelo menos 3 entradas."
            )
        ukey = _UNIT_KEY[axis]
        for i, m in enumerate(items):
            if not isinstance(m, dict):
                raise CalcEngineError(f"ludic_metaphors[{axis}][{i}] inválido.")
            for req in ("id", "label", ukey):
                if req not in m:
                    raise CalcEngineError(
                        f"ludic_metaphors[{axis}][{i}] sem campo obrigatório {req}."
                    )
            if float(m[ukey]) <= 0:
                raise CalcEngineError(
                    f"ludic_metaphors[{axis}][{i}].{ukey} deve ser > 0."
                )

    by_uf = specs.get("fuel_prices_by_uf")
    if not isinstance(by_uf, dict) or not by_uf:
        raise CalcEngineError("fuel_prices_by_uf vazio ou em falta.")

    meta = specs.get("fuel_prices_meta")
    if not isinstance(meta, dict):
        raise CalcEngineError("fuel_prices_meta em falta ou inválido.")
    for key in ("as_of", "source", "aggregation", "default_uf"):
        if key not in meta:
            raise CalcEngineError(f"fuel_prices_meta sem {key}.")
        val = meta[key]
        if not isinstance(val, str) or not val.strip():
            raise CalcEngineError(f"fuel_prices_meta.{key} deve ser string não vazia.")
