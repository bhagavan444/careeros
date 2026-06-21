import logging
from typing import Optional

from app.schemas.interview_intelligence import InterviewIntelligenceResponse
from app.services.recruiter_intelligence.orchestrator import RecruiterIntelligenceOrchestrator

from .interview_readiness_engine import InterviewReadinessEngine
from .interview_blueprint_engine import InterviewBlueprintEngine
from .skill_validation_engine import SkillValidationEngine
from .risk_investigation_engine import RiskInvestigationEngine
from .interview_simulation_engine import InterviewSimulationEngine
from .interview_scorecard_engine import InterviewScorecardEngine
from .interview_coverage_engine import InterviewCoverageEngine
from .skill_heatmap_engine import SkillHeatmapEngine

logger = logging.getLogger("interview_orchestrator")

class InterviewIntelligenceOrchestrator:
    """
    Master Orchestrator for the Interview Intelligence Operating System.
    Runs the entire upstream Recruiter Pipeline, then constructs the interview blueprints and LLM probing simulations.
    """

    @staticmethod
    async def generate_strategy(
        resume_text: str,
        job_description: str,
        github: Optional[str] = None,
        linkedin: Optional[str] = None,
        portfolio: Optional[str] = None
    ) -> InterviewIntelligenceResponse:
        logger.info("=== Starting Interview Intelligence OS Pipeline ===")
        
        # 1. Run upstream intelligence
        ri_response = await RecruiterIntelligenceOrchestrator.analyze_direct(
            resume_text=resume_text,
            job_description=job_description,
            github=github,
            linkedin=linkedin,
            portfolio=portfolio
        )
        
        # 2. Readiness Engine (Deterministic)
        readiness = InterviewReadinessEngine.evaluate(ri_response)
        
        # 3. Blueprint Engine (Deterministic)
        blueprint = InterviewBlueprintEngine.generate(ri_response, readiness.readiness_score)
        
        # 4. Scorecard Engine (Deterministic)
        scorecard = InterviewScorecardEngine.generate(ri_response)
        
        # 5. Targeted LLM Engines (Concurrent)
        import asyncio
        skill_val_task = asyncio.create_task(SkillValidationEngine.generate(ri_response))
        risk_inv_task = asyncio.create_task(RiskInvestigationEngine.generate(ri_response))
        
        candidate_level = ri_response.match_analysis.breakdown.get("candidate_level", "Mid-Level")
        sim_task = asyncio.create_task(InterviewSimulationEngine.generate(job_description, candidate_level))
        
        skill_validation_strategy, risk_investigation_strategy, interview_simulation = await asyncio.gather(
            skill_val_task, risk_inv_task, sim_task
        )
        
        # 6. V2 Coverage and Heatmap Engines (Deterministic)
        coverage = InterviewCoverageEngine.calculate(ri_response, skill_validation_strategy, risk_investigation_strategy, interview_simulation)
        heatmap = SkillHeatmapEngine.generate(ri_response)
        
        logger.info("=== Interview Intelligence OS Pipeline Complete ===")
        
        return InterviewIntelligenceResponse(
            readiness=readiness,
            blueprint=blueprint,
            skill_validation_strategy=skill_validation_strategy,
            risk_investigation_strategy=risk_investigation_strategy,
            interview_simulation=interview_simulation,
            scorecard=scorecard,
            coverage=coverage,
            heatmap=heatmap,
            raw_intelligence={
                "truth_score": ri_response.candidate_fit.technical_fit,
                "risk_analysis": ri_response.risk_analysis.dict(),
                "match_analysis": ri_response.match_analysis.dict(),
                "candidate_data": {"evidence": ri_response.evidence_registry}
            },
            audit_summary={"status": "Success", "orchestrator": "Single-Shot V3", "v2_features": True}
        )
