from datetime import date, datetime, timezone

from sqlalchemy import Boolean, Column, Date, DateTime, Float, Integer
from sqlmodel import Field, SQLModel


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class WeeklyGoal(SQLModel, table=True):
    __tablename__ = "weekly_goals"

    id: int | None = Field(default=None, primary_key=True)

    user_id: int = Field(
        sa_column=Column(Integer, nullable=False, index=True)
    )

    week_start_date: date = Field(
        sa_column=Column(Date, nullable=False)
    )

    target_transactions: int = Field(
        default=0,
        sa_column=Column(Integer, nullable=False),
    )

    current_transactions: int = Field(
        default=0,
        sa_column=Column(Integer, nullable=False),
    )

    target_co2_kg: float = Field(
        default=0,
        sa_column=Column(Float, nullable=False),
    )

    current_co2_kg: float = Field(
        default=0,
        sa_column=Column(Float, nullable=False),
    )

    is_completed: bool = Field(
        default=False,
        sa_column=Column(Boolean, nullable=False),
    )

    created_at: datetime = Field(
        default_factory=utc_now,
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )

    updated_at: datetime = Field(
        default_factory=utc_now,
        sa_column=Column(
            DateTime(timezone=True),
            nullable=False,
            onupdate=utc_now,
        ),
    )