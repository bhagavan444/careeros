import React from 'react';
import { useChatStore } from '../../store/chatStore';
import { 
  MessageSquare, FolderOpen, Download, 
  ChevronRight, Clock, Hash
} from 'lucide-react';

export default function ContextualAssistantPanel({ className = "" }) {
  const { chats } = useChatStore();
  const recentChats = chats.slice(0, 3);
  const conversationCount = chats.length;

  return (
    <div className={`career-snapshot-panel ${className}`} style={{ 
      height: '100%', 
      background: 'rgba(245, 245, 247, 0.8)',
      backdropFilter: 'blur(30px)',
      WebkitBackdropFilter: 'blur(30px)',
      borderLeft: '1px solid rgba(0,0,0,0.05)',
      overflowY: 'auto',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      flexShrink: 0
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#1d1d1f', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Assistant Context
        </h2>
      </div>

      <div style={{
        background: 'rgba(255, 255, 255, 0.72)',
        borderRadius: '16px',
        padding: '16px',
        border: '1px solid rgba(0,0,0,0.03)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={16} color="#86868b" />
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#86868b' }}>Recent Conversations</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '4px' }}>
          {recentChats.length > 0 ? recentChats.map(chat => (
            <div key={chat._id} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '14px', color: '#1d1d1f', cursor: 'pointer' }}>
              <MessageSquare size={16} color="#0071E3" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.4 }}>
                {chat.title || "New Conversation"}
              </span>
            </div>
          )) : (
            <div style={{ fontSize: '13px', color: '#86868b' }}>No recent conversations.</div>
          )}
        </div>
      </div>

      <div style={{
        background: 'rgba(255, 255, 255, 0.72)',
        borderRadius: '16px',
        padding: '16px',
        border: '1px solid rgba(0,0,0,0.03)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FolderOpen size={16} color="#5E5CE6" />
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#1d1d1f' }}>Saved Reports</span>
          </div>
          <ChevronRight size={16} color="#86868b" />
        </div>
        
        <div style={{ height: '1px', background: 'rgba(0,0,0,0.04)' }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Hash size={16} color="#34C759" />
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#1d1d1f' }}>Total Chats</span>
          </div>
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#86868b' }}>{conversationCount}</span>
        </div>
      </div>

      <button style={{ 
        marginTop: 'auto',
        background: 'rgba(0, 113, 227, 0.08)', 
        color: '#0071E3', 
        border: 'none', 
        borderRadius: '12px', 
        padding: '12px', 
        fontSize: '14px', 
        fontWeight: 600, 
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        transition: 'all 0.2s ease'
      }}>
        <Download size={16} />
        Export Conversation
      </button>

    </div>
  );
}
