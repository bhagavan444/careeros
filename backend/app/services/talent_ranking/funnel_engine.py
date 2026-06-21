import logging
from typing import List
from app.schemas.talent_ranking import HiringFunnel, RankedCandidate

logger = logging.getLogger("funnel_engine")

class FunnelEngine:
    @staticmethod
    def calculate(ranked_candidates: List[RankedCandidate]) -> HiringFunnel:
        logger.info("[FUNNEL] Calculating Hiring Funnel Metrics...")
        
        total = len(ranked_candidates)
        qualified = len([c for c in ranked_candidates if c.intelligence.match_score >= 50])
        strong_fits = len([c for c in ranked_candidates if c.intelligence.match_score >= 75])
        
        # Interview Ready = Urgent or High priority
        interview_ready = len([c for c in ranked_candidates if c.interview_priority in ["Urgent", "High"]])
        
        # Finalists = Elite or Strong Hire segments
        finalists = len([c for c in ranked_candidates if c.segment in ["Elite Candidate", "Strong Hire"]])
        
        # Rejected
        rejected = len([c for c in ranked_candidates if c.segment == "Reject" or c.interview_priority == "Reject"])
        
        return HiringFunnel(
            total_applicants=total,
            qualified=qualified,
            strong_fits=strong_fits,
            interview_ready=interview_ready,
            finalists=finalists,
            rejected=rejected
        )
