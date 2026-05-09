from typing import Any

from src.engine.exceptions import CalcEngineError
from src.engine.spec_validation import validate_engine_specs

# Fonte de preços: tabela pública Base dos Dados no BigQuery.
FUEL_PRICES_BQ_TABLE = "basedosdados.br_anp_precos_combustiveis"


class OfficialSourceProvider:
    """
    Fontes oficiais: sincroniza preços ANP (BigQuery) e expõe bundle para
    API / dict para CalcEngine.

    """

    def __init__(
        self,
        technical_specs_repository: Any,
        fuel_prices_repository: Any,
    ):
        self.technical_specs_repository = technical_specs_repository
        self.fuel_prices_repository = fuel_prices_repository

    async def _engine_dict_from_persisted_or_raise(self) -> dict[str, Any]:
        from src.dto.official_sources import (
            fuel_rows_to_engine_prices_map,
            technical_specs_to_engine_dict,
        )

        row = await self.technical_specs_repository.get_by_id(1)
        if row is None:
            raise CalcEngineError("technical_specs com id=1 não existe.")

        fuel_rows = await self.fuel_prices_repository.get_all()
        if not fuel_rows:
            raise CalcEngineError("Não há preços de combustível por UF na base.")

        prices_map = fuel_rows_to_engine_prices_map(fuel_rows)
        if not prices_map:
            raise CalcEngineError(
                "Mapa fuel_prices_by_uf vazio: sincronize preços com tipos válidos."
            )

        fuel_prices_as_of = max(fr.updated_at for fr in fuel_rows).isoformat()
        specs_dict = technical_specs_to_engine_dict(
            row,
            prices_map,
            fuel_prices_as_of=fuel_prices_as_of,
        )
        validate_engine_specs(specs_dict)
        return specs_dict

    async def sync_all_sources(self) -> None:
        await self._sync_fuel_prices_from_bq()

    async def _sync_fuel_prices_from_bq(self) -> None:
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
                    WHEN UPPER(produto) LIKE '%DIESEL%'
                        AND UPPER(produto) LIKE '%S%10%'
                        THEN 'diesel_s10'
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
                    OR (
                        UPPER(produto) LIKE '%DIESEL%'
                        AND UPPER(produto) LIKE '%S%10%'
                    )
                )
            GROUP BY sigla_uf, produto_padronizado
        """

        rows = client.query(query).result()

        fuel_prices_by_uf: dict[str, dict[str, float]] = {}

        for row in rows:
            uf = str(row.sigla_uf).strip().upper()
            produto = row.produto_padronizado

            if produto is None or row.preco_medio is None:
                continue

            preco = round(float(row.preco_medio), 2)

            if uf not in fuel_prices_by_uf:
                fuel_prices_by_uf[uf] = {}

            fuel_prices_by_uf[uf][str(produto)] = preco

        for uf, prices in fuel_prices_by_uf.items():
            await self.fuel_prices_repository.upsert_by_uf(
                uf=uf,
                price_diesel_s10=prices.get("diesel_s10"),
                price_gasolina_c=prices.get("gasolina_c"),
                price_etanol=prices.get("etanol"),
            )

    async def get_technical_specs_bundle(self):
        from src.dto.official_sources import (
            TechnicalSpecsBundleDTO,
            fuel_prices_rows_to_by_uf_dict,
            technical_specs_row_to_dto,
        )

        row = await self.technical_specs_repository.get_by_id(1)
        if row is None:
            return None

        fuel_rows = await self.fuel_prices_repository.get_all()
        by_uf = fuel_prices_rows_to_by_uf_dict(fuel_rows)

        if fuel_rows:
            latest = max(fr.updated_at for fr in fuel_rows)
            fuel_prices_as_of = latest.isoformat()
        else:
            fuel_prices_as_of = ""

        await self._engine_dict_from_persisted_or_raise()

        return TechnicalSpecsBundleDTO(
            specs=technical_specs_row_to_dto(row),
            fuel_prices_by_uf=by_uf,
            fuel_prices_as_of=fuel_prices_as_of,
        )

    async def get_specs_for_calc_engine(self) -> dict[str, Any]:
        return await self._engine_dict_from_persisted_or_raise()

    async def get_all_specs(self) -> dict[str, Any]:
        """Alias semântico da doc: dict validado para a CalcEngine."""
        return await self._engine_dict_from_persisted_or_raise()

    async def get_all_fuel_prices_dict(self) -> dict[str, dict[str, Any]]:
        """Mapa UF -> FuelPriceByUFDTO serializado para JSON."""
        from src.dto.official_sources import fuel_price_row_to_dto

        rows = await self.fuel_prices_repository.get_all()
        return {
            row.uf: fuel_price_row_to_dto(row).model_dump(mode="json")
            for row in rows
        }

    async def get_fuel_price_by_uf_dict(
        self,
        uf: str,
    ) -> dict[str, Any] | None:
        from src.dto.official_sources import fuel_price_row_to_dto

        row = await self.fuel_prices_repository.get_by_uf(uf)
        if row is None:
            return None
        return fuel_price_row_to_dto(row).model_dump(mode="json")
