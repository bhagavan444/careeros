import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)

class TruthEngine:
    """
    Deterministic scoring engine for Profile Intelligence.
    Calculates final Truth Score entirely based on the Verification Matrix.
    """

    @staticmethod
    def calculate_score(matrix: Dict[str, Any], candidate_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Calculates Truth Score, Evidence Score, and Verification Score.
        """
        verified = matrix.get("verified_skills", [])
        partially = matrix.get("partially_verified_skills", [])
        unverified = matrix.get("unverified_skills", [])
        
        total_skills = len(verified) + len(partially) + len(unverified)
        
        if total_skills == 0:
            return {
                "score": 0,
                "evidence_coverage": 0,
                "verification_score": 0,
                "confidence_level": "Low",
                "source_coverage": {
                    "resume": False,
                    "github": False,
                    "linkedin": False,
                    "portfolio": False
                }
            }

        # 1. Verification Score (Averages the confidence across all claimed skills)
        total_confidence = sum([s.get("confidence_score", 0) for s in verified]) + \
                           sum([s.get("confidence_score", 0) for s in partially]) + \
                           sum([s.get("confidence_score", 0) for s in unverified])
                           
        verification_score = int(total_confidence / total_skills)

        # 2. Evidence Score (Ratio of skills that have ANY evidence outside the resume)
        skills_with_external_evidence = 0
        for s in (verified + partially + unverified):
            # If it's present in Github, Portfolio, or Linkedin
            if s.get("github_present") or s.get("portfolio_present") or s.get("linkedin_present"):
                skills_with_external_evidence += 1
                
        evidence_score = int((skills_with_external_evidence / total_skills) * 100)

        # 3. Final Truth Score (Weighted Average)
        # 60% Verification (Strict Confidence Mapping), 40% Evidence Penetration
        truth_score = int((verification_score * 0.6) + (evidence_score * 0.4))
        
        # 4. Source Coverage Flags
        resume_data = candidate_data.get("resume", {})
        github_data = candidate_data.get("github", {})
        portfolio_data = candidate_data.get("portfolio", {})
        linkedin_data = candidate_data.get("linkedin", {})
        
        source_coverage = {
            "resume": len(resume_data.get("skills", [])) > 0,
            "github": len(github_data.get("verified_skills", [])) > 0,
            "portfolio": portfolio_data.get("status") == "success" and len(portfolio_data.get("verified_skills", [])) > 0,
            "linkedin": linkedin_data.get("status") == "success" and len(linkedin_data.get("verified_skills", [])) > 0
        }
        
        confidence_level = "Low"
        if truth_score >= 80:
            confidence_level = "High"
        elif truth_score >= 50:
            confidence_level = "Medium"

        return {
            "score": truth_score,
            "evidence_coverage": evidence_score,
            "verification_score": verification_score,
            "confidence_level": confidence_level,
            "source_coverage": source_coverage
        }
