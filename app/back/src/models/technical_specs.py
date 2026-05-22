from datetime import datetime, timezone
from typing import Any

from sqlalchemy import Column, DateTime, Float, Integer
from sqlalchemy.dialects.postgresql import JSONB
from sqlmodel import Field, SQLModel


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def default_ludic_metaphor_units() -> dict[str, dict[str, float]]:
    """Valores técnicos default (_default_ludic_metaphors da doc); labels ficam em constants."""
    return {
        "carbon": {
            "tree_year": 15.0,
            "burger": 2.5,
            "km_car": 0.12,
        },
        "water": {
            "shower_8min": 60.0,
            "drinking_day": 2.0,
            "flush": 6.0,
        },
        "paper": {
            "ream_a4": 500.0,
            "notebook": 50.0,
            "toilet_roll": 150.0,
        },
    }


class TechnicalSpecs(SQLModel, table=True):
    __tablename__ = "technical_specs"

    id: int | None = Field(default=None, primary_key=True)

    emission_factor_diesel_s10: float = Field(
        default=0, sa_column=Column(Float, nullable=False)
    )

    emission_factor_gasolina_c: float = Field(
        default=0, sa_column=Column(Float, nullable=False)
    )

    emission_factor_etanol: float = Field(
        default=0, sa_column=Column(Float, nullable=False)
    )

    idle_rate_leve: float = Field(
        default=0, sa_column=Column(Float, nullable=False))

    idle_rate_pesado: float = Field(
        default=0, sa_column=Column(Float, nullable=False))

    paper_co2_per_ticket: float = Field(
        default=0, sa_column=Column(Float, nullable=False))

    paper_water_per_ticket: float = Field(
        default=0, sa_column=Column(Float, nullable=False))

    ludic_tree_year_absorption: float = Field(
        default=0, sa_column=Column(Float, nullable=False))

    ludic_phone_charge_factor: float = Field(
        default=0, sa_column=Column(Float, nullable=False))

    ludic_coffee_factor: float = Field(
        default=0, sa_column=Column(Float, nullable=False))

    ludic_metaphor_units: dict[str, Any] = Field(
        default_factory=default_ludic_metaphor_units,
        sa_column=Column(JSONB, nullable=False),
    )

    baseline_pedagio_avg_wait_sec: int = Field(
        default=0, sa_column=Column(Integer, nullable=False))

    baseline_estacionamento_avg_wait_sec: int = Field(
        default=0, sa_column=Column(Integer, nullable=False)
    )

    maint_cost_leve: float = Field(
        default=0, sa_column=Column(Float, nullable=False))

    maint_cost_pesado: float = Field(
        default=0, sa_column=Column(Float, nullable=False))

    accel_surge_leve: float = Field(
        default=0, sa_column=Column(Float, nullable=False))

    accel_surge_pesado: float = Field(
        default=0, sa_column=Column(Float, nullable=False))

    benchmark_kg_co2_per_km_car: float = Field(
        default=0, sa_column=Column(Float, nullable=False))

    benchmark_kg_co2_per_burger: float = Field(
        default=0, sa_column=Column(Float, nullable=False))

    created_at: datetime = Field(
        default_factory=utc_now,
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )

    updated_at: datetime = Field(
        default_factory=utc_now,
        sa_column=Column(DateTime(timezone=True),
                         nullable=False, onupdate=utc_now),
    )
