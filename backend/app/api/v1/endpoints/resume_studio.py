from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List
from app.models.mongo_schema import ResumeModel, ResumeVersionModel
from app.core.database_mongo import get_database
from datetime import datetime
from bson import ObjectId

router = APIRouter()

@router.post("/save")
async def save_resume(payload: Dict[str, Any]):
    db = get_database()
    if db is None:
        raise HTTPException(status_code=500, detail="Database not connected")
        
    user_id = payload.get("user_id", "anonymous")
    resume_id = payload.get("resume_id")
    content = payload.get("content", {})
    template = payload.get("template", "professional")
    identity_score = payload.get("identity_score", 0)
    
    if not resume_id:
        # Create new resume
        resume = ResumeModel(
            user_id=user_id, 
            title=content.get("personalInfo", {}).get("title", "My Resume"),
            content=content,
            template=template,
            identity_score=identity_score
        )
        resume_dict = resume.dict(by_alias=True)
        await db.resumes.insert_one(resume_dict)
        resume_id = resume_dict["_id"]
    else:
        # Update existing (Autosave)
        await db.resumes.update_one(
            {"_id": resume_id},
            {"$set": {
                "updated_at": datetime.utcnow(), 
                "title": content.get("personalInfo", {}).get("title", "My Resume"),
                "content": content,
                "template": template,
                "identity_score": identity_score
            }}
        )
        
    return {"status": "success", "resume_id": resume_id}

@router.post("/snapshot")
async def create_snapshot(payload: Dict[str, Any]):
    db = get_database()
    resume_id = payload.get("resume_id")
    content = payload.get("content", {})
    template = payload.get("template", "professional")
    identity_score_snapshot = payload.get("identity_score", 0)
    
    if not resume_id:
        raise HTTPException(status_code=400, detail="resume_id is required for a snapshot")

    latest_version = await db.resume_versions.find_one({"resume_id": resume_id}, sort=[("version_number", -1)])
    version_number = (latest_version["version_number"] + 1) if latest_version else 1
    
    version = ResumeVersionModel(
        resume_id=resume_id,
        version_number=version_number,
        content=content,
        template=template,
        identity_score_snapshot=identity_score_snapshot
    )
    await db.resume_versions.insert_one(version.dict(by_alias=True))
    
    # Also log to identity timeline
    from app.models.mongo_schema import IdentitySnapshotModel
    user_id = content.get("personalInfo", {}).get("email", "anonymous") # basic fallback
    snapshot = IdentitySnapshotModel(
        user_id=user_id,
        identity_score=identity_score_snapshot,
        resume_score=identity_score_snapshot
    )
    await db.identity_snapshots.insert_one(snapshot.dict(by_alias=True))
    
    return {"status": "success", "version": version_number}

@router.get("/list/{user_id}")
async def list_resumes(user_id: str):
    db = get_database()
    cursor = db.resumes.find({"user_id": user_id})
    resumes = await cursor.to_list(length=100)
    return {"status": "success", "data": resumes}

@router.get("/{resume_id}/versions")
async def get_resume_versions(resume_id: str):
    db = get_database()
    cursor = db.resume_versions.find({"resume_id": resume_id}).sort("version_number", -1)
    versions = await cursor.to_list(length=100)
    return {"status": "success", "data": versions}
