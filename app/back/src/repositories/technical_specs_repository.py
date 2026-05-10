from typing import Any, Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.technical_specs import TechnicalSpecs


class TechnicalSpecsRepository:
    """Persistência da tabela technical_specs (documento global tipicamente id=1)."""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_id(self, id: int) -> Optional[TechnicalSpecs]:
        result = await self.session.execute(
            select(TechnicalSpecs).where(TechnicalSpecs.id == id)
        )
        return result.scalar_one_or_none()

    async def get_all(self) -> list[TechnicalSpecs]:
        result = await self.session.execute(select(TechnicalSpecs))
        return list(result.scalars().all())

    async def create(self, data: dict[str, Any]) -> TechnicalSpecs:
        fields = TechnicalSpecsRepository._extract_fields(data)
        specs = TechnicalSpecs(**fields)
        self.session.add(specs)
        await self.session.flush()
        return specs

    async def update(self, id: int, data: dict[str, Any]) -> Optional[TechnicalSpecs]:
        result = await self.session.execute(
            select(TechnicalSpecs).where(TechnicalSpecs.id == id)
        )
        specs = result.scalar_one_or_none()
        if specs is None:
            return None
        fields = TechnicalSpecsRepository._extract_fields(data)
        for field_name, field_value in fields.items():
            setattr(specs, field_name, field_value)
        await self.session.flush()
        return specs

    async def delete(self, id: int) -> bool:
        result = await self.session.execute(
            select(TechnicalSpecs).where(TechnicalSpecs.id == id)
        )
        specs = result.scalar_one_or_none()
        if specs is None:
            return False
        self.session.delete(specs)
        return True

    async def upsert_by_id(self, id: int, data: dict[str, Any]) -> TechnicalSpecs:
        result = await self.session.execute(
            select(TechnicalSpecs).where(TechnicalSpecs.id == id)
        )
        specs = result.scalar_one_or_none()
        fields = TechnicalSpecsRepository._extract_fields(data)
        if specs is None:
            specs = TechnicalSpecs(id=id, **fields)
            self.session.add(specs)
        else:
            for field_name, field_value in fields.items():
                setattr(specs, field_name, field_value)
        await self.session.flush()
        return specs

    @staticmethod
    def _extract_fields(data: dict[str, Any]) -> dict[str, Any]:
        """Extrai apenas campos persistidos; ignorando id/timestamps quando omitidos."""
        keys = (
            "emission_factor_diesel_s10",
            "emission_factor_gasolina_c",
            "emission_factor_etanol",
            "idle_rate_leve",
            "idle_rate_pesado",
            "paper_co2_per_ticket",
            "paper_water_per_ticket",
            "ludic_tree_year_absorption",
            "ludic_phone_charge_factor",
            "ludic_coffee_factor",
            "ludic_metaphor_units",
            "baseline_pedagio_avg_wait_sec",
            "baseline_estacionamento_avg_wait_sec",
            "maint_cost_leve",
            "maint_cost_pesado",
            "accel_surge_leve",
            "accel_surge_pesado",
            "benchmark_kg_co2_per_km_car",
            "benchmark_kg_co2_per_burger",
        )
        out: dict[str, Any] = {}
        for k in keys:
            if k in data:
                out[k] = data[k]
        return out
