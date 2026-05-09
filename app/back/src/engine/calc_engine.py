from __future__ import annotations

from typing import Any, Dict, List, Optional

from src.engine.exceptions import CalcEngineError


class CalcEngine:
    def __init__(self, technical_specs: Dict[str, Any]):
        self.specs = technical_specs

    def convert_to_co2(self, value: float, unit: str) -> float:
        if unit == "water_liters":
            wpt = float(self.specs["paper_impact"]["water_per_ticket"])
            if wpt == 0:
                raise CalcEngineError("paper_impact.water_per_ticket não pode ser zero.")
            tickets = value / wpt
            return tickets * float(self.specs["paper_impact"]["co2_per_ticket"])
        if unit == "paper_tickets":
            return value * float(self.specs["paper_impact"]["co2_per_ticket"])
        if unit.startswith("fuel_liters_"):
            fuel_type = unit.replace("fuel_liters_", "")
            return self.calculate_emissions_from_fuel(value, fuel_type)
        raise CalcEngineError(f"Unidade desconhecida para convert_to_co2: {unit!r}.")

    def convert_from_co2(self, co2_kg: float, target_unit: str) -> float:
        bench = self.specs["benchmarks"]
        factors = self.specs["ludic_factors"]
        cpt = float(self.specs["paper_impact"]["co2_per_ticket"])
        wpt = float(self.specs["paper_impact"]["water_per_ticket"])

        mapping: Dict[str, float] = {
            "trees": co2_kg / float(factors["tree_year_absorption"]),
            "water": (co2_kg / cpt) * wpt,
            "smartphone": co2_kg * float(factors["phone_charge_factor"]),
            "km_driven": co2_kg / float(bench["kg_co2_per_km_car"]),
            "burgers": co2_kg / float(bench["kg_co2_per_burger"]),
        }
        if target_unit not in mapping:
            raise CalcEngineError(
                f"Unidade destino desconhecida para convert_from_co2: {target_unit!r}."
            )
        return mapping[target_unit]

    def calculate_emissions_from_fuel(self, liters: float, fuel_type: str) -> float:
        factors = self.specs["emission_factors"]
        if fuel_type not in factors:
            raise CalcEngineError(
                f"emission_factors sem tipo de combustível: {fuel_type!r}."
            )
        return liters * float(factors[fuel_type])

    def calculate_avoided_idle_fuel(self, time_saved_sec: int, category: str) -> float:
        rates = self.specs["idle_rates"]
        if category not in rates:
            raise CalcEngineError(f"idle_rates sem categoria: {category!r}.")
        return time_saved_sec * float(rates[category])

    def calculate_avoided_acceleration_fuel(self, category: str) -> float:
        surge = self.specs["accel_surge"]
        if category not in surge:
            raise CalcEngineError(f"accel_surge sem categoria: {category!r}.")
        return float(surge[category])

    def calculate_paper_and_water_savings(self, is_digital: bool) -> Dict[str, float]:
        if not is_digital:
            return {"co2": 0.0, "water": 0.0, "paper_tickets": 0.0}
        pi = self.specs["paper_impact"]
        return {
            "co2": float(pi["co2_per_ticket"]),
            "water": float(pi["water_per_ticket"]),
            "paper_tickets": 1.0,
        }

    def resolve_fuel_price_brl_per_liter(
        self, uf_passagem: str, fuel_type: str
    ) -> tuple[float, str]:
        by_uf: Dict[str, Any] = self.specs["fuel_prices_by_uf"]
        uf = (uf_passagem or "").strip().upper()
        if len(uf) != 2:
            raise CalcEngineError(
                f"uf_passagem inválida (esperada sigla de 2 letras): {uf_passagem!r}."
            )
        row = by_uf.get(uf)
        if not isinstance(row, dict):
            raise CalcEngineError(f"Sem preços de combustível para a UF {uf}.")
        if fuel_type not in row:
            raise CalcEngineError(
                f"Sem preço para combustível {fuel_type!r} na UF {uf}."
            )
        price = float(row[fuel_type])
        if price <= 0:
            raise CalcEngineError(
                f"Preço inválido (<= 0) para {fuel_type} na UF {uf}."
            )
        return price, uf

    def calculate_financial_savings(
        self,
        idle_liters: float,
        accel_liters: float,
        fuel_type: str,
        category: str,
        fuel_price_brl_per_liter: float,
    ) -> Dict[str, Any]:
        maint_map = self.specs["maint_costs"]
        if category not in maint_map:
            raise CalcEngineError(f"maint_costs sem categoria: {category!r}.")
        price = float(fuel_price_brl_per_liter)
        idle_brl = round(idle_liters * price, 2)
        accel_brl = round(accel_liters * price, 2)
        maint = float(maint_map[category])
        fuel_total_brl = round(idle_brl + accel_brl, 2)
        total = round(fuel_total_brl + maint, 2)
        return {
            "fuel_savings_idle_brl": idle_brl,
            "fuel_savings_accel_brl": accel_brl,
            "fuel_savings_brl": fuel_total_brl,
            "maintenance_savings_brl": maint,
            "total_savings_brl": total,
        }

    def build_comparison(
        self,
        baseline_time_sec: int,
        real_time_sec: int,
        vehicle_data: Dict[str, Any],
        is_digital: bool,
        fuel_price_brl_per_liter: float,
    ) -> Dict[str, Any]:
        cat = vehicle_data["category"]
        fuel_type = vehicle_data["fuel_type"]
        rates = self.specs["idle_rates"]
        surge = self.specs["accel_surge"]
        if cat not in rates:
            raise CalcEngineError(f"idle_rates sem categoria: {cat!r}.")
        if cat not in surge:
            raise CalcEngineError(f"accel_surge sem categoria: {cat!r}.")
        rate = float(rates[cat])
        accel = float(surge[cat])

        without_idle = baseline_time_sec * rate
        without_total = without_idle + accel

        with_idle = max(0, real_time_sec) * rate
        with_total = with_idle

        paper_without = self.calculate_paper_and_water_savings(is_digital=False)
        paper_with = self.calculate_paper_and_water_savings(is_digital=is_digital)

        co2_without = self.calculate_emissions_from_fuel(
            without_total, fuel_type
        ) + paper_without["co2"]
        co2_with = self.calculate_emissions_from_fuel(with_total, fuel_type) + paper_with[
            "co2"
        ]

        fin_without = self.calculate_financial_savings(
            idle_liters=without_idle,
            accel_liters=accel,
            fuel_type=fuel_type,
            category=cat,
            fuel_price_brl_per_liter=fuel_price_brl_per_liter,
        )
        fin_with = self.calculate_financial_savings(
            idle_liters=with_idle,
            accel_liters=0.0,
            fuel_type=fuel_type,
            category=cat,
            fuel_price_brl_per_liter=fuel_price_brl_per_liter,
        )

        return {
            "without_tag": {
                "time_sec": baseline_time_sec,
                "fuel_liters": round(without_total, 4),
                "co2_kg": round(co2_without, 4),
                "water_liters": paper_without["water"],
                "estimated_brl": fin_without["total_savings_brl"],
            },
            "with_tag": {
                "time_sec": real_time_sec,
                "fuel_liters": round(with_total, 4),
                "co2_kg": round(co2_with, 4),
                "water_liters": paper_with["water"],
                "estimated_brl": fin_with["total_savings_brl"],
            },
            "delta": {
                "fuel_liters": round(without_total - with_total, 4),
                "co2_kg": round(co2_without - co2_with, 4),
                "water_liters": round(paper_with["water"] - paper_without["water"], 4),
                "estimated_brl": round(
                    fin_without["total_savings_brl"] - fin_with["total_savings_brl"], 2
                ),
            },
        }

    def get_ludic_metrics(self, total_co2_avoided: float) -> Dict[str, Any]:
        factors = self.specs["ludic_factors"]
        tree = float(factors["tree_year_absorption"])
        if tree <= 0:
            raise CalcEngineError("ludic_factors.tree_year_absorption deve ser > 0.")
        return {
            "trees_saved": round(total_co2_avoided / tree, 2),
            "smartphone_charges": int(total_co2_avoided * float(factors["phone_charge_factor"])),
            "coffee_filters": int(total_co2_avoided * float(factors["coffee_factor"])),
        }

    def get_ludic_metrics_by_axis(
        self,
        total_co2_kg: float,
        water_liters: float,
        paper_tickets: float,
    ) -> Dict[str, List[Dict[str, Any]]]:
        raw = self.specs["ludic_metaphors"]
        out: Dict[str, List[Dict[str, Any]]] = {"carbon": [], "water": [], "paper": []}
        for m in raw["carbon"]:
            kg = float(m["kg_co2_per_unit"])
            out["carbon"].append(
                {
                    "id": m["id"],
                    "label": m["label"],
                    "value": round(total_co2_kg / kg, 4),
                }
            )
        for m in raw["water"]:
            lu = float(m["liters_per_unit"])
            out["water"].append(
                {
                    "id": m["id"],
                    "label": m["label"],
                    "value": round(water_liters / lu, 4),
                }
            )
        for m in raw["paper"]:
            tu = float(m["tickets_per_unit"])
            out["paper"].append(
                {
                    "id": m["id"],
                    "label": m["label"],
                    "value": round(paper_tickets / tu, 4),
                }
            )
        return out

    @staticmethod
    def calculate_payback_snapshot(
        accumulated_savings_brl: float,
        monthly_tag_fee_brl: float,
        billing_months: float,
    ) -> Dict[str, Any]:
        fees = monthly_tag_fee_brl * billing_months
        net = round(accumulated_savings_brl - fees, 2)
        return {
            "accumulated_savings_brl": round(accumulated_savings_brl, 2),
            "monthly_tag_fee_brl": monthly_tag_fee_brl,
            "billing_months": billing_months,
            "fees_total_brl": round(fees, 2),
            "net_brl": net,
            "status": "tag_paga" if net >= 0 else "em_payback",
        }

    def process_transaction(
        self,
        real_time_sec: int,
        vehicle_data: Dict[str, Any],
        context: str,
        uf_passagem: str,
        *,
        is_digital: bool = True,
        payback: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        if real_time_sec < 0:
            raise CalcEngineError("real_time_sec não pode ser negativo.")
        baselines = self.specs["baselines"]
        if context not in baselines:
            raise CalcEngineError(f"context desconhecido: {context!r}.")
        for key in ("category", "fuel_type"):
            if key not in vehicle_data:
                raise CalcEngineError(f"vehicle_data sem campo obrigatório: {key}.")

        baseline_time = int(baselines[context]["avg_wait_sec"])
        time_saved = max(0, baseline_time - real_time_sec)

        idle_liters = self.calculate_avoided_idle_fuel(
            time_saved, vehicle_data["category"]
        )
        accel_liters = self.calculate_avoided_acceleration_fuel(
            vehicle_data["category"]
        )
        total_liters_saved = idle_liters + accel_liters

        paper_water = self.calculate_paper_and_water_savings(is_digital)
        fuel_co2 = self.calculate_emissions_from_fuel(
            total_liters_saved, vehicle_data["fuel_type"]
        )
        total_co2_avoided = fuel_co2 + paper_water["co2"]

        fuel_type = vehicle_data["fuel_type"]
        price_per_l, uf_applied = self.resolve_fuel_price_brl_per_liter(
            uf_passagem, fuel_type
        )
        meta = self.specs["fuel_prices_meta"]
        pricing_snapshot = {
            "fuel_price_brl_per_liter": round(price_per_l, 4),
            "fuel_type_applied": fuel_type,
            "uf_applied": uf_applied,
            "currency": "BRL",
            "price_as_of": meta["as_of"],
            "price_source": meta["source"],
        }

        financial = self.calculate_financial_savings(
            idle_liters,
            accel_liters,
            fuel_type,
            vehicle_data["category"],
            fuel_price_brl_per_liter=price_per_l,
        )

        comparison = self.build_comparison(
            baseline_time_sec=baseline_time,
            real_time_sec=real_time_sec,
            vehicle_data=vehicle_data,
            is_digital=is_digital,
            fuel_price_brl_per_liter=price_per_l,
        )

        storytelling = {
            "legacy": self.get_ludic_metrics(total_co2_avoided),
            "by_axis": self.get_ludic_metrics_by_axis(
                total_co2_avoided,
                paper_water["water"],
                paper_water["paper_tickets"],
            ),
        }

        payload: Dict[str, Any] = {
            "environmental": {
                "co2_kg": round(total_co2_avoided, 4),
                "water_liters": paper_water["water"],
                "fuel_liters": round(total_liters_saved, 4),
                "paper_tickets": paper_water["paper_tickets"],
            },
            "financial": financial,
            "comparison": comparison,
            "storytelling": storytelling,
            "metadata": {
                "time_saved_sec": time_saved,
                "baseline_wait_sec": baseline_time,
                "context": context,
                "is_digital": is_digital,
                "uf_passagem": (uf_passagem or "").strip().upper(),
                "pricing_snapshot": pricing_snapshot,
            },
        }

        if payback is not None:
            required = ("accumulated_savings_brl", "monthly_tag_fee_brl", "billing_months")
            for k in required:
                if k not in payback:
                    raise CalcEngineError(f"payback em falta: campo obrigatório {k!r}.")
            acc = float(payback["accumulated_savings_brl"])
            monthly = float(payback["monthly_tag_fee_brl"])
            months = float(payback["billing_months"])
            payload["payback"] = self.calculate_payback_snapshot(acc, monthly, months)

        return payload
