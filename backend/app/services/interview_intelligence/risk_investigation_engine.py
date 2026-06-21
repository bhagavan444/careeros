import logging
import json
from typing import List
from app.schemas.interview_intelligence import RiskProbingStrategy
from app.schemas.recruiter_intelligence import RecruiterIntelligenceResponse
import google.generativeai as genai
from app.core.config import settings

logger = logging.getLogger("risk_investigation_engine")


class RiskInvestigationEngine:
    @staticmethod
    async def generate(ri_response: RecruiterIntelligenceResponse) -> List[RiskProbingStrategy]:
        logger.info("[RISK INVESTIGATION] Generating targeted risk probing questions...")
        
        risks = [f"{f.category}: {f.description}" for f in ri_response.risk_analysis.factors if f.severity in ("High", "Critical", "Medium")]
        if not risks:
            logger.info("[RISK INVESTIGATION] No deterministic risks identified.")
            return []
            
        genai.configure(api_key=settings.GEMINI_API_KEY)
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        prompt = f"""
        Our deterministic risk engine flagged the following critical risks for a candidate:
        {json.dumps(risks, indent=2)}
        
        For EACH risk, generate 2 targeted probing questions to ask the candidate to investigate the risk, and 2 "red flag signals" the interviewer should watch out for in the candidate's answer.
        
        Respond ONLY with a valid JSON array of objects in this exact format:
        [
            {{
                "risk_factor": "Risk Name",
                "probing_questions": ["Q1", "Q2"],
                "red_flag_signals": ["Signal 1", "Signal 2"]
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
            return [RiskProbingStrategy(**item) for item in data]
        except Exception as e:
            logger.error(f"[RISK INVESTIGATION] LLM generation failed: {e}")
            return [
                RiskProbingStrategy(
                    risk_factor=risk,
                    probing_questions=["Could you elaborate on this area of your experience?"],
                    red_flag_signals=["Evasive answers or lack of concrete examples."]
                ) for risk in risks
            ]
