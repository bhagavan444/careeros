import logging
from typing import Dict, Any

from app.schemas.profile_intelligence import (
    ProfileIntelligenceRequest,
    ProfileIntelligenceResponse
)

# Adapters
from .resume_adapter import ResumeAdapter
from .github_adapter import GitHubAdapter
from .portfolio_adapter import PortfolioAdapter
from .linkedin_adapter import LinkedInAdapter

# Engines
from .verification_matrix import VerificationMatrixEngine
from .truth_engine import TruthEngine
from .consistency_engine import ConsistencyEngine
from .career_positioning_engine import CareerPositioningEngine
from .recruiter_readiness_engine import RecruiterReadinessEngine
from .market_readiness_engine import MarketReadinessEngine
from .interview_intelligence_engine import InterviewIntelligenceEngine
from .risk_engine import RiskEngine
from .decision_engine import DecisionEngine

# Audit & Explainability Engines
from .evidence_registry import EvidenceRegistry
from .score_explainer import ScoreExplainer
from .production_readiness import ProductionReadinessEngine

# Using existing GitHubAnalyzer for deeper metrics if needed
from app.services.github.analyzer import GitHubAnalyzer
from app.services.github.client import GitHubClient

logger = logging.getLogger("profile_intelligence_orchestrator")

class ProfileIntelligenceOrchestrator:
    @staticmethod
    async def analyze(request: ProfileIntelligenceRequest) -> ProfileIntelligenceResponse:
        """
        Master orchestrator for the Candidate Truth Infrastructure.
        Runs all adapters concurrently/sequentially, then pipes the deterministic data to the verification engines.
        """
        
        # 1. Run Data Adapters
        warnings = []
        
        logger.info("[INGESTION] Extracting Resume Data...")
        try:
            resume_data = ResumeAdapter.extract(request.resume)
        except Exception as e:
            warnings.append(f"Resume extraction failed: {e}")
            resume_data = {}
            
        logger.info("[INGESTION] Extracting GitHub Data...")
        try:
            github_data = await GitHubAdapter.extract(request.github)
            if not github_data.get("verified_skills"):
                warnings.append("GitHub returned no verified skills.")
        except Exception as e:
            warnings.append(f"GitHub extraction failed: {e}")
            github_data = {}
            
        logger.info("[INGESTION] Extracting Portfolio Data...")
        try:
            portfolio_data = await PortfolioAdapter.extract(request.portfolio)
            if portfolio_data.get("status") == "no_evidence":
                warnings.append("Portfolio analysis yielded no evidence or was blocked.")
        except Exception as e:
            warnings.append(f"Portfolio extraction failed: {e}")
            portfolio_data = {}
            
        logger.info("[INGESTION] Extracting LinkedIn Data...")
        try:
            linkedin_data = await LinkedInAdapter.extract(request.linkedin)
        except Exception as e:
            warnings.append(f"LinkedIn extraction failed: {e}")
            linkedin_data = {}
        
        # Group raw data for legacy engines if needed
        candidate_data = {
            "resume": resume_data,
            "github": github_data,
            "portfolio": portfolio_data,
            "linkedin": linkedin_data
        }
        
        # Additional deep analytics for GitHub (complexity, maturity)
        github_analytics = {"complexity_score": 0, "engineering_maturity": 0}
        try:
            if request.github:
                # Mock or lightweight implementation for now, using dummy data for speed
                # In production, this would call `GitHubAnalyzer.calculate_engineering_maturity`
                github_analytics["complexity_score"] = min(len(github_data.get("repositories", [])) * 5, 100)
                github_analytics["engineering_maturity"] = min(len(github_data.get("verified_skills", [])) * 10, 100)
        except Exception as e:
            logger.warning(f"Failed to calculate deep GitHub analytics: {e}")

        # 2. Run Deterministic Engines
        
        logger.info("[VERIFICATION] Generating Verification Matrix...")
        matrix_dict = VerificationMatrixEngine.generate(
            resume_data=resume_data,
            github_data=github_data,
            portfolio_data=portfolio_data,
            linkedin_data=linkedin_data
        )
        
        from app.schemas.profile_intelligence import VerificationMatrix
        matrix_obj = VerificationMatrix(**matrix_dict)
        
        logger.info("[TRUTH ENGINE] Calculating Score...")
        truth_score_dict = TruthEngine.calculate_score(matrix_dict, candidate_data)
        
        from app.schemas.profile_intelligence import TruthScoreDetails
        truth_score_obj = TruthScoreDetails(**truth_score_dict)
        
        logger.info("[CONSISTENCY] Analyzing cross-platform signals...")
        # Legacy engines expect Pydantic object
        consistency = ConsistencyEngine.analyze(candidate_data, matrix_obj)
        
        logger.info("[POSITIONING] Evaluating Career Position...")
        career_positioning = CareerPositioningEngine.evaluate(
            candidate_data=candidate_data,
            truth_score=truth_score_obj,
            matrix=matrix_obj,
            engineering_maturity=github_analytics["engineering_maturity"],
            project_complexity=github_analytics["complexity_score"]
        )
        
        logger.info("[READINESS] Evaluating Recruiter and Market Readiness...")
        recruiter_readiness = RecruiterReadinessEngine.evaluate(
            candidate_data=candidate_data,
            matrix=matrix_obj,
            truth_score=truth_score_obj,
            github_analytics=github_analytics
        )
        
        market_readiness = MarketReadinessEngine.evaluate(
            candidate_data=candidate_data,
            matrix=matrix_obj,
            career_positioning=career_positioning
        )
        
        logger.info("[INTELLIGENCE] Generating Interview Intelligence...")
        interview_intelligence = InterviewIntelligenceEngine.generate(
            matrix=matrix_obj,
            career_positioning=career_positioning
        )
        
        logger.info("[RISK] Analyzing Risk...")
        risk_analysis = RiskEngine.analyze(
            candidate_data=candidate_data,
            matrix=matrix_obj,
            consistency=consistency,
            github_analytics=github_analytics
        )
        
        logger.info("[DECISION] Compiling Decision Center...")
        decision_center = DecisionEngine.evaluate(
            truth_score=truth_score_obj,
            consistency=consistency,
            risk_analysis=risk_analysis,
            career_positioning=career_positioning
        )
        
        logger.info("[AUDIT] Generating Evidence Registry & Explanations...")
        evidence_registry = EvidenceRegistry.compile_registry(matrix_dict)
        truth_score_dict["score_reasoning"] = ScoreExplainer.generate_reasoning(truth_score_dict, matrix_dict)
        
        # Need to rebuild the truth_score_obj to include the new score_reasoning
        truth_score_obj = TruthScoreDetails(**truth_score_dict)
        
        coverage_metrics = ProductionReadinessEngine.evaluate(matrix_dict, truth_score_dict)
        
        audit_summary = {
            "status": "Healthy" if not warnings else "Completed with Warnings",
            "warnings": warnings
        }
        
        logger.info("[RESPONSE GENERATED] Pipeline execution successful.")
        
        # 3. Construct Final Schema
        final_response = ProfileIntelligenceResponse(
            truth_score=truth_score_obj,
            verification_matrix=matrix_obj,
            evidence_registry=evidence_registry,
            consistency_analysis=consistency,
            career_positioning=career_positioning,
            recruiter_readiness=recruiter_readiness,
            market_readiness=market_readiness,
            interview_intelligence=interview_intelligence,
            risk_analysis=risk_analysis,
            decision_center=decision_center,
            coverage_metrics=coverage_metrics,
            audit_summary=audit_summary
        )
        
        # 4. Save to persistence layer for Recruiter Intelligence to consume
        candidate_id = request.github.strip().lower() if request.github else "anonymous_candidate"
        try:
            from app.services.memory.candidate_store import CandidateStore
            CandidateStore.save(candidate_id, final_response.dict())
        except Exception as e:
            logger.error(f"Failed to persist candidate intelligence: {e}")
            
        return final_response
