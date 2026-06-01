from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from src.database.connection import get_db
from src.engine.exceptions import CalcEngineError
from src.errors import messages as err
from src.services.technical_specs import (
    get_technical_specs_bundle,
    post_technical_specs_update,
)
from src.services.mcti_sync_service import sync_emission_factors_from_mcti
from src.dto.technical_specs import TechnicalSpecsUpdate, TechnicalSpecsDTO


router = APIRouter(prefix="/technical-specs", tags=["Technical Specs"])


@router.get("/", response_model=dict[str, Any])
async def get_technical_specs(db: AsyncSession = Depends(get_db)) -> dict[str, Any]:
    try:
        specs = await get_technical_specs_bundle(db)
    except CalcEngineError as e:
        raise HTTPException(status_code=422, detail=err.CALC_ENGINE_FAILED) from e
    return {"data": specs}


@router.post("/sync-mcti", response_model=dict[str, Any])
async def sync_mcti_emission_factors(
    db: AsyncSession = Depends(get_db),
) -> dict[str, Any]:
    try:
        result = await sync_emission_factors_from_mcti(db)
        return {"status": "ok", **result}
    except RuntimeError as e:
        raise HTTPException(status_code=502, detail=str(e)) from e
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e)) from e


@router.post("/update", response_model=TechnicalSpecsDTO)
async def post_technical_specs(
    payload: TechnicalSpecsUpdate, db: AsyncSession = Depends(get_db)
):
    try:
        update_specs = await post_technical_specs_update(db=db, payload=payload)
        return update_specs
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e
