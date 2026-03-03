from sqlalchemy import String, Integer, Numeric, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import BaseModel


class Doctor(BaseModel):
    __tablename__ = "doctors"

    name: Mapped[str] = mapped_column(String(120), nullable=False)
    specialization: Mapped[str] = mapped_column(String(120), nullable=False)
    department_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("departments.id", ondelete="RESTRICT"), nullable=False)
    years_of_experience: Mapped[int] = mapped_column(Integer, nullable=False)
    consultation_fee: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    available_time_slots: Mapped[dict] = mapped_column(JSONB, nullable=False, default=dict)

    department = relationship("Department", back_populates="doctors")
    appointments = relationship("Appointment", back_populates="doctor")
    availability_slots = relationship("DoctorAvailabilitySlot", back_populates="doctor")
