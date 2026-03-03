from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import require_roles
from app.models.doctor import Doctor
from app.models.user import User

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.post("/doctors")
async def add_doctor(
    payload: dict,
    _: User = Depends(require_roles("Admin")),
    db: AsyncSession = Depends(get_db),
):
    doctor = Doctor(**payload)
    db.add(doctor)
    await db.commit()
    await db.refresh(doctor)
    return doctor


@router.get("/analytics")
async def analytics(_: User = Depends(require_roles("Admin"))):
    return {
        "kpis": {
            "appointments_today": 0,
            "active_doctors": 6,
            "avg_wait_minutes": 12,
        }
    }
