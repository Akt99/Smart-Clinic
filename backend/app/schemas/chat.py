from uuid import UUID

from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    message: str = Field(min_length=2, max_length=2000)
    session_id: UUID | None = None


class ChatResponse(BaseModel):
    session_id: UUID
    response: str
    requires_appointment: bool
    recommended_doctors: list[str]
