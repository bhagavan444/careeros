import logging
from app.schemas.interview_intelligence import InterviewOutcome, InterviewOutcomeRequest

logger = logging.getLogger("interview_outcome_engine")

class InterviewOutcomeEngine:
    @staticmethod
    def evaluate(request: InterviewOutcomeRequest) -> InterviewOutcome:
        logger.info("[OUTCOME ENGINE] Converting interviewer scores into deterministic outcome...")
        
        total_score = (
            request.technical_skills_score +
            request.problem_solving_score +
            request.communication_score +
            request.system_design_score +
            request.culture_fit_score
        )
        
        if total_score >= 45:
            decision = "Strong Hire"
            confidence = 95
            offer_readiness = "Immediate - Fast Track"
            ramp_up = "< 2 Weeks"
            justification = "Candidate demonstrates elite proficiency across all core rubric dimensions."
        elif total_score >= 40:
            decision = "Hire"
            confidence = 85
            offer_readiness = "Ready"
            ramp_up = "1 Month"
            justification = "Candidate meets all technical and behavioral requirements with high fidelity."
        elif total_score >= 30:
            decision = "Consider"
            confidence = 65
            offer_readiness = "Needs Final Review"
            ramp_up = "1-3 Months"
            justification = "Candidate is viable but showed minor gaps in specific rubric areas."
        elif total_score >= 20:
            decision = "Borderline"
            confidence = 40
            offer_readiness = "Not Recommended"
            ramp_up = "3-6 Months"
            justification = "Candidate struggled in multiple areas. Significant ramp-up required."
        else:
            decision = "Reject"
            confidence = 99
            offer_readiness = "Do Not Hire"
            ramp_up = "N/A"
            justification = "Candidate failed to meet baseline technical and cultural thresholds."
            
        return InterviewOutcome(
            decision=decision,
            confidence=confidence,
            offer_readiness=offer_readiness,
            ramp_up_prediction=ramp_up,
            justification=justification
        )
