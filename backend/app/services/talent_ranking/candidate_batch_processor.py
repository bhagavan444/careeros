import asyncio
import logging
from typing import List, Dict, Any
from app.services.recruiter_intelligence.orchestrator import RecruiterIntelligenceOrchestrator
from app.schemas.talent_ranking import LightweightCandidateIntelligence

logger = logging.getLogger("candidate_batch_processor")

class CandidateBatchProcessor:
    """
    Processes multiple resumes against a single Job Description concurrently,
    protected by an asyncio.Semaphore to prevent LLM API rate limiting.
    """
    
    @staticmethod
    async def process_batch(
        resume_texts: List[str], 
        filenames: List[str],
        job_description: str
    ) -> List[LightweightCandidateIntelligence]:
        
        logger.info(f"[BATCH] Starting execution for {len(resume_texts)} candidates.")
        
        # Concurrency limit: 5 concurrent candidate evaluations
        sem = asyncio.Semaphore(5)
        
        async def process_single(resume_text: str, filename: str) -> LightweightCandidateIntelligence:
            async with sem:
                try:
                    logger.info(f"[BATCH_ITEM] Processing candidate: {filename}")
                    
                    # We pass empty strings for github/linkedin/portfolio in batch mode
                    # Relying strictly on the Resume extraction adapter.
                    res = await RecruiterIntelligenceOrchestrator.analyze_direct(
                        resume_text=resume_text,
                        job_description=job_description,
                        github="",
                        linkedin="",
                        portfolio=""
                    )
                    
                    # Convert full object to lightweight memory object
                    return LightweightCandidateIntelligence(
                        candidate_name=filename.replace(".pdf", "").replace(".docx", ""),
                        match_score=res.match_analysis.overall_match_score,
                        truth_score=res.candidate_fit.technical_fit, # Using technical fit as proxy if truth_score is not passed fully to root
                        evidence_score=res.match_analysis.evidence_match_score,
                        risk_score=res.risk_analysis.risk_score,
                        profile_quality_score=res.match_analysis.technical_match_score,
                        github_intelligence_score=res.match_analysis.portfolio_match_score,
                        verified_skills=[s.skill_name for s in res.jd_verification_matrix.skills if s.candidate_claims],
                        missing_critical_skills=[s.skill_name for s in res.skill_gap_analysis.critical_missing],
                        experience_level=res.match_analysis.breakdown.get("candidate_level", "Unknown"),
                        education_level="Verified" if res.match_analysis.education_match_score > 50 else "Unverified",
                        raw_hiring_recommendation=res.hiring_recommendation.decision
                    )
                except Exception as e:
                    logger.error(f"[BATCH_ITEM] Failed processing {filename}: {e}")
                    # Return a baseline failure object
                    return LightweightCandidateIntelligence(
                        candidate_name=f"{filename} (FAILED)",
                        match_score=0,
                        truth_score=0,
                        evidence_score=0,
                        risk_score=100,
                        profile_quality_score=0,
                        github_intelligence_score=0,
                        verified_skills=[],
                        missing_critical_skills=[],
                        experience_level="Unknown",
                        education_level="Unknown",
                        raw_hiring_recommendation="Error Processing"
                    )

        # Execute all tasks
        tasks = [process_single(text, name) for text, name in zip(resume_texts, filenames)]
        results = await asyncio.gather(*tasks)
        
        logger.info(f"[BATCH] Finished processing {len(results)} candidates.")
        return list(results)
