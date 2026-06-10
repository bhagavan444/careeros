import jwt
from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from app.core.config import settings
import logging

logger = logging.getLogger("security")

class SecurityMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Always pass through CORS preflight requests — CORSMiddleware handles them
        if request.method == "OPTIONS":
            return await call_next(request)

        # Allow openapi, docs, and health checks to bypass strict auth
        open_paths = ["/api/v1/openapi.json", "/docs", "/health", "/redoc"]
        
        if any(request.url.path.startswith(path) for path in open_paths):
            return await call_next(request)
            
        # Example JWT Validation Logic (Placeholder for strict implementation)
        # auth_header = request.headers.get("Authorization")
        # if auth_header and auth_header.startswith("Bearer "):
        #     token = auth_header.split(" ")[1]
        #     try:
        #         payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        #         request.state.user = payload
        #     except jwt.ExpiredSignatureError:
        #         return JSONResponse(status_code=401, content={"detail": "Token expired"})
        #     except jwt.PyJWTError:
        #         return JSONResponse(status_code=401, content={"detail": "Invalid token"})
        
        try:
            return await call_next(request)
        except Exception as e:
            logger.error(f"Security middleware caught unhandled error: {e}")
            return JSONResponse(
                status_code=500,
                content={"detail": "Internal server error"}
            )
