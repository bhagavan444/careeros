import asyncio
import json
import os
import sys

# Ensure backend root is in Python path for app/* imports
backend_dir = os.path.abspath(os.path.dirname(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.schemas.profile_intelligence import ProfileIntelligenceRequest
from app.services.profile_intelligence.orchestrator import ProfileIntelligenceOrchestrator

async def run_benchmarks():
    candidates = ["bhagavan444", "torvalds", "tiangolo", "gaearon"]
    report = []

    for gh_user in candidates:
        print(f"Benchmarking {gh_user}...")
        request = ProfileIntelligenceRequest(github=gh_user)
        try:
            # We are testing with just GitHub inputs to see how the system handles missing Resume/Portfolio data
            # This explicitly tests Phase F Failure Recovery as well.
            response = await ProfileIntelligenceOrchestrator.analyze(request)
            report.append({
                "candidate": gh_user,
                "truth_score": response.truth_score.score,
                "evidence_score": response.truth_score.evidence_coverage,
                "verification_score": response.truth_score.verification_score,
                "verified_skills_count": len(response.verification_matrix.verified_skills),
                "unverified_skills_count": len(response.verification_matrix.unverified_skills),
                "risk_flags": [r.risk for r in response.risk_analysis.critical_risks],
                "score_reasoning": response.truth_score.score_reasoning
            })
            print(f"Success for {gh_user}: Truth Score {response.truth_score.score}")
        except Exception as e:
            print(f"Failed for {gh_user}: {e}")

    # Write report
    # Output to the artifacts directory as requested
    artifacts_dir = r"C:\Users\rocky\.gemini\antigravity\brain\3ead212e-f7f5-41c6-b28d-16c51ac2e866"
    report_path = os.path.join(artifacts_dir, "candidate_validation_report.json")
    
    with open(report_path, "w") as f:
        json.dump(report, f, indent=4)
        
    print(f"Benchmark completed. Report saved to {report_path}")

if __name__ == "__main__":
    asyncio.run(run_benchmarks())
