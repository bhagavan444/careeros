from typing import Dict, Any, List
from app.schemas.profile_intelligence import InterviewIntelligence, VerificationMatrix, CareerPositioning

class InterviewIntelligenceEngine:
    @staticmethod
    def generate(matrix: VerificationMatrix, career_positioning: CareerPositioning) -> InterviewIntelligence:
        """
        Generates interview preparation insights based strictly on verified skills.
        """
        verified_skills = [s.skill for s in matrix.verified_skills]
        
        likely_topics: Dict[str, List[str]] = {}
        suggested_tech = []
        suggested_system = []
        
        # Categorize topics
        frontend = [s for s in verified_skills if s.lower() in ["react", "vue", "angular", "javascript", "typescript", "html", "css"]]
        if frontend:
            likely_topics["Frontend"] = frontend
            suggested_tech.append(f"Deep dive into state management and component lifecycle in {frontend[0]}.")
            
        backend = [s for s in verified_skills if s.lower() in ["python", "java", "c#", "node.js", "express", "django", "fastapi", "spring"]]
        if backend:
            likely_topics["Backend"] = backend
            suggested_tech.append(f"Discuss API design and middleware implementation in {backend[0]}.")
            
        database = [s for s in verified_skills if s.lower() in ["sql", "mysql", "postgresql", "mongodb", "redis"]]
        if database:
            likely_topics["Database"] = database
            suggested_tech.append(f"Ask about indexing strategies and query optimization in {database[0]}.")
            
        devops = [s for s in verified_skills if s.lower() in ["docker", "kubernetes", "aws", "azure", "gcp", "ci/cd", "terraform"]]
        if devops:
            likely_topics["DevOps"] = devops
            suggested_system.append(f"Design a scalable deployment architecture utilizing {devops[0]}.")
            
        # Determine Difficulty
        if career_positioning.level in ["Staff Candidate", "Senior Candidate"]:
            difficulty = "Senior"
            suggested_system.append("Design a high-throughput, low-latency distributed system. Focus on partition tolerance.")
        elif career_positioning.level == "Mid-Level Candidate":
            difficulty = "Intermediate"
            suggested_system.append("Design a scalable microservice architecture. Focus on database sharding.")
        elif career_positioning.level == "Junior+":
            difficulty = "Beginner to Intermediate"
            suggested_system.append("Design a basic web application architecture with caching.")
        else:
            difficulty = "Beginner"
            suggested_system.append("Discuss the differences between SQL and NoSQL databases.")
            
        if not suggested_tech:
            suggested_tech.append("Assess basic programming fundamentals (data structures and algorithms).")
            
        return InterviewIntelligence(
            difficulty=difficulty,
            likely_topics=likely_topics,
            suggested_technical_questions=suggested_tech,
            suggested_system_design_questions=suggested_system
        )
