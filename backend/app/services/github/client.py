import httpx
import logging
from typing import Dict, List, Any
from app.core.config import settings
from fastapi import HTTPException

logger = logging.getLogger("github_client")

# Global HTTP client for connection pooling
_global_http_client = httpx.AsyncClient(
    limits=httpx.Limits(max_keepalive_connections=20, max_connections=50),
    timeout=15.0
)

class GitHubClient:
    BASE_URL = "https://api.github.com"
    
    def __init__(self):
        self.headers = {
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28"
        }
        if settings.GITHUB_TOKEN:
            self.headers["Authorization"] = f"Bearer {settings.GITHUB_TOKEN}"
        else:
            logger.warning("GITHUB_TOKEN is not set. API calls may be severely rate-limited.")

    async def get_user_profile(self, username: str) -> Dict[str, Any]:
        """
        Fetches the GitHub user profile data.
        """
        url = f"{self.BASE_URL}/users/{username}"
        has_token = bool(settings.GITHUB_TOKEN)
        logger.info(f"--- DEBUG: GitHub Profile Request ---")
        logger.info(f"Username received: {username}")
        logger.info(f"URL being requested: {url}")
        logger.info(f"Token loaded: {has_token}")
        logger.info(f"Authorization header presence: {'Authorization' in self.headers}")
        
        try:
            response = await _global_http_client.get(url, headers=self.headers)
            logger.info(f"GitHub status code: {response.status_code}")
            
            if response.status_code != 200:
                logger.error(f"GitHub response body: {response.text}")
            
            if response.status_code == 401:
                raise HTTPException(status_code=401, detail=f"GitHub API Unauthorized. Bad token? Response: {response.text}")
            elif response.status_code == 403:
                raise HTTPException(status_code=403, detail=f"GitHub API Forbidden (Rate limit?). Response: {response.text}")
            elif response.status_code == 404:
                raise HTTPException(status_code=404, detail=f"GitHub user not found. Response: {response.text}")
            elif response.status_code == 422:
                raise HTTPException(status_code=422, detail=f"GitHub API Unprocessable Entity. Response: {response.text}")
            elif response.status_code >= 500:
                raise HTTPException(status_code=500, detail=f"GitHub API Server Error. Response: {response.text}")
            
            response.raise_for_status()
            data = response.json()
            
            return {
                "name": data.get("name"),
                "username": data.get("login"),
                "bio": data.get("bio"),
                "avatar": data.get("avatar_url"),
                "followers": data.get("followers", 0),
                "following": data.get("following", 0),
                "public_repos": data.get("public_repos", 0),
                "created_at": data.get("created_at")
            }
        except httpx.RequestError as exc:
            logger.error(f"An error occurred while requesting {exc.request.url!r}.")
            import traceback
            logger.error(traceback.format_exc())
            raise HTTPException(status_code=500, detail=f"Failed to connect to GitHub API: {str(exc)}")

    async def get_user_repos(self, username: str) -> List[Dict[str, Any]]:
        """
        Fetches the public repositories for the user. Handles pagination to get all repos.
        """
        url = f"{self.BASE_URL}/users/{username}/repos"
        repos = []
        page = 1
        per_page = 100
        
        while True:
            logger.info(f"--- DEBUG: GitHub Repos Request (Page {page}) ---")
            logger.info(f"URL being requested: {url}")
            try:
                response = await _global_http_client.get(url, params={"per_page": per_page, "page": page, "sort": "updated"}, headers=self.headers)
                logger.info(f"GitHub status code: {response.status_code}")
                
                if response.status_code != 200:
                    logger.error(f"GitHub response body: {response.text}")
                    
                if response.status_code == 401:
                    raise HTTPException(status_code=401, detail=f"GitHub API Unauthorized. Response: {response.text}")
                elif response.status_code == 403:
                    raise HTTPException(status_code=403, detail=f"GitHub API Forbidden. Response: {response.text}")
                elif response.status_code == 404:
                    raise HTTPException(status_code=404, detail=f"GitHub user not found for repos. Response: {response.text}")
                elif response.status_code >= 500:
                    raise HTTPException(status_code=500, detail=f"GitHub API Server Error. Response: {response.text}")
                
                response.raise_for_status()
                data = response.json()
            except httpx.RequestError as exc:
                logger.error(f"Request error: {exc}")
                import traceback
                logger.error(traceback.format_exc())
                raise HTTPException(status_code=500, detail=f"Connection failed: {str(exc)}")
            
            if not data:
                break
                
            for repo in data:
                if not repo.get("fork"): # Optional: exclude forks for better analysis
                    repos.append({
                        "name": repo.get("name"),
                        "description": repo.get("description"),
                        "language": repo.get("language"),
                        "stars": repo.get("stargazers_count", 0),
                        "forks": repo.get("forks_count", 0),
                        "open_issues": repo.get("open_issues_count", 0),
                        "updated_at": repo.get("updated_at"),
                        "url": repo.get("html_url"),
                        "has_pages": repo.get("has_pages", False),
                        "topics": repo.get("topics", []),
                        "size": repo.get("size", 0),
                        "default_branch": repo.get("default_branch", "main")
                    })
            
            if len(data) < per_page:
                break
            page += 1
                
        return repos

    async def get_repo_file_content(self, owner: str, repo: str, path: str) -> str:
        """
        Attempts to fetch the raw content of a specific file in a repository.
        Returns the decoded string content, or None if not found/error.
        """
        url = f"{self.BASE_URL}/repos/{owner}/{repo}/contents/{path}"
        
        try:
            response = await _global_http_client.get(url, headers=self.headers)
            if response.status_code == 200:
                data = response.json()
                if data.get("encoding") == "base64" and data.get("content"):
                    import base64
                    return base64.b64decode(data["content"]).decode("utf-8")
            return None
        except Exception as e:
            logger.debug(f"File {path} not found in {owner}/{repo}: {str(e)}")
            return None

    async def get_repo_tree(self, owner: str, repo: str, branch: str = "main") -> List[str]:
        """
        Attempts to fetch the entire repository file tree recursively.
        Returns a list of file and directory paths.
        """
        url = f"{self.BASE_URL}/repos/{owner}/{repo}/git/trees/{branch}?recursive=1"
        paths = []
        
        try:
            response = await _global_http_client.get(url, headers=self.headers)
            if response.status_code == 200:
                data = response.json()
                tree = data.get("tree", [])
                for item in tree:
                    paths.append(item.get("path", ""))
            return paths
        except Exception as e:
            logger.debug(f"Tree not found for {owner}/{repo} branch {branch}: {str(e)}")
            return []

    async def check_rate_limit(self) -> Dict[str, Any]:
        """
        Verifies the token and fetches rate limit status.
        """
        url = f"{self.BASE_URL}/rate_limit"
        has_token = bool(settings.GITHUB_TOKEN)
        
        try:
            response = await _global_http_client.get(url, headers=self.headers)
            response.raise_for_status()
            data = response.json()
            
            core = data.get("resources", {}).get("core", {})
            remaining = core.get("remaining", 0)
            reset = core.get("reset", 0)
            
            from datetime import datetime
            reset_time = datetime.fromtimestamp(reset).isoformat() if reset else "unknown"
            
            logger.info(f"GitHub authenticated: {has_token}")
            logger.info(f"Remaining API requests: {remaining}")
            logger.info(f"Rate limit reset time: {reset_time}")
            
            return {
                "token_loaded": has_token,
                "authenticated": has_token and response.status_code == 200,
                "remaining_requests": remaining,
                "reset_time": reset_time
            }
        except Exception as e:
            logger.error(f"Error checking rate limit: {str(e)}")
            return {
                "token_loaded": has_token,
                "authenticated": False,
                "error": str(e)
            }

