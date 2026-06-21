import json
import logging
from typing import Dict, List, Any, Tuple
import asyncio
from app.services.github.client import GitHubClient

logger = logging.getLogger("tech_verifier")

class TechVerifier:
    def __init__(self, client: GitHubClient):
        self.client = client
        
        # Technology signature mapping
        self.signatures = {
            "React": {"files": ["package.json"], "keys": ["react", "react-dom"]},
            "Next.js": {"files": ["package.json"], "keys": ["next"]},
            "Vue": {"files": ["package.json"], "keys": ["vue"]},
            "Angular": {"files": ["package.json"], "keys": ["@angular/core"]},
            "Express": {"files": ["package.json"], "keys": ["express"]},
            
            "FastAPI": {"files": ["requirements.txt", "pyproject.toml"], "keys": ["fastapi"]},
            "Flask": {"files": ["requirements.txt", "pyproject.toml"], "keys": ["flask"]},
            "Django": {"files": ["requirements.txt", "pyproject.toml"], "keys": ["django"]},
            
            "MongoDB": {"files": ["package.json", "requirements.txt", "pyproject.toml"], "keys": ["mongoose", "mongodb", "motor", "pymongo"]},
            "PostgreSQL": {"files": ["package.json", "requirements.txt", "pyproject.toml"], "keys": ["pg", "psycopg2", "asyncpg"]},
            "MySQL": {"files": ["package.json", "requirements.txt", "pyproject.toml"], "keys": ["mysql", "mysqlclient", "mysql-connector-python"]},
            
            "TensorFlow": {"files": ["requirements.txt", "pyproject.toml"], "keys": ["tensorflow", "tf"]},
            "PyTorch": {"files": ["requirements.txt", "pyproject.toml"], "keys": ["torch", "torchvision"]},
            "Scikit-Learn": {"files": ["requirements.txt", "pyproject.toml"], "keys": ["scikit-learn", "sklearn"]},
            
            "Docker": {"files": ["Dockerfile", "docker-compose.yml"], "keys": []}, # Presence of file is enough
            "GitHub Actions": {"files": [".github/workflows"], "keys": []}
        }

    async def verify_technologies(self, username: str, profile: Dict[str, Any], repos: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Scans top repositories for configuration files to deterministicly verify skills.
        """
        verified_skills_map = {}
        weak_evidence = set()
        unverified_skills = set()
        
        # Determine "claimed" skills from profile bio and repo topics
        claimed_skills = set()
        if profile.get("bio"):
            bio = profile["bio"].lower()
            for tech in self.signatures.keys():
                if tech.lower() in bio:
                    claimed_skills.add(tech)
                    
        for repo in repos:
            for topic in repo.get("topics", []):
                for tech in self.signatures.keys():
                    if tech.lower() == topic.lower():
                        claimed_skills.add(tech)
                        
        # Sort repos by stars to prioritize deep scans (limit to top 10 to save API calls)
        top_repos = sorted(repos, key=lambda x: x.get("stars", 0), reverse=True)[:10]
        
        # We will fetch package.json, requirements.txt, pyproject.toml, Dockerfile for top repos
        tasks = []
        for repo in top_repos:
            repo_name = repo["name"]
            tasks.append(self._scan_repo(username, repo_name))
            
        results = await asyncio.gather(*tasks)
        
        # Aggregate found technologies
        for repo_techs in results:
            for tech, evidence in repo_techs.items():
                if tech not in verified_skills_map:
                    verified_skills_map[tech] = set()
                for e in evidence:
                    verified_skills_map[tech].add(e)
            
        # Classify
        verified_skills_output = []
        for tech in self.signatures.keys():
            if tech in verified_skills_map:
                verified_skills_output.append({
                    "technology": tech,
                    "confidence": 100,
                    "evidence": list(verified_skills_map[tech])
                })
            elif tech in claimed_skills:
                # Claimed but not verified by explicit files
                weak_evidence.add(tech)
                
        # Anything claimed but not verified/weak?
        for tech in claimed_skills:
            if tech not in verified_skills_map:
                unverified_skills.add(tech)
                if tech in weak_evidence:
                    weak_evidence.remove(tech)
        
        # Calculate Confidence Score
        total_detected = len(verified_skills_output)
        confidence_score = min(100, total_detected * 15)
        
        return {
            "verified_skills": verified_skills_output,
            "weak_evidence": list(weak_evidence),
            "unverified_skills": list(unverified_skills),
            "confidence_score": confidence_score
        }

    async def _scan_repo(self, owner: str, repo: str) -> Dict[str, List[str]]:
        found_tech = {}
        
        def add_evidence(tech: str, ev: str):
            if tech not in found_tech:
                found_tech[tech] = []
            if ev not in found_tech[tech]:
                found_tech[tech].append(ev)
        
        # Try fetching package.json
        pkg_json = await self.client.get_repo_file_content(owner, repo, "package.json")
        if pkg_json:
            try:
                data = json.loads(pkg_json)
                deps = list(data.get("dependencies", {}).keys()) + list(data.get("devDependencies", {}).keys())
                for dep in deps:
                    for tech, sig in self.signatures.items():
                        if "package.json" in sig["files"] and any(k == dep for k in sig["keys"]):
                            add_evidence(tech, f"{repo}/package.json")
            except:
                pass
                
        # Try fetching requirements.txt
        req_txt = await self.client.get_repo_file_content(owner, repo, "requirements.txt")
        if req_txt:
            for line in req_txt.split('\n'):
                line = line.strip().lower()
                for tech, sig in self.signatures.items():
                    if "requirements.txt" in sig["files"] and any(k in line for k in sig["keys"]):
                        add_evidence(tech, f"{repo}/requirements.txt")
                        
        # Try fetching Dockerfile
        dockerfile = await self.client.get_repo_file_content(owner, repo, "Dockerfile")
        if dockerfile:
            add_evidence("Docker", f"{repo}/Dockerfile")
            
        # Try fetching docker-compose.yml
        compose = await self.client.get_repo_file_content(owner, repo, "docker-compose.yml")
        if compose:
            add_evidence("Docker", f"{repo}/docker-compose.yml")
            
        # Try fetching .github/workflows for actions
        workflows = await self.client.get_repo_file_content(owner, repo, ".github/workflows")
        if workflows and isinstance(workflows, list) and len(workflows) > 0:
            add_evidence("GitHub Actions", f"{repo}/.github/workflows")
            
        return found_tech
