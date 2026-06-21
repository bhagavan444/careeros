from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
import uuid

def generate_uuid():
    return str(uuid.uuid4())

class MongoBaseModel(BaseModel):
    id: str = Field(default_factory=generate_uuid, alias="_id")
    created_at: datetime = Field(default_factory=datetime.utcnow)

class CareerMemoryModel(MongoBaseModel):
    user_id: str
    target_role: Optional[str] = None
    identity_score: Optional[int] = None
    strengths: Optional[List[str]] = []
    skill_gaps: Optional[List[str]] = []
    career_goals: Optional[str] = None
    last_synced_at: datetime = Field(default_factory=datetime.utcnow)

class CareerDNAModel(MongoBaseModel):
    user_id: str
    engineering_depth: int
    execution_ability: int
    learning_velocity: int
    communication_strength: int
    leadership_potential: int
    market_competitiveness: str # e.g. "Top 18%"
    hiring_probability: str # e.g. "79%"
    career_maturity: str # e.g. "Senior"

class ResumeModel(MongoBaseModel):
    user_id: str
    title: str = "My Resume"
    content: Dict[str, Any] = {}
    template: str = "professional"
    identity_score: int = 0
    identity_report_id: Optional[str] = None
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ResumeVersionModel(MongoBaseModel):
    resume_id: str
    version_number: int = 1
    content: Dict[str, Any]
    template: str = "professional"
    identity_score_snapshot: Optional[int] = None

class IdentityReportModel(MongoBaseModel):
    user_id: str
    target_role: Optional[str] = None
    score: Optional[int] = None
    category_scores: Optional[Dict[str, Dict[str, Any]]] = None # For Phase C breakdown
    career_maturity: Optional[str] = None
    strengths: Optional[List[str]] = []
    skill_gaps: Optional[List[str]] = []
    recommended_focus: Optional[str] = None
    source: Optional[str] = None

class IdentitySnapshotModel(MongoBaseModel):
    user_id: str
    identity_score: int
    career_dna_score: Optional[int] = None
    resume_score: Optional[int] = None
    github_score: Optional[int] = None
    snapshot_date: datetime = Field(default_factory=datetime.utcnow)

class GeneratedContentModel(MongoBaseModel):
    user_id: str
    content_type: str
    original_input: Optional[str] = None
    generated_text: str

class TimelinePredictionModel(MongoBaseModel):
    user_id: str
    nodes: List[Dict[str, Any]] # e.g. [{month: 6, role: "Senior", prob: 80}]
    
class RecruiterReviewModel(MongoBaseModel):
    user_id: str
    resume_id: Optional[str] = None
    persona: str
    interview_probability: int
    hiring_probability: int
    risk_areas: List[str]
    missing_evidence: List[str]
    recommended_actions: List[str]
    verdict: str

class GithubProfileModel(MongoBaseModel):
    username: str
    user_id: Optional[str] = None
    analytics_payload: Dict[str, Any]
    last_analyzed: datetime = Field(default_factory=datetime.utcnow)

class ResurrectionJobModel(MongoBaseModel):
    user_id: str
    status: str = "pending" # pending, processing, completed, failed
    current_stage: str = "Uploading Resume"
    progress: int = 0
    result_payload: Optional[Dict[str, Any]] = None
    error_message: Optional[str] = None

class UserModel(MongoBaseModel):
    email: str
    hashed_password: str
    full_name: Optional[str] = None
    role: str = "User" # User, Recruiter, Admin
    is_active: bool = True

class JobModel(MongoBaseModel):
    job_id: str
    job_type: str # e.g. "pdf_generation", "resume_parsing"
    status: str = "pending" # pending, running, completed, failed
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    error_message: Optional[str] = None
    result_payload: Optional[Dict[str, Any]] = None

