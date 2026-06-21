from typing import Dict, Any

class ProductionReadinessEngine:
    """
    Internal audit metrics generator.
    Produces deterministic reliability, coverage, and density scores.
    """

    @staticmethod
    def evaluate(matrix: Dict[str, Any], truth_score_details: Dict[str, Any]) -> Dict[str, int]:
        """
        Generates production audit scores (0-100).
        """
        verified = matrix.get("verified_skills", [])
        unverified = matrix.get("unverified_skills", [])
        total_skills = len(verified) + len(matrix.get("partially_verified_skills", [])) + len(unverified)
        
        evidence_coverage = truth_score_details.get("evidence_coverage", 0)
        
        # 1. Reliability Score (Percentage of verified skills vs total claims)
        if total_skills > 0:
            reliability_score = int((len(verified) / total_skills) * 100)
        else:
            reliability_score = 0
            
        # 2. Coverage Score (Based on the Source Coverage boolean flags)
        source_coverage = truth_score_details.get("source_coverage", {})
        active_sources = sum(1 for v in source_coverage.values() if v)
        coverage_score = int((active_sources / 4) * 100)
        
        # 3. Evidence Density Score (How much cross-source overlap exists)
        # We approximate this by looking at how high the confidence scores are for the verified set
        if len(verified) > 0:
            total_confidence = sum([s.get("confidence_score", 0) for s in verified])
            evidence_density_score = int(total_confidence / len(verified))
        else:
            evidence_density_score = 0
            
        # 4. Verification Strength Score (Penalty for unverified claims)
        penalty = len(unverified) * 5
        verification_strength = max(0, evidence_coverage - penalty)

        return {
            "reliability_score": reliability_score,
            "coverage_score": coverage_score,
            "evidence_density_score": evidence_density_score,
            "verification_strength_score": verification_strength
        }
