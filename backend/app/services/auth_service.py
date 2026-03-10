from datetime import datetime, timedelta, timezone
from random import randint

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.security import create_access_token
from app.models.role import Role
from app.models.user import User


class AuthService:
    # In production use Redis/DB table; this is a mock cache for OTP flow.
    otp_store: dict[str, tuple[str, datetime]] = {}

    def __init__(self, db: AsyncSession):
        self.db = db

    async def send_otp(self, phone_number: str) -> dict:
        otp = f"{randint(100000, 999999)}"
        expires_at = datetime.now(timezone.utc) + timedelta(minutes=settings.otp_expiry_minutes)
        self.otp_store[phone_number] = (otp, expires_at)
        return {"message": "OTP sent", "mock_otp": otp}

    async def verify_otp(self, phone_number: str, otp: str, full_name: str) -> str:
        cached = self.otp_store.get(phone_number)
        if not cached:
            raise ValueError("OTP not found")

        cached_otp, expires_at = cached
        if datetime.now(timezone.utc) > expires_at:
            raise ValueError("OTP expired")
        if otp != cached_otp:
            raise ValueError("Invalid OTP")

        user, role_name = await self._get_or_create_patient(phone_number, full_name)
        return create_access_token(str(user.id), role_name)

    async def _get_or_create_patient(self, phone_number: str, full_name: str) -> tuple[User, str]:
        result = await self.db.execute(
            select(User, Role.name)
            .join(Role, User.role_id == Role.id)
            .where(User.phone_number == phone_number)
        )
        existing = result.first()
        if existing:
            user, role_name = existing
            return user, role_name

        role_result = await self.db.execute(select(Role).where(Role.name == "Patient"))
        role = role_result.scalar_one_or_none()
        if not role:
            raise ValueError("Patient role missing")

        user = User(phone_number=phone_number, full_name=full_name, role_id=role.id)
        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)
        return user, role.name
