from datetime import date, timedelta

from fastapi import APIRouter, Depends, Query
from sqlalchemy import cast, func, select, Date
from sqlalchemy.ext.asyncio import AsyncSession

from src.database.connection import get_db
from src.middleware.dev_auth import apply_org_scope_for_gestor, get_current_user_dev
from src.models.transaction import Transaction
from src.models.user import User

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/daily-stats")
async def get_daily_stats(
    days: int = Query(default=30, ge=7, le=90),
    organization_id: int | None = Query(default=None),
    db: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_current_user_dev),
):
    organization_id = apply_org_scope_for_gestor(current_user, organization_id)
    since = date.today() - timedelta(days=days - 1)

    query = (
        select(
            cast(Transaction.created_at, Date).label("day"),
            func.count().label("transaction_count"),
            func.coalesce(func.sum(Transaction.co2_avoided_kg), 0).label("co2_total_kg"),
        )
        .where(Transaction.created_at >= since)
        .group_by(cast(Transaction.created_at, Date))
        .order_by(cast(Transaction.created_at, Date))
    )

    if organization_id is not None:
        query = query.where(Transaction.organization_id == organization_id)

    result = await db.execute(query)
    rows = result.all()

    day_map = {row.day: row for row in rows}
    data = []
    for i in range(days):
        d = since + timedelta(days=i)
        row = day_map.get(d)
        data.append({
            "day": d.isoformat(),
            "transaction_count": row.transaction_count if row else 0,
            "co2_total_kg": float(row.co2_total_kg) if row else 0.0,
        })

    return {"items": data}
