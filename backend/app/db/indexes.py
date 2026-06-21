import logging
from app.core.database_mongo import db
import pymongo

logger = logging.getLogger("db_indexes")

async def setup_mongodb_indexes():
    """Create MongoDB indexes for performance optimization."""
    if db.db is None:
        logger.warning("Database connection not available. Skipping index setup.")
        return

    try:
        logger.info("Setting up MongoDB indexes...")
        
        # Users Collection
        await db.db["users"].create_index([("email", pymongo.ASCENDING)], unique=True)
        
        # Jobs Collection (for querying by job_id and polling status)
        await db.db["jobs"].create_index([("job_id", pymongo.ASCENDING)], unique=True)
        await db.db["jobs"].create_index([("status", pymongo.ASCENDING)])
        await db.db["jobs"].create_index([("created_at", pymongo.DESCENDING)])
        
        # Resumes Collection
        await db.db["resumes"].create_index([("user_id", pymongo.ASCENDING)])
        
        # Audit Logs Collection (Future)
        await db.db["audit_logs"].create_index([("user_id", pymongo.ASCENDING)])
        await db.db["audit_logs"].create_index([("created_at", pymongo.DESCENDING)])
        
        logger.info("MongoDB indexes configured successfully.")
    except Exception as e:
        logger.error(f"Failed to setup MongoDB indexes: {e}")
