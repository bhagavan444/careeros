import logging
import json
from google import genai
from google.genai import types
from pydantic import BaseModel, Field
from typing import List, Optional
from app.services.gemini_provider_manager import GeminiProviderManager

logger = logging.getLogger("identity_service")
provider_manager = GeminiProviderManager()

class IdentityReportSchema(BaseModel):
    score: int = Field(description="Professional identity score out of 100")
    career_maturity: str = Field(description="e.g. Junior, Intermediate, Senior, Principal")
    strengths: List[str] = Field(description="Top 3 to 5 core strengths")
    skill_gaps: List[str] = Field(description="Missing but highly requested skills for this role")
    recommended_focus: str = Field(description="Recommended career direction")

class IdentityGenerationOutput(BaseModel):
    identity_report: IdentityReportSchema
    professional_summary: str = Field(description="3-4 sentence professional summary")
    project_bullets: List[str] = Field(description="List of highly impactful project bullets")
    achievement_bullets: List[str] = Field(description="List of achievement highlights")
    experience_highlights: List[str] = Field(description="Generated experience highlights")
    career_narrative: str = Field(description="Internal career narrative mapping")

async def generate_identity(signals: dict) -> dict:
    prompt = f"""
You are an expert CareerOS Intelligence Engine.
Analyze the following career signals and generate a deterministic Professional Identity Profile.

CRITICAL INSTRUCTION FOR GITHUB DATA:
If the user provides GitHub data (indicated by specific repositories, languages, or verified tech verification), you MUST ONLY generate content based on that verified data. 
DO NOT hallucinate or fabricate generic placeholder content, repositories, or achievements.
Ensure the Professional Summary, Skills, Projects, and Achievements reflect ONLY what was extracted from GitHub.

TARGET ROLE: {signals.get('targetRole', 'N/A')}
SKILLS: {signals.get('skills', 'N/A')}
PROJECTS: {signals.get('projects', 'N/A')}
ACHIEVEMENTS: {signals.get('achievements', 'N/A')}
CAREER GOALS: {signals.get('careerGoals', 'N/A')}

Return a highly professional and ATS-optimized identity profile.
"""
    
    response = await provider_manager.generate_content(
        contents=prompt,
        model="gemini-2.5-flash",
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=IdentityGenerationOutput,
            temperature=0.2
        )
    )
    
    return json.loads(response.text)
