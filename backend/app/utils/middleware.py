import logging

from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse

from app.core.config import settings
from app.core.security import decode_access_token

logger = logging.getLogger(__name__)


class ErrorHandlingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        try:
            return await call_next(request)
        except ValueError as exc:
            return JSONResponse(status_code=400, content={"detail": str(exc)})
        except Exception as exc:
            logger.exception("Unhandled error on %s %s", request.method, request.url.path)
            detail = str(exc) if settings.env == "development" else "Internal server error"
            return JSONResponse(status_code=500, content={"detail": detail})


class JWTClaimsMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        request.state.user_claims = None
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header.replace("Bearer ", "", 1)
            try:
                request.state.user_claims = decode_access_token(token)
            except ValueError:
                request.state.user_claims = None
        return await call_next(request)
