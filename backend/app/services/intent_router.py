import re
from typing import Dict, Tuple

class IntentRouter:
    """
    Classifies user queries into specific CareerOS domains with a confidence score.
    If confidence is low, the orchestrator should fall back to Knowledge Base or Gemini.
    """
    
    INTENT_PATTERNS = {
        "resume": [
            r"\b(resume|cv|ats|cover letter)\b",
            r"\banalyze my (resume|cv)\b",
            r"\b(resume|cv) score\b",
            r"\bupdate my (resume|cv)\b"
        ],
        "github": [
            r"\b(github|repo|repository|commits|pull requests|pr)\b",
            r"\banalyze my code\b",
            r"\bgithub profile\b"
        ],
        "recruiter": [
            r"\b(recruiter|hiring manager|red flags|feedback|concerns)\b",
            r"\bwhat would a recruiter say\b",
            r"\bhire me\b"
        ],
        "profile": [
            r"\b(profile|skills gap|missing skills|weaknesses|strengths)\b",
            r"\banalyze my profile\b",
            r"\bam i ready\b"
        ],
        "roadmap": [
            r"\b(roadmap|learning path|what should i learn|study plan|next steps)\b",
            r"\bhow to become\b",
            r"\bguide me\b"
        ],
        "interview": [
            r"\b(interview|mock interview|practice|system design|dsa)\b",
            r"\bask me a question\b",
            r"\btest my skills\b"
        ],
        "talent_ranking": [
            r"\b(ranking|benchmark|percentile|compare me|industry standard)\b",
            r"\bhow do i rank\b",
            r"\bwhere do i stand\b"
        ]
    }

    def detect_intent(self, query: str) -> Tuple[str, float]:
        """
        Returns (intent, confidence)
        Intent can be one of the defined domains or "general".
        """
        query_lower = query.lower()
        best_intent = "general"
        highest_confidence = 0.0
        
        for intent, patterns in self.INTENT_PATTERNS.items():
            matches = 0
            for pattern in patterns:
                if re.search(pattern, query_lower):
                    matches += 1
            
            if matches > 0:
                # Simple heuristic: 1 match = 0.70, 2 matches = 0.85, 3+ = 0.95
                if matches == 1:
                    confidence = 0.70
                elif matches == 2:
                    confidence = 0.85
                else:
                    confidence = 0.95
                
                if confidence > highest_confidence:
                    highest_confidence = confidence
                    best_intent = intent
                    
        return best_intent, highest_confidence
