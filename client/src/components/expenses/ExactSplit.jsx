import React from 'react';
import { getCurrencyFlag } from '../../constants/currencies';
import './SmartSplit.css';

const ExactSplit = ({ members, splitValues, onChange, totalAmount, currencyCode }) => {
  const currentTotal = members.reduce((sum, m) => sum + (splitValues[m.id] || 0), 0);
  const remaining = (parseFloat(totalAmount) || 0) - currentTotal;
  const isComplete = Math.abs(remaining) <= 0.05; // allow small floating precision margin

  const handleAmountChange = (id, val) => {
    let raw = val.trim();
    if (raw === '') raw = '0';
    const num = parseFloat(raw) || 0;
    onChange({ ...splitValues, [id]: num });
  };

  return (
    <div className="smart-split-container">
      <div className="split-status">
        <span style={{ color: isComplete ? '#8add5c' : '#ef4444', fontWeight: 'bold' }}>
          {remaining > 0.05 ? `${remaining.toFixed(2)} left` : remaining < -0.05 ? `${Math.abs(remaining).toFixed(2)} over` : 'Perfectly split'}
        </span>
      </div>
      
      {members.map(m => (
        <div key={m.id} className="split-input-row">
           <div className="split-member-info">
             <img src={m.img || `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.name}`} alt={m.name} onError={(e) => { e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=fallback`; }} />
             <span>{m.name}</span>
           </div>
           <div className="amount-input-container">
             <span className="input-prefix">{getCurrencyFlag(currencyCode)}</span>
             <input 
               type="number"
               className="smart-number-input"
               placeholder="0.00"
               value={splitValues[m.id] || ''}
               onChange={(e) => handleAmountChange(m.id, e.target.value)}
             />
           </div>
        </div>
      ))}
    </div>
  );
};

export default ExactSplit;
