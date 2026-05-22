from typing import Any, Literal

from pydantic import BaseModel, Field


class TransactionVehicleIn(BaseModel):
    category: Literal["leve", "pesado"]
    fuel_type: Literal["diesel_s10", "gasolina_c", "etanol"]
    model: str = Field(min_length=1, max_length=256)


class PaybackIn(BaseModel):
    accumulated_savings_brl: float
    monthly_tag_fee_brl: float
    billing_months: float = Field(gt=0)


class ProcessTransactionBody(BaseModel):
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
