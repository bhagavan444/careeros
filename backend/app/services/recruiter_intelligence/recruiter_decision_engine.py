import logging
from app.schemas.recruiter_intelligence import (
    MatchAnalysis, 
    RecruiterRiskAnalysis, 
    SkillGapAnalysis, 
    CandidateFit,
    HiringRecommendation,
    ExplainabilityTrace
)

logger = logging.getLogger("recruiter_decision_engine")

class RecruiterDecisionEngine:
    """
    Phase 9: Hiring Recommendation Engine.
    Produces a final deterministic "Hire / No Hire" decision based strictly on the aggregated metrics.
    No LLM guessing involved.
    """

    @staticmethod
    def evaluate(candidate_data: dict, match: MatchAnalysis, risks: RecruiterRiskAnalysis, gaps: SkillGapAnalysis, fit: CandidateFit, persona: str = "Enterprise Hiring Manager") -> HiringRecommendation:
        logger.info("[RECRUITER_DECISION] Computing Final Hiring Recommendation...")
        
        # Base scores
        m_score = match.overall_match_score
        r_score = risks.risk_score
        e_score = match.evidence_match_score
        t_score = match.technical_match_score
        
        # Calculate overall confidence in our decision
        # High evidence density means we are very confident in our yes/no.
        confidence = e_score
        # Adjust thresholds based on Persona
        persona_strictness = 0
        if persona == "Startup CTO":
            m_score += (fit.startup_fit - 50) * 0.2 # Heavily weight startup fit
            r_score -= 10 # More tolerant of risk
        elif persona == "FAANG Recruiter":
            persona_strictness = 10 # Requires higher match
        
        reasoning_lines = []
        reasoning_lines.append(f"Evaluated from the perspective of a {persona}.")
        
        # Deterministic Decision Matrix
        if m_score >= (85 + persona_strictness) and r_score <= 20 and len(gaps.critical_missing) == 0:
            decision = "Strong Hire"
            reasoning_lines.append(f"Exceptional alignment with JD (Match: {m_score}%).")
            reasoning_lines.append(f"Zero critical skill gaps and very low risk ({r_score}%).")
        
        elif m_score >= (70 + persona_strictness) and r_score <= 40 and len(gaps.critical_missing) <= 1:
            decision = "Hire"
            reasoning_lines.append(f"Solid alignment with JD (Match: {m_score}%).")
            if len(gaps.critical_missing) == 1:
                reasoning_lines.append(f"Only missing 1 critical skill ({gaps.critical_missing[0].skill_name}) which can be learned.")
            else:
                reasoning_lines.append("No critical skill gaps detected.")
        
        elif m_score >= 50 and r_score <= 60 and fit.startup_fit >= 70:
            decision = "Consider"
            reasoning_lines.append(f"Moderate match (Match: {m_score}%) but strong environment fit.")
            reasoning_lines.append(f"Candidate possesses high learning potential and evidence density, despite missing specific JD requirements.")
            
        elif m_score >= 40:
            decision = "Borderline"
            reasoning_lines.append(f"Weak alignment with JD (Match: {m_score}%).")
            reasoning_lines.append(f"High risk factors present ({r_score}%). Proceed with caution.")
            
        else:
            decision = "Pass"
            reasoning_lines.append(f"Poor alignment with JD (Match: {m_score}%).")
            reasoning_lines.append(f"Candidate lacks {len(gaps.critical_missing)} critical skills and carries excessive risk ({r_score}%).")
            
        # Add a note if evidence is very low
        if e_score < 40:
            reasoning_lines.append("Note: Recommendation confidence is low due to severe lack of physical evidence.")
            
        trace = ExplainabilityTrace(
            formula="Decision Matrix Threshold evaluation (Match >= X, Risk <= Y, Critical Gaps <= Z)",
            evidence_sources=["MatchEngine", "RiskEngine", "SkillGapEngine"],
            weight_contributions={
                "Match Threshold Met": "Yes" if m_score >= 70 else "No",
                "Risk Threshold Met": "Yes" if r_score <= 40 else "No",
                "Critical Gaps Met": "Yes" if len(gaps.critical_missing) <= 1 else "No"
            },
            confidence_level=confidence,
            deterministic_reasoning=f"Triggered Rules:\n✓ Match Score: {m_score}\n✓ Risk Score: {r_score}\nFinal Decision: {decision}"
        )
            
        return HiringRecommendation(
            decision=decision,
            reasoning=" ".join(reasoning_lines),
            confidence_score=int(confidence),
            explainability=trace
        )
