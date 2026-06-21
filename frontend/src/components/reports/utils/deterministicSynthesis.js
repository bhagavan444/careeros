/**
 * deterministicSynthesis.js
 * 
 * Generates Flagship Due Diligence metrics strictly from deterministic endpoints.
 * Completely eliminates AI hallucinations for scoring and positioning.
 */

export const synthesizeMetrics = (data) => {
  if (!data) return {};

  const repos = data.repositories || [];
  
  const maturity = data?.analytics?.engineering_maturity?.overall_score || 0;
  const trust = data?.analytics?.technology_trust?.trust_score || 0;
  const archScore = data?.analytics?.architecture_intelligence?.architecture_score || 0;
  const growthScore = data?.analytics?.engineering_evolution?.growth_score || 0;
  const complexity = repos.length > 0 ? Math.round(repos.reduce((acc, repo) => acc + (repo.complexity_score || 0), 0) / repos.length) : 0;

  // 1. Overall Engineering Score (V3 Formula)
  const overallScore = Math.round((0.30 * maturity) + (0.25 * trust) + (0.20 * archScore) + (0.15 * Math.min(100, complexity * 1.5)) + (0.10 * growthScore));

  // 2. Candidate Category
  let candidateCategory = "Emerging Engineer";
  if (overallScore >= 90) candidateCategory = "Elite Engineer";
  else if (overallScore >= 80) candidateCategory = "Advanced Engineer";
  else if (overallScore >= 70) candidateCategory = "Strong Engineer";
  else if (overallScore >= 60) candidateCategory = "Developing Engineer";

  // 3. Evidence Matrix (V3)
  const verifiedTechs = data?.analytics?.technology_trust?.verified_technologies || {};
  const weakTechs = data?.analytics?.technology_trust?.weak_evidence_technologies || {};
  const unverifiedTechs = data?.analytics?.technology_trust?.unverified_technologies || {};

  const evidenceMatrix = [];
  
  const processTech = (tech, sourceStr, conf) => {
    const s = sourceStr.toLowerCase();
    const hasResume = s.includes("resume") || s.includes("profile");
    const hasGithub = s.includes("github") || s.includes("repo") || s.includes("package.json") || s.includes("requirements");
    const hasPortfolio = s.includes("portfolio") || s.includes("website");
    const hasLinkedIn = s.includes("linkedin");
    
    // Fallback if no specific source mapped but verified
    const isGit = hasGithub || (conf > 0 && !hasResume && !hasPortfolio && !hasLinkedIn);

    evidenceMatrix.push({
      tech,
      resume: hasResume,
      github: isGit,
      portfolio: hasPortfolio,
      linkedin: hasLinkedIn,
      confidence: conf,
      sourceStr
    });
  };

  Object.entries(verifiedTechs).forEach(([tech, source]) => processTech(tech, source, 100));
  Object.entries(weakTechs).forEach(([tech, source]) => processTech(tech, source, 70));
  Object.keys(unverifiedTechs).forEach((tech) => processTech(tech, "None", 0));

  // 4. Interview Readiness Engine
  const evaluateReadiness = (domain, keywords) => {
    const matchedTechs = evidenceMatrix.filter(t => keywords.some(k => t.tech.toLowerCase().includes(k.toLowerCase()) && t.confidence > 0));
    const score = Math.min(100, matchedTechs.length * 20 + (overallScore * 0.4));
    
    let difficulty = "Beginner";
    if (score > 85) difficulty = "Senior";
    else if (score > 70) difficulty = "Advanced";
    else if (score > 40) difficulty = "Intermediate";

    return {
      domain,
      score: Math.round(score),
      difficulty,
      strengths: matchedTechs.map(t => t.tech).slice(0, 3).join(", ") || "None detected",
      weaknesses: matchedTechs.length === 0 ? "No verified tools in this domain." : "May lack enterprise scale experience.",
      evidence: matchedTechs.length > 0 ? "GitHub repositories" : "None"
    };
  };

  const interviewReadiness = [
    evaluateReadiness("Frontend", ["react", "vue", "angular", "html", "css", "js", "ts", "next", "svelte", "tailwind"]),
    evaluateReadiness("Backend", ["node", "python", "java", "go", "ruby", "c#", "php", "django", "fastapi", "express", "spring"]),
    evaluateReadiness("Database", ["sql", "mongo", "postgres", "mysql", "redis", "cassandra", "dynamo"]),
    evaluateReadiness("System Design", ["docker", "k8s", "aws", "gcp", "azure", "kafka", "rabbit", "microservices"]),
    evaluateReadiness("DevOps", ["docker", "kubernetes", "jenkins", "github actions", "gitlab", "ci/cd", "terraform"]),
    evaluateReadiness("AI Engineering", ["python", "tensorflow", "pytorch", "langchain", "openai", "huggingface", "keras", "ml"])
  ];

  // 5. Market Positioning
  let marketLevel = "Entry Level Candidate";
  if (overallScore >= 95) marketLevel = "Staff Candidate";
  else if (overallScore >= 85) marketLevel = "Senior Candidate";
  else if (overallScore >= 75) marketLevel = "Mid-Level Candidate";
  else if (overallScore >= 65) marketLevel = "Junior+ Candidate";
  else if (overallScore >= 50) marketLevel = "Junior Candidate";

  const evaluatePositioning = (name, baseScore, multiplier) => {
    const score = Math.min(100, Math.round(baseScore * multiplier));
    return {
      name,
      score,
      why: score > 75 ? "Strong verified metrics align with this profile." : "Lacks sufficient depth in required vectors.",
      evidence: score > 75 ? "High complexity scores and tech breadth." : "Limited repository complexity.",
      missing: score > 75 ? "Enterprise scale validation." : "Core foundational experience."
    };
  };

  const marketPositioning = [
    evaluatePositioning("Startup Readiness", (complexity * 1.5 + growthScore) / 2, 1.1),
    evaluatePositioning("Enterprise Readiness", (archScore * 1.5 + maturity) / 2, 1.0),
    evaluatePositioning("Product Engineering Readiness", (trust + maturity) / 2, 1.1),
    evaluatePositioning("AI Engineering Readiness", interviewReadiness.find(i => i.domain === "AI Engineering").score, 1.0)
  ];

  // 6. Hiring Recommendation
  let hiringRec = "Pass";
  let recConfidence = "Low";
  if (overallScore >= 85) { hiringRec = "Strong Hire"; recConfidence = "High"; }
  else if (overallScore >= 70) { hiringRec = "Hire"; recConfidence = "High"; }
  else if (overallScore >= 60) { hiringRec = "Consider"; recConfidence = "Medium"; }
  else if (overallScore >= 40) { hiringRec = "Needs Development"; recConfidence = "Medium"; }

  // 7. Portfolio Intelligence Rankings
  const topProject = repos.sort((a,b) => (b.complexity_score || 0) - (a.complexity_score || 0))[0] || null;
  
  // Sort by tech stack breadth to find most recruiter relevant
  const mostRelevant = repos.sort((a,b) => (b.detected_stack?.length || 0) - (a.detected_stack?.length || 0))[0] || null;

  return {
    maturity, trust, complexity, archScore, growthScore, overallScore,
    candidateCategory,
    evidenceMatrix,
    interviewReadiness,
    marketLevel,
    marketPositioning,
    hiringRec,
    recConfidence,
    portfolioRankings: {
      topProject: topProject,
      mostRelevant: mostRelevant,
      mostMature: repos.find(r => r.deployment?.[0]?.includes("Docker") || r.deployment?.[0]?.includes("Vercel")) || topProject,
      technicalDepth: repos.sort((a,b) => (b.features?.length || 0) - (a.features?.length || 0))[0] || topProject,
      businessImpact: repos.sort((a,b) => (b.complexity_score || 0) - (a.complexity_score || 0))[0] || topProject
    }
  };
};
