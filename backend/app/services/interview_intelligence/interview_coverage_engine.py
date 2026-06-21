import logging
from typing import List, Set
from app.schemas.interview_intelligence import InterviewCoverage, ValidationQuestion, RiskProbingStrategy, InterviewSimulation
from app.schemas.recruiter_intelligence import RecruiterIntelligenceResponse

logger = logging.getLogger("interview_coverage_engine")

class InterviewCoverageEngine:
    @staticmethod
    def calculate(
        ri_response: RecruiterIntelligenceResponse, 
        validation_strategy: List[ValidationQuestion],
        risk_strategy: List[RiskProbingStrategy],
        simulations: List[InterviewSimulation]
    ) -> InterviewCoverage:
        logger.info("[COVERAGE ENGINE] Calculating JD requirement coverage...")
        
        jd_skills = [skill.skill_name for skill in ri_response.jd_verification_matrix.skills if skill.is_required]
        if not jd_skills:
            # Fallback if JD didn't explicitly map required skills
            jd_skills = [skill.skill_name for skill in ri_response.jd_verification_matrix.skills]
            
        covered_skills: Set[str] = set()
        
        # 1. Check validation strategy
        for vs in validation_strategy:
            covered_skills.add(vs.skill.lower())
            
        # 2. Check risk strategy
        risk_text = " ".join([r.risk_factor.lower() for r in risk_strategy])
        
        # 3. Check simulations
        sim_text = " ".join([q.question.lower() + " ".join(q.expected_strong_answer_themes).lower() for sim in simulations for q in sim.questions])
        
        # Cross-reference
        final_covered = []
        uncovered = []
        for skill in jd_skills:
            if skill.lower() in covered_skills or skill.lower() in risk_text or skill.lower() in sim_text:
                final_covered.append(skill)
            else:
                uncovered.append(skill)
                
        coverage_score = 100
        if jd_skills:
            coverage_score = int((len(final_covered) / len(jd_skills)) * 100)
            
        # Identify gaps
        gaps = []
        if coverage_score < 100:
            gaps.append(f"Missing direct technical evaluation for: {', '.join(uncovered[:3])}")
        if coverage_score < 70:
            gaps.append("The generated blueprint risks ignoring significant portions of the Job Description.")
            
        return InterviewCoverage(
            coverage_score=coverage_score,
            covered_skills=final_covered,
            uncovered_skills=uncovered,
            coverage_gaps=gaps
        )
