import asyncio
import os
import sys

backend_dir = os.path.abspath(os.path.dirname(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.schemas.profile_intelligence import ProfileIntelligenceRequest
from app.services.profile_intelligence.orchestrator import ProfileIntelligenceOrchestrator

from app.schemas.recruiter_intelligence import RecruiterIntelligenceRequest
from app.services.recruiter_intelligence.orchestrator import RecruiterIntelligenceOrchestrator

async def main():
    print("=== Step 1: Generating Profile Intelligence (and saving to store) ===")
    profile_req = ProfileIntelligenceRequest(
        github="bhagavan444",
        resume_text="Senior React Engineer. Developed enterprise apps using React, Next.js, and Node.js. Built scalable backends with Python, FastAPI, and PostgreSQL. Deployed to AWS via Docker and Kubernetes. Led a team of 5 engineers.",
        linkedin="linkedin.com/in/bhagavan444",
        portfolio="bhagavan.dev"
    )
    
    # This automatically saves to CandidateStore as 'bhagavan444.json'
    profile_res = await ProfileIntelligenceOrchestrator.analyze(profile_req)
    print(f"Profile Intelligence Generated. Truth Score: {profile_res.truth_score.score}")
    
    print("\n=== Step 2: Running Recruiter Intelligence ===")
    job_desc = """
    We are looking for a Senior Frontend Engineer to lead our UI platform.
    
    Required Skills:
    - React
    - Next.js
    - TypeScript
    - Tailwind CSS
    
    Preferred Skills:
    - Node.js
    - GraphQL
    - AWS
    - Docker
    
    Experience: 5+ years of software engineering.
    """
    
    recruiter_req = RecruiterIntelligenceRequest(
        candidate_id="bhagavan444",
        job_description=job_desc
    )
    
    recruiter_res = RecruiterIntelligenceOrchestrator.analyze(recruiter_req)
    
    print(f"\n[RESULTS]")
    print(f"Overall Match Score: {recruiter_res.match_analysis.overall_match_score}%")
    print(f"Hiring Recommendation: {recruiter_res.hiring_recommendation.decision}")
    print(f"Reasoning: {recruiter_res.hiring_recommendation.reasoning}")
    print(f"\n[GAP ANALYSIS]")
    print(f"Critical Gaps: {[s.skill_name for s in recruiter_res.skill_gap_analysis.critical_missing]}")
    print(f"Moderate Gaps: {[s.skill_name for s in recruiter_res.skill_gap_analysis.moderate_missing]}")
    print(f"\n[RISK ANALYSIS]")
    print(f"Risk Score: {recruiter_res.risk_analysis.risk_score}")
    print(f"Risk Level: {recruiter_res.risk_analysis.risk_level}")
    
if __name__ == "__main__":
    asyncio.run(main())
