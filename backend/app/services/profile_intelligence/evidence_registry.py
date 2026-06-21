from typing import List, Dict, Any

class EvidenceRegistry:
    """
    Formalizes the mapping of skills to physical evidence.
    Ensures no skill is validated without concrete traceability.
    """

    @staticmethod
    def compile_registry(matrix: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Extracts evidence blocks from the verification matrix and formats
        them strictly to the Evidence Registry schema.
        """
        registry = []
        
        all_skills = (
            matrix.get("verified_skills", []) + 
            matrix.get("partially_verified_skills", []) + 
            matrix.get("unverified_skills", [])
        )
        
        for skill_data in all_skills:
            skill_name = skill_data.get("skill", "")
            confidence = skill_data.get("confidence_score", 0)
            
            # Extract underlying evidence descriptions
            evidence_list = skill_data.get("evidence", [])
            
            for ev in evidence_list:
                source = ev.get("source", "Unknown")
                desc = ev.get("description", "")
                
                # Deduce evidence_type, repository, and file based on description
                evidence_type = "Direct Claim"
                file_name = ""
                repository = ""
                
                if source == "GitHub":
                    evidence_type = "Repository Metadata"
                    if "package.json" in desc:
                        file_name = "package.json"
                        evidence_type = "Dependency Config"
                    elif "Dockerfile" in desc:
                        file_name = "Dockerfile"
                        evidence_type = "Infrastructure Config"
                    elif "requirements.txt" in desc:
                        file_name = "requirements.txt"
                        evidence_type = "Dependency Config"
                elif source == "Portfolio":
                    evidence_type = "DOM Signal"
                    if "meta generator" in desc:
                        evidence_type = "Meta Tag"
                        
                registry.append({
                    "skill": skill_name,
                    "source": source,
                    "evidence_type": evidence_type,
                    "repository": repository,
                    "file": file_name,
                    "description": desc,
                    "confidence": confidence
                })
                
        return registry
