import React from 'react';
import './SmartSplit.css';

const PercentageSplit = ({ members, splitValues, onChange }) => {
  const totalPct = members.reduce((sum, m) => sum + (splitValues[m.id] || 0), 0);
  const isComplete = totalPct === 100;

  const handleSliderChange = (id, val) => {
    const newVal = parseInt(val, 10) || 0;
    onChange({ ...splitValues, [id]: newVal });
  };

  return (
    <div className="smart-split-container">
      <div className="split-status">
        <span style={{ color: isComplete ? '#8add5c' : '#ef4444', fontWeight: 'bold' }}>
          {totalPct}% 
        </span>
        <span style={{ color: '#999', fontSize: 13, marginLeft: 6 }}>
          {isComplete ? 'Perfectly split' : 'Must equal 100%'}
        </span>
      </div>
      
      {members.map(m => (
        <div key={m.id} className="split-input-row">
          <div className="split-member-info">
             <img src={m.img || `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.name}`} alt={m.name} onError={(e) => { e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=fallback`; }} />
             <span>{m.name}</span>
          </div>
          <div className="slider-container">
             <input 
               type="range" 
               min="0" 
               max="100" 
               value={splitValues[m.id] || 0}
               onChange={(e) => handleSliderChange(m.id, e.target.value)}
             />
             <span className="slider-val">{splitValues[m.id] || 0}%</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PercentageSplit;
