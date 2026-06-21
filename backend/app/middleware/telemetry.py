import time
import logging
import uuid
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response, JSONResponse
import traceback
from app.core.logging_config import request_id_ctx_var, user_id_ctx_var

logger = logging.getLogger("telemetry")

class TelemetryMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next) -> Response:
        request_id = str(uuid.uuid4())
        start_time = time.perf_counter()
        
        # Set correlation ID in contextvar and request state
        token1 = request_id_ctx_var.set(request_id)
        request.state.request_id = request_id
        
        logger.info(f"[TELEMETRY_START] method: {request.method} | path: {request.url.path}")
        
        try:
            response = await call_next(request)
            response.headers["X-Request-ID"] = request_id
            
            process_time = time.perf_counter() - start_time
            logger.info(f"[TELEMETRY_END] id: {request_id} | status: {response.status_code} | duration: {process_time:.4f}s")
            return response
            
        except Exception as e:
            process_time = time.perf_counter() - start_time
            logger.error(f"[TELEMETRY_FAILURE] id: {request_id} | error: {str(e)} | duration: {process_time:.4f}s\n{traceback.format_exc()}")
            
            return JSONResponse(
                status_code=500,
                content={
                    "error": "Internal Server Error", 
                    "detail": str(e),
                    "request_id": request_id,
                    "location": "telemetry_middleware"
                },
                headers={"X-Request-ID": request_id}
            )
