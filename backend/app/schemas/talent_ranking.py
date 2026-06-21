from pydantic import BaseModel
from typing import List, Dict, Optional, Any
from .recruiter_intelligence import ExplainabilityTrace

class LightweightCandidateIntelligence(BaseModel):
    """
    Stored in memory during batch processing. 
    Strips out raw resume text to save RAM when processing 500+ candidates.
    """
    candidate_name: str
    match_score: int
    truth_score: int
    evidence_score: int
    risk_score: int
    profile_quality_score: int
    github_intelligence_score: int
    verified_skills: List[str]
    missing_critical_skills: List[str]
    experience_level: str
    education_level: str
    raw_hiring_recommendation: str

class RankedCandidate(BaseModel):
    rank: int
    candidate_name: str
    final_talent_score: int
    segment: str # Elite, Strong Hire, Hire, Consider, Borderline, Reject
    interview_priority: str # Urgent, High, Standard, Low, Reject
    intelligence: LightweightCandidateIntelligence
    explainability: ExplainabilityTrace

class TalentPoolAnalytics(BaseModel):
    average_match_score: int
    average_truth_score: int
    average_risk_score: int
    top_verified_technologies: List[Dict[str, Any]] # e.g. [{"skill": "React", "count": 45}]
    top_missing_technologies: List[Dict[str, Any]]
    experience_distribution: Dict[str, int]
    skill_distribution: Dict[str, int]

class HiringFunnel(BaseModel):
    total_applicants: int
    qualified: int       # Match > 50
    strong_fits: int     # Match > 75
    interview_ready: int # High/Urgent Priority
    finalists: int       # Elite / Strong Hire
    rejected: int        # Pass / Reject

class TalentIntelligenceResponse(BaseModel):
    job_description_summary: str
    rankings: List[RankedCandidate]
    pool_analytics: TalentPoolAnalytics
    hiring_funnel: HiringFunnel
    audit_summary: Dict[str, Any]
