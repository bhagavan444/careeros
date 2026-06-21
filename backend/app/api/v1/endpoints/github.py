from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from app.services.github.client import GitHubClient
from app.services.github.analyzer import GitHubAnalyzer
from app.services.ai.github_reviewer import GitHubAIReviewer
from app.services.github.tech_verifier import TechVerifier
import logging

logger = logging.getLogger("github_api")

router = APIRouter()

@router.get("/debug-token", response_model=Dict[str, Any])
async def debug_token():
    """
    Check rate limit and token status.
    """
    client = GitHubClient()
    return await client.check_rate_limit()

@router.get("/profile/{username}", response_model=Dict[str, Any])
async def get_github_profile(username: str):
    """
    Fetch raw GitHub profile information.
    """
    client = GitHubClient()
    try:
        return await client.get_user_profile(username)
    except HTTPException as e:
        if e.status_code == 403:
            from fastapi.responses import JSONResponse
            return JSONResponse(status_code=403, content={"error": "github_rate_limit", "message": "GitHub token missing or invalid"})
        raise
    except Exception as e:
        logger.error(f"Error fetching profile for {username}: {str(e)}")
        raise

@router.get("/repos/{username}", response_model=Dict[str, Any])
async def get_github_repos(username: str):
    """
    Fetch public repositories for a given user.
    """
    client = GitHubClient()
    try:
        repos = await client.get_user_repos(username)
        return {"count": len(repos), "repositories": repos}
    except HTTPException as e:
        if e.status_code == 403:
            from fastapi.responses import JSONResponse
            return JSONResponse(status_code=403, content={"error": "github_rate_limit", "message": "GitHub token missing or invalid"})
        raise
    except Exception as e:
        logger.error(f"Error fetching repos for {username}: {str(e)}")
        raise

@router.get("/analyze/{username}", response_model=Dict[str, Any])
async def analyze_github_user(username: str):
    """
    End-to-end analysis endpoint.
    Fetches data, runs deterministic engines, and generates AI insights.
    """
    client = GitHubClient()
    
    try:
        # 1. Fetch Raw Data
        profile = await client.get_user_profile(username)
        repos = await client.get_user_repos(username)
        
        logger.info("Running deterministic engines...")
        language_dist = GitHubAnalyzer.calculate_language_distribution(repos)
        quality_score, quality_breakdown = GitHubAnalyzer.evaluate_repository_quality(repos)
        activity_score, activity_breakdown = GitHubAnalyzer.evaluate_engineering_activity(profile, repos)
        
        import asyncio
        top_repos_for_tree = sorted(repos, key=lambda x: x.get("stars", 0), reverse=True)[:5]
        
        repo_trees = {}
        repo_files = {}
        
        # Build tasks for trees and files simultaneously
        tree_tasks = []
        file_tasks = []
        file_requests = []
        
        for repo in top_repos_for_tree:
            repo_name = repo["name"]
            repo_files[repo_name] = {}
            tree_tasks.append(client.get_repo_tree(username, repo_name, repo.get("default_branch", "main")))
            for path in ["package.json", "requirements.txt", "pyproject.toml"]:
                file_tasks.append(client.get_repo_file_content(username, repo_name, path))
                file_requests.append((repo_name, path))
                
        # Await ALL GitHub API calls concurrently
        all_results = await asyncio.gather(*tree_tasks, *file_tasks)
        
        trees = all_results[:len(tree_tasks)]
        file_results = all_results[len(tree_tasks):]
        
        repo_trees = {repo["name"]: tree for repo, tree in zip(top_repos_for_tree, trees)}
        for (repo_name, path), content in zip(file_requests, file_results):
            if content:
                repo_files[repo_name][path] = content
        
        code_structure = GitHubAnalyzer.analyze_code_structure(repo_trees)
        code_quality = GitHubAnalyzer.analyze_repository_engineering_quality(repo_trees, repo_files)
        
        complexity_metrics = GitHubAnalyzer.evaluate_project_complexity(repos, code_structure, repo_trees, repo_files)
        maturity_metrics = GitHubAnalyzer.calculate_engineering_maturity(profile, repos, code_structure)
        
        logger.info("Running Technology Verification Engine...")
        tech_verifier = TechVerifier(client)
        tech_verification = await tech_verifier.verify_technologies(username, profile, repos)
        
        trust_metrics = GitHubAnalyzer.calculate_engineering_trust(repos, tech_verification, code_structure)
        evolution = GitHubAnalyzer.analyze_engineering_evolution(repos)
        
        executive_summary = GitHubAnalyzer.generate_executive_summary(
            maturity_metrics, trust_metrics, complexity_metrics, tech_verification
        )
        
        recruiter_decision = GitHubAnalyzer.generate_recruiter_decision(
            maturity_metrics, trust_metrics, complexity_metrics, code_structure, evolution, executive_summary
        )
        
        analytics_payload = {
            "executive_summary": executive_summary,
            "language_distribution": language_dist,
            "quality_score": quality_score,
            "quality_breakdown": quality_breakdown,
            "activity_score": activity_score,
            "activity_breakdown": activity_breakdown,
            "complexity_level": complexity_metrics["tier"],
            "complexity_score": complexity_metrics["complexity_score"],
            "complexity_breakdown": complexity_metrics["breakdown"],
            "complexity_reasoning": complexity_metrics["reasoning"],
            "complexity_evidence": complexity_metrics["evidence"],
            "engineering_maturity": maturity_metrics,
            "tech_verification": tech_verification,
            "engineering_trust": trust_metrics,
            "code_structure": code_structure,
            "code_quality": code_quality,
            "engineering_evolution": evolution,
            "recruiter_decision": recruiter_decision,
            "total_repositories_analyzed": len(repos)
        }
        
        # 3. AI Code Review
        ai_insights = await GitHubAIReviewer.generate_insights(profile, repos, analytics_payload)
        
        # 4. Construct Final Payload
        return {
            "profile": profile,
            "analytics": analytics_payload,
            "ai_insights": ai_insights,
            "repositories": repos[:50] # Limit returned repos to top 50 to save frontend bandwidth
        }
        
    except HTTPException as e:
        if e.status_code == 403:
            from fastapi.responses import JSONResponse
            return JSONResponse(
                status_code=403,
                content={
                    "error": "github_rate_limit",
                    "message": "GitHub token missing or invalid"
                }
            )
        raise
    except Exception as e:
        logger.error(f"Error fetching data for {username}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error during GitHub Analysis")
