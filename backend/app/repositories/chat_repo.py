from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.chat_message import ChatMessage
from app.models.chat_session import ChatSession


class ChatRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_or_create_session(self, session_id, user_id, department_id):
        if session_id:
            result = await self.db.execute(select(ChatSession).where(ChatSession.id == session_id, ChatSession.user_id == user_id))
            existing = result.scalar_one_or_none()
            if existing:
                return existing

        session = ChatSession(user_id=user_id, department_id=department_id)
        self.db.add(session)
        await self.db.flush()
        return session

    async def add_message(self, session_id, sender: str, content: str):
        message = ChatMessage(session_id=session_id, sender=sender, content=content)
        self.db.add(message)
        await self.db.flush()
        return message
