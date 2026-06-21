from typing import Dict, Any, List
from app.schemas.profile_intelligence import DecisionCenter, TruthScoreDetails, ConsistencyAnalysis, RiskAnalysis, CareerPositioning

class DecisionEngine:
    @staticmethod
    def evaluate(
        truth_score: TruthScoreDetails,
        consistency: ConsistencyAnalysis,
        risk_analysis: RiskAnalysis,
        career_positioning: CareerPositioning
    ) -> DecisionCenter:
        """
        Deterministically evaluates the final hiring recommendation based on aggregated intelligence.
        """
        # Collect Strengths
        strengths = []
        if truth_score.score >= 80:
            strengths.append(f"High Truth Score ({truth_score.score}) with strong evidence coverage.")
        if consistency.status == "High Consistency":
            strengths.append("High cross-platform profile consistency.")
        if career_positioning.level in ["Senior Candidate", "Staff Candidate"]:
            strengths.append(f"Demonstrates {career_positioning.level} level maturity and complexity.")
        
        # Collect Weaknesses
        weaknesses = [risk.description for risk in risk_analysis.critical_risks + risk_analysis.moderate_risks]
        
        # Interview Focus Areas
        interview_focus_areas = []
        for risk in risk_analysis.moderate_risks + risk_analysis.minor_risks:
            interview_focus_areas.append(f"Probe deeply into: {risk.risk}")
            
        if len(weaknesses) == 0:
            weaknesses.append("No significant weaknesses detected in evidence.")
            
        if len(interview_focus_areas) == 0:
            interview_focus_areas.append("Standard technical interview.")
            
        # Determine Recommendation
        confidence = truth_score.confidence_level
        
        if truth_score.score >= 85 and len(risk_analysis.critical_risks) == 0 and consistency.status == "High Consistency":
            recommendation = "Strong Hire"
            justification = "Candidate has overwhelmingly verified claims, high consistency, and zero critical risks."
        elif truth_score.score >= 70 and len(risk_analysis.critical_risks) == 0:
            recommendation = "Hire"
            justification = "Candidate has solid verified claims and manageable risks."
        elif truth_score.score >= 50 and len(risk_analysis.critical_risks) <= 1:
            recommendation = "Consider"
            justification = "Candidate has partially verified claims but carries some risk. Requires rigorous interview assessment."
        elif truth_score.score >= 30:
            recommendation = "Needs Development"
            justification = "Evidence suggests the candidate lacks necessary maturity or verification for immediate hiring."
            confidence = "Medium"
        else:
            recommendation = "Pass"
            justification = "Severe lack of evidence, major contradictions, or critically low truth score."
            confidence = "High" # High confidence that it's a pass
            
        return DecisionCenter(
            recommendation=recommendation,
            confidence_level=confidence,
            strengths=strengths[:5], # Top 5
            weaknesses=weaknesses[:5], # Top 5
            hiring_justification=justification,
            interview_focus_areas=interview_focus_areas[:5]
        )
