from fastapi import FastAPI

from app.api import auth, departments, doctors, appointments, chatbot, admin, doctor_panel
from app.core.config import settings
from app.utils.logging import setup_logging
from app.utils.middleware import ErrorHandlingMiddleware, JWTClaimsMiddleware

app = FastAPI(title=settings.app_name)
setup_logging()
app.add_middleware(ErrorHandlingMiddleware)
app.add_middleware(JWTClaimsMiddleware)

app.include_router(auth.router, prefix=settings.api_prefix)
app.include_router(departments.router, prefix=settings.api_prefix)
app.include_router(doctors.router, prefix=settings.api_prefix)
app.include_router(appointments.router, prefix=settings.api_prefix)
app.include_router(chatbot.router, prefix=settings.api_prefix)
app.include_router(admin.router, prefix=settings.api_prefix)
app.include_router(doctor_panel.router, prefix=settings.api_prefix)


@app.get("/health")
async def healthcheck():
    return {"status": "ok"}
