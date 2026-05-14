from sqlalchemy.ext.asyncio import AsyncSession

from src.models.user_stats import UserStats
from src.repositories.user_stats_repository import UserStatsRepository


async def get_user_stats(
    db: AsyncSession,
    user_id: int,
) -> UserStats | None:
    return await UserStatsRepository(db).get_by_user(user_id)


async def list_user_stats(
    db: AsyncSession,
) -> list[UserStats]:
    return await UserStatsRepository(db).get_all()


async def upsert_user_stats_from_transaction(
    db: AsyncSession,
    user_id: int,
    time_saved_sec: float | None = 0,
    co2_kg: float | None = 0,
    fuel_liters: float | None = 0,
    water_liters: float | None = 0,
    financial_brl: float | None = 0,
) -> UserStats:
    return await UserStatsRepository(db).upsert_by_user(
        user_id=user_id,
        time_saved_sec=time_saved_sec or 0,
        co2_kg=co2_kg or 0,
        fuel_liters=fuel_liters or 0,
        water_liters=water_liters or 0,
        financial_brl=financial_brl or 0,
    )