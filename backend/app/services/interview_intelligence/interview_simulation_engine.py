import logging
import json
from typing import List
from app.schemas.interview_intelligence import InterviewSimulation, InterviewSimulationQuestion
import google.generativeai as genai
from app.core.config import settings

logger = logging.getLogger("interview_simulation_engine")


class InterviewSimulationEngine:
    @staticmethod
    async def generate(job_description: str, candidate_level: str) -> List[InterviewSimulation]:
        logger.info("[INTERVIEW SIMULATION] Generating Interview Simulation scenarios...")
        
        genai.configure(api_key=settings.GEMINI_API_KEY)
        model = genai.GenerativeModel('gemini-1.5-pro') # Using pro for high-quality scenario generation
        
        prompt = f"""
        Act as a Principal Engineer interviewing a {candidate_level} candidate for the following Job Description:
        {job_description}
        
        Generate exactly 2 categories of interview questions: "Technical Deep Dive" and "System Design / Architecture".
        For each category, generate exactly 2 highly complex, scenario-based interview questions.
        
        For each question, provide:
        - The question itself
        - Difficulty classification (e.g. Advanced, Expert)
        - 2 "Expected Strong Answer Themes" (What a great candidate says)
        - 2 "Expected Weak Answer Signals" (What a junior/poor candidate says)
        - 1 sentence of "Evaluation Criteria" (How to score the answer)
        - 1 "Red Flag Response" (An answer that warrants immediate rejection)
        
        Respond ONLY with a valid JSON array matching this exact format:
        [
            {{
                "category": "Technical Deep Dive",
                "questions": [
                    {{
                        "question": "Scenario...",
                        "difficulty_classification": "Advanced",
                        "expected_strong_answer_themes": ["Theme 1", "Theme 2"],
                        "expected_weak_answer_signals": ["Weak 1", "Weak 2"],
                        "evaluation_criteria": "Score 10 if...",
                        "red_flag_responses": ["Red Flag 1"]
                    }}
                ]
            }}
        ]
        Do not include markdown blocks like ```json.
        """
        
        try:
            response = await model.generate_content_async(prompt)
            raw_text = response.text.strip()
            if raw_text.startswith("```json"):
                raw_text = raw_text[7:-3].strip()
            if raw_text.startswith("```"):
                raw_text = raw_text[3:-3].strip()
                
            data = json.loads(raw_text)
            return [InterviewSimulation(**item) for item in data]
        except Exception as e:
            logger.error(f"[INTERVIEW SIMULATION] LLM generation failed: {e}")
            return []
