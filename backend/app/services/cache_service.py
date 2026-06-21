import json
import logging
from typing import Any, Optional
from app.core.cache import redis_cache

logger = logging.getLogger("cache_service")

class CacheService:
    @staticmethod
    async def get_cached_data(key: str) -> Optional[Any]:
        if not redis_cache.client:
            return None
            
        try:
            cached_val = await redis_cache.client.get(key)
            if cached_val:
                logger.debug(f"[CACHE HIT] {key}")
                return json.loads(cached_val)
            logger.debug(f"[CACHE MISS] {key}")
            return None
        except Exception as e:
            logger.error(f"Cache get error for key {key}: {e}")
            return None

    @staticmethod
    async def set_cached_data(key: str, data: Any, ttl_seconds: int = 3600):
        if not redis_cache.client:
            return
            
        try:
            val_str = json.dumps(data)
            await redis_cache.client.set(key, val_str, ex=ttl_seconds)
            logger.debug(f"[CACHE SET] {key} (TTL: {ttl_seconds}s)")
        except Exception as e:
            logger.error(f"Cache set error for key {key}: {e}")

    @staticmethod
    async def invalidate_cache(key: str):
        if not redis_cache.client:
            return
            
        try:
            await redis_cache.client.delete(key)
            logger.info(f"[CACHE INVALIDATE] {key}")
        except Exception as e:
            logger.error(f"Cache invalidate error for key {key}: {e}")
