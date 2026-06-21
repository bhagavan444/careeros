from typing import Dict, Any
from app.schemas.profile_intelligence import CareerPositioning, TruthScoreDetails, VerificationMatrix

class CareerPositioningEngine:
    @staticmethod
    def evaluate(
        candidate_data: Dict[str, Any],
        truth_score: TruthScoreDetails,
        matrix: VerificationMatrix,
        engineering_maturity: int = 0,
        project_complexity: int = 0
    ) -> CareerPositioning:
        """
        Deterministically evaluates the candidate's career level based on evidence.
        Levels: Student, Junior Candidate, Junior+, Mid-Level Candidate, Senior Candidate, Staff Candidate
        """
        verified_count = len(matrix.verified_skills)
        years_of_experience = candidate_data.get("resume", {}).get("years_of_experience", 0)
        
        # Base logic
        if years_of_experience >= 8 and engineering_maturity >= 85 and project_complexity >= 80:
            level = "Staff Candidate"
            justification = f"Evidence supports Staff level: {years_of_experience}+ years experience, highly complex projects ({project_complexity}/100), and excellent engineering maturity ({engineering_maturity}/100)."
        elif years_of_experience >= 5 and engineering_maturity >= 70 and verified_count >= 8:
            level = "Senior Candidate"
            justification = f"Evidence supports Senior level: {years_of_experience}+ years experience, solid engineering maturity ({engineering_maturity}/100), and {verified_count} verified core skills."
        elif years_of_experience >= 3 and engineering_maturity >= 50 and verified_count >= 5:
            level = "Mid-Level Candidate"
            justification = f"Evidence supports Mid-Level: {years_of_experience} years experience, adequate maturity, and {verified_count} verified skills."
        elif years_of_experience >= 1 and engineering_maturity >= 30:
            level = "Junior+"
            justification = f"Evidence supports Junior+: {years_of_experience} years experience with some verified practical application."
        elif years_of_experience > 0 or verified_count >= 3:
            level = "Junior Candidate"
            justification = f"Evidence supports Junior level: Limited experience but {verified_count} verified skills."
        else:
            level = "Student"
            justification = "Little to no professional experience or verified skills. Likely a student or entry-level."
            
        # Adjust based on Truth Score confidence
        if truth_score.confidence_level == "Low" and level not in ["Student", "Junior Candidate"]:
            level = "Junior+" # Downgrade due to lack of evidence
            justification += " Note: Level downgraded due to low confidence and missing cross-platform evidence."
            
        return CareerPositioning(
            level=level,
            justification=justification,
            engineering_maturity_score=engineering_maturity,
            project_complexity_score=project_complexity
        )
