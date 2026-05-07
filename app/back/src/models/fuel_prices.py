from datetime import datetime, timezone
from typing import Any

from pydantic import ConfigDict
from sqlalchemy import Column, DateTime, String
from sqlalchemy.dialects.postgresql import JSONB
from sqlmodel import Field, SQLModel


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class FuelPriceByUF(SQLModel, table=True):
    __tablename__ = "fuel_prices_by_uf"

    uf: str = Field(
        sa_column=Column(String(2), primary_key=True, index=True),
    )

    prices: dict[str, Any] = Field(
        default_factory=dict,
        sa_column=Column(JSONB, nullable=False),
    )

    meta: dict[str, Any] = Field(
        default_factory=dict,
        sa_column=Column(JSONB, nullable=False),
    )

    created_at: datetime = Field(
        default_factory=utc_now,
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )

    updated_at: datetime = Field(
        default_factory=utc_now,
        sa_column=Column(DateTime(timezone=True), nullable=False, onupdate=utc_now),
    )


class FuelPriceByUFPublic(SQLModel):
    model_config = ConfigDict(from_attributes=True)

    uf: str
    prices: dict[str, Any]
    meta: dict[str, Any]
    created_at: datetime
    updated_at: datetime