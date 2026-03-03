from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.repositories.department_repo import DepartmentRepository

router = APIRouter(prefix="/departments", tags=["Departments"])


@router.get("")
async def list_departments(db: AsyncSession = Depends(get_db)):
    repo = DepartmentRepository(db)
    return await repo.list_departments()
