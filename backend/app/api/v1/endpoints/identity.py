from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from app.services.identity_service import generate_identity
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

class IdentityGenerationRequest(BaseModel):
    targetRole: Optional[str] = ""
    skills: Optional[str] = ""
    projects: Optional[str] = ""
    achievements: Optional[str] = ""
    careerGoals: Optional[str] = ""

@router.post("/generate")
async def generate_identity_endpoint(request: IdentityGenerationRequest):
    try:
        signals = request.dict()
        result = await generate_identity(signals)
        return {"status": "success", "data": result}
    except Exception as e:
        logger.error(f"Error generating identity: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to generate identity")
