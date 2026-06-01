"""
Sincroniza fatores de emissão de combustível com a planilha oficial do MCTI/SIRENE.

URL configurável via env var MCTI_EMISSION_FACTORS_URL.
Estrutura esperada: planilha Excel com coluna de nome do combustível e coluna
de fator de emissão CO₂ (kg CO₂/L). O parser busca por palavras-chave nas células
para localizar as linhas de diesel, gasolina e etanol.
"""

import asyncio
import io
import logging
import os
from typing import Any

import httpx
import openpyxl

from src.repositories.technical_specs_repository import TechnicalSpecsRepository

logger = logging.getLogger(__name__)

# URL padrão: planilha de fatores de emissão por combustível do SIRENE/MCTI.
# Substituível via env var MCTI_EMISSION_FACTORS_URL.
_DEFAULT_MCTI_URL = (
    "https://www.gov.br/mcti/pt-br/acompanhe-o-mcti/sirene/dados-e-ferramentas"
    "/fatores-de-emissao/arquivos/fatores-de-emissao-combustiveis.xlsx"
)

# Mapeamento de palavras-chave para nome interno do combustível
_FUEL_KEYWORDS: dict[str, str] = {
    "diesel": "diesel_s10",
    "gasolina": "gasolina_c",
    "etanol": "etanol",
    "álcool": "etanol",
    "alcool": "etanol",
}


def _get_mcti_url() -> str:
    return os.environ.get("MCTI_EMISSION_FACTORS_URL", _DEFAULT_MCTI_URL)


def _parse_emission_factors(content: bytes) -> dict[str, float]:
    """
    Parseia o Excel do MCTI e retorna {combustível: fator_kg_co2_por_litro}.

    Estratégia: varre todas as células de todas as planilhas buscando
    palavras-chave de combustível e extrai o primeiro número numérico
    encontrado na mesma linha.
    """
    wb = openpyxl.load_workbook(io.BytesIO(content), read_only=True, data_only=True)
    found: dict[str, float] = {}

    for sheet in wb.worksheets:
        for row in sheet.iter_rows(values_only=True):
            row_texts = [str(c).lower().strip() if c is not None else "" for c in row]
            row_nums = [
                float(c)
                for c in row
                if c is not None and isinstance(c, (int, float)) and float(c) > 0
            ]

            for cell_text in row_texts:
                for keyword, fuel_key in _FUEL_KEYWORDS.items():
                    if keyword in cell_text and fuel_key not in found and row_nums:
                        found[fuel_key] = row_nums[0]
                        break

            if len(found) == 3:
                break
        if len(found) == 3:
            break

    wb.close()
    return found


async def _download_excel(url: str) -> bytes:
    async with httpx.AsyncClient(timeout=30.0, follow_redirects=True) as client:
        response = await client.get(url)
        response.raise_for_status()
        return response.content


async def sync_emission_factors_from_mcti(db: Any) -> dict[str, Any]:
    """
    Baixa a planilha do MCTI/SIRENE, parseia os fatores de emissão e
    persiste no technical_specs (id=1).

    Retorna dict com os campos atualizados e a URL de origem.
    """
    url = _get_mcti_url()
    logger.info("Sincronizando fatores MCTI de: %s", url)

    try:
        content = await _download_excel(url)
    except httpx.HTTPError as e:
        raise RuntimeError(f"Falha ao baixar planilha MCTI ({url}): {e}") from e

    try:
        factors = await asyncio.get_event_loop().run_in_executor(
            None, _parse_emission_factors, content
        )
    except Exception as e:
        raise ValueError(f"Falha ao parsear planilha MCTI: {e}") from e

    missing = {"diesel_s10", "gasolina_c", "etanol"} - set(factors.keys())
    if missing:
        raise ValueError(
            f"Fatores não encontrados na planilha MCTI: {missing}. "
            "Verifique a estrutura do arquivo ou configure MCTI_EMISSION_FACTORS_URL."
        )

    payload = {
        "emission_factor_diesel_s10": factors["diesel_s10"],
        "emission_factor_gasolina_c": factors["gasolina_c"],
        "emission_factor_etanol": factors["etanol"],
    }

    repo = TechnicalSpecsRepository(db)
    await repo.upsert_by_id(id=1, data=payload)
    await db.commit()

    logger.info("Fatores MCTI atualizados: %s", payload)
    return {"updated": payload, "source_url": url}
