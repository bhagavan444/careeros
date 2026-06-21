import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, FileText, Briefcase, GraduationCap, Code, Award,
  Target, Star, ChevronDown, ChevronRight, Plus, Trash2,
  CheckCircle2, AlertCircle, Sparkles
} from "lucide-react";
import { resumeDocumentStore } from "../../services/ResumeDocumentStore";

/* ─── Completion dot ─────────────────────────────── */
const CompletionDot = ({ pct }) => {
  const color = pct >= 100 ? "#34c759" : pct > 40 ? "#ff9500" : "#ff3b30";
  return (
    <div style={{ width: 7, height: 7, borderRadius: "50%", background: pct > 0 ? color : "rgba(0,0,0,0.12)", flexShrink: 0 }} />
  );
};

/* ─── Section Card (list-item sub-cards) ─────────── */
const ItemCard = ({ children, onRemove }) => (
  <motion.div 
    layout
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
    className="rs-note-card" 
    style={{ position: "relative" }}
  >
    {children}
    <button
      onClick={onRemove}
      style={{ position: "absolute", top: 10, right: 10, background: "none", border: "none", cursor: "pointer", color: "#86868b", padding: 2, borderRadius: 4, display: "flex", alignItems: "center", transition: "color 0.15s" }}
      onMouseOver={e => e.currentTarget.style.color = "#ff3b30"}
      onMouseOut={e => e.currentTarget.style.color = "#86868b"}
    >
      <Trash2 size={13} />
    </button>
  </motion.div>
);

/* ─── AI Micro-buttons ───────────────────────────── */
const AiPill = ({ label, onClick }) => (
  <button
    onClick={onClick}
    style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px", background: "rgba(0,113,227,0.06)", border: "1px solid rgba(0,113,227,0.15)", borderRadius: 20, fontSize: 11, fontWeight: 600, color: "#0071e3", cursor: "pointer", fontFamily: "inherit", transition: "background 0.15s" }}
    onMouseOver={e => e.currentTarget.style.background = "rgba(0,113,227,0.10)"}
    onMouseOut={e => e.currentTarget.style.background = "rgba(0,113,227,0.06)"}
  >
    <Sparkles size={11} /> {label}
  </button>
);

/* ─── Add button ─────────────────────────────────── */
const AddBtn = ({ label, onClick }) => (
  <button
    onClick={onClick}
    style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, width: "100%", padding: "9px", background: "rgba(0,113,227,0.04)", border: "1px dashed rgba(0,113,227,0.25)", borderRadius: 10, fontSize: 12, fontWeight: 600, color: "#0071e3", cursor: "pointer", fontFamily: "inherit", marginTop: 4, transition: "background 0.15s" }}
    onMouseOver={e => e.currentTarget.style.background = "rgba(0,113,227,0.08)"}
    onMouseOut={e => e.currentTarget.style.background = "rgba(0,113,227,0.04)"}
  >
    <Plus size={13} /> {label}
  </button>
);

/* ─── Section Card Wrapper ────────────────────────── */
const Section = ({ title, icon: Icon, sectionKey, healthData, children }) => {
  const metrics = healthData?.breakdown?.[sectionKey] || { score: 0, max: 10 };
  const pct = metrics.max > 0 ? Math.round((metrics.score / metrics.max) * 100) : 0;

  return (
    <div className="rs-note-card">
      {/* Section Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, paddingBottom: "20px", borderBottom: "1px solid rgba(0,0,0,0.04)", marginBottom: "20px" }}>
        <CompletionDot pct={pct} />
        <Icon size={16} color="#86868b" strokeWidth={2} style={{ flexShrink: 0 }} />
        <span style={{ flex: 1, fontSize: 16, fontWeight: 600, color: "#1d1d1f" }}>{title}</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: pct >= 100 ? "#34c759" : "#86868b", background: "rgba(0,0,0,0.03)", padding: "2px 8px", borderRadius: 10 }}>{pct}%</span>
      </div>

      <div style={{ padding: "0 4px" }}>
        {/* Recommendation hint */}
        {metrics.recommendation && pct < 100 && (
          <div style={{ display: "flex", alignItems: "flex-start", gap: 6, background: "rgba(255,149,0,0.06)", border: "1px solid rgba(255,149,0,0.18)", borderRadius: 12, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#86868b", lineHeight: 1.4 }}>
            <AlertCircle size={14} color="#ff9500" style={{ marginTop: 2, flexShrink: 0 }} />
            {metrics.recommendation}
          </div>
        )}
        {pct >= 100 && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(52,199,89,0.06)", border: "1px solid rgba(52,199,89,0.18)", borderRadius: 12, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#34c759", fontWeight: 500 }}>
            <CheckCircle2 size={14} /> Section complete
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

/* ─── Two-column grid helper ─────────────────────── */
const Row = ({ children }) => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>{children}</div>
);

/* ─── Main Component ─────────────────────────────── */
export default function LeftPanelBuilder({ data, onChange, healthData }) {

  const set = (section, field, value) =>
    onChange({ ...data, [section]: { ...data[section], [field]: value } });

  const setArr = (section, i, field, value) => {
    const arr = [...data[section]];
    arr[i] = { ...arr[i], [field]: value };
    onChange({ ...data, [section]: arr });
  };

  const add = (section, tpl) =>
    onChange({ ...data, [section]: [...data[section], { id: Date.now(), ...tpl }] });

  const remove = (section, i) => {
    const arr = [...data[section]];
    arr.splice(i, 1);
    onChange({ ...data, [section]: arr });
  };

  return (
    <div className="rs-panel rs-left-panel" style={{ overflowY: "hidden" }}>
      {/* Panel header */}
      <div className="rs-panel-header" style={{ justifyContent: "space-between" }}>
        <span>Editor</span>
        <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#34c759" }}>
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#34c759" }} />
          Auto-saved
        </div>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: "auto" }}>

        {/* ── 1. Personal Info ── */}
        <Section title="Personal Info" icon={User} sectionKey="personalInfo" healthData={healthData} defaultOpen>
          <div className="rs-form-group">
            <label className="rs-label">Full Name</label>
            <input className="rs-input" value={data.personalInfo.name} onChange={e => set("personalInfo", "name", e.target.value)} placeholder="Jane Doe" />
          </div>
          <div className="rs-form-group">
            <label className="rs-label">Professional Headline</label>
            <input className="rs-input" value={data.personalInfo.title} onChange={e => set("personalInfo", "title", e.target.value)} placeholder="AI Engineer · Full Stack Developer" />
          </div>
          <Row>
            <div className="rs-form-group">
              <label className="rs-label">Email</label>
              <input className="rs-input" value={data.personalInfo.email} onChange={e => set("personalInfo", "email", e.target.value)} placeholder="you@email.com" />
            </div>
            <div className="rs-form-group">
              <label className="rs-label">Phone</label>
              <input className="rs-input" value={data.personalInfo.phone} onChange={e => set("personalInfo", "phone", e.target.value)} placeholder="+91 98765 43210" />
            </div>
          </Row>
          <div className="rs-form-group">
            <label className="rs-label">Location</label>
            <input className="rs-input" value={data.personalInfo.location} onChange={e => set("personalInfo", "location", e.target.value)} placeholder="City, Country" />
          </div>
          <Row>
            <div className="rs-form-group">
              <label className="rs-label">LinkedIn</label>
              <input className="rs-input" value={data.personalInfo.linkedin} onChange={e => set("personalInfo", "linkedin", e.target.value)} placeholder="linkedin.com/in/..." />
            </div>
            <div className="rs-form-group">
              <label className="rs-label">GitHub</label>
              <input className="rs-input" value={data.personalInfo.github} onChange={e => set("personalInfo", "github", e.target.value)} placeholder="github.com/..." />
            </div>
          </Row>
          <div className="rs-form-group">
            <label className="rs-label">Portfolio (Optional)</label>
            <input className="rs-input" value={data.personalInfo.portfolio} onChange={e => set("personalInfo", "portfolio", e.target.value)} placeholder="yoursite.com" />
          </div>
        </Section>

        {/* ── 2. Summary ── */}
        <Section title="Professional Summary" icon={FileText} sectionKey="summary" healthData={healthData}>
          <Row>
            <div className="rs-form-group">
              <label className="rs-label">Target Role</label>
              <input className="rs-input" value={data.professionalSummary.targetRole} onChange={e => set("professionalSummary", "targetRole", e.target.value)} placeholder="Sr. Software Engineer" />
            </div>
            <div className="rs-form-group">
              <label className="rs-label">Years Exp.</label>
              <input className="rs-input" value={data.professionalSummary.yearsOfExperience} onChange={e => set("professionalSummary", "yearsOfExperience", e.target.value)} placeholder="5+" />
            </div>
          </Row>
          <div className="rs-form-group">
            <label className="rs-label">Industry Focus</label>
            <input className="rs-input" value={data.professionalSummary.industryFocus} onChange={e => set("professionalSummary", "industryFocus", e.target.value)} placeholder="Fintech · SaaS · Web3" />
          </div>
          <div className="rs-form-group">
            <label className="rs-label">Summary</label>
            <textarea className="rs-textarea" value={data.professionalSummary.summary} onChange={e => set("professionalSummary", "summary", e.target.value)} placeholder="Craft a compelling summary that highlights your expertise, unique value, and career goals..." style={{ minHeight: 100 }} />
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
            <AiPill label="Generate" onClick={() => {}} />
            <AiPill label="ATS Optimize" onClick={() => {}} />
            <AiPill label="Executive Rewrite" onClick={() => {}} />
          </div>
        </Section>

        {/* ── 3. Education ── */}
        <Section title="Education" icon={GraduationCap} sectionKey="education" healthData={healthData}>
          {data.education.map((edu, i) => (
            <ItemCard key={edu.id} onRemove={() => remove("education", i)}>
              <div className="rs-form-group">
                <input className="rs-input" value={edu.institution} onChange={e => setArr("education", i, "institution", e.target.value)} placeholder="University / Institution" />
              </div>
              <Row>
                <div className="rs-form-group">
                  <input className="rs-input" value={edu.degree} onChange={e => setArr("education", i, "degree", e.target.value)} placeholder="Degree" />
                </div>
                <div className="rs-form-group">
                  <input className="rs-input" value={edu.branch} onChange={e => setArr("education", i, "branch", e.target.value)} placeholder="Branch / Major" />
                </div>
              </Row>
              <Row>
                <div className="rs-form-group">
                  <input className="rs-input" value={edu.cgpa} onChange={e => setArr("education", i, "cgpa", e.target.value)} placeholder="CGPA" />
                </div>
                <div className="rs-form-group">
                  <input className="rs-input" value={edu.percentage} onChange={e => setArr("education", i, "percentage", e.target.value)} placeholder="Percentage" />
                </div>
              </Row>
              <Row>
                <div className="rs-form-group">
                  <input className="rs-input" value={edu.startYear} onChange={e => setArr("education", i, "startYear", e.target.value)} placeholder="Start Year" />
                </div>
                <div className="rs-form-group">
                  <input className="rs-input" value={edu.endYear} onChange={e => setArr("education", i, "endYear", e.target.value)} placeholder="End Year" />
                </div>
              </Row>
            </ItemCard>
          ))}
          <AddBtn label="Add Education" onClick={() => add("education", { institution: "", degree: "", branch: "", cgpa: "", percentage: "", startYear: "", endYear: "" })} />
        </Section>

        {/* ── 4. Internships ── */}
        <Section title="Internships" icon={Briefcase} sectionKey="internships" healthData={healthData}>
          {data.internships.map((int, i) => (
            <ItemCard key={int.id} onRemove={() => remove("internships", i)}>
              <div className="rs-form-group">
                <input className="rs-input" value={int.role} onChange={e => setArr("internships", i, "role", e.target.value)} placeholder="Role (e.g. SDE Intern)" />
              </div>
              <Row>
                <div className="rs-form-group">
                  <input className="rs-input" value={int.company} onChange={e => setArr("internships", i, "company", e.target.value)} placeholder="Company" />
                </div>
                <div className="rs-form-group">
                  <input className="rs-input" value={int.location} onChange={e => setArr("internships", i, "location", e.target.value)} placeholder="Location" />
                </div>
              </Row>
              <Row>
                <div className="rs-form-group">
                  <input className="rs-input" value={int.startDate} onChange={e => setArr("internships", i, "startDate", e.target.value)} placeholder="Start" />
                </div>
                <div className="rs-form-group">
                  <input className="rs-input" value={int.endDate} onChange={e => setArr("internships", i, "endDate", e.target.value)} placeholder="End" />
                </div>
              </Row>
              <div className="rs-form-group">
                <textarea className="rs-textarea" value={int.description} onChange={e => setArr("internships", i, "description", e.target.value)} placeholder="Key achievements and impact..." style={{ minHeight: 70 }} />
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                <AiPill label="Generate Bullets" onClick={() => {}} />
                <AiPill label="Quantify Impact" onClick={() => {}} />
              </div>
            </ItemCard>
          ))}
          <AddBtn label="Add Internship" onClick={() => add("internships", { company: "", role: "", location: "", startDate: "", endDate: "", description: "" })} />
        </Section>

        {/* ── 5. Projects ── */}
        <Section title="Projects" icon={Target} sectionKey="projects" healthData={healthData}>
          {data.projects.map((proj, i) => (
            <ItemCard key={proj.id} onRemove={() => remove("projects", i)}>
              <div className="rs-form-group">
                <input className="rs-input" value={proj.name} onChange={e => setArr("projects", i, "name", e.target.value)} placeholder="Project Name" />
              </div>
              <Row>
                <div className="rs-form-group">
                  <input className="rs-input" value={proj.category} onChange={e => setArr("projects", i, "category", e.target.value)} placeholder="Category (AI, Web)" />
                </div>
                <div className="rs-form-group">
                  <input className="rs-input" value={proj.duration} onChange={e => setArr("projects", i, "duration", e.target.value)} placeholder="Duration" />
                </div>
              </Row>
              <div className="rs-form-group">
                <input className="rs-input" value={proj.technologies} onChange={e => setArr("projects", i, "technologies", e.target.value)} placeholder="React · Node · Python" />
              </div>
              <Row>
                <div className="rs-form-group">
                  <input className="rs-input" value={proj.githubUrl} onChange={e => setArr("projects", i, "githubUrl", e.target.value)} placeholder="GitHub URL" />
                </div>
                <div className="rs-form-group">
                  <input className="rs-input" value={proj.liveUrl} onChange={e => setArr("projects", i, "liveUrl", e.target.value)} placeholder="Live URL" />
                </div>
              </Row>
              <div className="rs-form-group">
                <textarea className="rs-textarea" value={proj.description} onChange={e => setArr("projects", i, "description", e.target.value)} placeholder="What did you build? What was the impact?" style={{ minHeight: 70 }} />
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                <AiPill label="STAR Format" onClick={() => {}} />
                <AiPill label="ATS Optimize" onClick={() => {}} />
              </div>
            </ItemCard>
          ))}
          <AddBtn label="Add Project" onClick={() => add("projects", { name: "", category: "", duration: "", description: "", technologies: "", githubUrl: "", liveUrl: "" })} />
        </Section>

        {/* ── 6. Skills ── */}
        <Section title="Technical Skills" icon={Code} sectionKey="skills" healthData={healthData}>
          {[
            ["languages", "Languages"],
            ["frontend", "Frontend"],
            ["backend", "Backend"],
            ["databases", "Databases"],
            ["aiMl", "AI / ML"],
            ["tools", "Tools & Platforms"],
            ["cloud", "Cloud"],
            ["devOps", "DevOps"],
            ["coreSubjects", "Core Subjects"],
            ["softSkills", "Soft Skills"],
          ].map(([key, label]) => (
            <div className="rs-form-group" key={key}>
              <label className="rs-label">{label}</label>
              <input className="rs-input" value={data.technicalSkills[key]} onChange={e => set("technicalSkills", key, e.target.value)} placeholder={`e.g. Python, TypeScript...`} />
            </div>
          ))}
        </Section>

        {/* ── 7. Achievements ── */}
        <Section title="Achievements" icon={Award} sectionKey="achievements" healthData={healthData}>
          {data.achievements.map((ach, i) => (
            <ItemCard key={ach.id} onRemove={() => remove("achievements", i)}>
              <div className="rs-form-group">
                <input className="rs-input" value={ach.title} onChange={e => setArr("achievements", i, "title", e.target.value)} placeholder="Achievement Title" />
              </div>
              <Row>
                <div className="rs-form-group">
                  <input className="rs-input" value={ach.date} onChange={e => setArr("achievements", i, "date", e.target.value)} placeholder="Date" />
                </div>
                <div className="rs-form-group">
                  <input className="rs-input" value={ach.category} onChange={e => setArr("achievements", i, "category", e.target.value)} placeholder="Category" />
                </div>
              </Row>
              <div className="rs-form-group">
                <textarea className="rs-textarea" value={ach.description} onChange={e => setArr("achievements", i, "description", e.target.value)} placeholder="Describe the achievement and its impact..." style={{ minHeight: 60 }} />
              </div>
            </ItemCard>
          ))}
          <AddBtn label="Add Achievement" onClick={() => add("achievements", { title: "", description: "", date: "", category: "" })} />
        </Section>

        {/* ── 8. Certifications ── */}
        <Section title="Certifications" icon={Star} sectionKey="certifications" healthData={healthData}>
          {data.certifications.map((cert, i) => (
            <ItemCard key={cert.id} onRemove={() => remove("certifications", i)}>
              <div className="rs-form-group">
                <input className="rs-input" value={cert.name} onChange={e => setArr("certifications", i, "name", e.target.value)} placeholder="Certification Name" />
              </div>
              <Row>
                <div className="rs-form-group">
                  <input className="rs-input" value={cert.provider} onChange={e => setArr("certifications", i, "provider", e.target.value)} placeholder="Provider (AWS, Google)" />
                </div>
                <div className="rs-form-group">
                  <input className="rs-input" value={cert.issueDate} onChange={e => setArr("certifications", i, "issueDate", e.target.value)} placeholder="Issue Date" />
                </div>
              </Row>
              <div className="rs-form-group">
                <input className="rs-input" value={cert.link} onChange={e => setArr("certifications", i, "link", e.target.value)} placeholder="Credential URL" />
              </div>
            </ItemCard>
          ))}
          <AddBtn label="Add Certification" onClick={() => add("certifications", { name: "", provider: "", issueDate: "", link: "" })} />
        </Section>

        {/* Bottom spacing */}
        <div style={{ height: 32 }} />
      </div>
    </div>
  );
}
