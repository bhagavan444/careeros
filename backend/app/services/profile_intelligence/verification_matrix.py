import logging
from typing import Dict, Any, List

logger = logging.getLogger(__name__)

class VerificationMatrixEngine:
    """
    Core Pathora Engine for Profile Intelligence.
    Consolidates data across the 4 deterministic adapters and generates confidence scores.
    """

    @staticmethod
    def generate(resume_data: Dict[str, Any], 
                 github_data: Dict[str, Any], 
                 portfolio_data: Dict[str, Any], 
                 linkedin_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Builds the Verification Matrix based on 4-source truth tables.
        """
        
        # 1. Aggregate all unique normalized skills
        all_skills = set()
        
        resume_skills = set(resume_data.get("skills", []))
        github_skills = set(github_data.get("verified_skills", []))
        portfolio_skills = set(portfolio_data.get("verified_skills", []))
        linkedin_skills = set(linkedin_data.get("verified_skills", []))
        
        all_skills.update(resume_skills)
        all_skills.update(github_skills)
        all_skills.update(portfolio_skills)
        all_skills.update(linkedin_skills)
        
        # 2. Compile Evidence Registry
        evidence_registry = {}
        for ev in github_data.get("evidence", []):
            evidence_registry.setdefault(ev["skill"], []).append({"source": "GitHub", "description": ev["description"]})
            
        for ev in portfolio_data.get("evidence", []):
            evidence_registry.setdefault(ev["skill"], []).append({"source": "Portfolio", "description": ev["description"]})
            
        for ev in linkedin_data.get("evidence", []):
            evidence_registry.setdefault(ev["skill"], []).append({"source": "LinkedIn", "description": ev["description"]})
            
        # Add Resume implicit evidence
        for skill in resume_skills:
            evidence_registry.setdefault(skill, []).append({"source": "Resume", "description": "Claimed on resume text"})

        # 3. Build Matrix Rows
        verified_skills = []
        partially_verified = []
        unverified = []

        for skill in sorted(list(all_skills)):
            r_val = skill in resume_skills
            g_val = skill in github_skills
            p_val = skill in portfolio_skills
            l_val = skill in linkedin_skills
            
            # Calculate source coverage count
            sources_count = sum([r_val, g_val, p_val, l_val])
            
            # Deterministic Rules Engine
            if sources_count >= 4:
                confidence = 100
            elif sources_count == 3:
                confidence = 90
            elif sources_count == 2:
                confidence = 75
            elif sources_count == 1:
                confidence = 50
            else:
                confidence = 0

            row = {
                "skill": skill,
                "resume_present": r_val,
                "github_present": g_val,
                "portfolio_present": p_val,
                "linkedin_present": l_val,
                "confidence_score": confidence,
                "evidence": evidence_registry.get(skill, [])
            }

            if confidence >= 90:
                verified_skills.append(row)
            elif confidence >= 50:
                partially_verified.append(row)
            else:
                unverified.append(row)

        return {
            "verified_skills": verified_skills,
            "partially_verified_skills": partially_verified,
            "unverified_skills": unverified
        }
