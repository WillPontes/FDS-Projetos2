from datetime import date, timedelta

from sqlalchemy.ext.asyncio import AsyncSession

from src.dto.goals import (
    WeeklyGoalIn,
    WeeklyGoalProgressUpdate,
    WeeklyGoalUpdate,
)
from src.models.weekly_goal import WeeklyGoal
from src.repositories.weekly_goal_repository import WeeklyGoalRepository


def get_week_start_date(reference_date: date | None = None) -> date:
    current_date = reference_date or date.today()
    return current_date - timedelta(days=current_date.weekday())


async def list_goals(db: AsyncSession) -> list[WeeklyGoal]:
    return await WeeklyGoalRepository(db).get_all()


async def get_goal_by_id(
    db: AsyncSession,
    goal_id: int,
) -> WeeklyGoal | None:
    return await WeeklyGoalRepository(db).get_by_id(goal_id)


async def get_current_goal_by_user(
    db: AsyncSession,
    user_id: int,
) -> WeeklyGoal | None:
    week_start_date = get_week_start_date()

    return await WeeklyGoalRepository(db).get_current_by_user(
        user_id=user_id,
        week_start_date=week_start_date,
    )


async def create_goal(
    db: AsyncSession,
    goal_in: WeeklyGoalIn,
) -> WeeklyGoal:
    return await WeeklyGoalRepository(db).create(goal_in)


async def update_goal(
    db: AsyncSession,
    goal_id: int,
    goal_update: WeeklyGoalUpdate,
) -> WeeklyGoal | None:
    return await WeeklyGoalRepository(db).update(
        goal_id=goal_id,
        goal_update=goal_update,
    )


async def update_goal_progress(
    db: AsyncSession,
    goal_id: int,
    progress_update: WeeklyGoalProgressUpdate,
) -> WeeklyGoal | None:
    return await WeeklyGoalRepository(db).update_progress(
        goal_id=goal_id,
        progress_update=progress_update,
    )


async def increment_current_week_goal_progress(
    db: AsyncSession,
    user_id: int,
    co2_increment_kg: float | None = 0,
) -> WeeklyGoal | None:
    current_goal = await get_current_goal_by_user(
        db=db,
        user_id=user_id,
    )

    if current_goal is None:
        return None

    return await WeeklyGoalRepository(db).increment_progress(
        goal_id=current_goal.id,
        transactions_increment=1,
        co2_increment_kg=co2_increment_kg or 0,
    )