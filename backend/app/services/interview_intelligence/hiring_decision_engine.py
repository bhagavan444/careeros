import logging
from typing import Dict, Any
from app.schemas.interview_intelligence import HiringDecision, InterviewOutcome, InterviewOutcomeRequest

logger = logging.getLogger("hiring_decision_engine")

class HiringDecisionEngine:
    @staticmethod
    def generate(outcome: InterviewOutcome, req: InterviewOutcomeRequest) -> HiringDecision:
        logger.info("[DECISION ENGINE] Generating Boardroom Executive Summary...")
        
        # Blend Truth Score, Risk Score, and Outcome
        truth_score = req.truth_score
        risk_score = req.risk_analysis.get("risk_score", 0)
        
        decision = outcome.decision
        confidence = outcome.confidence
        
        # Adjust confidence based on Truth/Risk
        if truth_score < 50:
            confidence -= 15
        if risk_score > 60:
            confidence -= 20
            if decision in ["Strong Hire", "Hire"]:
                decision = "Consider" # Downgrade due to massive external risk
                
        confidence = min(max(confidence, 0), 100)
        
        strengths = []
        if req.technical_skills_score >= 8: strengths.append("Elite Technical Foundation")
        if req.problem_solving_score >= 8: strengths.append("High Problem Solving Dexterity")
        if req.system_design_score >= 8: strengths.append("Strong Architectural Vision")
        if not strengths: strengths.append("Acceptable General Competency")
            
        risks = []
        if req.culture_fit_score <= 5: risks.append("Poor Behavioral / Culture Fit")
        if risk_score > 50: risks.append("High Deterministic Background Risk")
        if not risks: risks.append("No critical risks observed")
            
        action = "Proceed to Offer Phase" if decision in ["Strong Hire", "Hire"] else "Reject and close profile"
        if decision == "Consider":
            action = "Hold for team debrief and comparables review"
            
        summary = f"Based on a final rubric score yielding a '{outcome.decision}' outcome, combined with a background truth score of {truth_score}/100 and risk score of {risk_score}/100, the system recommends to {action.lower()}."
        
        return HiringDecision(
            decision=decision,
            confidence=confidence,
            executive_summary=summary,
            strengths=strengths,
            risks=risks,
            recommended_action=action,
            business_justification=outcome.justification
        )
