from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import logging
import traceback
import os
import time

from app.core.config import settings

# Setup Logging
from app.core.logging_config import setup_logging
setup_logging()

logger = logging.getLogger("main")

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    description="Pathora AI Backend — Production Resilient",
    version="2.1.0"
)

# ─── Global Exception Handler ───────────────────────────────────────────────────
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """
    Catches ALL unhandled crashes and converts them into visible JSON 500s.
    Prevents silent connection drops and ensures CORS headers are returned.
    """
    logger.error(f"[CRITICAL_CRASH] Unhandled exception on {request.method} {request.url.path}: {exc}\n{traceback.format_exc()}")
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal Server Error",
            "detail": str(exc),
            "path": request.url.path,
            "traceback": traceback.format_exc().splitlines()
        }
    )

# ─── CORS Origins ───────────────────────────────────────────────────────────────
_default_origins = [
    "https://carrer-intelligence.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000",
]
CORS_ORIGINS: list[str] = [
    o.strip() for o in os.environ.get("CORS_ORIGINS", "").split(",") if o.strip()
] or _default_origins

# ─── Middlewares ────────────────────────────────────────────────────────────────
try:
    from app.middleware.telemetry import TelemetryMiddleware
    app.add_middleware(TelemetryMiddleware)
except Exception as e:
    logger.warning(f"Telemetry middleware skipped: {e}")

try:
    from app.middleware.security import SecurityMiddleware
    app.add_middleware(SecurityMiddleware)
except Exception as e:
    logger.warning(f"Security middleware skipped: {e}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["X-Request-ID"],
    max_age=600,
)

# ─── API Routes ────────────────────────────────────────────────────────────────
from app.api.v1.endpoints import (
    profile_intelligence,
    recruiter_intelligence,
    talent_ranking,
    interview_intelligence,
    # chat,
    # memory,
    career_dna,
    resume_studio,
    career_memory,
    export
)

app.include_router(profile_intelligence.router, prefix="/api/v1/profile-intelligence", tags=["Profile Intelligence"])
app.include_router(recruiter_intelligence.router, prefix="/api/v1/recruiter-intelligence", tags=["Recruiter Intelligence"])
app.include_router(talent_ranking.router, prefix="/api/v1/talent-ranking", tags=["Talent Ranking"])
app.include_router(interview_intelligence.router, prefix="/api/v1/interview-intelligence", tags=["Interview Intelligence"])
# app.include_router(chat.router, prefix="/api/v1/chat", tags=["Copilot Chat"])
# app.include_router(memory.router, prefix="/api/v1/memory", tags=["Copilot Memory"])
app.include_router(career_dna.router, prefix="/api/v1/career-dna", tags=["Career DNA"])
app.include_router(resume_studio.router, prefix="/api/v1/resume-studio", tags=["Resume Studio"])
app.include_router(career_memory.router, prefix="/api/v1/career-memory", tags=["MongoDB Career Memory"])
app.include_router(export.router, prefix="/api/v1/export", tags=["Export Engine"])

from app.api.v1.api import api_router
app.include_router(api_router, prefix=settings.API_V1_STR)

# ─── DIAGNOSTIC ENDPOINTS ──────────────────────────────────────────────────────
debug_router = FastAPI()

@app.get("/debug/health")
async def debug_health():
    """Verify all core services."""
    return {"status": "ok", "gemini_configured": bool(settings.GEMINI_API_KEY), "version": app.version}

@app.get("/debug/memory")
async def debug_memory():
    """Returns memory usage."""
    try:
        import psutil
        process = psutil.Process(os.getpid())
        mem = process.memory_info().rss / 1024 / 1024
        return {"status": "ok", "memory_mb": round(mem, 2)}
    except ImportError:
        return {"status": "error", "message": "psutil not installed"}

@app.get("/debug/dependencies")
async def debug_dependencies():
    """Verifies all heavy dependencies load successfully."""
    deps = {}
    try:
        import pdfplumber
        deps["pdfplumber"] = "ok"
    except Exception as e:
        deps["pdfplumber"] = str(e)
        
    try:
        import spacy
        deps["spacy"] = "ok"
    except Exception as e:
        deps["spacy"] = str(e)
        
    try:
        import google.genai
        deps["gemini"] = "ok"
    except Exception as e:
        deps["gemini"] = str(e)
        
    return {"status": "ok", "dependencies": deps}

@app.get("/debug/routes")
async def debug_routes():
    """Lists all registered routes."""
    return {"routes": [{"path": r.path, "name": r.name} for r in app.routes]}

@app.get("/debug/upload-test")
async def debug_upload_test():
    """Basic connectivity test for the upload path."""
    return {"status": "ok", "message": "Backend is reachable."}

from app.core.database_mongo import connect_to_mongo, close_mongo_connection
from app.core.cache import connect_to_redis, close_redis_connection

@app.on_event("startup")
async def startup_event():
    logger.info("=== Starting Pathora AI Backend ===")
    logger.info(f"[STARTUP_DIAGNOSTIC] API prefix: {settings.API_V1_STR}")
    logger.info(f"[STARTUP_DIAGNOSTIC] CORS origins: {CORS_ORIGINS}")
    
    try:
        from app.db.session import init_db
        init_db()
    except Exception as e:
        logger.error(f"Failed to init sqlite db: {e}")

    try:
        import psutil
        process = psutil.Process(os.getpid())
        logger.info(f"[STARTUP_DIAGNOSTIC] Initial Memory Usage: {process.memory_info().rss / 1024 / 1024:.2f} MB")
    except ImportError:
        pass

    try:
        await connect_to_mongo()
        from app.db.indexes import setup_mongodb_indexes
        await setup_mongodb_indexes()
    except Exception as e:
        logger.error(f"[STARTUP_DIAGNOSTIC] MongoDB connection failed: {e}")

    try:
        await connect_to_redis()
    except Exception as e:
        logger.error(f"[STARTUP_DIAGNOSTIC] Redis connection failed: {e}")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("=== Shutting down Pathora AI Backend ===")
    await close_mongo_connection()
    await close_redis_connection()
