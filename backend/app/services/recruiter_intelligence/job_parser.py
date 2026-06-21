import json
import logging
from google import genai
from pydantic import BaseModel

from app.core.config import settings
from app.schemas.recruiter_intelligence import JobIntelligence
from app.services.profile_intelligence.skill_taxonomy import SkillTaxonomy

logger = logging.getLogger("job_parser")

class JobParserEngine:
    """
    Phase 1: Deterministic Job Intelligence Engine.
    Uses Gemini strictly for semantic extraction into a strict JSON schema.
    Applies the deterministic SkillTaxonomy to normalize all extracted arrays.
    """

    @staticmethod
    def extract_job_intelligence(job_description: str) -> dict:
        """
        Parses raw text and returns normalized JobIntelligence dict.
        Returns empty structured dict on failure.
        """
        if not job_description or len(job_description.strip()) < 20:
            logger.warning("[JOB_PARSER] Job description is empty or too short.")
            return JobIntelligence().dict()

        if not settings.GEMINI_API_KEY:
            logger.warning("[JOB_PARSER] GEMINI_API_KEY not set. Returning empty intelligence.")
            return JobIntelligence().dict()

        client = genai.Client(api_key=settings.GEMINI_API_KEY)
        
        system_instruction = """
        You are a highly precise Job Description Parsing Engine.
        Your sole task is to extract requirements and skills from the provided text and map them exactly to the requested JSON schema.
        DO NOT hallucinate. Only extract what is explicitly stated in the text.
        If a section is not found, return an empty array or string.
        """

        prompt = f"""
        Extract the following information from the Job Description into a JSON object matching this schema exactly:
        {{
            "required_skills": ["array of exact strings"],
            "preferred_skills": ["array of exact strings"],
            "nice_to_have_skills": ["array of exact strings"],
            "programming_languages": ["array of exact strings"],
            "frameworks": ["array of exact strings"],
            "databases": ["array of exact strings"],
            "cloud_technologies": ["array of exact strings"],
            "devops_technologies": ["array of exact strings"],
            "ai_ml_technologies": ["array of exact strings"],
            "experience_requirements": "string summarizing years and level",
            "education_requirements": "string summarizing degree requirements",
            "certifications": ["array of exact strings"],
            "soft_skills": ["array of exact strings"]
        }}

        Job Description:
        \"\"\"{job_description}\"\"\"
        """

        try:
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
                config=genai.types.GenerateContentConfig(
                    system_instruction=system_instruction,
                    temperature=0.0,
                    response_mime_type="application/json",
                    response_schema=JobIntelligence
                ),
            )
            
            raw_data = json.loads(response.text)
            
            # Normalize all lists using SkillTaxonomy
            normalized_data = {
                "required_skills": SkillTaxonomy.deduplicate(raw_data.get("required_skills", [])),
                "preferred_skills": SkillTaxonomy.deduplicate(raw_data.get("preferred_skills", [])),
                "nice_to_have_skills": SkillTaxonomy.deduplicate(raw_data.get("nice_to_have_skills", [])),
                "programming_languages": SkillTaxonomy.deduplicate(raw_data.get("programming_languages", [])),
                "frameworks": SkillTaxonomy.deduplicate(raw_data.get("frameworks", [])),
                "databases": SkillTaxonomy.deduplicate(raw_data.get("databases", [])),
                "cloud_technologies": SkillTaxonomy.deduplicate(raw_data.get("cloud_technologies", [])),
                "devops_technologies": SkillTaxonomy.deduplicate(raw_data.get("devops_technologies", [])),
                "ai_ml_technologies": SkillTaxonomy.deduplicate(raw_data.get("ai_ml_technologies", [])),
                "experience_requirements": str(raw_data.get("experience_requirements", "")),
                "education_requirements": str(raw_data.get("education_requirements", "")),
                "certifications": SkillTaxonomy.deduplicate(raw_data.get("certifications", [])),
                "soft_skills": SkillTaxonomy.deduplicate(raw_data.get("soft_skills", []))
            }
            
            logger.info("[JOB_PARSER] Successfully parsed and normalized Job Description.")
            return normalized_data
            
        except Exception as e:
            logger.error(f"[JOB_PARSER] Failed to parse Job Description: {e}")
            return JobIntelligence().dict()

