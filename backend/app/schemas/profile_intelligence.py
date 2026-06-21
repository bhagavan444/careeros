from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any

class ProfileIntelligenceRequest(BaseModel):
    resume: Optional[str] = None
    github: Optional[str] = None
    linkedin: Optional[str] = None
    portfolio: Optional[str] = None

# --- Truth Engine ---
class SourceCoverage(BaseModel):
    resume: bool = False
    github: bool = False
    linkedin: bool = False
    portfolio: bool = False

class TruthScoreDetails(BaseModel):
    score: int
    evidence_coverage: int
    verification_score: int
    confidence_level: str # High, Medium, Low
    source_coverage: SourceCoverage
    score_reasoning: str = ""

# --- Evidence Registry ---
class EvidenceRecord(BaseModel):
    skill: str
    source: str
    evidence_type: str
    repository: str
    file: str
    description: str
    confidence: int

# --- Verification Matrix ---
class EvidenceItem(BaseModel):
    source: str # e.g. "Resume", "GitHub package.json"
    description: str

class SkillVerification(BaseModel):
    skill: str
    resume_present: bool = False
    github_present: bool = False
    linkedin_present: bool = False
    portfolio_present: bool = False
    confidence_score: int
    evidence: List[EvidenceItem]

class VerificationMatrix(BaseModel):
    verified_skills: List[SkillVerification]
    partially_verified_skills: List[SkillVerification]
    unverified_skills: List[SkillVerification]

# --- Consistency Analysis ---
class Contradiction(BaseModel):
    claim: str
    conflict: str
    severity: str # High, Medium, Low

class ConsistencyAnalysis(BaseModel):
    consistency_score: int
    status: str # High Consistency, Consistency Warning
    verified_claims: List[str]
    unverified_claims: List[str]
    contradictions: List[Contradiction]

# --- Career Positioning ---
class CareerPositioning(BaseModel):
    level: str # Student, Junior Candidate, Junior+, Mid-Level Candidate, Senior Candidate, Staff Candidate
    justification: str
    engineering_maturity_score: Optional[int] = None
    project_complexity_score: Optional[int] = None

# --- Readiness ---
class ReadinessMetric(BaseModel):
    score: int
    explanation: str

class RecruiterReadiness(BaseModel):
    technical_readiness: ReadinessMetric
    project_readiness: ReadinessMetric
    portfolio_readiness: ReadinessMetric
    professional_presence: ReadinessMetric
    documentation_readiness: ReadinessMetric
    overall_score: int

class MarketReadiness(BaseModel):
    startup_readiness: ReadinessMetric
    enterprise_readiness: ReadinessMetric
    remote_readiness: ReadinessMetric
    ai_engineering_readiness: ReadinessMetric
    product_engineering_readiness: ReadinessMetric

# --- Interview Intelligence ---
class InterviewIntelligence(BaseModel):
    difficulty: str # Beginner, Intermediate, Advanced, Senior
    likely_topics: Dict[str, List[str]] # e.g. {"Frontend": ["React", "State Management"]}
    suggested_technical_questions: List[str]
    suggested_system_design_questions: List[str]

# --- Risk Analysis ---
class RiskItem(BaseModel):
    risk: str
    description: str

class RiskAnalysis(BaseModel):
    critical_risks: List[RiskItem]
    moderate_risks: List[RiskItem]
    minor_risks: List[RiskItem]

# --- Decision Center ---
class DecisionCenter(BaseModel):
    recommendation: str # Strong Hire, Hire, Consider, Needs Development, Pass
    confidence_level: str # High, Medium, Low
    strengths: List[str]
    weaknesses: List[str]
    hiring_justification: str
    interview_focus_areas: List[str]
    # Phase H: Recruiter Mode Preparation
    match_score: Optional[int] = None
    missing_skills: Optional[List[str]] = []

# --- Production Readiness ---
class CoverageMetrics(BaseModel):
    reliability_score: int
    coverage_score: int
    evidence_density_score: int
    verification_strength_score: int

class AuditSummary(BaseModel):
    status: str
    warnings: List[str]

# --- Main Payload ---
class ProfileIntelligenceResponse(BaseModel):
    truth_score: TruthScoreDetails
    verification_matrix: VerificationMatrix
    evidence_registry: List[EvidenceRecord]
    consistency_analysis: ConsistencyAnalysis
    career_positioning: CareerPositioning
    recruiter_readiness: RecruiterReadiness
    market_readiness: MarketReadiness
    interview_intelligence: InterviewIntelligence
    risk_analysis: RiskAnalysis
    decision_center: DecisionCenter
    coverage_metrics: CoverageMetrics
    audit_summary: AuditSummary
