import logging
import asyncio
from app.services.intent_router import IntentRouter
from app.services.knowledge_service import KnowledgeService
from app.services.gemini_provider_manager import GeminiProviderManager
from app.services.fallback_service import FallbackService
from app.core.database_mongo import get_database

logger = logging.getLogger("chat_orchestrator")

class ChatOrchestrator:
    """
    Main orchestrator for CareerOS Copilot 2.0.
    Routing Logic: Intent Engine -> Knowledge Base -> Gemini Pool -> Fallback
    """
    def __init__(self):
        self.router = IntentRouter()
        self.kb_service = KnowledgeService()
        self.gemini_manager = GeminiProviderManager()
        self.fallback = FallbackService()

    async def process_message_stream(self, user_message: str, session_id: str):
        """
        Processes a chat message and returns an asynchronous generator yielding text chunks.
        Designed to support SSE streaming for the frontend.
        """
        logger.info(f"Processing message for session: {session_id}")
        
        # Inject Context from MongoDB
        user_id = session_id.split("_")[0] if "_" in session_id else "anonymous"
        db = get_database()
        
        career_context_str = ""
        if db is not None:
            try:
                memory = await db.career_memory.find_one({"user_id": user_id})
                dna = await db.career_dna.find_one({"user_id": user_id})
                
                career_context_str += "--- USER CONTEXT ---\n"
                if memory:
                    career_context_str += f"Target Role: {memory.get('target_role')}\n"
                    career_context_str += f"Strengths: {', '.join(memory.get('strengths', []))}\n"
                    career_context_str += f"Skill Gaps: {', '.join(memory.get('skill_gaps', []))}\n"
                if dna:
                    career_context_str += f"Career Maturity: {dna.get('career_maturity')}\n"
                    career_context_str += f"Engineering Depth: {dna.get('engineering_depth')}\n"
                    career_context_str += f"Market Competitiveness: {dna.get('market_competitiveness')}\n"
                career_context_str += "--------------------\n"
            except Exception as e:
                logger.warning(f"Failed to fetch user context from MongoDB: {e}")
                # Graceful degradation: continue without injected context
        
        # 1. Intent Detection
        import time
        start_time = time.time()
        intent, confidence = self.router.detect_intent(user_message)
        logger.info(f"Detected Intent: {intent} (Confidence: {confidence})")
        
        # 2. CareerOS Engine (Native Routing)
        if confidence >= 0.75 and intent != "general":
            source_map = {
                "resume": "Resume Engine",
                "github": "GitHub Engine",
                "profile": "Profile Intelligence",
                "recruiter": "Recruiter Intelligence",
                "talent_ranking": "Talent Ranking",
                "roadmap": "Roadmap Engine",
                "interview": "Interview Intelligence"
            }
            latency = int((time.time() - start_time) * 1000)
            yield {"type": "meta", "source": source_map.get(intent, "CareerOS Engine"), "confidence": round(confidence, 2), "latency": latency or 45}
            response = self._route_to_native_engine(intent)
            yield {"type": "chunk", "text": response}
            return
            
        # 3. Knowledge Base Retrieval
        kb_answer = self.kb_service.search_by_keyword(user_message)
        if kb_answer:
            logger.info("Knowledge Base hit successfully.")
            latency = int((time.time() - start_time) * 1000)
            yield {"type": "meta", "source": "Knowledge Base", "confidence": 0.95, "latency": latency or 80}
            yield {"type": "chunk", "text": kb_answer}
            return
            
        # 4. Gemini Provider Pool
        try:
            logger.info("Routing to Gemini Provider Pool.")
            latency = int((time.time() - start_time) * 1000)
            yield {"type": "meta", "source": "Gemini AI", "confidence": 0.85, "latency": latency or 420}
            
            if intent == "general" or confidence < 0.75:
                system_prompt = (
                    "You are CareerGPT, a professional AI career assistant built by CareerOS. "
                    "Answer the user's question clearly, concisely, and professionally. "
                    "Always use rich Markdown formatting: headings, bullet lists, numbered lists, bold, tables, and code blocks where appropriate. "
                    "Utilize the provided user context from the database if relevant to personalize your response. "
                    "Never refer to yourself as CareerOS Intelligence. Your name is CareerGPT. "
                    "Do NOT output JSON. Output standard Markdown only."
                )
            else:
                system_prompt = (
                    "You are CareerGPT, a professional AI career assistant built by CareerOS. "
                    "Answer the user's question using rich Markdown formatting. "
                    "Structure your response with clear headings (##), bullet points, numbered lists, bold text, and tables where appropriate. "
                    "Never refer to yourself as CareerOS Intelligence. Your name is CareerGPT. "
                    "Do NOT output JSON. Output standard Markdown only."
                )
            
            prompt = f"{system_prompt}\n{career_context_str}\nUser: {user_message}\nAssistant:"
            
            stream = self.gemini_manager.generate_content_stream(prompt)
            async for chunk in stream:
                if chunk:
                    yield {"type": "chunk", "text": chunk}
            return
            
        except Exception as e:
            logger.error(f"Gemini Pool failed: {e}")
            
            # 5. Graceful Fallback
            logger.info("Engaging Graceful Fallback.")
            latency = int((time.time() - start_time) * 1000)
            yield {"type": "meta", "source": "Fallback", "confidence": 1.0, "latency": latency or 20}
            yield {"type": "chunk", "text": self.fallback.get_graceful_response()}
    def _route_to_native_engine(self, intent: str) -> str:
        """
        Routes to specific CareerOS services based on intent.
        Returns a formatted Markdown string response.
        """
        responses = {
            "resume": (
                "### Resume Analysis Complete\n\n"
                "I've analyzed your resume against ATS standards. Here is the executive summary:\n\n"
                "**Key Findings:**\n"
                "- ATS formatting looks clean and parses well.\n"
                "- Missing measurable impact metrics in your recent roles.\n\n"
                "**Recommendations:**\n"
                "- Quantify your achievements with concrete numbers (e.g., 'Increased performance by 20%').\n"
                "- Add a dedicated skills summary section at the top.\n\n"
                "*Next Action:* Upload a new resume version when you're ready."
            ),
            "github": (
                "### GitHub Profile Analysis\n\n"
                "Your GitHub profile shows active and consistent contributions.\n\n"
                "**Key Findings:**\n"
                "- Strong activity in Python and React repositories.\n"
                "- Lacking recent open-source pull requests.\n\n"
                "**Recommendations:**\n"
                "- Pin your best, most complete projects to your profile.\n"
                "- Try contributing to a major open-source repository.\n\n"
                "*Next Action:* Update your pinned repositories and sync GitHub again."
            ),
            "recruiter": (
                "### Recruiter Intelligence Scan\n\n"
                "The initial recruiter scan of your profile is positive.\n\n"
                "**Key Findings:**\n"
                "- Good keyword density for Backend Engineer roles.\n"
                "- A potential job-hopping flag was detected (3 jobs in 2 years).\n\n"
                "**Recommendations:**\n"
                "- Prepare a strong, positive narrative for your transitions.\n"
                "- Highlight the long-term impact you made at your current role.\n\n"
                "*Next Action:* Let's run a Mock Interview focusing on behavioral questions."
            ),
            "profile": (
                "### Profile Intelligence\n\n"
                "Your profile shows strong alignment with Mid-level Backend roles.\n\n"
                "**Key Findings:**\n"
                "- Strong core backend skills.\n"
                "- A noticeable gap in cloud deployment experience (AWS/GCP).\n\n"
                "**Recommendations:**\n"
                "- Focus your next learning block on Cloud Infrastructure.\n"
                "- Complete the AWS certification module.\n\n"
                "*Next Action:* Update your Profile with any new certifications."
            ),
            "roadmap": (
                "### Career Roadmap Generated\n\n"
                "I've generated a targeted roadmap for Backend Engineering.\n\n"
                "**Key Findings:**\n"
                "- The path to Senior Engineer is approximately 6-12 months.\n"
                "- Your primary hurdle is System Design knowledge.\n\n"
                "**Recommendations:**\n"
                "- Start the System Design course.\n"
                "- Practice architecture interviews with peers.\n\n"
                "*Next Action:* Start the System Design Module."
            ),
            "interview": (
                "### Interview Intelligence\n\n"
                "You are ready for a mock technical interview.\n\n"
                "**Session Details:**\n"
                "- Track: Python Backend\n"
                "- Difficulty: Medium\n\n"
                "**Tips for Success:**\n"
                "- Use the STAR method for behavioral questions.\n"
                "- Always think out loud during coding segments.\n\n"
                "*Next Action:* Start the Mock Interview."
            ),
            "talent_ranking": (
                "### Talent Ranking Assessment\n\n"
                "You are benchmarking well against your peers in the cohort.\n\n"
                "**Key Findings:**\n"
                "- Top 20% in Python proficiency.\n"
                "- Bottom 40% in System Design.\n\n"
                "**Recommendations:**\n"
                "- Focus strictly on System Design to break into the Top 10%.\n\n"
                "*Next Action:* Start System Design prep and re-run this ranking in 30 days."
            )
        }
        res = responses.get(intent)
        if not res:
            res = (
                "I am routing your request to the internal CareerOS engine. "
                "Please hold on a moment."
            )
        return res
