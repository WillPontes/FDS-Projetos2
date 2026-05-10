from pydantic import ConfigDict
from sqlmodel import Field, SQLModel


class User(SQLModel, table=True):
    __tablename__ = "users"  # type: ignore[assignment]

    id: int | None = Field(default=None, primary_key=True)
    name: str
    email: str = Field(unique=True)


class UserPublic(SQLModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: str

