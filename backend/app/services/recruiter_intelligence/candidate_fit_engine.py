import logging
from app.schemas.recruiter_intelligence import CandidateFit, MatchAnalysis

logger = logging.getLogger("candidate_fit_engine")

class CandidateFitEngine:
    """
    Phase 7: Candidate Fit Engine.
    Uses MatchAnalysis and Candidate Profile Intelligence to deterministically compute
    various environment and cultural fit vectors.
    """

    @staticmethod
    def calculate(candidate_data: dict, match: MatchAnalysis) -> CandidateFit:
        logger.info("[CANDIDATE_FIT] Computing Environment Fit Vectors...")
        
        # Pull profile readiness signals
        market = candidate_data.get("market_readiness", {})
        readiness_score = market.get("market_readiness_score", 50)
        
        # 1. Technical Fit is directly tied to the Match Engine
        tech_fit = match.technical_match_score
        
        # 2. Startup Fit
        # Startups value broad evidence (GitHub/Portfolio) over strict matching
        # High evidence coverage + good readiness = high startup fit
        startup_base = match.portfolio_match_score * 0.4 + match.evidence_match_score * 0.4 + readiness_score * 0.2
        startup_fit = int(startup_base)
        
        # 3. Enterprise Fit
        # Enterprises value strict technical match and seniority
        enterprise_base = match.technical_match_score * 0.5 + match.experience_match_score * 0.3 + readiness_score * 0.2
        enterprise_fit = int(enterprise_base)
        
        # 4. Remote Fit
        # Remote requires strong footprint and documentation.
        coverage = candidate_data.get("coverage_metrics", {})
        has_gh = coverage.get("has_github", False)
        remote_base = match.evidence_match_score * 0.5 + (50 if has_gh else 0)
        remote_fit = min(int(remote_base), 100)
        
        # 5. Leadership Potential
        # Bound to Career Positioning
        career_pos = candidate_data.get("career_positioning", {})
        level = career_pos.get("estimated_level", "").lower()
        if "senior" in level or "staff" in level or "lead" in level:
            leadership = 85
        elif "mid" in level:
            leadership = 60
        else:
            leadership = 30
            
        # 6. Platform Engineering Fit
        # Tied to DevOps/Cloud skills verified
        matrix = candidate_data.get("verification_matrix", {})
        verified_skills = []
        if isinstance(matrix, dict):
            for s in matrix.get("verified", []):
                verified_skills.append(s.get("skill_name", "").lower() if isinstance(s, dict) else str(s).lower())
                
        platform_skills = ["aws", "kubernetes", "docker", "gcp", "azure", "terraform", "ci/cd", "linux"]
        platform_matches = len([s for s in platform_skills if s in verified_skills])
        
        if platform_matches >= 4:
            platform_fit = 95
        elif platform_matches >= 2:
            platform_fit = 70
        elif platform_matches == 1:
            platform_fit = 40
        else:
            platform_fit = 10
            
        return CandidateFit(
            technical_fit=tech_fit,
            startup_fit=startup_fit,
            enterprise_fit=enterprise_fit,
            remote_fit=remote_fit,
            leadership_potential=leadership,
            platform_engineering_fit=platform_fit
        )
