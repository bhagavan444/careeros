from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import uuid
from datetime import datetime
import logging
import pdfplumber
import json
import re

# ---------------- App Setup ----------------
app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ---------------- Gemini Setup ----------------
genai.configure(api_key="your api key")  # Replace with your actual API key

def get_working_model():
    for m in genai.list_models():
        if "generateContent" in m.supported_generation_methods:
            logger.info(f"Using model: {m.name}")
            return genai.GenerativeModel(m.name)
    raise RuntimeError("No supported Gemini model found")

model = get_working_model()

# ---------------- Storage ----------------
chat_sessions = {}

# ---------------- Helpers ----------------
def extract_resume_text(file):
    text = ""
    with pdfplumber.open(file) as pdf:
        for page in pdf.pages:
            text += page.extract_text() or ""
    return text.strip()


def safe_json_extract(text):
    """
    Extract valid JSON block from Gemini response safely
    """
    try:
        match = re.search(r"\{.*\}", text, re.DOTALL)
        if match:
            return json.loads(match.group())
    except Exception:
        pass
    return None


# ---------------- CHAT API (UNCHANGED) ----------------
@app.route("/api/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json(force=True)
        message = data.get("message", "").strip()
        chat_id = data.get("chat_id", str(uuid.uuid4()))

        if not message:
            return jsonify({"reply": "Message cannot be empty"}), 400

        prompt = (
            "You are a career guidance assistant.\n"
            "Explain topics clearly in your OWN words.\n"
            "Do NOT quote textbooks or copyrighted content.\n\n"
            f"User: {message}"
        )

        response = model.generate_content(prompt)

        reply = "Please rephrase your question."

        if response and response.candidates:
            c = response.candidates[0]
            if c.finish_reason == 1 and c.content.parts:
                reply = c.content.parts[0].text
            elif c.finish_reason == 4:
                reply = "Please rephrase to avoid copyrighted text."

        chat_sessions.setdefault(chat_id, []).append({
            "role": "user",
            "message": message,
            "time": datetime.now().strftime("%H:%M")
        })
        chat_sessions[chat_id].append({
            "role": "assistant",
            "message": reply,
            "time": datetime.now().strftime("%H:%M")
        })

        return jsonify({"reply": reply, "chat_id": chat_id})

    except Exception as e:
        if "429" in str(e) or "ResourceExhausted" in str(e):
            return jsonify({
                "reply": "AI usage limit reached. Please wait a minute and try again."
            }), 429

        logger.exception("Chat error")
        return jsonify({"reply": "Chat error occurred"}), 500


@app.route("/api/chats", methods=["GET"])
def get_chats():
    return jsonify(chat_sessions)


# ---------------- RESUME PREDICT API (UPDATED) ----------------
@app.route("/predict", methods=["POST"])
def predict():
    try:
        if "resume" not in request.files:
            return jsonify({"error": "Resume file required"}), 400

        resume_file = request.files["resume"]
        preferred_domain = request.form.get("preferredDomain", "")
        interests = request.form.get("interests", "")

        resume_text = extract_resume_text(resume_file)

        if not resume_text:
            return jsonify({"error": "Unable to extract resume text"}), 400

        prompt = f"""
You are an enterprise-grade AI Resume Analysis System.

Analyze the resume content and return ONLY valid JSON.
Do NOT include explanations, markdown, or extra text.

Resume Content:
{resume_text}

Preferred Domain: {preferred_domain}
User Interests: {interests}

Return JSON strictly in this format:

{{
  "score": 0-100,
  "roles": ["Role1", "Role2"],
  "skills": ["Skill1", "Skill2"],
  "summary": {{
    "education": "Short professional summary",
    "experience": "Short professional summary"
  }},
  "aspectScores": [
    {{ "name": "Formatting", "value": 0-100 }},
    {{ "name": "Keywords", "value": 0-100 }},
    {{ "name": "Experience", "value": 0-100 }}
  ],
  "roadmap": [
    "Step 1",
    "Step 2",
    "Step 3"
  ],
  "improvements": [
    "Improvement 1",
    "Improvement 2"
  ],
  "growthProjection": [
    {{ "year": 2025, "salary": 300000 }},
    {{ "year": 2026, "salary": 420000 }}
  ]
}}
"""

        response = model.generate_content(prompt)

        if not response or not response.candidates:
            return jsonify({"error": "AI did not return response"}), 500

        raw_text = response.candidates[0].content.parts[0].text
        parsed = safe_json_extract(raw_text)

        if not parsed:
            logger.error("Failed to parse AI JSON")
            return jsonify({"error": "Invalid AI response format"}), 500

        return jsonify(parsed)

    except json.JSONDecodeError:
        logger.exception("JSON decode error")
        return jsonify({"error": "AI returned malformed JSON"}), 500

    except Exception as e:
        if "429" in str(e) or "ResourceExhausted" in str(e):
            return jsonify({
                "error": "AI usage limit reached. Please wait 1 minute and retry."
            }), 429

        logger.exception("Resume analysis error")
        return jsonify({"error": "Failed to analyze resume"}), 500


# ---------------- Run App ----------------
if __name__ == "__main__":
    app.run(debug=True, port=5000)
