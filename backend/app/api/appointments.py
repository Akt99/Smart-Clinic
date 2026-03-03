from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.repositories.appointment_repo import AppointmentRepository
from app.schemas.appointment import AppointmentCreate
from app.services.appointment_service import AppointmentService

router = APIRouter(prefix="/appointments", tags=["Appointments"])


@router.post("")
async def create_appointment(
    payload: AppointmentCreate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = AppointmentService(db)
    try:
        return await service.create_appointment(user.id, payload.doctor_id, payload.appointment_time)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(exc)) from exc


@router.get("/me")
async def my_appointments(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    repo = AppointmentRepository(db)
    return await repo.list_by_patient(user.id)


@router.delete("/{appointment_id}")
async def cancel_appointment(appointment_id: str, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    service = AppointmentService(db)
    try:
        return await service.cancel(appointment_id, user.id)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc
