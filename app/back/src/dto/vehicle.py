from typing import Literal

from sqlmodel import SQLModel


FuelType = Literal[
    "diesel_s10",
    "gasolina_c",
    "etanol",
]


class VehicleIn(SQLModel):
    id_tag: str
    user_id: int
    organization_id: int | None = None
    assigned_driver_id: int | None = None
    license_plate: str
    model: str
    fuel_type: FuelType


class VehicleUpdate(SQLModel):
    id_tag: str | None = None
    user_id: int | None = None
    organization_id: int | None = None
    assigned_driver_id: int | None = None
    license_plate: str | None = None
    model: str | None = None
    fuel_type: FuelType | None = None
