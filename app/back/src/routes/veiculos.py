from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.lib.db import get_session
from src.models.user import CarPublic
from src.services.users import list_veiculos

router = APIRouter(tags=["veiculos"])

@router.get("/veiculos", response_model=list[CarPublic])
async def get_veiculos(session: AsyncSession = Depends(get_session)):
    rows = await list_veiculos (session)
    return [CarPublic.model_validate(row) for row in rows]