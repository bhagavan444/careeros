from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from app.models.mongo_schema import CareerMemoryModel
from app.core.database_mongo import get_database

router = APIRouter()

@router.post("/sync")
async def sync_career_memory(payload: Dict[str, Any]):
    db = get_database()
    if db is None:
        raise HTTPException(status_code=500, detail="Database not connected")
        
    user_id = payload.get("user_id", "anonymous")
    
    memory = CareerMemoryModel(
        user_id=user_id,
        target_role=payload.get("targetRole"),
        identity_score=payload.get("identityScore"),
        strengths=payload.get("strengths", []),
        skill_gaps=payload.get("skillGaps", []),
        career_goals=payload.get("careerGoals")
    )
    
    await db.career_memory.update_one(
        {"user_id": user_id},
        {"$set": memory.dict(by_alias=True, exclude={"id"})},
        upsert=True
    )
    
    return {"status": "success", "message": "Career memory synced to MongoDB"}

@router.get("/{user_id}")
async def get_career_memory(user_id: str):
    db = get_database()
    memory = await db.career_memory.find_one({"user_id": user_id})
    if memory:
        memory["_id"] = str(memory["_id"])
        return {"status": "success", "data": memory}
    return {"status": "not_found", "data": None}
