import React, { useEffect, useState, useRef } from 'react';
import { resumeDocumentStore } from '../../../services/ResumeDocumentStore';
import { SectionRenderer } from './SectionRenderer';

export default function DocumentRenderer() {
  const [storeState, setStoreState] = useState(resumeDocumentStore.state);
  const containerRef = useRef(null);

  useEffect(() => {
    const unsub = resumeDocumentStore.subscribe((state) => {
      setStoreState({ ...state });
      
      // Handle scrolling
      if (state.activeSection && containerRef.current) {
        const el = containerRef.current.querySelector(`[data-section-id^="${state.activeSection}"]`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });
    return unsub;
  }, []);

  const { pages, template, viewMode } = storeState;

  const getTemplateClass = () => {
    switch (template) {
      case "engineering": return "template-engineering";
      case "modern": return "template-modern";
      case "executive": return "template-executive";
      case "student": return "template-modern";
      case "ai-engineer": return "template-engineering";
      case "data-scientist": return "template-professional";
      default: return "template-professional";
    }
  };

  if (!pages || pages.length === 0) {
    return <div style={{ color: '#fff' }}>Calculating document...</div>;
  }

  return (
    <div ref={containerRef} className="rs-document-renderer" id="resume-export-root">
      {pages.map((pageBlocks, pageIndex) => (
        <div 
          key={pageIndex} 
          className={`rs-paper ${getTemplateClass()}`} 
          style={{
            position: 'relative',
            marginBottom: '40px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
            pageBreakAfter: 'always',
            pageBreakInside: 'avoid'
          }}
        >
          {pageBlocks.map(block => (
            <div key={block.id} data-section-id={block.id}>
              <SectionRenderer 
                type={block.type} 
                data={block.data} 
                itemData={block.itemData} 
                template={template}
                isGhost={block.isGhost}
              />
            </div>
          ))}
          
          {/* Recruiter / ATS Overlays can go here based on viewMode */}
          {viewMode === 'recruiter' && (
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', background: 'rgba(16, 185, 129, 0.05)', border: '2px solid rgba(16, 185, 129, 0.5)', zIndex: 10 }}>
              <div style={{ position: 'absolute', top: '10px', right: '10px', background: '#10b981', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold' }}>RECRUITER VIEW ACTIVE</div>
            </div>
          )}

          {viewMode === 'ats' && (
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', background: 'rgba(59, 130, 246, 0.05)', border: '2px dashed rgba(59, 130, 246, 0.5)', zIndex: 10 }}>
              <div style={{ position: 'absolute', top: '10px', right: '10px', background: '#3b82f6', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold' }}>ATS VIEW ACTIVE</div>
            </div>
          )}

          {/* Page Numbering */}
          {pages.length > 1 && (
            <div style={{ position: 'absolute', bottom: '15mm', right: '20mm', fontSize: '9pt', color: '#999', fontFamily: 'Arial' }}>
              {pageIndex + 1} / {pages.length}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
