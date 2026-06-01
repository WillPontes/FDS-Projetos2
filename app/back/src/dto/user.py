from src.models.user import UserRole
from sqlmodel import SQLModel


class UserUpdate(SQLModel):
    name: str | None = None
    email: str | None = None
    role: UserRole | None = None
    organization_id: int | None = None
