import logging
from app.core.config import settings
from google import genai
from google.genai.errors import APIError
from datetime import datetime

logger = logging.getLogger("gemini_provider")

class GeminiProviderManager:
    """
    Manages a pool of Gemini API keys with rotation and failure detection.
    Falls back gracefully when rate limits or quota issues are encountered.
    """
    def __init__(self):
        self.providers = []
        if settings.GEMINI_API_KEY:
            self.providers.append({
                "name": "Key 1",
                "key": settings.GEMINI_API_KEY,
                "client": genai.Client(api_key=settings.GEMINI_API_KEY)
            })
        
        if settings.GEMINI_API_KEY_2:
            self.providers.append({
                "name": "Key 2",
                "key": settings.GEMINI_API_KEY_2,
                "client": genai.Client(api_key=settings.GEMINI_API_KEY_2)
            })
            
        if not self.providers:
            logger.warning("No Gemini API keys configured in Provider Manager.")

    async def generate_content_stream(self, contents, model="gemini-2.5-flash", **kwargs):
        """
        Tries to generate content stream using Key 1. If it fails, falls back to Key 2.
        Yields chunks instantly as they arrive.
        """
        if not self.providers:
            raise Exception("No Gemini providers available.")
            
        last_error = None
        for provider in self.providers:
            client = provider["client"]
            name = provider["name"]
            logger.info(f"Attempting inference using {name}")
            
            try:
                # The generate_content_stream call is synchronous but returns an iterable
                # We wrap it or iterate over it. Since it's often blocking, in a true async app 
                # we'd run this in a threadpool, but for now we iterate normally or via asyncio.to_thread
                import asyncio
                
                def get_stream():
                    return client.models.generate_content_stream(model=model, contents=contents, **kwargs)
                    
                response_stream = await asyncio.to_thread(get_stream)
                
                # If we got the stream successfully without immediate error, yield from it
                # Converting synchronous generator to async generator
                for chunk in response_stream:
                    yield chunk.text
                    
                # If successful, break and do not try next provider
                return
                
            except APIError as e:
                logger.warning(f"Provider {name} encountered API Error: {e}")
                last_error = e
                continue
            except Exception as e:
                logger.warning(f"Provider {name} encountered Unexpected Error: {e}")
                last_error = e
                continue
                
        # If we exhausted all providers
        logger.error(f"All Gemini providers failed. Last error: {last_error}")
        raise last_error or Exception("All Gemini providers failed without a specific error.")

    async def generate_content(self, contents, model="gemini-2.5-flash", **kwargs):
        """
        Non-streaming deterministic generation with fallback.
        """
        if not self.providers:
            raise Exception("No Gemini providers available.")
            
        last_error = None
        for provider in self.providers:
            client = provider["client"]
            name = provider["name"]
            logger.info(f"Attempting non-stream inference using {name}")
            
            try:
                import asyncio
                
                def get_response():
                    return client.models.generate_content(model=model, contents=contents, **kwargs)
                    
                response = await asyncio.to_thread(get_response)
                return response
                
            except APIError as e:
                logger.warning(f"Provider {name} encountered API Error: {e}")
                last_error = e
                continue
            except Exception as e:
                logger.warning(f"Provider {name} encountered Unexpected Error: {e}")
                last_error = e
                continue
                
        logger.error(f"All Gemini providers failed. Last error: {last_error}")
        raise last_error or Exception("All Gemini providers failed without a specific error.")

# Singleton instance
_provider_instance = None

def get_gemini_provider() -> GeminiProviderManager:
    global _provider_instance
    if _provider_instance is None:
        _provider_instance = GeminiProviderManager()
    return _provider_instance
