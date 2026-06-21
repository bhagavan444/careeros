import logging
from typing import List
from collections import Counter
from app.schemas.talent_ranking import TalentPoolAnalytics, RankedCandidate

logger = logging.getLogger("pool_analytics_engine")

class PoolAnalyticsEngine:
    @staticmethod
    def generate(ranked_candidates: List[RankedCandidate]) -> TalentPoolAnalytics:
        logger.info("[ANALYTICS] Generating Talent Pool Analytics...")
        
        if not ranked_candidates:
            return TalentPoolAnalytics(
                average_match_score=0,
                average_truth_score=0,
                average_risk_score=0,
                top_verified_technologies=[],
                top_missing_technologies=[],
                experience_distribution={},
                skill_distribution={}
            )
            
        total = len(ranked_candidates)
        avg_match = sum([rc.intelligence.match_score for rc in ranked_candidates]) // total
        avg_truth = sum([rc.intelligence.truth_score for rc in ranked_candidates]) // total
        avg_risk = sum([rc.intelligence.risk_score for rc in ranked_candidates]) // total
        
        verified_counter = Counter()
        missing_counter = Counter()
        exp_counter = Counter()
        
        for rc in ranked_candidates:
            for skill in rc.intelligence.verified_skills:
                verified_counter[skill] += 1
            for skill in rc.intelligence.missing_critical_skills:
                missing_counter[skill] += 1
                
            exp_level = rc.intelligence.experience_level
            if exp_level:
                exp_counter[exp_level] += 1
                
        # Top 5 Verified
        top_verified = [{"skill": k, "count": v} for k, v in verified_counter.most_common(5)]
        
        # Top 5 Missing
        top_missing = [{"skill": k, "count": v} for k, v in missing_counter.most_common(5)]
        
        # Skill Distribution (Number of skills verified per candidate)
        skill_dist_raw = [len(rc.intelligence.verified_skills) for rc in ranked_candidates]
        skill_dist = {
            "0-5 Skills": len([x for x in skill_dist_raw if x <= 5]),
            "6-10 Skills": len([x for x in skill_dist_raw if 6 <= x <= 10]),
            "11-20 Skills": len([x for x in skill_dist_raw if 11 <= x <= 20]),
            "20+ Skills": len([x for x in skill_dist_raw if x > 20]),
        }
        
        return TalentPoolAnalytics(
            average_match_score=avg_match,
            average_truth_score=avg_truth,
            average_risk_score=avg_risk,
            top_verified_technologies=top_verified,
            top_missing_technologies=top_missing,
            experience_distribution=dict(exp_counter),
            skill_distribution=skill_dist
        )
