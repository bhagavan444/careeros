import logging
from typing import List
from app.schemas.talent_ranking import RankedCandidate

logger = logging.getLogger("interview_priority_engine")

class InterviewPriorityEngine:
    """
    Determines exactly who should be interviewed first based on ranking, segment, and risk.
    """
    
    @staticmethod
    def assign_priority(ranked_candidates: List[RankedCandidate]) -> List[RankedCandidate]:
        logger.info("[INTERVIEW_QUEUE] Assigning Interview Priority...")
        
        for rc in ranked_candidates:
            if rc.segment == "Elite Candidate":
                rc.interview_priority = "Urgent"
            elif rc.segment == "Strong Hire":
                rc.interview_priority = "High"
            elif rc.segment == "Hire":
                rc.interview_priority = "Standard"
            elif rc.segment in ["Consider", "Borderline"]:
                rc.interview_priority = "Low"
            else:
                rc.interview_priority = "Reject"
                
        return ranked_candidates
