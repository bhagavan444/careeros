from typing import Dict, Any, List
from app.schemas.profile_intelligence import RiskAnalysis, RiskItem, VerificationMatrix, ConsistencyAnalysis

class RiskEngine:
    @staticmethod
    def analyze(
        candidate_data: Dict[str, Any],
        matrix: VerificationMatrix,
        consistency: ConsistencyAnalysis,
        github_analytics: Dict[str, Any]
    ) -> RiskAnalysis:
        """
        Exposes candidate weaknesses deterministically based on evidence.
        """
        critical_risks = []
        moderate_risks = []
        minor_risks = []
        
        # 1. Contradictions (Critical)
        for contra in consistency.contradictions:
            if contra.severity == "High":
                critical_risks.append(RiskItem(risk="Profile Contradiction", description=contra.conflict))
            else:
                moderate_risks.append(RiskItem(risk="Profile Inconsistency", description=contra.conflict))
                
        # 2. DevOps/Testing Evidence
        verified_skills_lower = [s.skill.lower() for s in matrix.verified_skills]
        has_devops = any(s in verified_skills_lower for s in ["docker", "kubernetes", "aws", "azure", "gcp", "ci/cd"])
        has_testing = any(s in verified_skills_lower for s in ["jest", "pytest", "junit", "selenium", "cypress"])
        
        if not has_devops:
            minor_risks.append(RiskItem(risk="Weak DevOps Evidence", description="No verified skills in deployment or infrastructure."))
            
        if not has_testing:
            moderate_risks.append(RiskItem(risk="Missing Testing Signals", description="No verified testing frameworks found in evidence sources."))
            
        # 3. Portfolio / GitHub Presence
        if not candidate_data.get("portfolio", {}).get("url"):
            minor_risks.append(RiskItem(risk="Missing Portfolio", description="No personal portfolio provided for visual/product assessment."))
            
        if not candidate_data.get("github", {}).get("username"):
            critical_risks.append(RiskItem(risk="No Code Evidence", description="No GitHub profile provided to verify technical claims."))
            
        # 4. Code Quality Risks from GitHub Analytics
        code_quality = github_analytics.get("code_quality", {})
        if code_quality and code_quality.get("overall_score", 100) < 50:
            critical_risks.append(RiskItem(risk="Low Code Quality", description="GitHub repositories show poor structural patterns and low quality scores."))
            
        # 5. Low Cross-Platform Consistency
        if consistency.status == "Low Consistency":
            critical_risks.append(RiskItem(risk="Low Cross-Platform Consistency", description="Many skills claimed on resume lack external evidence."))
            
        return RiskAnalysis(
            critical_risks=critical_risks,
            moderate_risks=moderate_risks,
            minor_risks=minor_risks
        )
