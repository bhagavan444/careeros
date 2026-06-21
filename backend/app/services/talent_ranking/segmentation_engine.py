import logging
from typing import List
from app.schemas.talent_ranking import RankedCandidate

logger = logging.getLogger("segmentation_engine")

class SegmentationEngine:
    """
    Categorizes candidates into strict segments based on their raw Match and Risk metrics.
    """
    
    @staticmethod
    def segment(ranked_candidates: List[RankedCandidate]) -> List[RankedCandidate]:
        logger.info("[SEGMENTATION] Categorizing candidates...")
        
        for rc in ranked_candidates:
            match = rc.intelligence.match_score
            risk = rc.intelligence.risk_score
            
            if match >= 90 and risk <= 10:
                rc.segment = "Elite Candidate"
            elif match >= 85 and risk <= 20:
                rc.segment = "Strong Hire"
            elif match >= 75 and risk <= 30:
                rc.segment = "Hire"
            elif match >= 60:
                rc.segment = "Consider"
            elif match >= 50:
                rc.segment = "Borderline"
            else:
                rc.segment = "Reject"
                
        return ranked_candidates
