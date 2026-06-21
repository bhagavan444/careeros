import asyncio
import json
from app.api.v1.endpoints.github import debug_token

async def main():
    result = await debug_token()
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    asyncio.run(main())
