import asyncio
import json
from app.api.v1.endpoints.github import analyze_github_user

async def main():
    try:
        result = await analyze_github_user("bhagavan444")
        
        # We just want to inspect the structure, not the massive list of repos
        if "repositories" in result:
            result["repositories"] = f"[{len(result['repositories'])} repos]"
            
        print(json.dumps(result, indent=2))
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(main())
