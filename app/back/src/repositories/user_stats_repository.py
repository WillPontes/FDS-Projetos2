from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.user_stats import UserStats


class UserStatsRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_by_user(self, user_id: int) -> UserStats | None:
        result = await self.session.execute(
            select(UserStats).where(UserStats.user_id == user_id)
        )

        return result.scalar_one_or_none()

    async def get_all(self) -> list[UserStats]:
        result = await self.session.execute(select(UserStats))

        return list(result.scalars().all())

    async def upsert_by_user(
        self,
        user_id: int,
        time_saved_sec: float = 0,
        co2_kg: float = 0,
        fuel_liters: float = 0,
        water_liters: float = 0,
        financial_brl: float = 0,
    ) -> UserStats:
        user_stats = await self.get_by_user(user_id)

        if user_stats is None:
            user_stats = UserStats(
                user_id=user_id,
                total_time_saved_sec=time_saved_sec,
                co2_total_kg=co2_kg,
                fuel_total_liters=fuel_liters,
                water_total_liters=water_liters,
                financial_total_brl=financial_brl,
                transactions_count=1,
            )

            self.session.add(user_stats)
        else:
            user_stats.total_time_saved_sec += time_saved_sec
            user_stats.co2_total_kg += co2_kg
            user_stats.fuel_total_liters += fuel_liters
            user_stats.water_total_liters += water_liters
            user_stats.financial_total_brl += financial_brl
            user_stats.transactions_count += 1

        await self.session.flush()

        return user_stats