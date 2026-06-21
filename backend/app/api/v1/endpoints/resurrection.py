from fastapi import APIRouter, HTTPException, UploadFile, File, BackgroundTasks, Request
from sse_starlette.sse import EventSourceResponse
from typing import Dict, Any
from app.models.mongo_schema import ResurrectionJobModel
from app.core.database_mongo import get_database
from app.services.documents.resume_resurrection_service import run_resurrection_pipeline
import asyncio
import json

router = APIRouter()

@router.post("/start")
async def start_resurrection(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    db = get_database()
    if db is None:
        raise HTTPException(status_code=500, detail="Database not connected")
    
    # 1. Read file into memory (we could save it temporarily, but memory is fine for a resume)
    file_bytes = await file.read()
    
    # 2. Create Job
    job = ResurrectionJobModel(user_id="anonymous", status="pending", current_stage="Uploading Resume", progress=5)
    job_dict = job.dict(by_alias=True)
    await db.resurrection_jobs.insert_one(job_dict)
    job_id = job_dict["_id"]
    
    # 3. Fire Background Task
    background_tasks.add_task(run_resurrection_pipeline, job_id, file_bytes, file.filename)
    
    return {"status": "success", "job_id": job_id}

@router.get("/events/{job_id}")
async def get_resurrection_events(request: Request, job_id: str):
    db = get_database()
    if db is None:
        raise HTTPException(status_code=500, detail="Database not connected")
        
    async def event_generator():
        last_progress = -1
        while True:
            # If client disconnects, break
            if await request.is_disconnected():
                break
                
            job = await db.resurrection_jobs.find_one({"_id": job_id})
            if not job:
                yield json.dumps({"error": "Job not found"})
                break
                
            # Only send if progress updated to avoid flooding (or we can just send every sec)
            if job["progress"] != last_progress:
                payload = {
                    "status": job["status"],
                    "current_stage": job["current_stage"],
                    "progress": job["progress"]
                }
                if job["status"] == "completed":
                    payload["result_payload"] = job.get("result_payload")
                elif job["status"] == "failed":
                    payload["error_message"] = job.get("error_message")
                    
                yield json.dumps(payload)
                last_progress = job["progress"]
                
            if job["status"] in ["completed", "failed"]:
                break
                
            await asyncio.sleep(0.5)

    return EventSourceResponse(event_generator())
