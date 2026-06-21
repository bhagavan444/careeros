import logging
from typing import Optional
from app.services.memory.candidate_store import CandidateStore

logger = logging.getLogger("candidate_aggregator")

class CandidateIntelligenceAggregator:
    """
    Phase 2: Candidate Intelligence Aggregation.
    Fetches the pre-calculated Profile Intelligence from the persistence layer
    so the Recruiter Engine can deterministically evaluate it against the JD.
    """

    @staticmethod
    def fetch_candidate(candidate_id: str) -> Optional[dict]:
        """
        Retrieves the Profile Intelligence Response dictionary.
        This contains Truth Score, Verified Skills, Risks, etc.
        """
        logger.info(f"[CANDIDATE_AGGREGATOR] Fetching intelligence for requested candidate ID: '{candidate_id}'")
        data = CandidateStore.get(candidate_id)
        logger.info(f"[CANDIDATE_AGGREGATOR] Successfully retrieved Candidate Intelligence payload for '{candidate_id}'.")
        return data
