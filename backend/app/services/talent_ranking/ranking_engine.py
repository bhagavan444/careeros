import logging
from typing import List
from app.schemas.talent_ranking import LightweightCandidateIntelligence, RankedCandidate
from app.schemas.recruiter_intelligence import ExplainabilityTrace

logger = logging.getLogger("ranking_engine")

class RankingEngine:
    @staticmethod
    def rank_candidates(candidates: List[LightweightCandidateIntelligence]) -> List[RankedCandidate]:
        logger.info("[RANKING] Calculating Final Talent Scores...")
        
        ranked_list = []
        
        for cand in candidates:
            # Formula: (Match * 0.4) + (Truth * 0.2) + (Evidence * 0.15) + (Quality * 0.1) + (GitHub * 0.1) - (Risk * 0.05)
            # Actually, the user asked for + (Risk Adjustment * 0.05) where low risk = high points.
            # So Risk Adjustment = (100 - Risk Score).
            
            match_pts = cand.match_score * 0.40
            truth_pts = cand.truth_score * 0.20
            evidence_pts = cand.evidence_score * 0.15
            quality_pts = cand.profile_quality_score * 0.10
            github_pts = cand.github_intelligence_score * 0.10
            
            risk_adjustment = (100 - cand.risk_score) * 0.05
            
            final_score = int(match_pts + truth_pts + evidence_pts + quality_pts + github_pts + risk_adjustment)
            
            # Cap at 100
            final_score = min(final_score, 100)
            
            trace = ExplainabilityTrace(
                formula="(Match*0.4) + (Truth*0.2) + (Evidence*0.15) + (Quality*0.1) + (GitHub*0.1) + ((100-Risk)*0.05)",
                evidence_sources=["RecruiterIntelligence", "ProfileIntelligence"],
                weight_contributions={
                    "Match": f"{int(match_pts)}/40",
                    "Truth": f"{int(truth_pts)}/20",
                    "Evidence": f"{int(evidence_pts)}/15",
                    "Quality": f"{int(quality_pts)}/10",
                    "GitHub": f"{int(github_pts)}/10",
                    "Risk Adjustment": f"{int(risk_adjustment)}/5"
                },
                confidence_level=cand.evidence_score,
                deterministic_reasoning=f"Final calculated score is {final_score}. Highest contributing factor was Match ({int(match_pts)} pts)."
            )
            
            ranked_list.append({
                "score": final_score,
                "candidate": cand,
                "trace": trace
            })
            
        # Sort descending by score
        ranked_list.sort(key=lambda x: x["score"], reverse=True)
        
        final_output = []
        for rank, item in enumerate(ranked_list, start=1):
            # Segmentation and interview priority will be injected by the next engines,
            # but we construct the base object here.
            final_output.append(RankedCandidate(
                rank=rank,
                candidate_name=item["candidate"].candidate_name,
                final_talent_score=item["score"],
                segment="TBD",
                interview_priority="TBD",
                intelligence=item["candidate"],
                explainability=item["trace"]
            ))
            
        return final_output
