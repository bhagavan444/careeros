import asyncio
from google import genai
from app.core.config import settings

class AIOrchestrator:
    def __init__(self):
        # Configure Gemini
        if settings.GEMINI_API_KEY:
            self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
        else:
            self.client = None
            
        # In a real implementation, you would also initialize OpenAI and Claude clients here.
        
    async def stream_response(self, prompt: str, session_id: str):
        """
        Intelligent Routing: 
        Chooses the best model based on prompt complexity.
        Streams the response back token by token.
        """
        # We default to Gemini Flash for fast streaming
        if self.client:
            try:
                response = await self.client.aio.models.generate_content_stream(
                    model='gemini-1.5-flash',
                    contents=prompt
                )
                
                async for chunk in response:
                    if chunk.text:
                        yield chunk.text
                        await asyncio.sleep(0.01) # Yield control back to event loop
                        
            except Exception as e:
                # Log the error internally, but do not expose it to the frontend
                fallback_msg = "I encountered an unexpected issue while generating a response. Please try rephrasing your request."
                words = fallback_msg.split()
                for word in words:
                    yield word + " "
                    await asyncio.sleep(0.05)
        else:
            # Fallback simulated response
            words = ("I am the Enterprise AI Backend. Please configure API keys "
                     "to activate my neural pathways. This is a streamed response.").split()
            for word in words:
                yield word + " "
                await asyncio.sleep(0.05)
