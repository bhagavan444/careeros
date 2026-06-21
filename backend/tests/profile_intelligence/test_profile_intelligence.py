import pytest
from app.services.profile_intelligence.skill_taxonomy import SkillTaxonomy
from app.services.profile_intelligence.verification_matrix import VerificationMatrixEngine
from app.services.profile_intelligence.truth_engine import TruthEngine

def test_skill_taxonomy_normalization():
    assert SkillTaxonomy.normalize("reactjs") == "React"
    assert SkillTaxonomy.normalize("Node.js") == "Node.js"
    assert SkillTaxonomy.normalize("PYTHON3") == "Python"
    assert SkillTaxonomy.normalize("unknown_skill") == "Unknown_Skill"

def test_taxonomy_deduplication():
    skills = ["React", "reactjs", "node", "NodeJS", "aws"]
    dedup = SkillTaxonomy.deduplicate(skills)
    assert set(dedup) == {"React", "Node.js", "AWS"}

def test_verification_matrix_confidence_scoring():
    resume_data = {"skills": ["React", "Python"]}
    github_data = {"verified_skills": ["React", "Python", "Docker"]}
    portfolio_data = {"verified_skills": ["React"]}
    linkedin_data = {"verified_skills": ["React"]}
    
    matrix = VerificationMatrixEngine.generate(resume_data, github_data, portfolio_data, linkedin_data)
    
    # React has 4 sources (100)
    # Python has 2 sources (75)
    # Docker has 1 source (50)
    
    for skill in matrix["verified_skills"]:
        if skill["skill"] == "React":
            assert skill["confidence_score"] == 100
            
    for skill in matrix["partially_verified_skills"]:
        if skill["skill"] == "Python":
            assert skill["confidence_score"] == 75
        elif skill["skill"] == "Docker":
            assert skill["confidence_score"] == 50

def test_truth_engine_scoring():
    matrix = {
        "verified_skills": [{"skill": "React", "confidence_score": 100}],
        "partially_verified_skills": [{"skill": "Python", "confidence_score": 75}, {"skill": "Docker", "confidence_score": 50}],
        "unverified_skills": [{"skill": "AWS", "confidence_score": 0}]
    }
    
    candidate_data = {
        "resume": {"skills": ["React", "Python", "AWS"]},
        "github": {"verified_skills": ["React", "Python", "Docker"]},
        "portfolio": {"status": "success", "verified_skills": ["React"]},
        "linkedin": {"status": "no_evidence"}
    }
    
    result = TruthEngine.calculate_score(matrix, candidate_data)
    
    # 4 skills total.
    # Verification Score average: (100 + 75 + 50 + 0) / 4 = 56
    # Evidence: React, Python, Docker have external evidence (3/4) = 75%
    # Truth Score: (56 * 0.6) + (75 * 0.4) = 33.6 + 30 = 63
    
    assert result["verification_score"] == 56
    assert result["evidence_coverage"] == 75
    assert result["score"] == 63
    assert result["source_coverage"]["resume"] == True
    assert result["source_coverage"]["linkedin"] == False
