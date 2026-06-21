from typing import Dict, Any
from app.schemas.profile_intelligence import MarketReadiness, ReadinessMetric, VerificationMatrix, CareerPositioning

class MarketReadinessEngine:
    @staticmethod
    def evaluate(
        candidate_data: Dict[str, Any],
        matrix: VerificationMatrix,
        career_positioning: CareerPositioning
    ) -> MarketReadiness:
        """
        Positions candidate for hiring markets based on evidence.
        """
        verified_skills = [s.skill.lower() for s in matrix.verified_skills]
        
        # Startup Readiness
        startup_skills = ["react", "next.js", "node.js", "tailwind", "firebase", "mongodb", "fastapi"]
        startup_match = sum(1 for s in verified_skills if any(ss in s for ss in startup_skills))
        startup_score = min(100, startup_match * 20 + (20 if "startup" in str(candidate_data).lower() else 0))
        startup_exp = f"Matches {startup_match} common startup technologies. Values full-stack agility."
        
        # Enterprise Readiness
        enterprise_skills = ["java", "spring", "c#", ".net", "kubernetes", "aws", "azure", "docker", "angular"]
        enterprise_match = sum(1 for s in verified_skills if any(es in s for es in enterprise_skills))
        ent_score = min(100, enterprise_match * 20 + (30 if career_positioning.level in ["Senior Candidate", "Staff Candidate"] else 0))
        ent_exp = f"Matches {enterprise_match} enterprise technologies. {'Strong seniority signals.' if ent_score > 60 else 'Needs more scale evidence.'}"
        
        # Remote Readiness
        remote_score = 80 if "remote" in str(candidate_data.get("linkedin", {})).lower() or candidate_data.get("github", {}).get("repos") else 40
        rem_exp = "Has open source collaboration evidence." if remote_score > 50 else "Requires more async collaboration evidence."
        
        # AI Engineering Readiness
        ai_skills = ["python", "pytorch", "tensorflow", "langchain", "llm", "openai", "machine learning", "ml"]
        ai_match = sum(1 for s in verified_skills if any(ai in s for ai in ai_skills))
        ai_score = min(100, ai_match * 25)
        ai_exp = f"Matches {ai_match} AI/ML technologies."
        
        # Product Engineering Readiness
        prod_skills = ["react", "typescript", "figma", "css", "html", "ui/ux", "frontend"]
        prod_match = sum(1 for s in verified_skills if any(ps in s for ps in prod_skills))
        prod_score = min(100, prod_match * 20)
        prod_exp = f"Matches {prod_match} product/frontend technologies."
        
        return MarketReadiness(
            startup_readiness=ReadinessMetric(score=startup_score, explanation=startup_exp),
            enterprise_readiness=ReadinessMetric(score=ent_score, explanation=ent_exp),
            remote_readiness=ReadinessMetric(score=remote_score, explanation=rem_exp),
            ai_engineering_readiness=ReadinessMetric(score=ai_score, explanation=ai_exp),
            product_engineering_readiness=ReadinessMetric(score=prod_score, explanation=prod_exp)
        )
