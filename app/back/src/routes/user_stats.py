from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from src.database.connection import get_db
from src.errors import messages as err
from src.models.user_stats import UserStatsPublic
from src.services.user_stats import (
    get_user_stats as get_user_stats_svc,
    list_user_stats as list_user_stats_svc,
)

router = APIRouter(prefix="/user-stats", tags=["User Stats"])


@router.get("/", response_model=list[UserStatsPublic])
async def list_user_stats(
    db: AsyncSession = Depends(get_db),
):
    stats = await list_user_stats_svc(db)

    return [
        UserStatsPublic.model_validate(item)
        for item in stats
    ]


@router.get("/{user_id}", response_model=UserStatsPublic)
async def get_user_stats(
    user_id: int,
    db: AsyncSession = Depends(get_db),
):
    stats = await get_user_stats_svc(db, user_id)

    if not stats:
        raise HTTPException(
            status_code=404,
            detail=err.USER_STATS_NOT_FOUND,
        )

    return UserStatsPublic.model_validate(stats)