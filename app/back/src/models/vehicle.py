from pydantic import ConfigDict
from sqlmodel import Field,SQLModel

from src.models.user import User




class Car(SQLModel, table=True):
    model_config = ConfigDict(from_attributes=True)

    id: int | None = Field(default=None, primary_key=True)
    id_tag: str = Field (unique=True)
    user_id: int = Field(foreign_key="user.id")
    
    placa: str = Field(unique=True)
    modelo: str
    combustivel: str
    