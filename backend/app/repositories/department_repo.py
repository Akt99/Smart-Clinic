from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.department import Department


class DepartmentRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def list_departments(self) -> list[Department]:
        result = await self.db.execute(select(Department).order_by(Department.name.asc()))
        return list(result.scalars().all())

    async def get_by_id(self, department_id):
        result = await self.db.execute(select(Department).where(Department.id == department_id))
        return result.scalar_one_or_none()
