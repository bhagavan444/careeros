import logging
from typing import List
from app.schemas.interview_intelligence import SkillHeatmapItem
from app.schemas.recruiter_intelligence import RecruiterIntelligenceResponse

logger = logging.getLogger("skill_heatmap_engine")

class SkillHeatmapEngine:
    @staticmethod
    def generate(ri_response: RecruiterIntelligenceResponse) -> List[SkillHeatmapItem]:
        logger.info("[HEATMAP ENGINE] Generating Candidate Skill Strength Matrix...")
        
        heatmap: List[SkillHeatmapItem] = []
        
        truth_base = ri_response.candidate_fit.technical_fit
        overall_evidence = ri_response.match_analysis.evidence_match_score
        
        for skill in ri_response.jd_verification_matrix.skills:
            base_score = 50 if skill.candidate_claims else 0
            
            if skill.candidate_claims:
                if skill.github_evidence:
                    base_score += 30
                if skill.portfolio_evidence:
                    base_score += 15
                if skill.resume_evidence:
                    base_score += 5
                    
            # Normalize with truth and evidence proxies
            strength = int((base_score * 0.7) + (truth_base * 0.15) + (overall_evidence * 0.15))
            strength = min(max(strength, 0), 100)
            
            heatmap.append(SkillHeatmapItem(
                skill_name=skill.skill_name,
                strength_score=strength
            ))
            
        # Sort by strength descending
        heatmap.sort(key=lambda x: x.strength_score, reverse=True)
        return heatmap
