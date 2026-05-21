from datetime import datetime, timezone
from typing import Any

from pydantic import ConfigDict
from sqlalchemy import Column, DateTime, Float
from sqlalchemy.dialects.postgresql import JSONB
from sqlmodel import Field, SQLModel


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class Transaction(SQLModel, table=True):
    __tablename__ = "transactions"

    id: int | None = Field(default=None, primary_key=True)

    user_id: int | None = Field(
        default=None,
        foreign_key="users.id",
    )

    vehicle_id: int | None = Field(
        default=None,
        foreign_key="vehicles.id",
    )

    organization_id: int | None = Field(
        default=None,
        foreign_key="organizations.id",
    )

    plate: str | None = None

    context: str

    uf: str | None = None

    elapsed_time_sec: float | None = Field(
        default=None,
        sa_column=Column(Float),
    )

    is_digital: bool = True

    co2_avoided_kg: float | None = Field(
        default=None,
        sa_column=Column(Float),
    )

    fuel_saved_liters: float | None = Field(
        default=None,
        sa_column=Column(Float),
    )

    time_saved_sec: float | None = Field(
        default=None,
        sa_column=Column(Float),
    )

    financial_savings_brl: float | None = Field(
        default=None,
        sa_column=Column(Float),
    )

    water_saved_liters: float | None = Field(
        default=None,
        sa_column=Column(Float),
    )

    parameters_snapshot: dict[str, Any] = Field(
        default_factory=dict,
        sa_column=Column(JSONB),
    )

    created_at: datetime = Field(
        default_factory=utc_now,
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )


class TransactionPublic(SQLModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int | None
    vehicle_id: int | None
    organization_id: int | None
    plate: str | None
    context: str
    uf: str | None
    elapsed_time_sec: float | None
    is_digital: bool
    co2_avoided_kg: float | None
    fuel_saved_liters: float | None
    time_saved_sec: float | None
    financial_savings_brl: float | None
    water_saved_liters: float | None
    parameters_snapshot: dict[str, Any]
    created_at: datetime