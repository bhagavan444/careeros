import html2pdf from "html2pdf.js";

export default async function generateEnterprisePDF(data, outcome) {
  // Defensive checks
  if (!data || !outcome) {
    alert("Please complete the Interview Outcome Evaluation before exporting the final Enterprise PDF.");
    return;
  }

  const {
    readiness,
    blueprint,
    skill_validation_strategy,
    risk_investigation_strategy,
    interview_simulation,
    scorecard,
    coverage,
    heatmap,
    raw_intelligence
  } = data;

  const { outcome: outcomeData, hiring_decision } = outcome;

  // Build massive HTML template
  const element = document.createElement("div");
  element.style.padding = "40px";
  element.style.fontFamily = "Arial, sans-serif";
  element.style.color = "#111827";

  element.innerHTML = `
    <div style="text-align: center; margin-bottom: 40px;">
      <h1 style="font-size: 28px; color: #111827; margin: 0 0 10px;">CareerOS Enterprise</h1>
      <h2 style="font-size: 20px; color: #6b7280; margin: 0;">Interview Intelligence & Hiring Decision Report</h2>
      <p style="margin-top: 10px; color: #9ca3af; font-size: 12px;">Generated: ${new Date().toLocaleString()} | Report ID: PATH-${Math.random().toString(36).substring(7).toUpperCase()}</p>
    </div>

    <hr style="border: none; border-top: 1px solid #e5e7eb; margin-bottom: 30px;" />

    <h2 style="color: #3b82f6; font-size: 22px; border-bottom: 2px solid #3b82f6; padding-bottom: 5px;">1. Executive Recommendation</h2>
    <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 30px; border-left: 4px solid #3b82f6;">
      <h3 style="margin: 0 0 10px; font-size: 24px;">${hiring_decision.decision} (Confidence: ${hiring_decision.confidence}%)</h3>
      <p style="margin: 0; line-height: 1.6;">${hiring_decision.executive_summary}</p>
      <p style="margin: 10px 0 0; font-weight: bold;">Recommended Action: ${hiring_decision.recommended_action}</p>
    </div>

    <h2 style="color: #10b981; font-size: 22px; border-bottom: 2px solid #10b981; padding-bottom: 5px;">2. Post-Interview Outcome</h2>
    <div style="margin-bottom: 30px;">
      <p><b>Offer Readiness:</b> ${outcomeData.offer_readiness}</p>
      <p><b>Predicted Ramp-Up Time:</b> ${outcomeData.ramp_up_prediction}</p>
      <p><b>Business Justification:</b> ${outcomeData.justification}</p>
    </div>

    <h2 style="color: #8b5cf6; font-size: 22px; border-bottom: 2px solid #8b5cf6; padding-bottom: 5px;">3. Interview Readiness</h2>
    <div style="margin-bottom: 30px;">
      <p><b>Score:</b> ${readiness.readiness_score} / 100</p>
      <p><b>Difficulty Classification:</b> ${readiness.interview_difficulty}</p>
      <p><b>Top Strengths:</b> ${readiness.strengths.join(", ")}</p>
      <p><b>Key Weaknesses:</b> ${readiness.weaknesses.join(", ")}</p>
    </div>

    <h2 style="color: #f59e0b; font-size: 22px; border-bottom: 2px solid #f59e0b; padding-bottom: 5px;">4. Job Description Coverage</h2>
    <div style="margin-bottom: 30px;">
      <p><b>Coverage Score:</b> ${coverage.coverage_score}%</p>
      <p><b>Covered Skills:</b> ${coverage.covered_skills.join(", ") || "None"}</p>
      <p><b>Coverage Gaps:</b> ${coverage.coverage_gaps.join(" | ") || "None"}</p>
    </div>

    <div style="page-break-before: always;"></div>

    <h2 style="color: #ec4899; font-size: 22px; border-bottom: 2px solid #ec4899; padding-bottom: 5px;">5. Skill Heatmap Matrix</h2>
    <div style="margin-bottom: 30px;">
      ${heatmap.map(item => `
        <div style="margin-bottom: 10px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <strong>${item.skill_name}</strong>
            <span>${item.strength_score}/100</span>
          </div>
          <div style="width: 100%; background: #e5e7eb; height: 10px; border-radius: 5px;">
            <div style="width: ${item.strength_score}%; background: ${item.strength_score >= 80 ? '#10b981' : item.strength_score >= 50 ? '#3b82f6' : '#ef4444'}; height: 10px; border-radius: 5px;"></div>
          </div>
        </div>
      `).join("")}
    </div>

    <h2 style="color: #6366f1; font-size: 22px; border-bottom: 2px solid #6366f1; padding-bottom: 5px;">6. Dynamic Interview Blueprint</h2>
    <div style="margin-bottom: 30px;">
      <p><b>Total Expected Duration:</b> ${blueprint.total_duration_hours} hours</p>
      ${blueprint.rounds.map(r => `
        <div style="margin-bottom: 15px; padding: 15px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h4 style="margin: 0 0 5px;">Round ${r.round_number}: ${r.round_name} (${r.duration_minutes} min)</h4>
          <p style="margin: 0 0 5px; font-size: 14px; color: #4b5563;"><b>Interviewer:</b> ${r.suggested_interviewer}</p>
          <p style="margin: 0; font-size: 14px; color: #4b5563;"><b>Focus Areas:</b> ${r.focus_areas.join(", ")}</p>
        </div>
      `).join("")}
    </div>

    <h2 style="color: #ef4444; font-size: 22px; border-bottom: 2px solid #ef4444; padding-bottom: 5px;">7. Risk Investigation Strategy</h2>
    <div style="margin-bottom: 30px;">
      ${risk_investigation_strategy.length === 0 ? "<p>No critical risks identified.</p>" : risk_investigation_strategy.map(r => `
        <div style="margin-bottom: 15px;">
          <h4 style="margin: 0 0 5px; color: #b91c1c;">Risk: ${r.risk_factor}</h4>
          <p style="margin: 0 0 5px; font-size: 14px;"><b>Probing Questions:</b> ${r.probing_questions.join(" ")}</p>
          <p style="margin: 0; font-size: 14px; color: #b91c1c;"><b>Red Flag Signals:</b> ${r.red_flag_signals.join(" ")}</p>
        </div>
      `).join("")}
    </div>
    
    <div style="page-break-before: always;"></div>

    <h2 style="color: #14b8a6; font-size: 22px; border-bottom: 2px solid #14b8a6; padding-bottom: 5px;">8. Hiring Scorecard Rubric</h2>
    <div style="margin-bottom: 30px;">
      <p><b>Total Possible Score:</b> ${scorecard.total_max_score}</p>
      <p><b>Strong Hire Threshold:</b> ${scorecard.strong_hire_threshold}</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
        <thead>
          <tr style="background: #f3f4f6; text-align: left;">
            <th style="padding: 10px; border: 1px solid #e5e7eb;">Category</th>
            <th style="padding: 10px; border: 1px solid #e5e7eb;">Max Score</th>
          </tr>
        </thead>
        <tbody>
          ${scorecard.categories.map(c => `
            <tr>
              <td style="padding: 10px; border: 1px solid #e5e7eb;">${c.category_name}</td>
              <td style="padding: 10px; border: 1px solid #e5e7eb; text-align: center;">${c.max_score}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>

    <div style="text-align: center; margin-top: 60px; color: #9ca3af; font-size: 12px; opacity: 0.5;">
      <p>CONFIDENTIAL - INTERNAL USE ONLY</p>
      <p>CAREEROS INTERVIEW INTELLIGENCE OS V2</p>
    </div>
  `;

  // Apply html2pdf
  const opt = {
    margin:       10,
    filename:     'CareerOS_Hiring_Decision_Report.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  try {
    await html2pdf().from(element).set(opt).save();
  } catch (error) {
    console.error("PDF Generation Failed:", error);
    alert("Failed to generate PDF. Please try again.");
  }
}
