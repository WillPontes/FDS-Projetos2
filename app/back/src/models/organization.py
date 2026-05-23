from datetime import datetime, timezone

from pydantic import ConfigDict
from sqlalchemy import Column, DateTime, String
from sqlmodel import Field, SQLModel


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class Organization(SQLModel, table=True):
    __tablename__ = "organizations"

    id: int | None = Field(default=None, primary_key=True)

    name: str = Field(
        sa_column=Column(String, nullable=False),
    )

    cnpj: str | None = Field(
        default=None,
        sa_column=Column(String, nullable=True, unique=True),
    )

    created_at: datetime = Field(
        default_factory=utc_now,
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )


class OrganizationPublic(SQLModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    cnpj: str | None
    created_at: datetime