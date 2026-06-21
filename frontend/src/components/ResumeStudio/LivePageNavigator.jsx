import React, { useEffect, useState } from 'react';
import { resumeDocumentStore } from '../../services/ResumeDocumentStore';

export default function LivePageNavigator() {
  const [pages, setPages] = useState([]);

  useEffect(() => {
    const unsub = resumeDocumentStore.subscribe((state) => {
      setPages(state.pages || []);
    });
    return unsub;
  }, []);

  if (!pages || pages.length <= 1) return null;

  return (
    <div style={{
      position: 'absolute',
      left: '-60px',
      top: '60px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      zIndex: 10
    }}>
      {pages.map((_, idx) => (
        <button
          key={idx}
          onClick={() => {
            const papers = document.querySelectorAll('.rs-paper');
            if (papers[idx]) {
              papers[idx].scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }}
          style={{
            width: '40px',
            height: '56px',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '4px',
            color: '#fff',
            fontSize: '0.7rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
            e.currentTarget.style.borderColor = '#a78bfa';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
          }}
          title={`Scroll to Page ${idx + 1}`}
        >
          {idx + 1}
        </button>
      ))}
    </div>
  );
}
