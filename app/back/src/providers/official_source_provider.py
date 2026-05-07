from typing import Any, Dict

# Fonte de preços: tabela pública Base dos Dados no BigQuery.
FUEL_PRICES_BQ_TABLE = "basedosdados.br_anp_precos_combustiveis"


class OfficialSourceProvider:
    """
    Fornece dados oficiais à CalcEngine.

    Fluxo:
    1. busca preços reais de combustíveis no BigQuery;
    2. organiza os dados por UF;
    3. salva uma linha por UF na tabela fuel_prices_by_uf;
    4. retorna dados reais salvos no banco.

    Não usa fallback.
    """

    def __init__(self, technical_specs_repository: Any, fuel_prices_repository: Any):
        self.technical_specs_repository = technical_specs_repository
        self.fuel_prices_repository = fuel_prices_repository

    async def sync_all_sources(self) -> None:
        await self._sync_fuel_prices_from_bq()

    async def _sync_fuel_prices_from_bq(self) -> None:
        """
        Busca preços recentes de combustíveis na Base dos Dados / BigQuery
        e salva uma linha por UF no PostgreSQL.
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

        fuel_prices_by_uf: Dict[str, Dict[str, float]] = {}

        for row in rows:
            uf = row.sigla_uf
            produto = row.produto_padronizado

            if produto is None or row.preco_medio is None:
                continue

            preco = round(float(row.preco_medio), 2)

            if uf not in fuel_prices_by_uf:
                fuel_prices_by_uf[uf] = {}

            fuel_prices_by_uf[uf][produto] = preco

        fuel_prices_meta = {
            "as_of": str(date.today()),
            "aggregation": "average_by_uf_last_30_days_from_latest_available_date",
            "source": "basedosdados:br_anp_precos_combustiveis.microdados",
        }

        for uf, prices in fuel_prices_by_uf.items():
            await self.fuel_prices_repository.upsert_by_id(
                uf=uf,
                prices=prices,
                meta=fuel_prices_meta,
            )

    async def get_all_specs(self) -> Dict[str, Any] | None:
        """
        Retorna dados técnicos gerais salvos no banco.

        Não usa fallback.
        """
        return await self.technical_specs_repository.get_by_id(1)

    async def get_all_fuel_prices(self) -> list[Dict[str, Any]]:
        """
        Retorna todos os preços de combustíveis por UF.
        """
        return await self.fuel_prices_repository.get_all()

    async def get_fuel_price_by_uf(self, uf: str) -> Dict[str, Any] | None:
        """
        Retorna preços de combustíveis de uma UF específica.
        """
        return await self.fuel_prices_repository.get_by_id(uf)