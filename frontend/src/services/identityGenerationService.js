/**
 * identityGenerationService.js
 * 
 * Generates the full Resume Draft using the Identity Report.
 */

export const generateResumeDraft = async (identityReport) => {
  // Base skeleton matching the exact Resume Architecture
  const baseResume = {
    personalInfo: {
      name: "Generated User",
      title: identityReport.targetRole || "Software Engineer",
      email: "user@careeros.ai",
      phone: "+1 (555) 012-3456",
      location: "San Francisco, CA",
      linkedin: "linkedin.com/in/user",
      github: "github.com/user",
      portfolio: "",
      website: "",
      image: "",
    },
    professionalSummary: {
      summary: "",
      objective: "",
      targetRole: identityReport.targetRole || "Software Engineer",
      yearsOfExperience: "2+",
      industryFocus: "Technology",
    },
    education: [
      {
        id: Date.now(),
        institution: "University of Technology",
        degree: "B.S. Computer Science",
        branch: "Computer Science",
        cgpa: "3.8/4.0",
        percentage: "",
        startYear: "2020",
        endYear: "2024",
      }
    ],
    internships: [],
    projects: [],
    technicalSkills: {
      languages: "",
      frontend: "",
      backend: "",
      databases: "",
      aiMl: "",
      tools: "",
      cloud: "",
      devOps: "",
      coreSubjects: "",
      softSkills: ""
    },
    achievements: [],
    certifications: []
  };

  if (identityReport.draft) {
    const { draft } = identityReport;

    // 1. Map GitHub Repos to Projects
    if (draft.rawRepos && draft.rawRepos.length > 0) {
      baseResume.projects = draft.rawRepos.slice(0, 5).map((repo, i) => ({
        id: Date.now() + i,
        name: repo.name || "Open Source Project",
        category: "Software Development",
        duration: repo.created_at ? new Date(repo.created_at).getFullYear().toString() : "Recent",
        description: `${repo.description || 'Developed open-source repository.'}\n• Stars: ${repo.stars || 0} | Forks: ${repo.forks || 0}`,
        technologies: repo.language || 'Multiple',
        githubUrl: repo.url || '',
        liveUrl: '',
        impact: '',
        achievements: ''
      }));
    } else if (draft.project_bullets && draft.project_bullets.length > 0) {
      baseResume.projects = draft.project_bullets.map((bullet, i) => ({
        id: Date.now() + i,
        name: `Project ${i + 1}`,
        category: "Software",
        duration: "Recent",
        description: bullet,
        technologies: "",
        githubUrl: "",
        liveUrl: "",
        impact: "",
        achievements: ""
      }));
    }

    // 2. Map GitHub Skills to categorical technicalSkills
    if (draft.exactSkills && draft.exactSkills.length > 0) {
      // Very naive mapping for demo purposes. In a real app, AI classifies these.
      const skillsStr = draft.exactSkills.join(", ");
      baseResume.technicalSkills.languages = draft.exactSkills.slice(0, 4).join(", ");
      baseResume.technicalSkills.tools = draft.exactSkills.slice(4).join(", ");
    } else if (identityReport.strengths) {
      baseResume.technicalSkills.languages = identityReport.strengths.join(", ");
    }

    // 3. Map Summary
    if (draft.summary) {
      baseResume.professionalSummary.summary = draft.summary;
    }

    // 4. Map Achievements
    if (draft.achievement_bullets && draft.achievement_bullets.length > 0) {
      baseResume.achievements = draft.achievement_bullets.map((ach, i) => ({
        id: Date.now() + i,
        title: `Achievement ${i + 1}`,
        description: ach,
        date: "Recent",
        impact: "",
        category: "Award"
      }));
    }

    // 5. GitHub Username extraction
    if (identityReport.source.includes("GitHub")) {
      const username = identityReport.source.match(/@([^)]+)/)?.[1];
      if (username) baseResume.personalInfo.github = `github.com/${username}`;
    }

    return baseResume;
  }

  // Fallback to mock logic if backend was down
  await new Promise(resolve => setTimeout(resolve, 1500));
  baseResume.professionalSummary.summary = `Motivated ${identityReport.targetRole} recognized for strengths in ${(identityReport.strengths || []).join(", ")}.`;
  baseResume.technicalSkills.languages = (identityReport.strengths || []).join(", ");
  
  return baseResume;
};

// Targeted enhancers for future use
export const generateProfessionalSummary = async (role, skills) => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  return `Expert ${role} specialized in ${skills}. Track record of shipping high-impact products.`;
};

export const generateProjectBullets = async (description) => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  return `• AI Enhanced: Optimized the architecture based on original input.\n• AI Enhanced: Scaled the system to handle 10x throughput.`;
};
