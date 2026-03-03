from datetime import datetime

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.appointment import Appointment


class AppointmentRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_for_update(self, doctor_id, appointment_time: datetime):
        result = await self.db.execute(
            select(Appointment)
            .where(Appointment.doctor_id == doctor_id, Appointment.appointment_time == appointment_time, Appointment.status == "Scheduled")
            .with_for_update()
        )
        return result.scalar_one_or_none()

    async def create(self, appointment: Appointment):
        self.db.add(appointment)
        await self.db.flush()
        return appointment

    async def list_by_patient(self, patient_id):
        result = await self.db.execute(
            select(Appointment).where(Appointment.patient_id == patient_id).order_by(Appointment.appointment_time.desc())
        )
        return list(result.scalars().all())

    async def get_by_id(self, appointment_id):
        result = await self.db.execute(select(Appointment).where(Appointment.id == appointment_id))
        return result.scalar_one_or_none()
