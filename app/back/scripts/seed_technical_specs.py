#!/usr/bin/env python3
"""
Insere ou atualiza technical_specs id=1 com valores completos válidos para a CalcEngine.

Uso (em app/back, DATABASE_URL no .env):

    uv run python scripts/seed_technical_specs.py

No container (API no ar, deps instaladas no build via uv sync):

    docker compose exec api uv run python scripts/seed_technical_specs.py

Use sempre ``uv run`` no container; ``python`` solto aponta para o interpretador da
imagem base, sem o .venv do projeto.

Ordem sugerida: Postgres no ar -> alembic upgrade head -> este script -> sync de preços.
"""

from __future__ import annotations

import asyncio
import sys
from pathlib import Path

_BACK_ROOT = Path(__file__).resolve().parents[1]
if str(_BACK_ROOT) not in sys.path:
    sys.path.insert(0, str(_BACK_ROOT))

from dotenv import load_dotenv  # noqa: E402

load_dotenv(_BACK_ROOT / ".env")

from src.database.connection import AsyncSessionLocal  # noqa: E402
from src.models.technical_specs import default_ludic_metaphor_units  # noqa: E402
from src.repositories.technical_specs_repository import (  # noqa: E402
    TechnicalSpecsRepository,
)

# Alinhado à migration 001 (sem freios) — todos os campos obrigatórios.
SEED_TECHNICAL_SPECS_ID_1: dict = {
    "emission_factor_diesel_s10": 2.51,
    "emission_factor_gasolina_c": 2.15,
    "emission_factor_etanol": 0.44,
    "idle_rate_leve": 0.00027,
    "idle_rate_pesado": 0.00069,
    "paper_co2_per_ticket": 0.012,
    "paper_water_per_ticket": 0.5,
    "ludic_tree_year_absorption": 15.0,
    "ludic_phone_charge_factor": 120.0,
    "ludic_coffee_factor": 10.0,
    "ludic_metaphor_units": default_ludic_metaphor_units(),
    "baseline_pedagio_avg_wait_sec": 300,
    "baseline_estacionamento_avg_wait_sec": 180,
    "maint_cost_leve": 0.05,
    "maint_cost_pesado": 0.25,
    "accel_surge_leve": 0.015,
    "accel_surge_pesado": 0.080,
    "benchmark_kg_co2_per_km_car": 0.12,
    "benchmark_kg_co2_per_burger": 2.5,
}


async def main() -> None:
    async with AsyncSessionLocal() as session:
        repo = TechnicalSpecsRepository(session)
        await repo.upsert_by_id(1, SEED_TECHNICAL_SPECS_ID_1)
        await session.commit()
        print("technical_specs id=1 atualizado com valores completos.")


if __name__ == "__main__":
    asyncio.run(main())
