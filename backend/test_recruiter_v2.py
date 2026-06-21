import asyncio
import os
import sys

backend_dir = os.path.abspath(os.path.dirname(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.services.recruiter_intelligence.orchestrator import RecruiterIntelligenceOrchestrator

async def main():
    print("=== Running V2 Recruiter Intelligence Pipeline (Direct Mode) ===")
    
    resume_text = "Senior React Engineer. Developed enterprise apps using React, Next.js, and Node.js. Built scalable backends with Python, FastAPI, and PostgreSQL. Deployed to AWS via Docker and Kubernetes. Led a team of 5 engineers."
    
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
    
    # We will pass a dummy github, but the resume and JD are the main drivers
    res = await RecruiterIntelligenceOrchestrator.analyze_direct(
        resume_text=resume_text,
        job_description=job_desc,
        github="bhagavan444"
    )
    
    print(f"\n[RESULTS]")
    print(f"Overall Match Score: {res.match_analysis.overall_match_score}%")
    print(f"Hiring Recommendation: {res.hiring_recommendation.decision}")
    print(f"Risk Level: {res.risk_analysis.risk_level} ({res.risk_analysis.risk_score}%)")
    
    print(f"\n[EXPLAINABILITY - MATCH]")
    m_exp = res.match_analysis.explainability
    if m_exp:
        print(f"Formula: {m_exp.formula}")
        print(f"Sources: {m_exp.evidence_sources}")
        for k, v in m_exp.weight_contributions.items():
            print(f" - {k}: {v}")
            
    print(f"\n[EXPLAINABILITY - RISK]")
    r_exp = res.risk_analysis.explainability
    if r_exp:
        print(f"Formula: {r_exp.formula}")
        for k, v in r_exp.weight_contributions.items():
            print(f" - {k}: {v}")
            
    print(f"\n[EXPLAINABILITY - DECISION]")
    d_exp = res.hiring_recommendation.explainability
    if d_exp:
        print(f"Formula: {d_exp.formula}")
        print(f"Reasoning:\n{d_exp.deterministic_reasoning}")
        
    print(f"\n[EVIDENCE REGISTRY]")
    for item in res.evidence_registry:
        print(f"{item.get('skill', 'Unknown')}:")
        print(f" - {item.get('source')} ({item.get('evidence_type')}) - {item.get('file', 'N/A')}")
            
if __name__ == "__main__":
    asyncio.run(main())
