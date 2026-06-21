import os
from motor.motor_asyncio import AsyncIOMotorClient
import logging

logger = logging.getLogger("mongodb")

class MongoDB:
    client: AsyncIOMotorClient = None
    db = None

db = MongoDB()

async def connect_to_mongo():
    logger.info("Connecting to MongoDB...")
    mongo_uri = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
    db_name = os.getenv("MONGODB_DB_NAME", "careeros")
    
    try:
        db.client = AsyncIOMotorClient(mongo_uri)
        db.db = db.client[db_name]
        # Verify connection
        await db.client.server_info()
        logger.info(f"Connected to MongoDB: {db_name}")
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {e}")
        logger.warning("Continuing boot without MongoDB. Database-dependent features will fail.")

async def close_mongo_connection():
    if db.client:
        logger.info("Closing MongoDB connection...")
        db.client.close()
        logger.info("MongoDB connection closed.")

def get_database():
    return db.db
