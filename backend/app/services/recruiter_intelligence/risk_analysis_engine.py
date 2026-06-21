import logging
from app.schemas.recruiter_intelligence import (
    JobIntelligence, 
    MatchAnalysis, 
    SkillGapAnalysis, 
    RecruiterRiskAnalysis, 
    RecruiterRiskFactor,
    ExplainabilityTrace
)

logger = logging.getLogger("recruiter_risk_engine")

class RecruiterRiskEngine:
    """
    Phase 6: Recruiter Risk Engine.
    Combines the Candidate's Profile Risks with the JD-specific Skill Gaps and Match Analysis
    to produce a tailored Hiring Risk assessment.
    """

    @staticmethod
    def analyze(candidate_data: dict, match: MatchAnalysis, gaps: SkillGapAnalysis) -> RecruiterRiskAnalysis:
        logger.info("[RECRUITER_RISK] Analyzing Hiring Risks...")
        
        factors = []
        base_risk_score = 0
        
        # 1. Inherit from Candidate Profile Intelligence
        # Profile Intelligence already flagged core contradictions (e.g. claims Senior but no evidence)
        profile_risk = candidate_data.get("risk_analysis", {})
        if isinstance(profile_risk, dict):
            for flag in profile_risk.get("flags", []):
                factors.append(RecruiterRiskFactor(
                    category="Profile Contradiction",
                    description=flag.get("description", "Unknown contradiction"),
                    severity=flag.get("severity", "Medium"),
                    mitigation="Ask candidate to provide specific physical evidence for this claim during behavioral interview."
                ))
                sev = flag.get("severity", "").lower()
                if sev == "high": base_risk_score += 30
                elif sev == "medium": base_risk_score += 15
                elif sev == "low": base_risk_score += 5
                
        # 2. Critical Skill Gaps
        if gaps.critical_missing:
            names = [s.skill_name for s in gaps.critical_missing]
            factors.append(RecruiterRiskFactor(
                category="Critical Skills Missing",
                description=f"Candidate lacks evidence for {len(names)} required skills: {', '.join(names)}",
                severity="High",
                mitigation="Assign a take-home technical test specifically covering these technologies."
            ))
            base_risk_score += (len(names) * 15)
            
        # 3. Match Score Risks
        if match.overall_match_score < 60:
            factors.append(RecruiterRiskFactor(
                category="Poor Job Alignment",
                description=f"Candidate overall match score is only {match.overall_match_score}%.",
                severity="High",
                mitigation="Strongly reconsider moving forward unless candidate has explicit internal referral."
            ))
            base_risk_score += 25
            
        # 4. Evidence Deficit
        if match.evidence_match_score < 50:
            factors.append(RecruiterRiskFactor(
                category="Low Evidence Density",
                description="Less than 50% of the candidate's claims have external verification.",
                severity="Medium",
                mitigation="Require live coding or whiteboard architecture session."
            ))
            base_risk_score += 20
            
        # Cap Score at 100
        final_score = min(base_risk_score, 100)
        
        # Risk Level
        if final_score >= 70:
            level = "High"
        elif final_score >= 40:
            level = "Medium"
        else:
            level = "Low"
            
        # If no factors, add a generic low risk factor
        if not factors:
            factors.append(RecruiterRiskFactor(
                category="Baseline",
                description="Candidate profile aligns closely with JD and contains sufficient evidence.",
                severity="Low",
                mitigation="Proceed with standard interview loop."
            ))

        trace = ExplainabilityTrace(
            formula="(Critical Gaps × 15) + (Poor Alignment × 25) + (Low Evidence × 20) + (Profile Flags dynamic)",
            evidence_sources=["Truth Engine", "Verification Matrix"],
            weight_contributions={
                "Profile Contradictions": f"{base_risk_score - (len(gaps.critical_missing)*15 if gaps.critical_missing else 0) - (25 if match.overall_match_score < 60 else 0) - (20 if match.evidence_match_score < 50 else 0)} pts",
                "Critical Gaps": f"{len(gaps.critical_missing)*15 if gaps.critical_missing else 0} pts",
                "Job Alignment": f"{25 if match.overall_match_score < 60 else 0} pts",
                "Evidence Deficit": f"{20 if match.evidence_match_score < 50 else 0} pts"
            },
            confidence_level=match.evidence_match_score,
            deterministic_reasoning="\n".join([f.description for f in factors])
        )

        return RecruiterRiskAnalysis(
            risk_score=final_score,
            risk_level=level,
            factors=factors,
            explainability=trace
        )
