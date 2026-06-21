import logging
from app.schemas.recruiter_intelligence import (
    SkillGapAnalysis, 
    RecruiterRiskAnalysis, 
    InterviewBlueprint, 
    InterviewRound,
    MatchAnalysis
)

logger = logging.getLogger("interview_blueprint_engine")

class InterviewBlueprintEngine:
    """
    Phase 8: Interview Blueprint Engine.
    Generates deterministic interview plans tailored to the candidate's specific
    skill gaps and risk factors identified during the Recruiter Intelligence scan.
    """

    @staticmethod
    def generate(gaps: SkillGapAnalysis, risks: RecruiterRiskAnalysis, match: MatchAnalysis) -> InterviewBlueprint:
        logger.info("[INTERVIEW_BLUEPRINT] Generating Recruiter Interview Plan...")
        
        rounds = []
        
        # Pull specific flags to build questions
        critical_skills = [s.skill_name for s in gaps.critical_missing]
        moderate_skills = [s.skill_name for s in gaps.moderate_missing]
        risk_flags = [r.description for r in risks.factors if r.severity in ["High", "Medium"]]
        
        # 1. Round 1 - Screening (Recruiter)
        screening_focus = ["Career Trajectory", "Compensation & Logistics"]
        screening_questions = ["What is your target compensation?", "Why are you looking to leave your current role?"]
        if match.evidence_match_score < 60:
            screening_focus.append("Evidence Verification")
            screening_questions.append("Can you point us to any public code or architecture diagrams you've built recently?")
        
        rounds.append(InterviewRound(
            round_name="Round 1 - Recruiter Screen",
            focus_areas=screening_focus,
            questions=screening_questions,
            evaluation_criteria=["Communication skills", "Alignment on logistics", "Basic truth-verification"],
            risk_validation=[r.mitigation for r in risks.factors if r.category == "Profile Contradiction"]
        ))
        
        # 2. Round 2 - Technical Deep Dive (Engineering Panel)
        tech_focus = ["Core Competency Verification"]
        tech_questions = ["Describe a complex bug you recently solved."]
        
        if critical_skills:
            tech_focus.append(f"Gap Assessment: {', '.join(critical_skills[:3])}")
            tech_questions.append(f"How would you approach learning or implementing {critical_skills[0]} if required on day 1?")
            
        rounds.append(InterviewRound(
            round_name="Round 2 - Technical Deep Dive",
            focus_areas=tech_focus,
            questions=tech_questions,
            evaluation_criteria=["Code quality", "Problem-solving methodology", "Ability to learn missing skills"],
            risk_validation=[r.mitigation for r in risks.factors if r.category == "Critical Skills Missing"]
        ))
        
        # 3. Round 3 - System Design (Architect / Staff)
        sys_focus = ["Scalability", "Architecture"]
        sys_questions = ["Design a distributed rate limiter.", "How do you handle database migrations with zero downtime?"]
        if moderate_skills:
            sys_focus.append(f"Ecosystem Knowledge: {', '.join(moderate_skills[:3])}")
            
        rounds.append(InterviewRound(
            round_name="Round 3 - System Design",
            focus_areas=sys_focus,
            questions=sys_questions,
            evaluation_criteria=["Trade-off analysis", "Scalability foresight", "Component decoupling"],
            risk_validation=[]
        ))
        
        # 4. Round 4 - Behavioral (Hiring Manager)
        beh_focus = ["Cultural Alignment", "Ownership"]
        beh_questions = ["Tell me about a time you disagreed with an architectural decision.", "Describe a project that failed and what you learned."]
        
        rounds.append(InterviewRound(
            round_name="Round 4 - Behavioral & Leadership",
            focus_areas=beh_focus,
            questions=beh_questions,
            evaluation_criteria=["Ownership", "Conflict resolution", "Mentorship capacity"],
            risk_validation=risk_flags
        ))
        
        return InterviewBlueprint(rounds=rounds)
