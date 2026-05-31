from datetime import datetime, timezone

from pydantic import ConfigDict
from sqlalchemy import Column, DateTime, ForeignKey, String, UniqueConstraint
from sqlmodel import Field, SQLModel


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class Fleet(SQLModel, table=True):
    __tablename__ = "fleets"

    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(sa_column=Column(String, nullable=False))
    organization_id: int = Field(foreign_key="organizations.id")
    created_at: datetime = Field(
        default_factory=utc_now,
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )


class FleetUser(SQLModel, table=True):
    __tablename__ = "fleet_users"
    __table_args__ = (UniqueConstraint("fleet_id", "user_id", name="uq_fleet_user"),)

    id: int | None = Field(default=None, primary_key=True)
    fleet_id: int = Field(foreign_key="fleets.id")
    user_id: int = Field(foreign_key="users.id")


class FleetPublic(SQLModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    organization_id: int
    created_at: datetime
