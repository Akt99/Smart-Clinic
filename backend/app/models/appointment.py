from datetime import datetime

from sqlalchemy import DateTime, Enum, ForeignKey, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import BaseModel


class AppointmentStatus(str):
    SCHEDULED = "Scheduled"
    COMPLETED = "Completed"
    CANCELLED = "Cancelled"


class Appointment(BaseModel):
    __tablename__ = "appointments"
    __table_args__ = (
        CheckConstraint("status in ('Scheduled','Completed','Cancelled')", name="ck_appointment_status"),
    )

    patient_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    doctor_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("doctors.id", ondelete="RESTRICT"), nullable=False)
    appointment_time: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    status: Mapped[str] = mapped_column(Enum("Scheduled", "Completed", "Cancelled", name="appointment_status"), nullable=False)

    patient = relationship("User", back_populates="appointments")
    doctor = relationship("Doctor", back_populates="appointments")
