import logging
from app.schemas.recruiter_intelligence import JobIntelligence, JDVerificationMatrix, SkillGapAnalysis, MissingSkill

logger = logging.getLogger("skill_gap_engine")

class SkillGapEngine:
    """
    Phase 5: Skill Gap Analysis Engine.
    Evaluates the Verification Matrix to determine Critical, Moderate, and Minor gaps.
    """

    @staticmethod
    def analyze(job: JobIntelligence, matrix: JDVerificationMatrix) -> SkillGapAnalysis:
        logger.info("[SKILL_GAP] Running Skill Gap Analysis...")
        
        critical = []
        moderate = []
        minor = []
        
        # 1. Identify what skills the candidate actually has (confidence > 0 means some evidence or claim)
        # We will be strict: If confidence == 0, it's missing.
        verified_map = { s.skill_name.lower(): s for s in matrix.skills if s.confidence_score > 0 }
        
        # 2. Critical = Required Skills Missing
        for req in job.required_skills:
            if req.lower() not in verified_map:
                critical.append(MissingSkill(
                    skill_name=req,
                    impact="High",
                    reason="Explicitly required by Job Description but no evidence found in candidate profile."
                ))
                
        # 3. Moderate = Preferred Skills Missing
        for pref in job.preferred_skills:
            if pref.lower() not in verified_map:
                moderate.append(MissingSkill(
                    skill_name=pref,
                    impact="Medium",
                    reason="Listed as a preferred qualification but missing from candidate evidence."
                ))
                
        # 4. Minor = Nice to Have Missing
        for nice in job.nice_to_have_skills:
            if nice.lower() not in verified_map:
                minor.append(MissingSkill(
                    skill_name=nice,
                    impact="Low",
                    reason="Bonus skill not found in candidate profile."
                ))
                
        return SkillGapAnalysis(
            critical_missing=critical,
            moderate_missing=moderate,
            minor_missing=minor
        )
