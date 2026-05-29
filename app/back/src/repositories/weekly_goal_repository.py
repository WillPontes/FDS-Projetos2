from datetime import date

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.dto.goals import (
    WeeklyGoalIn,
    WeeklyGoalProgressUpdate,
    WeeklyGoalUpdate,
)
from src.models.weekly_goal import WeeklyGoal


class WeeklyGoalRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_by_id(self, goal_id: int) -> WeeklyGoal | None:
        result = await self.session.execute(
            select(WeeklyGoal).where(WeeklyGoal.id == goal_id)
        )

        return result.scalar_one_or_none()

    async def get_all(self) -> list[WeeklyGoal]:
        result = await self.session.execute(select(WeeklyGoal))

        return list(result.scalars().all())

    async def get_current_by_user(
        self,
        user_id: int,
        week_start_date: date,
    ) -> WeeklyGoal | None:
        result = await self.session.execute(
            select(WeeklyGoal).where(
                WeeklyGoal.user_id == user_id,
                WeeklyGoal.week_start_date == week_start_date,
            )
        )

        return result.scalar_one_or_none()

    async def create(
        self,
        goal_in: WeeklyGoalIn,
    ) -> WeeklyGoal:
        goal = WeeklyGoal(**goal_in.model_dump())

        self.session.add(goal)
        await self.session.flush()

        return goal

    async def update(
        self,
        goal_id: int,
        goal_update: WeeklyGoalUpdate,
    ) -> WeeklyGoal | None:
        goal = await self.get_by_id(goal_id)

        if goal is None:
            return None

        for key, value in goal_update.model_dump(exclude_unset=True).items():
            setattr(goal, key, value)

        self.session.add(goal)
        await self.session.flush()

        return goal

    async def update_progress(
        self,
        goal_id: int,
        progress_update: WeeklyGoalProgressUpdate,
    ) -> WeeklyGoal | None:
        goal = await self.get_by_id(goal_id)

        if goal is None:
            return None

        for key, value in progress_update.model_dump(exclude_unset=True).items():
            setattr(goal, key, value)

        goal.is_completed = self._is_goal_completed(goal)

        self.session.add(goal)
        await self.session.flush()

        return goal

    async def increment_progress(
        self,
        goal_id: int,
        transactions_increment: int = 1,
        co2_increment_kg: float = 0,
    ) -> WeeklyGoal | None:
        goal = await self.get_by_id(goal_id)

        if goal is None:
            return None

        goal.current_transactions += transactions_increment
        goal.current_co2_kg += co2_increment_kg
        goal.is_completed = self._is_goal_completed(goal)

        self.session.add(goal)
        await self.session.flush()

        return goal

    def _is_goal_completed(self, goal: WeeklyGoal) -> bool:
        transactions_completed = (
            goal.target_transactions > 0
            and goal.current_transactions >= goal.target_transactions
        )

        co2_completed = (
            goal.target_co2_kg > 0
            and goal.current_co2_kg >= goal.target_co2_kg
        )

        return transactions_completed or co2_completed