from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.repositories.doctor_repo import DoctorRepository

router = APIRouter(tags=["Doctors"])


@router.get("/departments/{department_id}/doctors")
async def doctors_by_department(department_id: str, db: AsyncSession = Depends(get_db)):
    repo = DoctorRepository(db)
    return await repo.get_by_department(department_id)


@router.get("/doctors/{doctor_id}/slots")
async def doctor_slots(doctor_id: str, db: AsyncSession = Depends(get_db)):
    repo = DoctorRepository(db)
    return await repo.get_slots(doctor_id)
