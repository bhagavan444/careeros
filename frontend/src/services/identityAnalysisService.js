/**
 * identityAnalysisService.js
 * 
 * Analyzes career signals (manual inputs or GitHub) to generate a
 * Professional Identity Report BEFORE generating the resume.
 */
import apiClient from "./apiClient";

export const analyzeIdentity = async (signals) => {
  try {
    const response = await apiClient.post('/api/v1/identity/generate', signals);
    const data = response.data.data; // Since backend returns {"status": "success", "data": result}
    
    // We get back the whole IdentityGenerationOutput
    // We attach the generated resume content directly onto the report so we can use it later
    return {
      ...data.identity_report,
      targetRole: signals.targetRole || "Software Engineer",
      identityScore: data.identity_report.score,
      recommendedFocus: data.identity_report.recommended_focus,
      readiness: `${data.identity_report.score}%`,
      source: "Manual Signals",
      // Include the generated draft components
      draft: {
        summary: data.professional_summary,
        project_bullets: data.project_bullets,
        achievement_bullets: data.achievement_bullets,
        experience_highlights: data.experience_highlights,
        career_narrative: data.career_narrative
      }
    };
  } catch (error) {
    console.error("Identity Analysis Error", error);
    // Fallback if backend is down
    return {
      targetRole: signals.targetRole || "Software Engineer",
      identityScore: 75,
      careerMaturity: "Intermediate",
      strengths: ["Problem Solving"],
      skillGaps: ["System Design"],
      recommendedFocus: "Software Engineering",
      readiness: "75%",
      source: "Manual Signals",
      draft: null
    };
  }
};

export const analyzeGitHubIdentity = async (username) => {
  try {
    // 1. Fetch GitHub Intelligence
    const githubResponse = await apiClient.get(`/api/v1/github/analyze/${username}`);
    const githubData = githubResponse.data;

    // 2. Map GitHub data into signals for the Identity Engine
    const languages = Object.keys(githubData.analytics.language_distribution || {}).slice(0, 5).join(", ");
    const topRepos = (githubData.repositories || []).slice(0, 3).map(r => `${r.name} (${r.language || 'Unknown'}): ${r.description || 'No description'}`).join(" | ");
    const techVerification = githubData.analytics.tech_verification?.verified_skills?.join(", ") || "";
    
    const signals = {
      targetRole: "Software Engineer", 
      skills: `${languages}, ${techVerification}`,
      projects: topRepos,
      achievements: "Significant open-source contributor with verified engineering maturity.",
      careerGoals: "Leveraging GitHub experience in a high-impact engineering role."
    };

    // 3. Call the Identity Generation Engine with GitHub signals
    const identityResponse = await apiClient.post('/api/v1/identity/generate', signals);
    const data = identityResponse.data.data;

    return {
      ...data.identity_report,
      targetRole: "Software Engineer",
      identityScore: data.identity_report.score,
      recommendedFocus: data.identity_report.recommended_focus,
      readiness: `${data.identity_report.score}%`,
      source: `GitHub Profile (@${username})`,
      draft: {
        summary: data.professional_summary,
        project_bullets: data.project_bullets,
        achievement_bullets: data.achievement_bullets,
        experience_highlights: data.experience_highlights,
        career_narrative: data.career_narrative,
        rawRepos: githubData.repositories, // Pass the exact repos to the generator
        exactSkills: Array.from(new Set([...Object.keys(githubData.analytics.language_distribution || {}), ...(githubData.analytics.tech_verification?.verified_skills || [])]))
      }
    };
  } catch (error) {
    console.error("GitHub Identity Analysis Error", error);
    // Fallback Mock
    return {
      targetRole: "Full Stack Engineer",
      identityScore: 88,
      careerMaturity: "Senior",
      primaryStack: "React + Node.js",
      projectQuality: "Strong",
      strengths: ["Open Source", "Code Quality"],
      skillGaps: ["Cloud Ops"],
      recommendedFocus: "Architecture",
      readiness: "88%",
      source: `GitHub Profile (@${username})`,
      draft: null
    };
  }
};
