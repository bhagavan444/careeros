from typing import Dict, Any
from app.schemas.profile_intelligence import RecruiterReadiness, ReadinessMetric, VerificationMatrix, TruthScoreDetails

class RecruiterReadinessEngine:
    @staticmethod
    def evaluate(
        candidate_data: Dict[str, Any],
        matrix: VerificationMatrix,
        truth_score: TruthScoreDetails,
        github_analytics: Dict[str, Any]
    ) -> RecruiterReadiness:
        """
        Calculates recruiter confidence metrics.
        """
        # Technical Readiness
        tech_score = int(min(100, len(matrix.verified_skills) * 10 + len(matrix.partially_verified_skills) * 5))
        tech_explanation = f"Based on {len(matrix.verified_skills)} verified and {len(matrix.partially_verified_skills)} partially verified skills."
        
        # Project Readiness
        repos = candidate_data.get("github", {}).get("repos", [])
        project_count = len(repos)
        proj_score = min(100, project_count * 15)
        proj_explanation = f"Candidate has {project_count} public repositories."
        
        # Portfolio Readiness
        portfolio_url = candidate_data.get("portfolio", {}).get("url")
        port_score = 100 if portfolio_url else 0
        port_explanation = "Portfolio is present and accessible." if portfolio_url else "No portfolio provided."
        
        # Professional Presence
        has_linkedin = candidate_data.get("linkedin", {}).get("url") is not None
        has_github = candidate_data.get("github", {}).get("username") is not None
        pres_score = (50 if has_linkedin else 0) + (50 if has_github else 0)
        pres_explanation = f"Presence detected on: {', '.join([s for s, has in [('LinkedIn', has_linkedin), ('GitHub', has_github)] if has])}."
        
        # Documentation Readiness
        doc_score = github_analytics.get("code_quality", {}).get("documentation_score", 50)
        doc_explanation = f"Based on GitHub repository READMEs and code comments."
        
        overall = int((tech_score + proj_score + port_score + pres_score + doc_score) / 5)
        
        return RecruiterReadiness(
            technical_readiness=ReadinessMetric(score=tech_score, explanation=tech_explanation),
            project_readiness=ReadinessMetric(score=proj_score, explanation=proj_explanation),
            portfolio_readiness=ReadinessMetric(score=port_score, explanation=port_explanation),
            professional_presence=ReadinessMetric(score=pres_score, explanation=pres_explanation),
            documentation_readiness=ReadinessMetric(score=doc_score, explanation=doc_explanation),
            overall_score=overall
        )
