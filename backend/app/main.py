from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import logging
import traceback
import os

from app.core.config import settings

# Setup Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    description="Pathora AI Backend — Career Intelligence Platform",
    version="2.0.0"
)

# ─── Global Exception Handler ───────────────────────────────────────────────────
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """
    Catches ALL unhandled crashes and converts them into visible JSON 500s.
    Prevents silent connection drops and ensures CORS headers are returned 
    even on catastrophic internal failures.
    """
    logger.error(f"CRITICAL UNHANDLED EXCEPTION on {request.method} {request.url.path}: {exc}\n{traceback.format_exc()}")
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal Server Error",
            "detail": str(exc),
            "path": request.url.path
        }
    )

# ─── CORS Origins ───────────────────────────────────────────────────────────────
_default_origins = [
    "https://carrer-intelligence.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
]
CORS_ORIGINS: list[str] = [
    o.strip()
    for o in os.environ.get("CORS_ORIGINS", "").split(",")
    if o.strip()
] or _default_origins

logger.info(f"CORS allowed origins: {CORS_ORIGINS}")

# ─── Middlewares ────────────────────────────────────────────────────────────────
# Starlette executes middleware in REVERSE registration order.
# Register CORS LAST so it wraps everything (outermost = first to run).

# Telemetry middleware (lightweight, always safe to load)
try:
    from app.middleware.telemetry import TelemetryMiddleware
    app.add_middleware(TelemetryMiddleware)
except Exception as e:
    logger.warning(f"Telemetry middleware skipped: {e}")

# Security middleware (lightweight, always safe to load)
try:
    from app.middleware.security import SecurityMiddleware
    app.add_middleware(SecurityMiddleware)
except Exception as e:
    logger.warning(f"Security middleware skipped: {e}")

# CORS — MUST be the last add_middleware() call (outermost middleware).
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=False, # Critical for avoiding strict CORS issues
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["X-Request-ID"],
    max_age=600,  # Cache preflight for 10 minutes
)

# ─── Prometheus Metrics (optional) ─────────────────────────────────────────────
try:
    from prometheus_fastapi_instrumentator import Instrumentator
    Instrumentator().instrument(app).expose(app, include_in_schema=False)
except Exception as e:
    logger.info(f"Prometheus metrics skipped: {e}")

# ─── API Routes ────────────────────────────────────────────────────────────────
from app.api.v1.api import api_router
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.on_event("startup")
async def startup_event():
    logger.info("=== Starting Pathora AI Backend ===")
    logger.info(f"API prefix: {settings.API_V1_STR}")
    logger.info(f"CORS origins: {CORS_ORIGINS}")
    logger.info(f"GEMINI_API_KEY configured: {'Yes' if settings.GEMINI_API_KEY else 'No'}")
    
    # Optional diagnostics logging
    try:
        import psutil
        process = psutil.Process(os.getpid())
        mem_info = process.memory_info()
        logger.info(f"Startup Memory Usage: {mem_info.rss / 1024 / 1024:.2f} MB")
    except ImportError:
        pass


@app.get("/health")
async def health_check():
    health_data = {
        "status": "healthy",
        "version": app.version,
        "gemini_configured": bool(settings.GEMINI_API_KEY),
        "cors_origins": CORS_ORIGINS,
    }
    try:
        import psutil
        process = psutil.Process(os.getpid())
        health_data["memory_mb"] = round(process.memory_info().rss / 1024 / 1024, 2)
    except ImportError:
        pass
        
    return health_data
