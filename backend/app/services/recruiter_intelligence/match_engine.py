import logging
from app.schemas.recruiter_intelligence import JobIntelligence, MatchAnalysis, ExplainabilityTrace

logger = logging.getLogger("match_engine")

class MatchEngine:
    """
    Phase 3: Deterministic Candidate-Job Matching Engine.
    Calculates technical, experience, evidence, portfolio, and education matches
    based purely on verified data (No AI guessing).
    """

    @staticmethod
    def calculate_match(job: JobIntelligence, candidate_data: dict) -> MatchAnalysis:
        logger.info("[MATCH_ENGINE] Calculating Candidate-Job Match Scores...")
        
        # 1. Extract Candidate Verified Skills
        matrix = candidate_data.get("verification_matrix", {})
        verified_skills = set()
        partial_skills = set()
        
        if isinstance(matrix, dict):
            # Depends on how VerificationMatrix is serialized. Usually a dict with 'verified', 'partially_verified'
            verified_list = matrix.get("verified", [])
            for s in verified_list:
                # Skill names
                name = s.get("skill_name", "").lower() if isinstance(s, dict) else str(s).lower()
                verified_skills.add(name)
                
            partial_list = matrix.get("partially_verified", [])
            for s in partial_list:
                name = s.get("skill_name", "").lower() if isinstance(s, dict) else str(s).lower()
                partial_skills.add(name)
                
        # 2. Technical Match Score
        # Required skills are heavily weighted.
        tech_score = 0
        required = [s.lower() for s in job.required_skills]
        preferred = [s.lower() for s in job.preferred_skills]
        
        req_points = 0
        for req in required:
            if req in verified_skills:
                req_points += 1.0
            elif req in partial_skills:
                req_points += 0.5
                
        tech_score_req = (req_points / len(required) * 100) if required else 100
        
        pref_points = 0
        for pref in preferred:
            if pref in verified_skills:
                pref_points += 1.0
            elif pref in partial_skills:
                pref_points += 0.5
                
        tech_score_pref = (pref_points / len(preferred) * 100) if preferred else 100
        
        # 80% weight to required, 20% to preferred
        technical_match_score = int((tech_score_req * 0.8) + (tech_score_pref * 0.2))

        # 3. Evidence Match Score
        # Direct pull from Truth Engine
        truth_score = candidate_data.get("truth_score", {})
        evidence_coverage = truth_score.get("evidence_coverage", 0)
        evidence_match_score = int(evidence_coverage)

        # 4. Portfolio / GitHub Match Score
        # Based on physical signals in candidate_data
        coverage = candidate_data.get("coverage_metrics", {})
        has_github = coverage.get("has_github", False)
        has_portfolio = coverage.get("has_portfolio", False)
        
        port_score = 0
        if has_github: port_score += 60
        if has_portfolio: port_score += 40
        portfolio_match_score = port_score

        # 5. Experience Match
        # Using Career Positioning as a proxy since exact YOE math requires deep resume parsing
        career_pos = candidate_data.get("career_positioning", {})
        level = career_pos.get("estimated_level", "").lower()
        
        jd_exp = job.experience_requirements.lower()
        exp_score = 75 # Default neutral
        
        if "senior" in jd_exp or "staff" in jd_exp or "principal" in jd_exp or "lead" in jd_exp:
            if "senior" in level or "staff" in level or "lead" in level:
                exp_score = 100
            elif "mid" in level:
                exp_score = 60
            else:
                exp_score = 30
        elif "mid" in jd_exp:
            if "mid" in level or "senior" in level:
                exp_score = 100
            else:
                exp_score = 50
        elif "junior" in jd_exp or "entry" in jd_exp:
            exp_score = 100 # Anyone can do entry theoretically

        experience_match_score = exp_score

        # 6. Education Match (Stubbed until full degree extraction is built)
        education_match_score = 100 

        # 7. Overall Match Score
        # Weighted Average
        weights = {
            "technical": 0.45,
            "evidence": 0.20,
            "experience": 0.20,
            "portfolio": 0.10,
            "education": 0.05
        }
        
        overall = (
            (technical_match_score * weights["technical"]) +
            (evidence_match_score * weights["evidence"]) +
            (experience_match_score * weights["experience"]) +
            (portfolio_match_score * weights["portfolio"]) +
            (education_match_score * weights["education"])
        )
        
        overall_match_score = int(overall)
        
        # 8. Explainability Trace
        trace = ExplainabilityTrace(
            formula="(Technical Match × 0.45) + (Evidence Strength × 0.20) + (Experience Alignment × 0.20) + (Portfolio × 0.10) + (Education × 0.05)",
            evidence_sources=["Resume", "GitHub", "Portfolio"],
            weight_contributions={
                "Technical Match": f"{int(technical_match_score * weights['technical'])}/45",
                "Evidence Strength": f"{int(evidence_match_score * weights['evidence'])}/20",
                "Experience Alignment": f"{int(experience_match_score * weights['experience'])}/20",
                "Portfolio Presence": f"{int(portfolio_match_score * weights['portfolio'])}/10",
                "Education Match": f"{int(education_match_score * weights['education'])}/5"
            },
            confidence_level=evidence_match_score,
            deterministic_reasoning=f"Matched {req_points}/{len(required)} required skills. Experience aligns at a {exp_score}% factor."
        )
        
        return MatchAnalysis(
            overall_match_score=overall_match_score,
            technical_match_score=technical_match_score,
            experience_match_score=experience_match_score,
            evidence_match_score=evidence_match_score,
            education_match_score=education_match_score,
            portfolio_match_score=portfolio_match_score,
            breakdown={
                "required_skills_met": f"{req_points}/{len(required)}",
                "preferred_skills_met": f"{pref_points}/{len(preferred)}",
                "candidate_level": level
            },
            explainability=trace
        )
