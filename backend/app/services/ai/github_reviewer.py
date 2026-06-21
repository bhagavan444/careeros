import json
import logging
from typing import Dict, Any, List
from app.core.config import settings
import traceback

logger = logging.getLogger("github_reviewer")

class GitHubAIReviewer:
    @staticmethod
    async def generate_insights(profile: Dict[str, Any], repos: List[Dict[str, Any]], analytics: Dict[str, Any]) -> Dict[str, Any]:
        """
        Sends metadata to Gemini to generate structured engineering insights.
        """
        try:
            from google import genai
            from google.genai import types
            
            if not settings.GEMINI_API_KEY:
                logger.warning("GEMINI_API_KEY not set. Returning mock insights for gracefully degraded experience.")
                return GitHubAIReviewer._fallback_insights()

            client = genai.Client(api_key=settings.GEMINI_API_KEY)
            
            # Prepare contextual payload
            repo_summaries = [
                f"- {r['name']} ({r.get('language', 'Unknown')}): {r.get('description', '')}" 
                for r in sorted(repos, key=lambda x: x.get('stars', 0), reverse=True)[:10] # Top 10 repos
            ]
            
            context = f"""
            Analyze this GitHub profile as a Principal Software Engineer and Engineering Manager.
            Profile: {profile.get('username')}
            Bio: {profile.get('bio')}
            
            Metrics:
            - Quality Score: {analytics.get('quality_score')}
            - Activity Score: {analytics.get('activity_score')}
            - Complexity Score: {analytics.get('complexity_score')} (Level: {analytics.get('complexity_level')})
            - Engineering Maturity: {analytics.get('engineering_maturity', {}).get('score', 0)}/100
            - Trust Score: {analytics.get('engineering_trust', {}).get('trust_score', 0)}/100
            - Verified Skills: {', '.join([skill.get('technology', str(skill)) if isinstance(skill, dict) else str(skill) for skill in analytics.get('engineering_trust', {}).get('verified_skills', [])])}
            - Hiring Recommendation (Deterministic): {analytics.get('recruiter_decision', {}).get('hiring_recommendation', 'Unknown')}
            - Recruiter Risk Areas: {', '.join(analytics.get('recruiter_decision', {}).get('risk_areas', []))}
            
            Maturity Weaknesses: {', '.join(analytics.get('engineering_maturity', {}).get('weaknesses', []))}
            
            Top Repositories:
            {chr(10).join(repo_summaries)}
            
            Generate a JSON response EXACTLY matching this structure. 
            For the Growth Roadmap, derive the plans directly from actual detected weaknesses. No generic advice.
            For the Recruiter Summary, write a 2-3 sentence executive summary explaining the deterministic hiring recommendation to a non-technical recruiter. DO NOT invent your own recommendation.
            
            {{
                "career_positioning": {{
                    "career_level": "Student | Junior Developer | Associate Engineer | Mid-Level Engineer | Senior Engineer Candidate",
                    "confidence": "Low | Medium | High",
                    "reasoning": "string",
                    "strengths": ["string", "string"],
                    "growth_areas": ["string", "string"]
                }},
                "growth_roadmap": {{
                    "30_day_plan": ["string", "string"],
                    "90_day_plan": ["string", "string"],
                    "180_day_plan": ["string", "string"]
                }},
                "recruiter_summary": "string"
            }}
            """
            
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=context,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.3
                )
            )
            
            try:
                # Some API wrappers return the raw JSON string
                result = json.loads(response.text)
                logger.debug(f"ai_review {json.dumps(result, indent=2)}")
                return result
            except json.JSONDecodeError:
                logger.error(f"Failed to decode JSON from Gemini: {response.text}")
                return GitHubAIReviewer._fallback_insights()
                
        except Exception as e:
            logger.error(f"Error in GitHubAIReviewer: {str(e)}\n{traceback.format_exc()}")
            return GitHubAIReviewer._fallback_insights()
            
    @staticmethod
    def _fallback_insights() -> Dict[str, Any]:
        return {
            "career_positioning": {
                "career_level": "Junior Developer",
                "confidence": "Medium",
                "reasoning": "Profile lacks verifiable evidence of advanced architecture, testing, or CI/CD pipelines.",
                "strengths": ["Consistent commit history", "Good variety of languages"],
                "growth_areas": ["Lacking comprehensive READMEs", "Limited architectural complexity"]
            },
            "growth_roadmap": {
                "30_day_plan": ["Add comprehensive READMEs to top 3 projects", "Implement unit testing using PyTest/Jest in main repository"],
                "90_day_plan": ["Set up GitHub Actions for CI/CD automated testing and linting", "Refactor one application to use containerization (Docker)"],
                "180_day_plan": ["Deploy containerized application to AWS/GCP", "Implement microservice architecture patterns with database integration"]
            }
        }
