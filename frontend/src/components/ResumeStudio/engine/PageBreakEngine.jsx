import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { resumeDocumentStore } from '../../../services/ResumeDocumentStore';
import { SectionRenderer } from './SectionRenderer';

const A4_HEIGHT_PX = 1122; // 297mm approx
const PADDING_PX = 132; // ~35mm total padding (top+bottom)
const AVAILABLE_HEIGHT = A4_HEIGHT_PX - PADDING_PX;

export default function PageBreakEngine() {
  const [storeState, setStoreState] = useState(resumeDocumentStore.state);
  const [elementsToMeasure, setElementsToMeasure] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    const unsub = resumeDocumentStore.subscribe((state) => {
      setStoreState({ ...state });
    });

    const handleRecalculate = () => {
      const data = resumeDocumentStore.state.resumeData;
      if (!data) return;

      // Build flat list of all rendering blocks
      const blocks = [];
      blocks.push({ id: 'header', type: 'header', data: data.personalInfo });
      
      // Helper to generate blocks for a section
      const buildSection = (sectionName) => {
        if (sectionName === 'summary') {
          if (data.professionalSummary?.summary) {
            blocks.push({ id: 'summary', type: 'summary', data: data.professionalSummary });
          } else {
            blocks.push({ id: 'summary_ghost', type: 'summary', data: { summary: "[Craft a compelling professional summary that highlights your core expertise, years of experience, and key career objectives. This section acts as an elevator pitch to recruiters.]" }, isGhost: true });
          }
        } else if (sectionName === 'education') {
          if (data.education?.length > 0) {
            blocks.push({ id: 'education_header', type: 'education_header', isHeader: true });
            data.education.forEach(edu => blocks.push({ id: `education_${edu.id}`, type: 'education_item', itemData: edu }));
          } else {
            blocks.push({ id: 'education_header_ghost', type: 'education_header', isHeader: true, isGhost: true });
            blocks.push({ id: 'education_ghost', type: 'education_item', itemData: { institution: "[University / Institution Name]", degree: "[B.S. / M.S.]", branch: "[Major / Field of Study]", startYear: "2019", endYear: "2023", cgpa: "3.8/4.0" }, isGhost: true });
          }
        } else if (sectionName === 'skills') {
          if (data.technicalSkills && Object.values(data.technicalSkills).some(v => v && v.trim().length > 0)) {
            blocks.push({ id: 'skills', type: 'skills', data: data.technicalSkills });
          } else {
            blocks.push({ id: 'skills_ghost', type: 'skills', data: { languages: "[Python, JavaScript, Java, C++]", frontend: "[React, Vue, HTML/CSS]", backend: "[Node.js, Django, Spring Boot]", databases: "[PostgreSQL, MongoDB, Redis]" }, isGhost: true });
          }
        } else if (sectionName === 'internships') {
          if (data.internships?.length > 0) {
            blocks.push({ id: 'experience_header', type: 'experience_header', isHeader: true });
            data.internships.forEach(exp => blocks.push({ id: `experience_${exp.id}`, type: 'experience_item', itemData: exp }));
          } else {
            blocks.push({ id: 'experience_header_ghost', type: 'experience_header', isHeader: true, isGhost: true });
            blocks.push({ id: 'experience_ghost', type: 'experience_item', itemData: { role: "[Job Title / Role]", company: "[Company Name]", location: "[City, State]", startDate: "Jan 2022", endDate: "Present", description: "- [Accomplished X as measured by Y, by doing Z]\n- [Optimized performance resulting in 20% improvement]\n- [Led a team of 3 developers to deliver feature A]" }, isGhost: true });
          }
        } else if (sectionName === 'projects') {
          if (data.projects?.length > 0) {
            blocks.push({ id: 'projects_header', type: 'projects_header', isHeader: true });
            data.projects.forEach(proj => blocks.push({ id: `projects_${proj.id}`, type: 'projects_item', itemData: proj }));
          } else {
            blocks.push({ id: 'projects_header_ghost', type: 'projects_header', isHeader: true, isGhost: true });
            blocks.push({ id: 'projects_ghost', type: 'projects_item', itemData: { name: "[Major Project Name]", duration: "Fall 2023", technologies: "[React, Node, MongoDB]", description: "- [Built full-stack application serving 1000+ daily active users]\n- [Implemented OAuth2.0 authentication and real-time websockets]" }, isGhost: true });
          }
        } else if (sectionName === 'achievements') {
          if (data.achievements?.length > 0) {
            blocks.push({ id: 'achievements_header', type: 'achievements_header', isHeader: true });
            data.achievements.forEach(ach => blocks.push({ id: `achievements_${ach.id}`, type: 'achievements_item', itemData: ach }));
          } else {
            blocks.push({ id: 'achievements_header_ghost', type: 'achievements_header', isHeader: true, isGhost: true });
            blocks.push({ id: 'achievements_ghost', type: 'achievements_item', itemData: { title: "[Outstanding Performer Award]", date: "2023", category: "[Professional]", description: "[Awarded for exceeding performance metrics by 150% in Q3.]" }, isGhost: true });
          }
        } else if (sectionName === 'certifications') {
          if (data.certifications?.length > 0) {
            blocks.push({ id: 'certifications_header', type: 'certifications_header', isHeader: true });
            data.certifications.forEach(cert => blocks.push({ id: `certifications_${cert.id}`, type: 'certifications_item', itemData: cert }));
          } else {
            blocks.push({ id: 'certifications_header_ghost', type: 'certifications_header', isHeader: true, isGhost: true });
            blocks.push({ id: 'certifications_ghost', type: 'certifications_item', itemData: { name: "[AWS Certified Solutions Architect]", provider: "[Amazon Web Services]", issueDate: "2023", link: "https://aws.amazon.com" }, isGhost: true });
          }
        }
      };

      // Define Template Ordering
      const tpl = resumeDocumentStore.state.template || 'professional';
      let sectionOrder = [];
      
      switch (tpl) {
        case 'engineering':
        case 'ai-engineer':
          sectionOrder = ['summary', 'skills', 'projects', 'internships', 'education', 'achievements', 'certifications'];
          break;
        case 'data-scientist':
          sectionOrder = ['summary', 'skills', 'internships', 'projects', 'education', 'certifications', 'achievements'];
          break;
        case 'modern':
        case 'student':
          sectionOrder = ['summary', 'education', 'projects', 'internships', 'skills', 'achievements', 'certifications'];
          break;
        case 'professional':
        case 'executive':
        default:
          sectionOrder = ['summary', 'internships', 'education', 'projects', 'skills', 'certifications', 'achievements'];
          break;
      }

      // Build blocks based on order
      sectionOrder.forEach(sec => buildSection(sec));

      setElementsToMeasure(blocks);
    };

    window.addEventListener('recalculate-pages', handleRecalculate);
    handleRecalculate(); // Initial run

    return () => {
      unsub();
      window.removeEventListener('recalculate-pages', handleRecalculate);
    };
  }, []);

  useLayoutEffect(() => {
    if (elementsToMeasure.length === 0 || !containerRef.current) return;

    // Wait a tick for DOM to render the measuring elements
    requestAnimationFrame(() => {
      const children = Array.from(containerRef.current.children);
      
      let pages = [];
      let currentPage = [];
      let currentHeight = 0;

      let pendingHeader = null;

      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        const block = elementsToMeasure[i];
        const height = child.getBoundingClientRect().height;

        if (block.isHeader) {
          pendingHeader = { block, height };
          continue;
        }

        const itemHeight = height + (pendingHeader ? pendingHeader.height : 0);

        if (currentHeight + itemHeight > AVAILABLE_HEIGHT && currentPage.length > 0) {
          // Page full, push to pages and start new
          pages.push([...currentPage]);
          currentPage = [];
          currentHeight = 0;
        }

        if (pendingHeader) {
          currentPage.push(pendingHeader.block);
          currentHeight += pendingHeader.height;
          pendingHeader = null;
        }

        currentPage.push(block);
        currentHeight += height;
      }

      if (currentPage.length > 0) {
        pages.push([...currentPage]);
      }

      resumeDocumentStore.setPages(pages);
    });

  }, [elementsToMeasure]);

  // Render invisibly off-screen to measure
  return (
    <div 
      ref={containerRef} 
      className={`rs-paper ${storeState.template ? `template-${storeState.template}` : 'template-professional'}`}
      style={{ 
        position: 'absolute', 
        top: '-9999px', 
        left: '-9999px', 
        visibility: 'hidden',
        width: '210mm',
        padding: '15mm 20mm', // Must match actual padding for accurate height
        boxSizing: 'border-box'
      }}
    >
      {elementsToMeasure.map((block) => (
        <div key={block.id} data-id={block.id}>
          <SectionRenderer 
            type={block.type} 
            data={block.data} 
            itemData={block.itemData} 
            template={storeState.template} 
            isGhost={block.isGhost}
          />
        </div>
      ))}
    </div>
  );
}
