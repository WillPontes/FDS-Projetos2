from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from src.database.connection import get_db
from src.errors import messages as err
from src.models.user_stats import UserStatsPublic
from src.services.paper_savings import compute_paper_saved_meters
from src.services.user_stats import (
    get_user_stats as get_user_stats_svc,
    list_user_stats as list_user_stats_svc,
)


def _with_paper_saved_meters(stats, paper_saved_meters: float) -> UserStatsPublic:
    data = UserStatsPublic.model_validate(stats).model_dump()
    data["paper_saved_meters"] = paper_saved_meters
    return UserStatsPublic.model_validate(data)

router = APIRouter(prefix="/user-stats", tags=["User Stats"])


@router.get("/", response_model=list[UserStatsPublic])
async def list_user_stats(
    db: AsyncSession = Depends(get_db),
):
    stats = await list_user_stats_svc(db)

    result = []
    for item in stats:
        paper_saved_meters = await compute_paper_saved_meters(
            db,
            digital_transaction_count=item.transactions_count,
        )
        result.append(_with_paper_saved_meters(item, paper_saved_meters))
    return result


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

    paper_saved_meters = await compute_paper_saved_meters(
        db,
        digital_transaction_count=stats.transactions_count,
    )
    return _with_paper_saved_meters(stats, paper_saved_meters)