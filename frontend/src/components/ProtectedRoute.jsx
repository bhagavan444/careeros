import React from 'react';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';
import InfrastructureLoader from './InfrastructureLoader';

export default function ProtectedRoute({ children }) {
  const { currentUser, authLoading } = useAuth();

  if (authLoading) {
    return <InfrastructureLoader />;
  }

  if (!currentUser) {
    return (
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        {/* Render children underneath the modal without modifying their pixels directly */}
        <div style={{ pointerEvents: 'none', userSelect: 'none' }}>
          {children}
        </div>
        {/* Render the AuthModal overlay */}
        <AuthModal />
      </div>
    );
  }

  return children;
}
