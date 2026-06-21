import logging
import os
import redis.asyncio as redis
from typing import Optional

logger = logging.getLogger("cache")

class RedisCache:
    client: Optional[redis.Redis] = None

redis_cache = RedisCache()

async def connect_to_redis():
    logger.info("Connecting to Redis...")
    redis_uri = os.getenv("REDIS_URI", "redis://localhost:6379")
    try:
        # Create connection pool
        redis_cache.client = redis.from_url(redis_uri, decode_responses=True)
        # Test connection
        await redis_cache.client.ping()
        logger.info("Connected to Redis successfully.")
    except Exception as e:
        logger.error(f"Failed to connect to Redis: {e}")
        logger.warning("Continuing without Redis. Caching will be disabled.")
        redis_cache.client = None

async def close_redis_connection():
    if redis_cache.client:
        logger.info("Closing Redis connection...")
        await redis_cache.client.close()
        logger.info("Redis connection closed.")
