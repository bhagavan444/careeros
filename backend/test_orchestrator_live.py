import asyncio
import os
import sys
import traceback

backend_dir = os.path.abspath(os.path.dirname(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.schemas.profile_intelligence import ProfileIntelligenceRequest
from app.services.profile_intelligence.orchestrator import ProfileIntelligenceOrchestrator

async def test_live():
    request = ProfileIntelligenceRequest(
        resume="test_doc_id",
        github="bhagavan444",
        linkedin="https://linkedin.com/in/gsssbhagavan",
        portfolio="https://bhagavanengineer.vercel.app/"
    )
    
    try:
        response = await ProfileIntelligenceOrchestrator.analyze(request)
        print("SUCCESS! Payload generated.")
    except Exception as e:
        print("FAILED!")
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_live())
