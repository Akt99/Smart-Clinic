from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.schemas.auth import SendOTPRequest, VerifyOTPRequest, TokenResponse
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/send-otp")
async def send_otp(payload: SendOTPRequest, db: AsyncSession = Depends(get_db)):
    service = AuthService(db)
    return await service.send_otp(payload.phone_number)


@router.post("/verify-otp", response_model=TokenResponse)
async def verify_otp(payload: VerifyOTPRequest, db: AsyncSession = Depends(get_db)):
    service = AuthService(db)
    try:
        token = await service.verify_otp(payload.phone_number, payload.otp, payload.full_name)
        return TokenResponse(access_token=token)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc


@router.get("/google-login")
async def google_login():
    return {
        "message": "Google OAuth placeholder endpoint",
        "next": "Implement OAuth callback and token exchange with Google provider",
    }
