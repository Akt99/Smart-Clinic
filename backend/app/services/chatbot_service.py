from datetime import datetime, timezone

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.doctor import Doctor
from app.repositories.chat_repo import ChatRepository
from app.repositories.department_repo import DepartmentRepository
from app.repositories.doctor_repo import DoctorRepository


class ChatRateLimiter:
    requests: dict[tuple[str, str], list[datetime]] = {}

    @classmethod
    def allow(cls, user_id: str, department_id: str, limit: int) -> bool:
        key = (user_id, department_id)
        now = datetime.now(timezone.utc)
        window_start = now.replace(second=0, microsecond=0)
        history = [t for t in cls.requests.get(key, []) if t >= window_start]
        if len(history) >= limit:
            cls.requests[key] = history
            return False
        history.append(now)
        cls.requests[key] = history
        return True


class ChatbotService:
    SEVERE_KEYWORDS = {
        "bleeding", "chest pain", "unconscious", "suicidal", "fracture", "severe pain", "emergency", "fainting"
    }

    def __init__(self, db: AsyncSession):
        self.db = db
        self.chat_repo = ChatRepository(db)
        self.dept_repo = DepartmentRepository(db)
        self.doctor_repo = DoctorRepository(db)

    async def ask(self, user_id, department_id, message: str, session_id=None):
        department = await self.dept_repo.get_by_id(department_id)
        if not department:
            raise ValueError("Department not found")

        session = await self.chat_repo.get_or_create_session(session_id, user_id, department_id)
        await self.chat_repo.add_message(session.id, "user", message)

        severe = any(token in message.lower() for token in self.SEVERE_KEYWORDS)
        doctors = await self.doctor_repo.get_by_department(department_id)
        recommendations = [doc.name for doc in doctors[:3]]

        base = self._mock_llm_reply(department.name, message)
        if severe:
            base += " Symptoms may be severe. Please book an appointment immediately."

        if severe and recommendations:
            base += f" Recommended doctors: {', '.join(recommendations)}."

        await self.chat_repo.add_message(session.id, "assistant", base)
        await self.db.commit()

        return {
            "session_id": session.id,
            "response": base,
            "requires_appointment": severe,
            "recommended_doctors": recommendations if severe else [],
        }

    @staticmethod
    def _mock_llm_reply(department: str, message: str) -> str:
        # Guardrails: no diagnosis/prescription; only awareness guidance.
        return (
            f"[{department} Assistant] Based on your message, here is general awareness and first-aid guidance: "
            f"{message[:180]}. This is not a diagnosis or prescription."
        )
