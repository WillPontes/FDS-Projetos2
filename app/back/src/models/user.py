from pydantic import ConfigDict
from sqlmodel import Field, SQLModel


class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    email: str = Field(unique=True)


class UserPublic(SQLModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: str

class CarPublic(SQLModel):
    model_config = ConfigDict(from_attributes=True)

    placa: str
    modelo: str
    combustivel: str