from datetime import timedelta

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.appointment import Appointment
from app.models.doctor_availability_slot import DoctorAvailabilitySlot
from app.repositories.appointment_repo import AppointmentRepository


class AppointmentService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = AppointmentRepository(db)

    async def create_appointment(self, patient_id, doctor_id, appointment_time):
        # Force 30-min alignment on server side.
        if appointment_time.minute not in (0, 30) or appointment_time.second != 0:
            raise ValueError("Slot must be aligned to 30-minute boundary")

        slot_exists = await self.db.execute(
            select(DoctorAvailabilitySlot).where(
                DoctorAvailabilitySlot.doctor_id == doctor_id,
                DoctorAvailabilitySlot.slot_time == appointment_time,
            )
        )
        if slot_exists.scalar_one_or_none() is None:
            raise ValueError("Requested slot is not in doctor availability")

        try:
            async with self.db.begin():
                locked = await self.repo.get_for_update(doctor_id=doctor_id, appointment_time=appointment_time)
                if locked:
                    raise ValueError("Slot already booked")

                existing_user_slot = await self.db.execute(
                    select(Appointment).where(
                        Appointment.patient_id == patient_id,
                        Appointment.doctor_id == doctor_id,
                        Appointment.appointment_time == appointment_time,
                        Appointment.status == "Scheduled",
                    )
                )
                if existing_user_slot.scalar_one_or_none() is not None:
                    raise ValueError("You already booked this slot")

                appointment = Appointment(
                    patient_id=patient_id,
                    doctor_id=doctor_id,
                    appointment_time=appointment_time,
                    status="Scheduled",
                )
                await self.repo.create(appointment)
                await self.db.flush()
                return appointment
        except IntegrityError as exc:
            raise ValueError("Slot conflict detected") from exc

    async def cancel(self, appointment_id, patient_id):
        appointment = await self.repo.get_by_id(appointment_id)
        if not appointment:
            raise ValueError("Appointment not found")
        if str(appointment.patient_id) != str(patient_id):
            raise ValueError("You can only cancel your own appointment")
        if appointment.status != "Scheduled":
            raise ValueError("Only scheduled appointments can be cancelled")

        appointment.status = "Cancelled"
        await self.db.commit()
        await self.db.refresh(appointment)
        return appointment

    @staticmethod
    def slot_end(start_time):
        return start_time + timedelta(minutes=30)
