import logging
from app.schemas.interview_intelligence import InterviewReadiness
from app.schemas.recruiter_intelligence import RecruiterIntelligenceResponse

logger = logging.getLogger("interview_readiness_engine")

class InterviewReadinessEngine:
    @staticmethod
    def evaluate(ri_response: RecruiterIntelligenceResponse) -> InterviewReadiness:
        logger.info("[READINESS ENGINE] Calculating Deterministic Interview Readiness...")
        
        match = ri_response.match_analysis.overall_match_score
        truth = ri_response.candidate_fit.technical_fit # Proxy for truth
        risk = ri_response.risk_analysis.risk_score
        evidence = ri_response.match_analysis.evidence_match_score
        
        # Readiness formula
        readiness_score = int((match * 0.4) + (truth * 0.25) + (evidence * 0.2) + ((100 - risk) * 0.15))
        readiness_score = min(max(readiness_score, 0), 100)
        
        if readiness_score >= 85:
            confidence = "High"
            difficulty = "Advanced"
        elif readiness_score >= 65:
            confidence = "Medium"
            difficulty = "Intermediate"
        elif readiness_score >= 45:
            confidence = "Low"
            difficulty = "Beginner"
        else:
            confidence = "Very Low"
            difficulty = "Reject"
            
        strengths = [s.skill_name for s in ri_response.jd_verification_matrix.skills if s.candidate_claims and s.github_evidence][:3]
        weaknesses = [s.skill_name for s in ri_response.skill_gap_analysis.critical_missing][:3]
        
        if not strengths:
            strengths = ["General alignment with preferred skills"]
        if not weaknesses:
            weaknesses = ["No critical weaknesses identified deterministically"]
            
        return InterviewReadiness(
            readiness_score=readiness_score,
            confidence=confidence,
            strengths=strengths,
            weaknesses=weaknesses,
            interview_difficulty=difficulty
        )
