from sqlalchemy import String, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import BaseModel


class User(BaseModel):
    __tablename__ = "users"

    phone_number: Mapped[str | None] = mapped_column(String(20), unique=True, nullable=True)
    google_sub: Mapped[str | None] = mapped_column(String(255), unique=True, nullable=True)
    full_name: Mapped[str] = mapped_column(String(150), nullable=False)
    role_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("roles.id", ondelete="RESTRICT"), nullable=False)

    role = relationship("Role", back_populates="users")
    appointments = relationship("Appointment", back_populates="patient")
    chat_sessions = relationship("ChatSession", back_populates="user")
