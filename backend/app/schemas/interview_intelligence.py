from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any

class InterviewReadiness(BaseModel):
    readiness_score: int
    confidence: str # High, Medium, Low
    strengths: List[str]
    weaknesses: List[str]
    interview_difficulty: str # Advanced, Intermediate, Beginner, Reject

class InterviewRound(BaseModel):
    round_number: int
    round_name: str # e.g. HR Screening, Technical Screening, Coding Assessment, System Design
    focus_areas: List[str]
    duration_minutes: int
    suggested_interviewer: str # e.g. HR, Senior Engineer, Hiring Manager

class InterviewBlueprint(BaseModel):
    rounds: List[InterviewRound]
    total_duration_hours: float

class ValidationQuestion(BaseModel):
    skill: str
    verification_needed: bool
    questions: List[str]

class RiskProbingStrategy(BaseModel):
    risk_factor: str
    probing_questions: List[str]
    red_flag_signals: List[str]

class InterviewSimulationQuestion(BaseModel):
    question: str
    difficulty_classification: str
    expected_strong_answer_themes: List[str]
    expected_weak_answer_signals: List[str]
    evaluation_criteria: str
    red_flag_responses: List[str]

class InterviewSimulation(BaseModel):
    category: str # e.g., Technical, System Design, Behavioral
    questions: List[InterviewSimulationQuestion]

class ScorecardCategory(BaseModel):
    category_name: str
    max_score: int
    evaluation_guidance: str

class InterviewScorecard(BaseModel):
    categories: List[ScorecardCategory]
    total_max_score: int
    pass_threshold: int
    strong_hire_threshold: int
    red_flags_to_watch: List[str]

class InterviewCoverage(BaseModel):
    coverage_score: int
    covered_skills: List[str]
    uncovered_skills: List[str]
    coverage_gaps: List[str]

class SkillHeatmapItem(BaseModel):
    skill_name: str
    strength_score: int

class InterviewIntelligenceResponse(BaseModel):
    readiness: InterviewReadiness
    blueprint: InterviewBlueprint
    skill_validation_strategy: List[ValidationQuestion]
    risk_investigation_strategy: List[RiskProbingStrategy]
    interview_simulation: List[InterviewSimulation]
    scorecard: InterviewScorecard
    coverage: InterviewCoverage
    heatmap: List[SkillHeatmapItem]
    raw_intelligence: Dict[str, Any]
    audit_summary: Dict[str, Any]

class InterviewOutcomeRequest(BaseModel):
    technical_skills_score: int
    problem_solving_score: int
    communication_score: int
    system_design_score: int
    culture_fit_score: int
    candidate_data: Dict[str, Any]
    match_analysis: Dict[str, Any]
    risk_analysis: Dict[str, Any]
    truth_score: int

class InterviewOutcome(BaseModel):
    decision: str
    confidence: int
    offer_readiness: str
    ramp_up_prediction: str
    justification: str

class HiringDecision(BaseModel):
    decision: str
    confidence: int
    executive_summary: str
    strengths: List[str]
    risks: List[str]
    recommended_action: str
    business_justification: str

class InterviewOutcomeResponse(BaseModel):
    outcome: InterviewOutcome
    hiring_decision: HiringDecision

