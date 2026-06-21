from fastapi import APIRouter, HTTPException, BackgroundTasks
from typing import Dict, Any
from app.services.career_dna_service import CareerDNAService

router = APIRouter()

@router.get("/{user_id}", response_model=Dict[str, Any])
async def get_career_dna(user_id: str):
    dna = await CareerDNAService.get_career_dna(user_id)
    if not dna:
        # Return a skeleton until it's generated
        return {
            "status": "pending",
            "message": "Career DNA not yet generated. Sync resume or GitHub to generate."
        }
    return {"status": "success", "data": dna}

@router.post("/generate/{user_id}")
async def generate_career_dna(user_id: str, payload: Dict[str, Any]):
    """
    Force generate Career DNA based on provided signals.
    """
    dna = await CareerDNAService.generate_and_save_career_dna(user_id, payload)
    return {"status": "success", "data": dna}
