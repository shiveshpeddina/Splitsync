import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        flexDirection: 'column',
        background: '#f7f8fa'
      }}>
        <img 
          src="/splitsync-icon.png" 
          alt="SplitSync" 
          style={{ 
            width: 80, 
            height: 80, 
            marginBottom: 20, 
            borderRadius: 16,
            animation: 'loaderPulse 1.5s ease-in-out infinite' 
          }} 
        />
        <div style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 24, fontWeight: 700, color: '#1c1c28', marginBottom: 8 }}>SplitSync</div>
        <p style={{ color: '#8a8fa8', marginTop: 0, fontSize: 13, letterSpacing: '0.02em' }}>Loading your finances...</p>
        <div style={{ marginTop: 24, width: 40, height: 40, border: '3px solid #e8eaed', borderTopColor: '#3dba5f', borderRadius: '50%', animation: 'loaderSpin 0.8s linear infinite' }} />
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default ProtectedRoute;
