from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, Float, String
from sqlmodel import Field, SQLModel


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class FuelPriceByUF(SQLModel, table=True):
    __tablename__ = "fuel_prices_by_uf"

    id: int | None = Field(default=None, primary_key=True)

    uf: str = Field(sa_column=Column(
        String(2), nullable=False, unique=True, index=True))

    price_diesel_s10: float | None = Field(
        default=None, sa_column=Column(Float, nullable=True))

    price_gasolina_c: float | None = Field(
        default=None, sa_column=Column(Float, nullable=True))

    price_etanol: float | None = Field(
        default=None, sa_column=Column(Float, nullable=True))

    updated_at: datetime = Field(
        default_factory=utc_now,
        sa_column=Column(DateTime(timezone=True),
                         nullable=False, onupdate=utc_now),
    )
