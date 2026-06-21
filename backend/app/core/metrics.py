import time
import logging
import asyncio
from functools import wraps
from typing import Callable, Any

logger = logging.getLogger("metrics")

def track_performance(metric_name: str):
    """
    Decorator to track the execution time of a function.
    Logs the timing with a specific metric name (e.g. 'ai_processing_time', 'db_query_time').
    """
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        async def async_wrapper(*args, **kwargs) -> Any:
            start_time = time.perf_counter()
            try:
                result = await func(*args, **kwargs)
                return result
            finally:
                duration = time.perf_counter() - start_time
                logger.info(f"[METRIC] {metric_name} | duration: {duration:.4f}s")
                
        @wraps(func)
        def sync_wrapper(*args, **kwargs) -> Any:
            start_time = time.perf_counter()
            try:
                result = func(*args, **kwargs)
                return result
            finally:
                duration = time.perf_counter() - start_time
                logger.info(f"[METRIC] {metric_name} | duration: {duration:.4f}s")
                
        if asyncio.iscoroutinefunction(func):
            return async_wrapper
        return sync_wrapper
    return decorator
