import React from 'react';
import vibeTags from '../../constants/vibeTags';

const CategoryBreakdown = ({ breakdown }) => {
  if (!breakdown || breakdown.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
        No spending data to analyze yet.
      </div>
    );
  }

  return (
    <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0' }}>
      <h3 style={{ margin: '0 0 20px 0', color: '#1e293b', fontSize: '18px' }}>Category Breakdown</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {breakdown.map((item) => {
          const tagInfo = vibeTags.find(t => t.id === item.tag) || { label: 'Other', emoji: '📌', color: '#94a3b8' };
          
          return (
            <div key={item.tag}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                <span style={{ fontWeight: '600', color: '#334155' }}>
                  {tagInfo.emoji} {tagInfo.label}
                </span>
                <span style={{ fontWeight: 'bold', color: '#0f172a' }}>
                  {item.percent}%
                </span>
              </div>
              <div style={{ 
                height: '8px', 
                background: '#f1f5f9', 
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  width: `${item.percent}%`,
                  background: tagInfo.color,
                  borderRadius: '4px',
                  transition: 'width 1s ease-out'
                }} />
              </div>
              <div style={{ textAlign: 'right', fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                Amount: {item.amount.toFixed(2)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryBreakdown;
