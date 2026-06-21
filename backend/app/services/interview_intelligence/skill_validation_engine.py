import logging
import json
from typing import List
from app.schemas.interview_intelligence import ValidationQuestion
from app.schemas.recruiter_intelligence import RecruiterIntelligenceResponse
import google.generativeai as genai
from app.core.config import settings

logger = logging.getLogger("skill_validation_engine")


class SkillValidationEngine:
    @staticmethod
    async def generate(ri_response: RecruiterIntelligenceResponse) -> List[ValidationQuestion]:
        logger.info("[SKILL VALIDATION] Isolating weakly evidenced skills for validation...")
        
        # Isolate skills claimed by candidate but lacking GitHub or other evidence
        weak_skills = []
        for skill in ri_response.jd_verification_matrix.skills:
            if skill.candidate_claims and not skill.github_evidence:
                weak_skills.append(skill.skill_name)
                
        if not weak_skills:
            logger.info("[SKILL VALIDATION] All claimed skills have strong external evidence.")
            return []
            
        genai.configure(api_key=settings.GEMINI_API_KEY)
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        prompt = f"""
        The following skills were claimed by a candidate on their resume but lack any external evidence (like GitHub commits or public code):
        {', '.join(weak_skills)}
        
        Generate exactly 3 deep, technical probing questions for EACH skill to verify if the candidate actually possesses production-level knowledge, or if they just padded their resume.
        
        Respond ONLY with a valid JSON array of objects in this exact format:
        [
            {{
                "skill": "Skill Name",
                "verification_needed": true,
                "questions": [
                    "Question 1",
                    "Question 2",
                    "Question 3"
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
            return [ValidationQuestion(**item) for item in data]
        except Exception as e:
            logger.error(f"[SKILL VALIDATION] LLM generation failed: {e}")
            # Fallback
            return [
                ValidationQuestion(
                    skill=skill,
                    verification_needed=True,
                    questions=[f"Explain your past experience using {skill} in a production environment.", f"What is the most complex problem you solved using {skill}?"]
                ) for skill in weak_skills
            ]
