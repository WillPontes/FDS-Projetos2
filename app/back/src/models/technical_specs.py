from datetime import datetime, timezone
from typing import Any

from pydantic import ConfigDict
from sqlalchemy import Column, DateTime
from sqlalchemy.dialects.postgresql import JSONB
from sqlmodel import Field, SQLModel


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class TechnicalSpecs(SQLModel, table=True):
    __tablename__ = "technical_specs"

    id: int | None = Field(default=None, primary_key=True)

    emission_factors: dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSONB))
    idle_rates: dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSONB))
    paper_impact: dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSONB))
    ludic_factors: dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSONB))
    ludic_metaphors: dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSONB))
    baselines: dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSONB))

    maint_costs: dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSONB))
    brake_cost_per_stop_brl: dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSONB))
    accel_surge: dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSONB))
    benchmarks: dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSONB))

    created_at: datetime = Field(
        default_factory=utc_now,
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )

    updated_at: datetime = Field(
        default_factory=utc_now,
        sa_column=Column(DateTime(timezone=True), nullable=False, onupdate=utc_now),
    )


class TechnicalSpecsPublic(SQLModel):
    model_config = ConfigDict(from_attributes=True)

    id: int

    emission_factors: dict[str, Any]
    idle_rates: dict[str, Any]
    paper_impact: dict[str, Any]
    ludic_factors: dict[str, Any]
    ludic_metaphors: dict[str, Any]
    baselines: dict[str, Any]

    maint_costs: dict[str, Any]
    brake_cost_per_stop_brl: dict[str, Any]
    accel_surge: dict[str, Any]
    benchmarks: dict[str, Any]

    created_at: datetime
    updated_at: datetime