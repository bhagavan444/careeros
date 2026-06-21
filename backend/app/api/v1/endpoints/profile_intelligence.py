from fastapi import APIRouter, HTTPException
import logging
import traceback
from typing import Dict, Any

from app.schemas.profile_intelligence import (
    ProfileIntelligenceRequest,
    ProfileIntelligenceResponse
)
from app.services.profile_intelligence.orchestrator import ProfileIntelligenceOrchestrator

logger = logging.getLogger("profile_intelligence_api")
router = APIRouter()

@router.post("/analyze", response_model=ProfileIntelligenceResponse)
async def analyze_profile(request: ProfileIntelligenceRequest):
    """
    Core Profile Intelligence Endpoint.
    Consumes Resume, GitHub, LinkedIn, and Portfolio inputs.
    Returns deterministic verified skills, truth score, and hiring recommendations.
    """
    try:
        logger.info(f"Received Profile Intelligence Request. GitHub: {request.github}, Resume provided: {bool(request.resume)}")
        response = await ProfileIntelligenceOrchestrator.analyze(request)
        return response
    except Exception as e:
        logger.error(f"[PROFILE_INTELLIGENCE_ERROR] {traceback.format_exc()}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal Server Error during Profile Intelligence Analysis: {str(e)}"
        )
