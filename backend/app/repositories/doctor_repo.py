from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.doctor import Doctor
from app.models.doctor_availability_slot import DoctorAvailabilitySlot


class DoctorRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_department(self, department_id):
        result = await self.db.execute(select(Doctor).where(Doctor.department_id == department_id).order_by(Doctor.name.asc()))
        return list(result.scalars().all())

    async def get_slots(self, doctor_id):
        result = await self.db.execute(
            select(DoctorAvailabilitySlot).where(DoctorAvailabilitySlot.doctor_id == doctor_id).order_by(DoctorAvailabilitySlot.slot_time.asc())
        )
        return list(result.scalars().all())
