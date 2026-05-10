from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from src.database.connection import get_db
from src.engine.exceptions import CalcEngineError
from src.services.technical_specs import get_technical_specs_bundle

router = APIRouter(prefix="/technical-specs", tags=["Technical Specs"])


@router.get("/", response_model=dict[str, Any])
async def get_technical_specs(db: AsyncSession = Depends(get_db)) -> dict[str, Any]:
    try:
        specs = await get_technical_specs_bundle(db)
    except CalcEngineError as e:
        raise HTTPException(status_code=422, detail=str(e)) from e
    return {"data": specs}
