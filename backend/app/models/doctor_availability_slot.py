from datetime import datetime

from sqlalchemy import DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import BaseModel


class DoctorAvailabilitySlot(BaseModel):
    __tablename__ = "doctor_availability_slots"

    doctor_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("doctors.id", ondelete="CASCADE"), nullable=False)
    slot_time: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)

    doctor = relationship("Doctor", back_populates="availability_slots")
