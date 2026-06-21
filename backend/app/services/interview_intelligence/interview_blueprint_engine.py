import logging
from typing import List
from app.schemas.interview_intelligence import InterviewBlueprint, InterviewRound
from app.schemas.recruiter_intelligence import RecruiterIntelligenceResponse

logger = logging.getLogger("interview_blueprint_engine")

class InterviewBlueprintEngine:
    @staticmethod
    def generate(ri_response: RecruiterIntelligenceResponse, readiness_score: int) -> InterviewBlueprint:
        logger.info("[BLUEPRINT ENGINE] Generating Dynamic Interview Timeline...")
        
        rounds: List[InterviewRound] = []
        candidate_level = ri_response.match_analysis.breakdown.get("candidate_level", "Mid-Level")
        
        # Round 1: HR Screening (Always)
        rounds.append(InterviewRound(
            round_number=1,
            round_name="HR Screening & Culture Fit",
            focus_areas=["Compensation expectations", "Timeline", "High-level culture alignment"],
            duration_minutes=30,
            suggested_interviewer="Talent Acquisition"
        ))
        
        # Round 2: Technical Screening
        tech_focus = "General API and Framework knowledge"
        if "Senior" in candidate_level or "Staff" in candidate_level:
            tech_focus = "Deep architectural patterns and past project post-mortems"
            
        rounds.append(InterviewRound(
            round_number=2,
            round_name="Technical Deep Dive",
            focus_areas=[tech_focus, "Validation of resume claims"],
            duration_minutes=60,
            suggested_interviewer="Senior Engineer"
        ))
        
        # Round 3: Optional Coding Assessment based on GitHub evidence
        portfolio_match = ri_response.match_analysis.portfolio_match_score
        if portfolio_match < 50:
            rounds.append(InterviewRound(
                round_number=len(rounds) + 1,
                round_name="Live Coding Assessment",
                focus_areas=["Algorithm optimization", "Live debugging", "Code cleanliness"],
                duration_minutes=60,
                suggested_interviewer="Staff Engineer"
            ))
            
        # Round 4: System Design (For Senior+)
        if "Senior" in candidate_level or "Staff" in candidate_level or "Lead" in candidate_level:
            rounds.append(InterviewRound(
                round_number=len(rounds) + 1,
                round_name="System Design & Architecture",
                focus_areas=["Scalability", "Database choice", "Microservices vs Monolith"],
                duration_minutes=60,
                suggested_interviewer="Principal Engineer or Architect"
            ))
            
        # Final Round: Hiring Manager
        rounds.append(InterviewRound(
            round_number=len(rounds) + 1,
            round_name="Hiring Manager Review",
            focus_areas=["Team fit", "Long-term career goals", "Conflict resolution"],
            duration_minutes=45,
            suggested_interviewer="Engineering Manager"
        ))
        
        total_duration = sum(r.duration_minutes for r in rounds) / 60.0
        
        return InterviewBlueprint(
            rounds=rounds,
            total_duration_hours=total_duration
        )
