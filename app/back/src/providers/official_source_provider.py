from typing import Any, Dict

# Fonte de preços: tabela pública Base dos Dados no BigQuery (agregação por UF feita no sync).
FUEL_PRICES_BQ_TABLE = "basedosdados.br_anp_precos_combustiveis"


def _fallback_technical_specs() -> Dict[str, Any]:
    """Primeira execução ou banco de dados vazio; inclui chaves US02/US05/US11 + preços por UF."""
    return {
        "emission_factors": {"diesel_s10": 2.51, "gasolina_c": 2.15, "etanol": 0.44},
        "idle_rates": {"leve": 0.00027, "pesado": 0.00069},
        "paper_impact": {"co2_per_ticket": 0.012, "water_per_ticket": 0.5},
        "ludic_factors": {
            "tree_year_absorption": 15.0,
            "phone_charge_factor": 120.0,
            "coffee_factor": 10.0,
        },
        "ludic_metaphors": {
            "carbon": [
                {"id": "tree_year", "label": "Árvores (absorção ~1 ano)", "kg_co2_per_unit": 15.0},
                {"id": "burger", "label": "Hambúrgueres (pegada média)", "kg_co2_per_unit": 2.5},
                {"id": "km_car", "label": "Km carro médio (120 g/km)", "kg_co2_per_unit": 0.12},
            ],
            "water": [
                {"id": "shower_8min", "label": "Chuveiros (~8 min)", "liters_per_unit": 60.0},
                {"id": "drinking_day", "label": "Dias de consumo humano (2 L/dia)", "liters_per_unit": 2.0},
                {"id": "flush", "label": "Descargas de vaso sanitário (~6 L)", "liters_per_unit": 6.0},
            ],
            "paper": [
                {"id": "ream_a4", "label": "Resmas A4 (~500 folhas)", "tickets_per_unit": 500.0},
                {"id": "notebook", "label": "Cadernos escolares (~50 folhas)", "tickets_per_unit": 50.0},
                {"id": "toilet_roll", "label": "Rolos de papel higiênico (~equiv. folhas)", "tickets_per_unit": 150.0},
            ],
        },
        "baselines": {
            "pedagio": {"avg_wait_sec": 300},
            "estacionamento": {"avg_wait_sec": 180},
        },
        "fuel_prices_by_uf": {
            "SP": {"diesel_s10": 6.10, "gasolina_c": 5.85, "etanol": 3.60},
            "RJ": {"diesel_s10": 6.12, "gasolina_c": 5.88, "etanol": 3.55},
        },
        "fuel_prices_meta": {
            "as_of": "2026-04-01",
            "aggregation": "median_by_uf_last_week",
            "source": "basedosdados:br_anp_precos_combustiveis",
            "default_uf": "SP",
        },
        "fuel_prices": {"diesel_s10": 6.10, "gasolina_c": 5.85, "etanol": 3.60},
        "maint_costs": {"leve": 0.05, "pesado": 0.25},
        "brake_cost_per_stop_brl": {"leve": 0.15, "pesado": 0.45},
        "accel_surge": {"leve": 0.015, "pesado": 0.080},
        "benchmarks": {"kg_co2_per_km_car": 0.12, "kg_co2_per_burger": 2.5},
    }


class OfficialSourceProvider:
    """
    Fornece technical_specs à CalcEngine.
    Preços: carregados e persistidos a partir de consultas ao BigQuery sobre FUEL_PRICES_BQ_TABLE (job agendado).
    """

    def __init__(self, db: Any):
        self.db = db

    def sync_all_sources(self) -> None:
        self._sync_fuel_prices_from_bq()
        self._sync_ghg_factors_mcti()

    def _sync_fuel_prices_from_bq(self) -> None:
        """
        Popula self.db com fuel_prices_by_uf + fuel_prices_meta a partir de FUEL_PRICES_BQ_TABLE.
        TODO: implementar cliente BigQuery com query de agrupamento de preços por UF.
        """
        pass

    def _sync_ghg_factors_mcti(self) -> None:
        """Placeholder para fatores oficiais MCTI / GHG Protocol."""
        pass

    def get_all_specs(self) -> Dict[str, Any]:
        specs = self.db.get_current_technical_specs()
        if specs:
            return specs
        return _fallback_technical_specs()