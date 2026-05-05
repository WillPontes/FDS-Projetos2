from sqlalchemy import Integer
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from src.database.connection import Base


class TechnicalSpecs(Base):
    __tablename__ = "technical_specs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    data: Mapped[dict] = mapped_column(JSONB, nullable=False)