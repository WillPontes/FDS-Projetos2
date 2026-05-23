from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, Field
from sqlmodel import SQLModel


class TransactionVehicleIn(BaseModel):
    category: Literal["leve", "pesado"]
    fuel_type: Literal["diesel_s10", "gasolina_c", "etanol"]
    model: str = Field(min_length=1, max_length=256)


class PaybackIn(BaseModel):
    accumulated_savings_brl: float
    monthly_tag_fee_brl: float
    billing_months: float = Field(gt=0)


class ProcessTransactionBody(BaseModel):
    user_id: int | None = None
    vehicle_id: int | None = None
    organization_id: int | None = None

    plate: str = Field(min_length=1, max_length=10)
    elapsed_time: int = Field(ge=0)
    context: Literal["pedagio", "estacionamento"]
    uf: str = Field(
        min_length=2,
        max_length=2,
        pattern=r"^[A-Za-z]{2}$",
    )
    is_digital: bool = True
    vehicle: TransactionVehicleIn
    payback: PaybackIn | None = None


class TransactionResultDTO(BaseModel):
    data: dict[str, Any]


class TransactionIn(SQLModel):
    user_id: int | None = None
    vehicle_id: int | None = None
    organization_id: int | None = None

    plate: str | None = None
    context: Literal["pedagio", "estacionamento"]
    uf: str | None = Field(
        default=None,
        min_length=2,
        max_length=2,
        pattern=r"^[A-Za-z]{2}$",
    )

    elapsed_time_sec: float | None = None
    is_digital: bool = True

    co2_avoided_kg: float | None = None
    fuel_saved_liters: float | None = None
    time_saved_sec: float | None = None
    financial_savings_brl: float | None = None
    water_saved_liters: float | None = None

    parameters_snapshot: dict[str, Any] = Field(default_factory=dict)


class TransactionUpdate(SQLModel):
    user_id: int | None = None
    vehicle_id: int | None = None
    organization_id: int | None = None

    plate: str | None = None
    context: Literal["pedagio", "estacionamento"] | None = None
    uf: str | None = Field(
        default=None,
        min_length=2,
        max_length=2,
        pattern=r"^[A-Za-z]{2}$",
    )

    elapsed_time_sec: float | None = None
    is_digital: bool | None = None

    co2_avoided_kg: float | None = None
    fuel_saved_liters: float | None = None
    time_saved_sec: float | None = None
    financial_savings_brl: float | None = None
    water_saved_liters: float | None = None

    parameters_snapshot: dict[str, Any] | None = None


class TransactionPublic(SQLModel):
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
