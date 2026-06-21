import urllib.request
import json
import sys

def check():
    url = "http://localhost:8000/api/v1/github/analyze/bhagavan444"
    try:
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read())
            print("Analytics Keys:")
            print(list(data.get("analytics", {}).keys()))
            print("\nAI Insights Keys:")
            print(list(data.get("ai_insights", {}).keys()))
    except Exception as e:
        print(f"Error: {e}")

check()
