from typing import Dict, Any, List
from app.schemas.profile_intelligence import VerificationMatrix, SkillVerification, EvidenceItem

class VerificationEngine:
    @staticmethod
    def generate_matrix(candidate_data: Dict[str, Any]) -> VerificationMatrix:
        """
        Deterministically computes the skill verification matrix.
        No AI guessing. Only returns skills found in raw data.
        """
        # Extract skills from different sources
        # We assume candidate_data is structured like:
        # {
        #   "resume": {"skills": ["React", ...], "projects": [...]},
        #   "github": {"skills": ["React", ...], "repos": [...]},
        #   "linkedin": {"skills": ["React", ...]},
        #   "portfolio": {"skills": ["React", ...]}
        # }
        
        resume_data = candidate_data.get("resume") or {}
        github_data = candidate_data.get("github") or {}
        linkedin_data = candidate_data.get("linkedin") or {}
        portfolio_data = candidate_data.get("portfolio") or {}
        
        resume_skills = [s.lower().strip() for s in resume_data.get("skills", [])]
        github_skills = [s.lower().strip() for s in github_data.get("skills", [])]
        linkedin_skills = [s.lower().strip() for s in linkedin_data.get("skills", [])]
        portfolio_skills = [s.lower().strip() for s in portfolio_data.get("skills", [])]
        
        all_skills_set = set(resume_skills + github_skills + linkedin_skills + portfolio_skills)
        
        verified = []
        partially_verified = []
        unverified = []
        
        for skill_lower in all_skills_set:
            # Re-capitalize for display
            display_skill = next((s for s in (resume_data.get("skills", []) + github_data.get("skills", []) + linkedin_data.get("skills", []) + portfolio_data.get("skills", [])) if s.lower().strip() == skill_lower), skill_lower.title())
            
            in_resume = skill_lower in resume_skills
            in_github = skill_lower in github_skills
            in_linkedin = skill_lower in linkedin_skills
            in_portfolio = skill_lower in portfolio_skills
            
            sources_count = sum([in_resume, in_github, in_linkedin, in_portfolio])
            
            # Deterministic Confidence Logic
            if sources_count >= 3:
                confidence = 100
            elif sources_count == 2:
                confidence = 65
            elif sources_count == 1:
                confidence = 30
            else:
                confidence = 0
                
            evidence = []
            if in_resume:
                evidence.append(EvidenceItem(source="Resume", description=f"Found in resume skills section or projects."))
            if in_github:
                evidence.append(EvidenceItem(source="GitHub", description=f"Detected via repository language, package.json, or requirements.txt."))
            if in_linkedin:
                evidence.append(EvidenceItem(source="LinkedIn", description=f"Listed in LinkedIn endorsements or experience."))
            if in_portfolio:
                evidence.append(EvidenceItem(source="Portfolio", description=f"Extracted from portfolio projects or about section."))
                
            sv = SkillVerification(
                skill=display_skill,
                resume_present=in_resume,
                github_present=in_github,
                linkedin_present=in_linkedin,
                portfolio_present=in_portfolio,
                confidence_score=confidence,
                evidence=evidence
            )
            
            if confidence == 100:
                verified.append(sv)
            elif confidence >= 65:
                partially_verified.append(sv)
            else:
                unverified.append(sv)
                
        # Sort by confidence descending
        verified.sort(key=lambda x: x.confidence_score, reverse=True)
        partially_verified.sort(key=lambda x: x.confidence_score, reverse=True)
        unverified.sort(key=lambda x: x.confidence_score, reverse=True)
        
        return VerificationMatrix(
            verified_skills=verified,
            partially_verified_skills=partially_verified,
            unverified_skills=unverified
        )
