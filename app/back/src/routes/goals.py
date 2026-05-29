from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from src.database.connection import get_db
from src.dto.goals import (
    WeeklyGoalIn,
    WeeklyGoalProgressUpdate,
    WeeklyGoalPublic,
    WeeklyGoalUpdate,
)
from src.services.goals import (
    create_goal as create_goal_svc,
    get_current_goal_by_user as get_current_goal_by_user_svc,
    get_goal_by_id as get_goal_by_id_svc,
    list_goals as list_goals_svc,
    update_goal as update_goal_svc,
    update_goal_progress as update_goal_progress_svc,
)

router = APIRouter(prefix="/goals", tags=["Goals"])


@router.get("/", response_model=list[WeeklyGoalPublic])
async def list_goals(
    db: AsyncSession = Depends(get_db),
):
    goals = await list_goals_svc(db)

    return [
        WeeklyGoalPublic.model_validate(goal)
        for goal in goals
    ]


@router.get("/{goal_id}", response_model=WeeklyGoalPublic)
async def get_goal(
    goal_id: int,
    db: AsyncSession = Depends(get_db),
):
    goal = await get_goal_by_id_svc(db, goal_id)

    if not goal:
        raise HTTPException(
            status_code=404,
            detail="Goal not found",
        )

    return WeeklyGoalPublic.model_validate(goal)


@router.get("/current/{user_id}", response_model=WeeklyGoalPublic)
async def get_current_goal_by_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),
):
    goal = await get_current_goal_by_user_svc(db, user_id)

    if not goal:
        raise HTTPException(
            status_code=404,
            detail="Current weekly goal not found",
        )

    return WeeklyGoalPublic.model_validate(goal)


@router.post("/", response_model=WeeklyGoalPublic)
async def create_goal(
    goal_in: WeeklyGoalIn,
    db: AsyncSession = Depends(get_db),
):
    goal = await create_goal_svc(db, goal_in)

    await db.commit()

    return WeeklyGoalPublic.model_validate(goal)


@router.patch("/{goal_id}", response_model=WeeklyGoalPublic)
async def update_goal(
    goal_id: int,
    goal_update: WeeklyGoalUpdate,
    db: AsyncSession = Depends(get_db),
):
    goal = await update_goal_svc(
        db=db,
        goal_id=goal_id,
        goal_update=goal_update,
    )

    if not goal:
        raise HTTPException(
            status_code=404,
            detail="Goal not found",
        )

    await db.commit()

    return WeeklyGoalPublic.model_validate(goal)


@router.patch("/{goal_id}/progress", response_model=WeeklyGoalPublic)
async def update_goal_progress(
    goal_id: int,
    progress_update: WeeklyGoalProgressUpdate,
    db: AsyncSession = Depends(get_db),
):
    goal = await update_goal_progress_svc(
        db=db,
        goal_id=goal_id,
        progress_update=progress_update,
    )

    if not goal:
        raise HTTPException(
            status_code=404,
            detail="Goal not found",
        )

    await db.commit()

    return WeeklyGoalPublic.model_validate(goal)