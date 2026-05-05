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

    Fluxo:
    1. tenta buscar os dados técnicos no PostgreSQL;
    2. se encontrar, retorna os dados do banco;
    3. se não encontrar, usa o fallback;
    4. salva o fallback no banco;
    5. retorna os dados.

    Preços: futuramente serão carregados e persistidos a partir de consultas ao BigQuery
    sobre FUEL_PRICES_BQ_TABLE.
    """

    def __init__(self, db: Any):
        self.db = db

    async def sync_all_sources(self) -> None:
        await self._sync_fuel_prices_from_bq()
        await self._sync_ghg_factors_mcti()

    async def _sync_fuel_prices_from_bq(self) -> None:
        """
        Busca preços recentes de combustíveis na Base dos Dados / BigQuery
        e salva no PostgreSQL usando o repository.
        """

        from datetime import date

        from google.cloud import bigquery

        client = bigquery.Client()

        query = f"""
            WITH latest_date AS (
            SELECT MAX(data_coleta) AS max_data
            FROM `{FUEL_PRICES_BQ_TABLE}.microdados`
            )
            SELECT
            sigla_uf,
            CASE
                WHEN UPPER(produto) LIKE '%GASOLINA%' THEN 'gasolina_c'
                WHEN UPPER(produto) LIKE '%ETANOL%' THEN 'etanol'
                WHEN UPPER(produto) LIKE '%DIESEL%' AND UPPER(produto) LIKE '%S%10%' THEN 'diesel_s10'
            END AS produto_padronizado,
            AVG(preco_venda) AS preco_medio
            FROM `{FUEL_PRICES_BQ_TABLE}.microdados`, latest_date
            WHERE
            data_coleta >= DATE_SUB(max_data, INTERVAL 30 DAY)
            AND preco_venda IS NOT NULL
            AND sigla_uf IS NOT NULL
            AND (
                UPPER(produto) LIKE '%GASOLINA%'
                OR UPPER(produto) LIKE '%ETANOL%'
                OR (UPPER(produto) LIKE '%DIESEL%' AND UPPER(produto) LIKE '%S%10%')
            )
            GROUP BY sigla_uf, produto_padronizado
        """

        rows = client.query(query).result()

        fuel_prices_by_uf = {}

        for row in rows:
            uf = row.sigla_uf
            produto = row.produto_padronizado

            if produto is None:
                continue

            if row.preco_medio is None:
                continue

            preco = round(float(row.preco_medio), 2)

            if uf not in fuel_prices_by_uf:
                fuel_prices_by_uf[uf] = {}

            fuel_prices_by_uf[uf][produto] = preco

        current_specs = await self.db.get_current_technical_specs()

        if not current_specs:
            current_specs = _fallback_technical_specs()

        current_specs["fuel_prices_by_uf"] = fuel_prices_by_uf
        current_specs["fuel_prices_meta"] = {
            "as_of": str(date.today()),
            "aggregation": "average_by_uf_last_30_days_from_latest_available_date",
            "source": "basedosdados:br_anp_precos_combustiveis.microdados",
            "default_uf": "SP",
        }

        if "SP" in fuel_prices_by_uf:
            current_specs["fuel_prices"] = fuel_prices_by_uf["SP"]

        await self.db.save_technical_specs(current_specs)

    async def _sync_ghg_factors_mcti(self) -> None:
        """Placeholder para fatores oficiais MCTI / GHG Protocol."""
        pass

    async def get_all_specs(self) -> Dict[str, Any]:
        specs = await self.db.get_current_technical_specs()

        if specs:
            return specs

        fallback_specs = _fallback_technical_specs()

        await self.db.save_technical_specs(fallback_specs)

        return fallback_specs