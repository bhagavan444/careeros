import requests

url = "http://localhost:8000/api/v1/profile-intelligence/analyze"
payload = {
    "resume": "some_doc_id",
    "github": "bhagavan444",
    "portfolio": "https://bhagavanengineer.vercel.app/",
    "linkedin": "https://www.linkedin.com/in/gsssbhagavan/"
}

try:
    response = requests.post(url, json=payload)
    print(f"Status: {response.status_code}")
    print(response.text)
except Exception as e:
    print(f"Error: {e}")
