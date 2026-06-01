from src.models.user import UserRole
from sqlmodel import SQLModel


class UserUpdate(SQLModel):
    name: str | None = None
    email: str | None = None
    role: UserRole | None = None
    organization_id: int | None = None
    email_alerts: bool | None = None
    push_alerts: bool | None = None
    weekly_report: bool | None = None
