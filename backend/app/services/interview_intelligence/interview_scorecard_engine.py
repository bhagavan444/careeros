import logging
from typing import List
from app.schemas.interview_intelligence import InterviewScorecard, ScorecardCategory
from app.schemas.recruiter_intelligence import RecruiterIntelligenceResponse

logger = logging.getLogger("interview_scorecard_engine")

class InterviewScorecardEngine:
    @staticmethod
    def generate(ri_response: RecruiterIntelligenceResponse) -> InterviewScorecard:
        logger.info("[SCORECARD ENGINE] Building Standardized Rubric...")
        
        categories = [
            ScorecardCategory(
                category_name="Technical Skills",
                max_score=10,
                evaluation_guidance="Assess depth of knowledge in core required technologies. 8+ requires ability to teach the tech to others."
            ),
            ScorecardCategory(
                category_name="Problem Solving",
                max_score=10,
                evaluation_guidance="Evaluate ability to break down ambiguous problems. 8+ requires optimal algorithmic solutions with edge-case handling."
            ),
            ScorecardCategory(
                category_name="Communication",
                max_score=10,
                evaluation_guidance="Clear, concise answers. Ability to explain complex concepts simply to non-technical stakeholders."
            ),
            ScorecardCategory(
                category_name="System Design & Architecture",
                max_score=10,
                evaluation_guidance="Understands tradeoffs. Can design for scale, availability, and maintainability."
            ),
            ScorecardCategory(
                category_name="Culture & Behavioral Fit",
                max_score=10,
                evaluation_guidance="Aligns with company values. Handles conflict well. Takes ownership of failures."
            )
        ]
        
        red_flags = [
            "Cannot explain past projects on resume in depth.",
            "Blames team members for past failures.",
            "Focuses entirely on specific tools rather than underlying engineering principles.",
            "Unable to articulate the 'why' behind architectural choices."
        ]
        
        return InterviewScorecard(
            categories=categories,
            total_max_score=50,
            pass_threshold=35,
            strong_hire_threshold=42,
            red_flags_to_watch=red_flags
        )
