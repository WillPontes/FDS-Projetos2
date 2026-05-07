from typing import Any, Dict, List, Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.technical_specs import TechnicalSpecs


class TechnicalSpecsRepository:
    """
    Repository responsável por operações de banco da tabela technical_specs.
    Usa métodos padronizados: get_by_id, get_all, create, update, delete e upsert_by_id.
    """

    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_id(self, id: int) -> Optional[Dict[str, Any]]:
        result = await self.session.execute(
            select(TechnicalSpecs).where(TechnicalSpecs.id == id)
        )

        specs = result.scalar_one_or_none()

        if specs is None:
            return None

        return self._to_dict(specs)

    async def get_all(self) -> List[Dict[str, Any]]:
        result = await self.session.execute(select(TechnicalSpecs))

        rows = result.scalars().all()

        return [self._to_dict(row) for row in rows]

    async def create(self, data: Dict[str, Any]) -> Dict[str, Any]:
        fields = self._extract_fields(data)

        specs = TechnicalSpecs(**fields)

        self.session.add(specs)
        await self.session.commit()
        await self.session.refresh(specs)

        return self._to_dict(specs)

    async def update(self, id: int, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        result = await self.session.execute(
            select(TechnicalSpecs).where(TechnicalSpecs.id == id)
        )

        specs = result.scalar_one_or_none()

        if specs is None:
            return None

        fields = self._extract_fields(data)

        for field_name, field_value in fields.items():
            setattr(specs, field_name, field_value)

        await self.session.commit()
        await self.session.refresh(specs)

        return self._to_dict(specs)

    async def delete(self, id: int) -> bool:
        result = await self.session.execute(
            select(TechnicalSpecs).where(TechnicalSpecs.id == id)
        )

        specs = result.scalar_one_or_none()

        if specs is None:
            return False

        await self.session.delete(specs)
        await self.session.commit()

        return True

    async def upsert_by_id(self, id: int, data: Dict[str, Any]) -> Dict[str, Any]:
        result = await self.session.execute(
            select(TechnicalSpecs).where(TechnicalSpecs.id == id)
        )

        specs = result.scalar_one_or_none()
        fields = self._extract_fields(data)

        if specs is None:
            specs = TechnicalSpecs(id=id, **fields)
            self.session.add(specs)
        else:
            for field_name, field_value in fields.items():
                setattr(specs, field_name, field_value)

        await self.session.commit()
        await self.session.refresh(specs)

        return self._to_dict(specs)

    def _to_dict(self, specs: TechnicalSpecs) -> Dict[str, Any]:
        return {
            "id": specs.id,
            "emission_factors": specs.emission_factors,
            "idle_rates": specs.idle_rates,
            "paper_impact": specs.paper_impact,
            "ludic_factors": specs.ludic_factors,
            "ludic_metaphors": specs.ludic_metaphors,
            "baselines": specs.baselines,
            "maint_costs": specs.maint_costs,
            "brake_cost_per_stop_brl": specs.brake_cost_per_stop_brl,
            "accel_surge": specs.accel_surge,
            "benchmarks": specs.benchmarks,
            "created_at": specs.created_at,
            "updated_at": specs.updated_at,
        }

    def _extract_fields(self, data: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "emission_factors": data.get("emission_factors", {}),
            "idle_rates": data.get("idle_rates", {}),
            "paper_impact": data.get("paper_impact", {}),
            "ludic_factors": data.get("ludic_factors", {}),
            "ludic_metaphors": data.get("ludic_metaphors", {}),
            "baselines": data.get("baselines", {}),
            "maint_costs": data.get("maint_costs", {}),
            "brake_cost_per_stop_brl": data.get("brake_cost_per_stop_brl", {}),
            "accel_surge": data.get("accel_surge", {}),
            "benchmarks": data.get("benchmarks", {}),
        }