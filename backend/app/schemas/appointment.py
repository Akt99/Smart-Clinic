from datetime import datetime
from uuid import UUID

from pydantic import BaseModel

from app.schemas.common import TimestampedSchema


class AppointmentCreate(BaseModel):
    doctor_id: UUID
    appointment_time: datetime


class AppointmentResponse(TimestampedSchema):
    patient_id: UUID
    doctor_id: UUID
    appointment_time: datetime
    status: str
