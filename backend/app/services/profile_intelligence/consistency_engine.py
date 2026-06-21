from typing import Dict, Any, List
from app.schemas.profile_intelligence import ConsistencyAnalysis, Contradiction, VerificationMatrix

class ConsistencyEngine:
    @staticmethod
    def analyze(candidate_data: Dict[str, Any], matrix: VerificationMatrix) -> ConsistencyAnalysis:
        """
        Detects contradictions between profile sources deterministically.
        """
        contradictions = []
        verified_claims = [skill.skill for skill in matrix.verified_skills]
        unverified_claims = [skill.skill for skill in matrix.unverified_skills]
        
        # Check for contradictions based on unverified claims
        for skill in matrix.unverified_skills:
            if skill.resume_present and not skill.github_present and not skill.portfolio_present:
                contradictions.append(
                    Contradiction(
                        claim=f"Claims {skill.skill} expertise on Resume",
                        conflict=f"No {skill.skill} repositories or portfolio evidence found",
                        severity="High"
                    )
                )
            elif skill.linkedin_present and not skill.resume_present:
                contradictions.append(
                    Contradiction(
                        claim=f"Lists {skill.skill} on LinkedIn",
                        conflict=f"Missing {skill.skill} from Resume",
                        severity="Medium"
                    )
                )
                
        # Calculate consistency score
        total_skills = len(matrix.verified_skills) + len(matrix.partially_verified_skills) + len(matrix.unverified_skills)
        if total_skills == 0:
            consistency_score = 0
            status = "Low Consistency"
        else:
            # Score penalizes unverified skills more heavily
            consistency_score = int(((len(matrix.verified_skills) + len(matrix.partially_verified_skills)) / total_skills) * 100)
            
            # Additional penalty for high severity contradictions
            high_severity_count = len([c for c in contradictions if c.severity == "High"])
            consistency_score = max(0, consistency_score - (high_severity_count * 10))
            
            if consistency_score >= 80:
                status = "High Consistency"
            elif consistency_score >= 50:
                status = "Consistency Warning"
            else:
                status = "Low Consistency"
                
        return ConsistencyAnalysis(
            consistency_score=consistency_score,
            status=status,
            verified_claims=verified_claims,
            unverified_claims=unverified_claims,
            contradictions=contradictions
        )
