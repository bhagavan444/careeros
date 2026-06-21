import React, { forwardRef } from 'react';

// Renders individual resume sections. Supports being measured via ref or data attributes.
export const SectionRenderer = forwardRef(({ type, data, itemData, template, isGhost }, ref) => {
  // Ghost styles
  const ghostWrapperStyle = isGhost ? { opacity: 0.4, filter: "grayscale(100%)", background: "rgba(0,0,0,0.02)", borderRadius: "4px", padding: "4px", border: "1px dashed #cbd5e1" } : {};
  const ghostTextStyle = isGhost ? { color: "#94a3b8" } : {};
  // Styles based on template
  const isProfessional = template === 'professional' || template === 'data-scientist';
  const isEngineering = template === 'engineering' || template === 'ai-engineer';
  const isModern = template === 'modern' || template === 'student';
  const isExecutive = template === 'executive';

  const headingStyle = {
    fontSize: isProfessional ? "14pt" : isModern ? "14pt" : isEngineering ? "14pt" : "16pt",
    textTransform: "uppercase",
    borderBottom: isProfessional ? "1px solid #000" : isEngineering ? "2px solid #1e3a8a" : isModern ? "2px solid #e2e8f0" : "1px solid #999",
    marginTop: "16px",
    marginBottom: "8px",
    paddingBottom: "4px",
    color: isEngineering ? "#1e3a8a" : isModern ? "#0f172a" : "#000",
    fontFamily: isEngineering ? "Consolas, monospace" : isModern ? "Helvetica Neue, sans-serif" : isExecutive ? "Garamond, serif" : "Arial, sans-serif",
    letterSpacing: isModern ? "1px" : "normal"
  };

  const textStyle = {
    fontSize: isProfessional ? "11pt" : isEngineering ? "10pt" : isModern ? "11pt" : "12pt",
    lineHeight: isModern ? "1.6" : "1.5",
    fontFamily: isEngineering ? "Consolas, monospace" : isModern ? "Helvetica Neue, sans-serif" : isExecutive ? "Garamond, serif" : "Georgia, serif",
  };

  if (type === 'header') {
    return (
      <header ref={ref} style={{ marginBottom: "20px", textAlign: "center", ...textStyle }}>
        <h1 style={{ 
          fontSize: isModern ? "28pt" : isExecutive ? "26pt" : "24pt", 
          marginBottom: "8px",
          color: isEngineering ? "#1e3a8a" : isModern ? "#0f172a" : "#000",
          fontFamily: isProfessional ? "Georgia, serif" : isModern ? "Helvetica Neue, sans-serif" : isEngineering ? "Consolas, monospace" : "Garamond, serif",
          fontWeight: isModern ? "300" : "bold",
          letterSpacing: isModern ? "2px" : isExecutive ? "3px" : "normal",
          textTransform: isExecutive ? "uppercase" : "none",
          borderBottom: isExecutive ? "2px solid #111" : isEngineering ? "2px solid #1e3a8a" : "none",
        }}>{data?.name || "Your Name"}</h1>
        {data?.title && <div style={{ fontSize: "12pt", marginBottom: "8px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", color: "#333" }}>{data.title}</div>}
        
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "8px", fontSize: "10pt", color: "#444" }}>
          {data?.email && <span>{data.email}</span>}
          {data?.phone && <span>• {data.phone}</span>}
          {data?.location && <span>• {data.location}</span>}
        </div>
        
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "8px", fontSize: "10pt", color: "#444", marginTop: "4px" }}>
          {data?.linkedin && <span><a href={`https://${data.linkedin.replace('https://', '')}`} style={{color: "inherit", textDecoration: "none"}}>{data.linkedin}</a></span>}
          {data?.github && <span>• <a href={`https://${data.github.replace('https://', '')}`} style={{color: "inherit", textDecoration: "none"}}>{data.github}</a></span>}
          {data?.portfolio && <span>• <a href={`https://${data.portfolio.replace('https://', '')}`} style={{color: "inherit", textDecoration: "none"}}>{data.portfolio}</a></span>}
          {data?.website && <span>• <a href={`https://${data.website.replace('https://', '')}`} style={{color: "inherit", textDecoration: "none"}}>{data.website}</a></span>}
        </div>
      </header>
    );
  }

  if (type === 'summary') {
    return (
      <section ref={ref} style={{ ...textStyle, marginBottom: "16px", ...ghostWrapperStyle }}>
        <h2 style={{ ...headingStyle, ...ghostTextStyle }}>Professional Summary</h2>
        <p style={{ whiteSpace: "pre-line", textAlign: "justify", margin: 0, ...ghostTextStyle }}>{data.summary}</p>
      </section>
    );
  }

  if (type === 'education_header') {
    return <h2 ref={ref} style={{ ...headingStyle, ...ghostTextStyle, ...(isGhost && ghostWrapperStyle) }}>Education</h2>;
  }
  
  if (type === 'education_item') {
    return (
      <div ref={ref} style={{ marginBottom: "12px", ...textStyle, ...ghostWrapperStyle, ...ghostTextStyle }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", ...ghostTextStyle }}>
          <span>{itemData.institution || "Institution Name"}</span>
          <span>{itemData.startYear && itemData.endYear ? `${itemData.startYear} - ${itemData.endYear}` : (itemData.endYear || itemData.startYear)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontStyle: "italic", marginBottom: "4px" }}>
          <span>{itemData.degree || "Degree"} {itemData.branch && `in ${itemData.branch}`}</span>
          <span>{itemData.cgpa && `CGPA: ${itemData.cgpa}`} {itemData.percentage && `| ${itemData.percentage}`}</span>
        </div>
      </div>
    );
  }

  if (type === 'skills') {
    return (
      <section ref={ref} style={{ ...textStyle, marginBottom: "16px", ...ghostWrapperStyle }}>
        <h2 style={{ ...headingStyle, ...ghostTextStyle }}>Technical Skills</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "4px", fontSize: "11pt", ...ghostTextStyle }}>
          {data.languages && <div><strong style={ghostTextStyle}>Programming Languages:</strong> {data.languages}</div>}
          {data.frontend && <div><strong style={ghostTextStyle}>Frontend:</strong> {data.frontend}</div>}
          {data.backend && <div><strong style={ghostTextStyle}>Backend:</strong> {data.backend}</div>}
          {data.databases && <div><strong style={ghostTextStyle}>Databases:</strong> {data.databases}</div>}
          {data.aiMl && <div><strong style={ghostTextStyle}>AI / ML:</strong> {data.aiMl}</div>}
          {data.cloud && <div><strong style={ghostTextStyle}>Cloud:</strong> {data.cloud}</div>}
          {data.devOps && <div><strong style={ghostTextStyle}>DevOps:</strong> {data.devOps}</div>}
          {data.tools && <div><strong style={ghostTextStyle}>Tools:</strong> {data.tools}</div>}
          {data.softSkills && <div><strong style={ghostTextStyle}>Soft Skills:</strong> {data.softSkills}</div>}
        </div>
      </section>
    );
  }

  if (type === 'experience_header') {
    return <h2 ref={ref} style={{ ...headingStyle, ...ghostTextStyle, ...(isGhost && ghostWrapperStyle) }}>Experience</h2>;
  }

  if (type === 'experience_item') {
    return (
      <div ref={ref} style={{ marginBottom: "16px", ...textStyle, ...ghostWrapperStyle, ...ghostTextStyle }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", ...ghostTextStyle }}>
          <span>{itemData.role || "Role"}</span>
          <span>{itemData.startDate && itemData.endDate ? `${itemData.startDate} - ${itemData.endDate}` : (itemData.endDate || itemData.startDate)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontStyle: "italic", marginBottom: "4px" }}>
          <span>{itemData.company || "Company Name"} {itemData.location && `| ${itemData.location}`}</span>
        </div>
        {itemData.description && (
          <ul style={{ margin: "4px 0 0 16px", padding: 0 }}>
            {itemData.description.split('\n').filter(line => line.trim().length > 0).map((bullet, idx) => (
              <li key={idx} style={{ marginBottom: "4px", textAlign: "justify" }}>
                {bullet.replace(/^[-•*]\s*/, '')}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  if (type === 'projects_header') {
    return <h2 ref={ref} style={{ ...headingStyle, ...ghostTextStyle, ...(isGhost && ghostWrapperStyle) }}>Projects</h2>;
  }

  if (type === 'projects_item') {
    return (
      <div ref={ref} style={{ marginBottom: "16px", ...textStyle, ...ghostWrapperStyle, ...ghostTextStyle }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", ...ghostTextStyle }}>
          <span>
            {itemData.name || "Project Name"}
            <span style={{ fontWeight: "normal", fontStyle: "italic", fontSize: "0.9em", marginLeft: "8px", color: "#555" }}>
              {itemData.githubUrl && <a href={itemData.githubUrl} style={{ color: "inherit", textDecoration: "none", marginRight: "6px" }}>GitHub</a>}
              {itemData.liveUrl && <a href={itemData.liveUrl} style={{ color: "inherit", textDecoration: "none" }}>Live</a>}
            </span>
          </span>
          <span>{itemData.duration}</span>
        </div>
        {itemData.technologies && (
          <div style={{ fontStyle: "italic", marginBottom: "4px", fontSize: "0.95em", color: "#444" }}>
            <span>{itemData.technologies}</span>
          </div>
        )}
        {itemData.description && (
          <ul style={{ margin: "4px 0 0 16px", padding: 0 }}>
            {itemData.description.split('\n').filter(line => line.trim().length > 0).map((bullet, idx) => (
              <li key={idx} style={{ marginBottom: "4px", textAlign: "justify" }}>
                {bullet.replace(/^[-•*]\s*/, '')}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  if (type === 'achievements_header') {
    return <h2 ref={ref} style={{ ...headingStyle, ...ghostTextStyle, ...(isGhost && ghostWrapperStyle) }}>Achievements</h2>;
  }

  if (type === 'achievements_item') {
    return (
      <div ref={ref} style={{ marginBottom: "8px", ...textStyle, ...ghostWrapperStyle, ...ghostTextStyle }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", ...ghostTextStyle }}>
          <span>{itemData.title || "Achievement"}</span>
          <span>{itemData.date}</span>
        </div>
        {itemData.description && (
          <p style={{ margin: "2px 0 0 0", ...ghostTextStyle }}>{itemData.description}</p>
        )}
      </div>
    );
  }

  if (type === 'certifications_header') {
    return <h2 ref={ref} style={{ ...headingStyle, ...ghostTextStyle, ...(isGhost && ghostWrapperStyle) }}>Certifications</h2>;
  }

  if (type === 'certifications_item') {
    return (
      <div ref={ref} style={{ marginBottom: "8px", ...textStyle, ...ghostWrapperStyle, ...ghostTextStyle }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", ...ghostTextStyle }}>
          <span>
            {itemData.name || "Certification"} 
            {itemData.link && <span style={{ fontWeight: "normal", fontSize: "0.9em", marginLeft: "8px" }}><a href={itemData.link} style={{ color: "inherit", textDecoration: "none" }}>[Link]</a></span>}
          </span>
          <span>{itemData.issueDate}</span>
        </div>
        <div style={{ fontStyle: "italic", ...ghostTextStyle }}>
          <span>{itemData.provider || "Provider"}</span>
        </div>
      </div>
    );
  }

  return null;
});
