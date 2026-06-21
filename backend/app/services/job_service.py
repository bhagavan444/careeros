import asyncio
import logging
from datetime import datetime
import uuid
from typing import Dict, Any, Callable, Coroutine
from app.core.database_mongo import db
from app.models.mongo_schema import JobModel
import time

logger = logging.getLogger("job_service")

class JobService:
    @staticmethod
    async def create_job(job_type: str) -> JobModel:
        """Create a new job in the database with pending status."""
        job_id = str(uuid.uuid4())
        job = JobModel(
            job_id=job_id,
            job_type=job_type,
            status="pending"
        )
        
        if db.db is not None:
            await db.db["jobs"].insert_one(job.model_dump(by_alias=True))
        
        return job

    @staticmethod
    async def get_job(job_id: str) -> Dict[str, Any]:
        """Fetch job status from the database."""
        if db.db is None:
            return {"job_id": job_id, "status": "unknown", "error": "Database unavailable"}
            
        job_data = await db.db["jobs"].find_one({"job_id": job_id})
        if not job_data:
            return {"job_id": job_id, "status": "not_found"}
            
        # Remove mongo specific _id
        if "_id" in job_data:
            del job_data["_id"]
            
        return job_data

    @staticmethod
    async def _update_job_status(job_id: str, status: str, result: Dict[str, Any] = None, error: str = None):
        """Update job status in the database."""
        if db.db is None:
            return

        update_data = {"status": status}
        if status == "running":
            update_data["started_at"] = datetime.utcnow()
        elif status in ["completed", "failed"]:
            update_data["completed_at"] = datetime.utcnow()
            
        if result is not None:
            update_data["result_payload"] = result
        if error is not None:
            update_data["error_message"] = error
            
        await db.db["jobs"].update_one(
            {"job_id": job_id},
            {"$set": update_data}
        )

    @staticmethod
    def spawn_background_task(job_id: str, task_func: Callable[..., Coroutine], *args, **kwargs):
        """
        Spawns a background task managed by asyncio.
        Updates the job status in MongoDB automatically.
        """
        async def wrapper():
            start_time = time.perf_counter()
            logger.info(f"[JOB_START] {job_id} starting execution.")
            await JobService._update_job_status(job_id, "running")
            
            try:
                # Execute the actual worker function
                result = await task_func(*args, **kwargs)
                
                # Mark as completed
                await JobService._update_job_status(job_id, "completed", result=result)
                duration = time.perf_counter() - start_time
                logger.info(f"[JOB_SUCCESS] {job_id} completed in {duration:.4f}s.")
            except Exception as e:
                # Mark as failed
                logger.error(f"[JOB_FAILED] {job_id} failed: {e}")
                await JobService._update_job_status(job_id, "failed", error=str(e))
                
        # Launch independently in the background
        asyncio.create_task(wrapper())
