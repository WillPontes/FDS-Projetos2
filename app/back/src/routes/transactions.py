from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from src.database.connection import get_db
from src.dto.transactions import ProcessTransactionBody, TransactionResultDTO
from src.engine import CalcEngine, CalcEngineError, TransactionOrchestrator
from src.services.technical_specs import get_all_specs

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
