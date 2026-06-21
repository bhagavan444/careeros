from typing import Dict, Any

class ScoreExplainer:
    """
    Score Explainability Engine.
    Generates deterministic, human-readable reasoning for every Truth Score.
    No LLM generation is used.
    """

    @staticmethod
    def generate_reasoning(truth_score_details: Dict[str, Any], matrix: Dict[str, Any]) -> str:
        """
        Synthesizes the reasoning text based on the Verification Matrix and final scores.
        """
        verified_count = len(matrix.get("verified_skills", []))
        partial_count = len(matrix.get("partially_verified_skills", []))
        unverified_count = len(matrix.get("unverified_skills", []))
        
        score = truth_score_details.get("score", 0)
        evidence_coverage = truth_score_details.get("evidence_coverage", 0)
        
        # Determine cross-source confirmations (skills with > 1 source)
        cross_source_count = 0
        all_skills = matrix.get("verified_skills", []) + matrix.get("partially_verified_skills", [])
        for skill in all_skills:
            if skill.get("confidence_score", 0) >= 75:  # 75 means 2+ sources
                cross_source_count += 1
                
        reasoning = (
            f"Truth Score is {score}. "
            f"The candidate has {verified_count} fully verified skills, "
            f"{cross_source_count} cross-source confirmations, "
            f"{partial_count} partial confirmations, and "
            f"{unverified_count} unsupported claims. "
        )
        
        reasoning += f"Evidence Coverage is {evidence_coverage}%. "
        
        if evidence_coverage >= 80:
            reasoning += "Evidence Density is High."
        elif evidence_coverage >= 50:
            reasoning += "Evidence Density is Moderate."
        else:
            reasoning += "Evidence Density is Low."
            
        return reasoning
