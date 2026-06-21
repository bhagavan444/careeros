import logging
from typing import Optional

from app.schemas.recruiter_intelligence import RecruiterIntelligenceResponse
from app.services.recruiter_intelligence.job_parser import JobParserEngine
from app.services.recruiter_intelligence.match_engine import MatchEngine
from app.services.recruiter_intelligence.verification_matrix_engine import JDVerificationMatrixEngine
from app.services.recruiter_intelligence.skill_gap_engine import SkillGapEngine
from app.services.recruiter_intelligence.risk_analysis_engine import RecruiterRiskEngine
from app.services.recruiter_intelligence.candidate_fit_engine import CandidateFitEngine
from app.services.recruiter_intelligence.interview_blueprint_engine import InterviewBlueprintEngine
from app.services.recruiter_intelligence.recruiter_decision_engine import RecruiterDecisionEngine

from app.schemas.profile_intelligence import ProfileIntelligenceRequest
from app.services.profile_intelligence.orchestrator import ProfileIntelligenceOrchestrator

logger = logging.getLogger("recruiter_orchestrator")

class RecruiterIntelligenceOrchestrator:
    """
    The main traffic controller for the Recruiter Intelligence Platform V2.
    Runs Profile Intelligence dynamically, then pipes the result through the Recruiter Intelligence engines.
    """

    @staticmethod
    async def analyze_direct(
        resume_text: str,
        job_description: str,
        github: Optional[str] = None,
        linkedin: Optional[str] = None,
        portfolio: Optional[str] = None,
        persona: str = "Enterprise Hiring Manager"
    ) -> RecruiterIntelligenceResponse:
        logger.info("=== Starting V2 Direct Recruiter Intelligence ===")
        
        # Phase 1: Job Intelligence (Parse JD text using Gemini)
        job_intel_dict = JobParserEngine.extract_job_intelligence(job_description)
        from app.schemas.recruiter_intelligence import JobIntelligence
        job_intel = JobIntelligence(**job_intel_dict)
        
        # Phase 2: Run Profile Intelligence Generation Pipeline
        # We wrap this in a request object expected by ProfileIntelligenceOrchestrator
        profile_req = ProfileIntelligenceRequest(
            resume=resume_text,
            github=github,
            linkedin=linkedin,
            portfolio=portfolio
        )
        
        profile_res_obj = await ProfileIntelligenceOrchestrator.analyze(profile_req)
        candidate_data = profile_res_obj.dict()
            
        # Phase 3: Match Engine
        match_analysis = MatchEngine.calculate_match(job_intel, candidate_data)
        
        # Phase 4: JD Verification Matrix
        jd_matrix = JDVerificationMatrixEngine.generate(job_intel, candidate_data)
        
        # Phase 5: Skill Gap Analysis
        skill_gaps = SkillGapEngine.analyze(job_intel, jd_matrix)
        
        # Phase 6: Risk Analysis
        risk_analysis = RecruiterRiskEngine.analyze(candidate_data, match_analysis, skill_gaps)
        
        # Phase 7: Candidate Fit
        candidate_fit = CandidateFitEngine.calculate(candidate_data, match_analysis)
        
        # Phase 8: Interview Blueprint
        blueprint = InterviewBlueprintEngine.generate(skill_gaps, risk_analysis, match_analysis)
        
        # Phase 9: Hiring Recommendation
        recommendation = RecruiterDecisionEngine.evaluate(candidate_data, match_analysis, risk_analysis, skill_gaps, candidate_fit, persona)
        
        evidence_registry = candidate_data.get("evidence_registry", {})
        
        logger.info(f"=== Recruiter Intelligence Complete. Final Decision: {recommendation.decision} ===")
        
        return RecruiterIntelligenceResponse(
            job_intelligence=job_intel,
            match_analysis=match_analysis,
            jd_verification_matrix=jd_matrix,
            skill_gap_analysis=skill_gaps,
            risk_analysis=risk_analysis,
            candidate_fit=candidate_fit,
            interview_blueprint=blueprint,
            hiring_recommendation=recommendation,
            evidence_registry=evidence_registry
        )
