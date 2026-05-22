from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from src.services.user_stats import upsert_user_stats_from_transaction

from src.database.connection import get_db
from src.dto.transactions import (
    ProcessTransactionBody,
    TransactionIn,
    TransactionPublic,
    TransactionResultDTO,
    TransactionUpdate,
)
from src.engine import CalcEngine, CalcEngineError, TransactionOrchestrator
from src.services.technical_specs import get_all_specs
from src.services.transactions import (
    create_transaction as create_transaction_svc,
    delete_transaction as delete_transaction_svc,
    get_transaction_by_id as get_transaction_by_id_svc,
    list_transactions as list_transactions_svc,
    update_transaction as update_transaction_svc,
)

router = APIRouter(prefix="/transactions", tags=["Transactions"])


@router.post("/process", response_model=TransactionResultDTO)
async def process_transaction(
    body: ProcessTransactionBody,
    db: AsyncSession = Depends(get_db),
):
    try:
        specs = await get_all_specs(db)
    except CalcEngineError as e:
        raise HTTPException(status_code=422, detail=str(e)) from e

    engine = CalcEngine(specs)
    orchestrator = TransactionOrchestrator(engine)

    payload_dict: dict[str, Any] = {
        "plate": body.plate.strip().upper(),
        "elapsed_time": body.elapsed_time,
        "context": body.context,
        "uf_passagem": body.uf.strip().upper(),
        "is_digital": body.is_digital,
        "vehicle": body.vehicle.model_dump(),
    }
    if body.payback is not None:
        payload_dict["payback"] = body.payback.model_dump()

    try:
        result = orchestrator.handle_tag_event(payload_dict)
    except CalcEngineError as e:
        raise HTTPException(status_code=422, detail=str(e)) from e

    transaction_in = TransactionIn(
        user_id=body.user_id,
        vehicle_id=body.vehicle_id,
        organization_id=body.organization_id,
        plate=body.plate.strip().upper(),
        context=body.context,
        uf=body.uf.strip().upper(),
        elapsed_time_sec=float(body.elapsed_time),
        is_digital=body.is_digital,
        co2_avoided_kg=result.get("co2_avoided_kg"),
        fuel_saved_liters=result.get("fuel_saved_liters"),
        time_saved_sec=result.get("time_saved_sec"),
        financial_savings_brl=result.get("financial_savings_brl"),
        water_saved_liters=result.get("water_saved_liters"),
        parameters_snapshot={
            "payload": payload_dict,
            "emission_factors": specs.get("emission_factors"),
            "pricing_snapshot": {
                "fuel_prices": specs.get("fuel_prices"),
                "fuel_prices_by_uf": specs.get("fuel_prices_by_uf"),
                "fuel_prices_meta": specs.get("fuel_prices_meta"),
            },
            "result": result,
        },
    )

    transaction = await create_transaction_svc(db, transaction_in)

    if body.user_id is not None:
        await upsert_user_stats_from_transaction(
            db=db,
            user_id=body.user_id,
            time_saved_sec=result.get("time_saved_sec"),
            co2_kg=result.get("co2_avoided_kg"),
            fuel_liters=result.get("fuel_saved_liters"),
            water_liters=result.get("water_saved_liters"),
            financial_brl=result.get("financial_savings_brl"),
        )

    await db.commit()

    return {
        "data": {
            "result": result,
            "transaction": TransactionPublic.model_validate(transaction).model_dump(),
        }
    }
