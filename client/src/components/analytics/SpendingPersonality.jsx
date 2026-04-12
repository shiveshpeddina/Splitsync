import React from 'react';

const SpendingPersonality = ({ personality, totalSpent, currencyCode }) => {
  if (!personality) return null;

  return (
    <div style={{
      background: `linear-gradient(135deg, ${personality.color}22, ${personality.color}11)`,
      border: `1px solid ${personality.color}44`,
      borderRadius: '16px',
      padding: '24px',
      textAlign: 'center',
      marginBottom: '24px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        fontSize: '64px',
        lineHeight: 1,
        marginBottom: '16px',
        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
      }}>
        {personality.emoji}
      </div>
      <h3 style={{ 
        margin: '0 0 8px 0', 
        color: personality.color,
        fontSize: '24px'
      }}>
        {personality.label}
      </h3>
      <p style={{ 
        margin: '0 0 16px 0', 
        color: '#475569',
        fontSize: '15px'
      }}>
        {personality.description}
      </p>
      
      <div style={{
        background: '#fff',
        display: 'inline-block',
        padding: '8px 16px',
        borderRadius: '20px',
        fontWeight: 'bold',
        color: '#1e293b',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        Total Contributed: {currencyCode} {totalSpent.toFixed(2)}
      </div>
    </div>
  );
};

export default SpendingPersonality;
