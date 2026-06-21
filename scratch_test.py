import asyncio
import os
import sys

# Add backend directory to sys.path so we can import app
sys.path.append(os.path.join(os.path.dirname(__file__), "backend"))

from app.main import app

print("--- Registered Routes ---")
for route in app.routes:
    if hasattr(route, "path"):
        print(route.path)
    else:
        # Some routes might be Mount objects depending on FastAPI version
        print(route)
print("-------------------------")
