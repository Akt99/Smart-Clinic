from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import require_roles
from app.models.appointment import Appointment
from app.models.doctor_availability_slot import DoctorAvailabilitySlot
from app.models.user import User

router = APIRouter(prefix="/doctor-panel", tags=["Doctor Panel"])


@router.get("/schedule")
async def my_schedule(_: User = Depends(require_roles("Doctor")), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Appointment).order_by(Appointment.appointment_time.asc()))
    return list(result.scalars().all())


@router.post("/availability")
async def update_availability(
    payload: dict,
    _: User = Depends(require_roles("Doctor")),
    db: AsyncSession = Depends(get_db),
):
    slot = DoctorAvailabilitySlot(**payload)
    db.add(slot)
    await db.commit()
    await db.refresh(slot)
    return slot
