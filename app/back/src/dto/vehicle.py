from typing import Literal

from sqlmodel import SQLModel


class VehicleIn(SQLModel):
    id_tag: str
    user_id: int
    license_plate: str
    model: str
    fuel_type: Literal["diesel_s10", "gasolina_c", "etanol"]


class VehicleUpdate(SQLModel):
    id_tag: str | None = None
    license_plate: str | None = None
    model: str | None = None
    fuel_type: Literal["diesel_s10", "gasolina_c", "etanol"] | None = None
