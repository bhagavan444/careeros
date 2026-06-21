/**
 * identityScoreEngine.js
 * 
 * Calculates the Progressive Identity Score based on a weighted system:
 * Personal Information = 15
 * Summary = 15
 * Education = 15
 * Skills = 15
 * Projects = 20
 * Experience = 15
 * Achievements = 5
 */

export const calculateIdentityScore = (resumeData) => {
  if (!resumeData) return { score: 0, breakdown: {}, nextAction: "Start your resume" };

  let totalScore = 0;
  const breakdown = {};
  
  // 1. Personal Info (15)
  let piScore = 0;
  if (resumeData.personalInfo?.name) piScore += 3;
  if (resumeData.personalInfo?.email) piScore += 3;
  if (resumeData.personalInfo?.phone) piScore += 3;
  if (resumeData.personalInfo?.title) piScore += 3;
  if (resumeData.personalInfo?.linkedin || resumeData.personalInfo?.github) piScore += 3;
  breakdown.personalInfo = { score: piScore, max: 15, name: "Personal Information" };
  totalScore += piScore;

  // 2. Summary (15)
  let summaryScore = 0;
  const summaryLength = resumeData.professionalSummary?.summary?.length || 0;
  if (summaryLength > 50) summaryScore += 15;
  else if (summaryLength > 10) summaryScore += 5;
  breakdown.summary = { score: summaryScore, max: 15, name: "Professional Summary" };
  totalScore += summaryScore;

  // 3. Education (15)
  let eduScore = 0;
  if (resumeData.education && resumeData.education.length > 0) {
    const validEdus = resumeData.education.filter(e => e.institution && e.degree);
    if (validEdus.length > 0) eduScore = 15;
    else if (resumeData.education.length > 0) eduScore = 5;
  }
  breakdown.education = { score: eduScore, max: 15, name: "Education" };
  totalScore += eduScore;

  // 4. Skills (15)
  let skillsScore = 0;
  if (resumeData.technicalSkills) {
    const populatedSkills = Object.values(resumeData.technicalSkills).filter(s => s && s.trim().length > 0).length;
    if (populatedSkills >= 3) skillsScore = 15;
    else if (populatedSkills > 0) skillsScore = 8;
  }
  breakdown.skills = { score: skillsScore, max: 15, name: "Technical Skills" };
  totalScore += skillsScore;

  // 5. Projects (20)
  let projScore = 0;
  if (resumeData.projects && resumeData.projects.length > 0) {
    const validProjs = resumeData.projects.filter(p => p.name && p.description && p.description.length > 20);
    if (validProjs.length >= 2) projScore = 20;
    else if (validProjs.length === 1) projScore = 12;
    else projScore = 5;
  }
  breakdown.projects = { score: projScore, max: 20, name: "Projects" };
  totalScore += projScore;

  // 6. Experience (15)
  let expScore = 0;
  if (resumeData.internships && resumeData.internships.length > 0) {
    const validExps = resumeData.internships.filter(e => e.role && e.company && e.description?.length > 20);
    if (validExps.length > 0) expScore = 15;
    else expScore = 5;
  }
  breakdown.experience = { score: expScore, max: 15, name: "Experience" };
  totalScore += expScore;

  // 7. Achievements (5)
  let achScore = 0;
  if (resumeData.achievements && resumeData.achievements.length > 0) {
    const validAch = resumeData.achievements.filter(a => a.title);
    if (validAch.length > 0) achScore = 5;
  }
  breakdown.achievements = { score: achScore, max: 5, name: "Achievements" };
  totalScore += achScore;

  // Determine Next Action
  let nextAction = "Review and Export";
  let lowestPercent = 1;
  let lowestSection = null;

  Object.entries(breakdown).forEach(([key, data]) => {
    const percent = data.score / data.max;
    if (percent < lowestPercent) {
      lowestPercent = percent;
      lowestSection = data.name;
    }
  });

  if (lowestSection && lowestPercent < 1) {
    nextAction = `Improve ${lowestSection}`;
  } else if (totalScore === 100) {
    nextAction = "Ready for Export!";
  }

  return {
    score: totalScore,
    breakdown,
    nextAction
  };
};
