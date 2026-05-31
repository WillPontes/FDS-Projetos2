from pydantic import ConfigDict, model_validator
from sqlmodel import Field, SQLModel


class Vehicle(SQLModel, table=True):
    __tablename__ = "vehicles"

    model_config = ConfigDict(from_attributes=True)
    id: int | None = Field(default=None, primary_key=True)
    id_tag: str = Field(unique=True)
    user_id: int = Field(
        foreign_key="users.id",
    )
    organization_id: int | None = Field(
        default=None,
        foreign_key="organizations.id",
    )
    assigned_driver_id: int | None = Field(
        default=None,
        foreign_key="users.id",
    )
    license_plate: str = Field(unique=True)
    model: str
    fuel_type: str


class VehiclePublic(SQLModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    id_tag: str
    user_id: int
    organization_id: int | None
    assigned_driver_id: int | None
    license_plate: str
    plate: str = ""
    model: str
    fuel_type: str

    @model_validator(mode="after")
    def set_plate_alias(self) -> "VehiclePublic":
        self.plate = self.license_plate
        return self


class VehicleListPublic(SQLModel):
    items: list[VehiclePublic]
    total: int
