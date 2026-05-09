from typing import Any, Literal

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession

from src.database.connection import get_db
from src.engine import CalcEngine, CalcEngineError, TransactionOrchestrator
from src.providers.official_source_provider import OfficialSourceProvider
from src.repositories.fuel_prices_repository import FuelPricesRepository
from src.repositories.technical_specs_repository import TechnicalSpecsRepository

router = APIRouter(tags=["transactions"])


class VehicleIn(BaseModel):
    category: Literal["leve", "pesado"]
    fuel_type: Literal["diesel_s10", "gasolina_c", "etanol"]
    model: str = Field(min_length=1, max_length=256)


class PaybackIn(BaseModel):
    accumulated_savings_brl: float
    monthly_tag_fee_brl: float
    billing_months: float = Field(gt=0)


class ProcessTransactionBody(BaseModel):
    plate: str = Field(min_length=1, max_length=10)
    elapsed_time: int = Field(ge=0)
    context: Literal["pedagio", "estacionamento"]
    uf_passagem: str = Field(
        min_length=2,
        max_length=2,
        pattern=r"^[A-Za-z]{2}$",
    )
    is_digital: bool = True
    vehicle: VehicleIn
    payback: PaybackIn | None = None


def _provider(db: AsyncSession) -> OfficialSourceProvider:
    return OfficialSourceProvider(
        technical_specs_repository=TechnicalSpecsRepository(db),
        fuel_prices_repository=FuelPricesRepository(db),
    )


@router.post("/transactions/process")
async def process_transaction(
    body: ProcessTransactionBody,
    db: AsyncSession = Depends(get_db),
) -> dict[str, Any]:
    provider = _provider(db)
    try:
        specs = await provider.get_all_specs()
    except CalcEngineError as e:
        raise HTTPException(status_code=422, detail=str(e)) from e

    engine = CalcEngine(specs)
    orchestrator = TransactionOrchestrator(engine)

    payload_dict: dict[str, Any] = {
        "plate": body.plate.strip().upper(),
        "elapsed_time": body.elapsed_time,
        "context": body.context,
        "uf_passagem": body.uf_passagem.strip().upper(),
        "is_digital": body.is_digital,
        "vehicle": body.vehicle.model_dump(),
    }
    if body.payback is not None:
        payload_dict["payback"] = body.payback.model_dump()

    try:
        result = orchestrator.handle_tag_event(payload_dict)
    except CalcEngineError as e:
        raise HTTPException(status_code=422, detail=str(e)) from e

    return {"data": result}
