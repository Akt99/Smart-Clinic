from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import BaseModel


class Department(BaseModel):
    __tablename__ = "departments"

    name: Mapped[str] = mapped_column(String(80), unique=True, nullable=False)
    prompt_template: Mapped[str] = mapped_column(Text, nullable=False)

    doctors = relationship("Doctor", back_populates="department")
    chat_sessions = relationship("ChatSession", back_populates="department")
