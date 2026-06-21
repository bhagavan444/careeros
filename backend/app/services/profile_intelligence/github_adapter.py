import logging
from typing import Dict, Any, List

from app.services.github.client import GitHubClient
from .skill_taxonomy import SkillTaxonomy

logger = logging.getLogger(__name__)

class GitHubAdapter:
    """
    Data acquisition layer for GitHub intelligence.
    Extracts explicit signals from live repositories and maps them as concrete evidence.
    """

    @staticmethod
    async def extract(username: str) -> Dict[str, Any]:
        """
        Fetches public repositories and derives deterministic verified skills.
        Always returns a structured dict, even if the user is invalid or blocked.
        """
        result = {
            "verified_skills": [],
            "repositories": [],
            "evidence": []
        }

        if not username:
            return result

        try:
            client = GitHubClient()
            repos = await client.get_user_repos(username)
            
            raw_skills_dict = {} # Mapping: raw_skill_name -> list of evidence strings
            
            for repo in repos:
                repo_name = repo.get("name", "Unknown Repo")
                
                # Language Evidence
                lang = repo.get("language")
                if lang:
                    raw_skills_dict.setdefault(lang, []).append(f"Primary language in {repo_name}")
                
                # Topics / Frameworks Evidence
                topics = repo.get("topics", [])
                for topic in topics:
                    raw_skills_dict.setdefault(topic, []).append(f"Repository topic in {repo_name}")
                    
                # Note: In a deeper implementation, we would fetch file trees (e.g. package.json for React)
                # Here we simulate that deterministic extraction based on the topics metadata for speed.

            # Apply Canonical Taxonomy and flatten evidence
            for raw_skill, evidence_list in raw_skills_dict.items():
                normalized = SkillTaxonomy.normalize(raw_skill)
                if normalized not in result["verified_skills"]:
                    result["verified_skills"].append(normalized)
                
                for ev in evidence_list:
                    result["evidence"].append({
                        "skill": normalized,
                        "source": "GitHub",
                        "description": ev
                    })

            result["repositories"] = [repo.get("name") for repo in repos]
            
            # Sort for determinism
            result["verified_skills"].sort()

            return result

        except Exception as e:
            logger.error(f"GitHubAdapter extraction failed for user {username}: {e}")
            return result
