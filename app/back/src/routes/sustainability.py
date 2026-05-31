from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import SQLModel

from src.database.connection import get_db
from src.middleware.dev_auth import get_current_user_dev, scoped_user_id_for_motorista
from src.models.user import User
from src.repositories.technical_specs_repository import TechnicalSpecsRepository
from src.repositories.transaction_repository import TransactionRepository
from src.services.goals import get_current_goal_by_user
from src.services.user_stats import get_user_stats

router = APIRouter(prefix="/sustainability", tags=["Sustainability"])


# ---------------------------------------------------------------------------
# DTOs (response-only, inline — específicos desta feature)
# ---------------------------------------------------------------------------

class ImpactMetricsPublic(SQLModel):
    days_saved_without_queues: float
    tree_saved: float
    total_carbon: float
    total_water_saved: float
    paper_saved: float


class WeeklyGoalSummaryPublic(SQLModel):
    weekly_goal: int
    weekly_percentage: float
    current_transactions: int
    target_transactions: int
    target_co2_kg: float
    current_co2_kg: float
    is_completed: bool


class PassagePublic(SQLModel):
    id: int
    local_name: str
    passage_datetime: str
    carbon: str
    water_saved: str
    time: str


class PassagesListPublic(SQLModel):
    total_results: int
    page: int
    last_passages: list[PassagePublic]


class PassagesSummaryPublic(SQLModel):
    total_passages: int
    total_carbon: float
    hours_saved: float


# ---------------------------------------------------------------------------
# Helpers de formatação
# ---------------------------------------------------------------------------

def _fmt_carbon(kg: float | None) -> str:
    if kg is None:
        return "0g"
    g = (kg or 0) * 1000
    if g < 1000:
        return f"{g:.0f}g"
    return f"{kg:.2f}kg"


def _fmt_water(liters: float | None) -> str:
    if liters is None:
        return "0ml"
    ml = (liters or 0) * 1000
    if ml < 1000:
        return f"{ml:.0f}ml"
    return f"{liters:.2f}L"


def _fmt_time(seconds: float | None) -> str:
    if not seconds:
        return "0min"
    total_min = int(seconds / 60)
    if total_min < 60:
        return f"{total_min}min"
    h = total_min // 60
    m = total_min % 60
    return f"{h}h {m}min" if m else f"{h}h"


def _fmt_datetime(dt) -> str:
    return dt.strftime("%d/%m/%Y às %H:%M:%S")


def _context_label(context: str, uf: str | None) -> str:
    labels = {"pedagio": "Pedágio", "estacionamento": "Estacionamento"}
    name = labels.get(context, context.capitalize())
    return f"{name} {uf}" if uf else name


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@router.get("/impact", response_model=ImpactMetricsPublic)
async def get_impact_metrics(
    user_id: int = Query(...),
    db: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_current_user_dev),
) -> ImpactMetricsPublic:
    user_id = scoped_user_id_for_motorista(current_user, user_id) or user_id
    stats = await get_user_stats(db, user_id)

    specs_list = await TechnicalSpecsRepository(db).get_all()
    specs = specs_list[0] if specs_list else None

    tree_absorption = specs.ludic_tree_year_absorption if specs else 21.8
    paper_co2 = specs.paper_co2_per_ticket if specs else 0.005

    if stats is None:
        return ImpactMetricsPublic(
            days_saved_without_queues=0,
            tree_saved=0,
            total_carbon=0,
            total_water_saved=0,
            paper_saved=0,
        )

    days_saved = stats.total_time_saved_sec / 86400
    tree_saved = stats.co2_total_kg / tree_absorption if tree_absorption else 0
    paper_saved = stats.transactions_count * paper_co2

    return ImpactMetricsPublic(
        days_saved_without_queues=round(days_saved, 4),
        tree_saved=round(tree_saved, 4),
        total_carbon=round(stats.co2_total_kg, 4),
        total_water_saved=round(stats.water_total_liters, 4),
        paper_saved=round(paper_saved, 4),
    )


@router.get("/goal", response_model=WeeklyGoalSummaryPublic)
async def get_weekly_goal(
    user_id: int = Query(...),
    db: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_current_user_dev),
) -> WeeklyGoalSummaryPublic:
    user_id = scoped_user_id_for_motorista(current_user, user_id) or user_id
    goal = await get_current_goal_by_user(db, user_id)

    if goal is None:
        return WeeklyGoalSummaryPublic(
            weekly_goal=0,
            weekly_percentage=0,
            current_transactions=0,
            target_transactions=0,
            target_co2_kg=0,
            current_co2_kg=0,
            is_completed=False,
        )

    pct = 0.0
    if goal.target_transactions > 0:
        pct = (goal.current_transactions / goal.target_transactions) * 100

    return WeeklyGoalSummaryPublic(
        weekly_goal=goal.target_transactions,
        weekly_percentage=round(min(pct, 100), 1),
        current_transactions=goal.current_transactions,
        target_transactions=goal.target_transactions,
        target_co2_kg=goal.target_co2_kg,
        current_co2_kg=goal.current_co2_kg,
        is_completed=goal.is_completed,
    )


@router.get("/passages/summary", response_model=PassagesSummaryPublic)
async def get_passages_summary(
    user_id: int = Query(...),
    db: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_current_user_dev),
) -> PassagesSummaryPublic:
    user_id = scoped_user_id_for_motorista(current_user, user_id) or user_id
    stats = await get_user_stats(db, user_id)

    if stats is None:
        return PassagesSummaryPublic(total_passages=0, total_carbon=0, hours_saved=0)

    return PassagesSummaryPublic(
        total_passages=stats.transactions_count,
        total_carbon=round(stats.co2_total_kg, 4),
        hours_saved=round(stats.total_time_saved_sec / 3600, 4),
    )


@router.get("/passages", response_model=PassagesListPublic)
async def get_passages(
    user_id: int = Query(...),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=10, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_current_user_dev),
) -> PassagesListPublic:
    user_id = scoped_user_id_for_motorista(current_user, user_id) or user_id
    repo = TransactionRepository(db)
    txs, total = await repo.get_by_user_paginated(user_id, page, page_size)

    passages = [
        PassagePublic(
            id=t.id,
            local_name=_context_label(t.context, t.uf),
            passage_datetime=_fmt_datetime(t.created_at),
            carbon=_fmt_carbon(t.co2_avoided_kg),
            water_saved=_fmt_water(t.water_saved_liters),
            time=_fmt_time(t.time_saved_sec),
        )
        for t in txs
    ]

    return PassagesListPublic(
        total_results=total,
        page=page,
        last_passages=passages,
    )
