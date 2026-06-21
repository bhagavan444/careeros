import React, { useEffect, useState } from 'react';
import { Clock, RefreshCcw } from 'lucide-react';
import apiClient from '../../services/apiClient';

export default function VersionHistoryPanel({ onRestore }) {
  const [versions, setVersions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchVersions();
    const handleRefresh = () => fetchVersions();
    document.addEventListener('toggle-version-history', handleRefresh); // We can keep this to refresh
    return () => document.removeEventListener('toggle-version-history', handleRefresh);
  }, []);

  const fetchVersions = async () => {
    const resumeId = localStorage.getItem("current_resume_id");
    if (!resumeId) return;
    setIsLoading(true);
    try {
      const res = await apiClient.get(`/api/v1/resume-studio/${resumeId}/versions`);
      if (res.data.status === "success") setVersions(res.data.data);
    } catch (err) {
      console.error("Failed to fetch versions:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = (version) => {
    if (window.confirm(`Restore Version ${version.version_number}? This overwrites your current draft.`)) {
      onRestore(version.content, version.template);
    }
  };

  return (
    <div className="rs-timeline">
      {isLoading ? (
        <div style={{ color: '#86868b', fontSize: 13, paddingLeft: 16 }}>Loading career evolution timeline...</div>
      ) : versions.length === 0 ? (
        <div style={{ color: '#86868b', fontSize: 13, paddingLeft: 16 }}>
          No snapshots saved yet. Click "History" in the header to refresh.
        </div>
      ) : (
        versions.map((v, i) => (
          <div key={v._id} style={{
            background: '#fbfbfd',
            border: '1px solid rgba(0,0,0,0.04)',
            borderRadius: 16,
            padding: '16px 20px',
            minWidth: '240px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            flexShrink: 0
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#1d1d1f' }}>Version {v.version_number}</div>
              {i === 0 && (
                <span style={{ background: 'rgba(0,113,227,0.1)', color: '#0071e3', fontSize: 10, padding: '2px 8px', borderRadius: 8, fontWeight: 700 }}>LATEST</span>
              )}
            </div>
            
            <div style={{ color: '#86868b', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
              <Clock size={12} />
              {new Date(v.created_at).toLocaleString()}
            </div>
            
            <div style={{ display: 'flex', gap: 12, marginTop: 12, marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 500, color: '#1d1d1f' }}>Score: {v.identity_score_snapshot || 0}</div>
              <div style={{ fontSize: 11, color: '#86868b', textTransform: 'capitalize' }}>{v.template}</div>
            </div>

            <button 
              onClick={() => handleRestore(v)}
              style={{ width: '100%', background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)', color: '#1d1d1f', padding: '8px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.15s' }}
              onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(0,113,227,0.3)'; e.currentTarget.style.color = '#0071e3'; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)'; e.currentTarget.style.color = '#1d1d1f'; }}
            >
              <RefreshCcw size={12} />
              Restore
            </button>
          </div>
        ))
      )}
    </div>
  );
}
