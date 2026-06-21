import React, { useState, useEffect } from 'react';
import { ZoomIn, ZoomOut, Maximize, FileText, Layout } from 'lucide-react';
import { resumeDocumentStore } from '../../services/ResumeDocumentStore';

export default function ZoomControls() {
  const [zoomMode, setZoomMode] = useState(resumeDocumentStore.state.zoomMode);

  const [viewMode, setViewMode] = useState(resumeDocumentStore.state.viewMode);

  useEffect(() => {
    const unsub = resumeDocumentStore.subscribe((state) => {
      setZoomMode(state.zoomMode);
      setViewMode(state.viewMode);
    });
    return unsub;
  }, []);

  const handleZoom = (mode) => {
    resumeDocumentStore.setZoomMode(mode);
  };

  const handleView = (mode) => {
    resumeDocumentStore.setViewMode(mode);
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      background: 'rgba(15, 23, 42, 0.8)',
      padding: '6px 12px',
      borderRadius: '8px',
      border: '1px solid rgba(255,255,255,0.1)',
      backdropFilter: 'blur(8px)',
      marginBottom: '16px',
      position: 'sticky',
      top: '0px',
      zIndex: 20
    }}>
      <div style={{ display: 'flex', gap: '4px', borderRight: '1px solid rgba(255,255,255,0.1)', paddingRight: '8px' }}>
        <button className="rs-zoom-btn" onClick={() => handleZoom('50')} style={btnStyle(zoomMode === '50')}>50%</button>
        <button className="rs-zoom-btn" onClick={() => handleZoom('75')} style={btnStyle(zoomMode === '75')}>75%</button>
        <button className="rs-zoom-btn" onClick={() => handleZoom('100')} style={btnStyle(zoomMode === '100')}>100%</button>
        <button className="rs-zoom-btn" onClick={() => handleZoom('125')} style={btnStyle(zoomMode === '125')}>125%</button>
        <button className="rs-zoom-btn" onClick={() => handleZoom('150')} style={btnStyle(zoomMode === '150')}>150%</button>
      </div>
      
      <div style={{ display: 'flex', gap: '4px' }}>
        <button className="rs-zoom-btn" onClick={() => handleZoom('fit-width')} title="Fit Width" style={btnStyle(zoomMode === 'fit-width')}>
          <Maximize size={14} />
        </button>
        <button className="rs-zoom-btn" onClick={() => handleZoom('fit-page')} title="Fit Page" style={btnStyle(zoomMode === 'fit-page')}>
          <FileText size={14} />
        </button>
        <button className="rs-zoom-btn" onClick={() => handleZoom('fit-all')} title="Fit Entire Resume" style={btnStyle(zoomMode === 'fit-all')}>
          <Layout size={14} />
        </button>
      </div>
      <div style={{ display: 'flex', gap: '4px', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '8px', marginLeft: 'auto' }}>
        <button className="rs-zoom-btn" onClick={() => handleView('normal')} style={btnStyle(viewMode === 'normal')}>Normal</button>
        <button className="rs-zoom-btn" onClick={() => handleView('recruiter')} style={{ ...btnStyle(viewMode === 'recruiter'), color: viewMode === 'recruiter' ? '#10b981' : '#94a3b8', background: viewMode === 'recruiter' ? 'rgba(16, 185, 129, 0.2)' : 'transparent' }}>Recruiter</button>
        <button className="rs-zoom-btn" onClick={() => handleView('ats')} style={{ ...btnStyle(viewMode === 'ats'), color: viewMode === 'ats' ? '#3b82f6' : '#94a3b8', background: viewMode === 'ats' ? 'rgba(59, 130, 246, 0.2)' : 'transparent' }}>ATS</button>
      </div>
    </div>
  );
}

const btnStyle = (isActive) => ({
  background: isActive ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
  color: isActive ? '#c084fc' : '#94a3b8',
  border: 'none',
  padding: '4px 8px',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '0.8rem',
  fontFamily: 'Outfit, sans-serif',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.2s ease'
});
