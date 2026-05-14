from datetime import datetime, timezone

from pydantic import ConfigDict
from sqlalchemy import Column, DateTime, Float, Integer
from sqlmodel import Field, SQLModel


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class UserStats(SQLModel, table=True):
    __tablename__ = "user_stats"

    id: int | None = Field(default=None, primary_key=True)

    user_id: int = Field(
        foreign_key="users.id",
        unique=True,
        index=True,
    )

    total_time_saved_sec: float = Field(
        default=0,
        sa_column=Column(Float, nullable=False),
    )

    co2_total_kg: float = Field(
        default=0,
        sa_column=Column(Float, nullable=False),
    )

    fuel_total_liters: float = Field(
        default=0,
        sa_column=Column(Float, nullable=False),
    )

    water_total_liters: float = Field(
        default=0,
        sa_column=Column(Float, nullable=False),
    )

    financial_total_brl: float = Field(
        default=0,
        sa_column=Column(Float, nullable=False),
    )

    transactions_count: int = Field(
        default=0,
        sa_column=Column(Integer, nullable=False),
    )

    updated_at: datetime = Field(
        default_factory=utc_now,
        sa_column=Column(
            DateTime(timezone=True),
            nullable=False,
            onupdate=utc_now,
        ),
    )


class UserStatsPublic(SQLModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int

    total_time_saved_sec: float
    co2_total_kg: float
    fuel_total_liters: float
    water_total_liters: float
    financial_total_brl: float

    transactions_count: int

    updated_at: datetime