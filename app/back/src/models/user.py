from enum import Enum

from pydantic import ConfigDict
from sqlmodel import Field, SQLModel


class UserRole(str, Enum):
    motorista = "motorista"
    gestor_frota = "gestor_frota"
    admin = "admin"


class User(SQLModel, table=True):
    __tablename__ = "users"  # type: ignore[assignment]

    id: int | None = Field(default=None, primary_key=True)

    name: str

    email: str = Field(unique=True)

    role: UserRole = UserRole.motorista

    organization_id: int | None = Field(
        default=None,
        foreign_key="organizations.id",
    )


class UserPublic(SQLModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: str

    role: UserRole

    organization_id: int | None
