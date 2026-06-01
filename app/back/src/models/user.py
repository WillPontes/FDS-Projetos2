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

    password_hash: str

    role: UserRole = UserRole.motorista

    organization_id: int | None = Field(
        default=None,
        foreign_key="organizations.id",
    )

    email_alerts: bool = Field(default=True)
    push_alerts: bool = Field(default=False)
    weekly_report: bool = Field(default=True)


class UserPublic(SQLModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: str

    role: UserRole

    organization_id: int | None

    email_alerts: bool
    push_alerts: bool
    weekly_report: bool
