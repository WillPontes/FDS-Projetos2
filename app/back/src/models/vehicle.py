from pydantic import ConfigDict
from sqlmodel import Field, SQLModel


class Vehicle(SQLModel, table=True):
    __tablename__ = "vehicles"
    model_config = ConfigDict(from_attributes=True)

    id: int | None = Field(default=None, primary_key=True)
    id_tag: str = Field(unique=True)
    user_id: int = Field(foreign_key="user.id")
    license_plate: str = Field(unique=True)
    model: str
    fuel_type: str
