from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import Session

from src.database.connection import get_db
from src.engine.exceptions import CalcEngineError
from src.services.technical_specs import (
    get_technical_specs_bundle,
    post_technical_specs_update,
)
from src.dto.technical_specs import TechnicalSpecsUpdate, TechnicalSpecsDTO


router = APIRouter(prefix="/technical-specs", tags=["Technical Specs"])


@router.get("/", response_model=dict[str, Any])
async def get_technical_specs(db: AsyncSession = Depends(get_db)) -> dict[str, Any]:
    try:
        specs = await get_technical_specs_bundle(db)
    except CalcEngineError as e:
        raise HTTPException(status_code=422, detail=str(e)) from e
    return {"data": specs}


@router.post("/update", response_model=TechnicalSpecsDTO)
async def post_technical_specs(
    payload: TechnicalSpecsUpdate, db: AsyncSession = Depends(get_db)
):
    try:
        update_specs = await post_technical_specs_update(db=db, payload=payload)
        return update_specs
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
