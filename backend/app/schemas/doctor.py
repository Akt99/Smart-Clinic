from decimal import Decimal

from app.schemas.common import TimestampedSchema


class DoctorResponse(TimestampedSchema):
    name: str
    specialization: str
    department_id: str
    years_of_experience: int
    consultation_fee: Decimal
    available_time_slots: dict
