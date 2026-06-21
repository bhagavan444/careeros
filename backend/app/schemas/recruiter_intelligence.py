from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any

# --- Job Intelligence ---
class JobIntelligence(BaseModel):
    required_skills: List[str] = []
    preferred_skills: List[str] = []
    nice_to_have_skills: List[str] = []
    programming_languages: List[str] = []
    frameworks: List[str] = []
    databases: List[str] = []
    cloud_technologies: List[str] = []
    devops_technologies: List[str] = []
    ai_ml_technologies: List[str] = []
    experience_requirements: str = ""
    education_requirements: str = ""
    certifications: List[str] = []
    soft_skills: List[str] = []

class ExplainabilityTrace(BaseModel):
    formula: str
    evidence_sources: List[str]
    weight_contributions: Dict[str, str]
    confidence_level: int
    deterministic_reasoning: str

class MatchAnalysis(BaseModel):
    overall_match_score: int
    technical_match_score: int
    experience_match_score: int
    evidence_match_score: int
    education_match_score: int
    portfolio_match_score: int
    breakdown: Dict[str, Any]
    explainability: Optional[ExplainabilityTrace] = None

class JDVerificationSkill(BaseModel):
    skill_name: str
    is_required: bool
    candidate_claims: bool
    resume_evidence: bool
    github_evidence: bool
    portfolio_evidence: bool
    linkedin_evidence: bool
    confidence_score: int

class JDVerificationMatrix(BaseModel):
    skills: List[JDVerificationSkill]

class MissingSkill(BaseModel):
    skill_name: str
    impact: str
    reason: str

class SkillGapAnalysis(BaseModel):
    critical_missing: List[MissingSkill]
    moderate_missing: List[MissingSkill]
    minor_missing: List[MissingSkill]

class RecruiterRiskFactor(BaseModel):
    category: str
    description: str
    severity: str
    mitigation: str

class RecruiterRiskAnalysis(BaseModel):
    risk_score: int
    risk_level: str
    factors: List[RecruiterRiskFactor]
    explainability: Optional[ExplainabilityTrace] = None

class CandidateFit(BaseModel):
    technical_fit: int
    startup_fit: int
    enterprise_fit: int
    remote_fit: int
    leadership_potential: int
    platform_engineering_fit: int

class InterviewRound(BaseModel):
    round_name: str
    focus_areas: List[str]
    questions: List[str]
    evaluation_criteria: List[str]
    risk_validation: List[str]

class InterviewBlueprint(BaseModel):
    rounds: List[InterviewRound]

class HiringRecommendation(BaseModel):
    decision: str
    reasoning: str
    confidence_score: int
    explainability: Optional[ExplainabilityTrace] = None

# --- Request/Response ---
class RecruiterIntelligenceRequest(BaseModel):
    candidate_id: str
    job_description: str

class RecruiterIntelligenceResponse(BaseModel):
    job_intelligence: JobIntelligence
    match_analysis: MatchAnalysis
    jd_verification_matrix: JDVerificationMatrix
    skill_gap_analysis: SkillGapAnalysis
    risk_analysis: RecruiterRiskAnalysis
    candidate_fit: CandidateFit
    interview_blueprint: InterviewBlueprint
    hiring_recommendation: HiringRecommendation
    evidence_registry: List[Dict[str, Any]] = []
