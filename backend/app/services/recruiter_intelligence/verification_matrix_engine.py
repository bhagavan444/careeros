import logging
from app.schemas.recruiter_intelligence import JobIntelligence, JDVerificationMatrix, JDVerificationSkill

logger = logging.getLogger("jd_verification_matrix_engine")

class JDVerificationMatrixEngine:
    """
    Phase 4: JD Verification Matrix.
    Maps every skill required by the Job Description to the Candidate's physical evidence registry.
    """

    @staticmethod
    def generate(job: JobIntelligence, candidate_data: dict) -> JDVerificationMatrix:
        logger.info("[JD_VERIFICATION] Generating Candidate vs JD Verification Matrix...")
        
        skills_output = []
        
        # We need to map skills from JD to what's in the candidate's existing Verification Matrix
        existing_matrix = candidate_data.get("verification_matrix", {})
        
        # Create a lookup dictionary for fast access
        candidate_skills_lookup = {}
        
        if isinstance(existing_matrix, dict):
            for status in ["verified", "partially_verified", "unverified"]:
                for s in existing_matrix.get(status, []):
                    name = s.get("skill_name", "").lower() if isinstance(s, dict) else str(s).lower()
                    candidate_skills_lookup[name] = s if isinstance(s, dict) else {"skill_name": s}
                    candidate_skills_lookup[name]["_status"] = status
        
        # Process Required and Preferred Skills
        all_job_skills = []
        for s in job.required_skills:
            all_job_skills.append((s, True))
        for s in job.preferred_skills:
            all_job_skills.append((s, False))
            
        for skill_name, is_required in all_job_skills:
            normalized_name = skill_name.lower()
            
            # Check if candidate has it
            candidate_skill_obj = candidate_skills_lookup.get(normalized_name)
            
            if candidate_skill_obj:
                # Candidate has some footprint of this skill
                sources = candidate_skill_obj.get("sources", [])
                
                resume_ev = "resume" in sources
                github_ev = "github" in sources
                portfolio_ev = "portfolio" in sources
                linkedin_ev = "linkedin" in sources
                
                # Confidence Calculation based on source volume
                evidence_count = sum([resume_ev, github_ev, portfolio_ev, linkedin_ev])
                if evidence_count >= 3:
                    confidence = 100
                elif evidence_count == 2:
                    confidence = 75
                elif evidence_count == 1:
                    confidence = 50
                else:
                    confidence = 0
                    
                skills_output.append(JDVerificationSkill(
                    skill_name=skill_name,
                    is_required=is_required,
                    candidate_claims=True, # They either claimed it or we found it
                    resume_evidence=resume_ev,
                    github_evidence=github_ev,
                    portfolio_evidence=portfolio_ev,
                    linkedin_evidence=linkedin_ev,
                    confidence_score=confidence
                ))
            else:
                # Candidate completely lacks this skill
                skills_output.append(JDVerificationSkill(
                    skill_name=skill_name,
                    is_required=is_required,
                    candidate_claims=False,
                    resume_evidence=False,
                    github_evidence=False,
                    portfolio_evidence=False,
                    linkedin_evidence=False,
                    confidence_score=0
                ))
                
        return JDVerificationMatrix(skills=skills_output)
