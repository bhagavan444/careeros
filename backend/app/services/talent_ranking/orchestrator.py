import logging
from typing import List
from .candidate_batch_processor import CandidateBatchProcessor
from .ranking_engine import RankingEngine
from .segmentation_engine import SegmentationEngine
from .pool_analytics_engine import PoolAnalyticsEngine
from .funnel_engine import FunnelEngine
from .interview_priority_engine import InterviewPriorityEngine
from app.schemas.talent_ranking import TalentIntelligenceResponse

logger = logging.getLogger("talent_intelligence_orchestrator")

class TalentIntelligenceOrchestrator:
    """
    Master Orchestrator for the Talent Intelligence OS.
    Executes the entire batch of resumes and returns a Boardroom-grade Command Center payload.
    """
    
    @staticmethod
    async def analyze_batch(resume_texts: List[str], filenames: List[str], job_description: str) -> TalentIntelligenceResponse:
        logger.info("[TALENT_OS] Commencing Batch Talent Processing...")
        
        # 1. Process Batch (Concurrently)
        candidates = await CandidateBatchProcessor.process_batch(resume_texts, filenames, job_description)
        
        # 2. Ranking
        ranked_candidates = RankingEngine.rank_candidates(candidates)
        
        # 3. Segmentation
        ranked_candidates = SegmentationEngine.segment(ranked_candidates)
        
        # 4. Interview Priority
        ranked_candidates = InterviewPriorityEngine.assign_priority(ranked_candidates)
        
        # 5. Pool Analytics
        pool_analytics = PoolAnalyticsEngine.generate(ranked_candidates)
        
        # 6. Funnel
        hiring_funnel = FunnelEngine.calculate(ranked_candidates)
        
        logger.info("[TALENT_OS] Talent Intelligence Pipeline Completed.")
        
        return TalentIntelligenceResponse(
            job_description_summary="Extracted JD parameters driving this batch analysis.", # simplified for payload size
            rankings=ranked_candidates,
            pool_analytics=pool_analytics,
            hiring_funnel=hiring_funnel,
            audit_summary={"status": "Success", "total_processed": len(candidates)}
        )
