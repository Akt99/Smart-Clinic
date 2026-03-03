from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.chat import ChatRequest
from app.services.chatbot_service import ChatbotService, ChatRateLimiter

router = APIRouter(tags=["Chatbot"])


@router.post("/chat/{department_id}")
async def ask_chatbot(
    department_id: str,
    payload: ChatRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if not ChatRateLimiter.allow(str(user.id), department_id, settings.chat_rate_limit_per_minute):
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="Rate limit exceeded")

    service = ChatbotService(db)
    try:
        return await service.ask(user.id, department_id, payload.message, payload.session_id)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc
