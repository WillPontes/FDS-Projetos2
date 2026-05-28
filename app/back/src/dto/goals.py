from datetime import date, datetime

from pydantic import Field
from sqlmodel import SQLModel


class WeeklyGoalIn(SQLModel):
    user_id: int

    week_start_date: date

    target_transactions: int = Field(
        ge=0,
        default=0,
    )

    target_co2_kg: float = Field(
        ge=0,
        default=0,
    )


class WeeklyGoalUpdate(SQLModel):
    target_transactions: int | None = Field(
        default=None,
        ge=0,
    )

    target_co2_kg: float | None = Field(
        default=None,
        ge=0,
    )

    is_completed: bool | None = None


class WeeklyGoalProgressUpdate(SQLModel):
    current_transactions: int | None = Field(
        default=None,
        ge=0,
    )

    current_co2_kg: float | None = Field(
        default=None,
        ge=0,
    )

    is_completed: bool | None = None


class WeeklyGoalPublic(SQLModel):
    id: int

    user_id: int

    week_start_date: date

    target_transactions: int
    current_transactions: int

    target_co2_kg: float
    current_co2_kg: float

    is_completed: bool

    created_at: datetime
    updated_at: datetime