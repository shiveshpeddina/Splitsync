import React from 'react';
import currencies, { getCurrencyFlag } from '../../constants/currencies';
import './CurrencySelector.css';

const CurrencySelector = ({ value, onChange }) => {
  const current = currencies.find(c => c.code === value);
  
  return (
    <div className="currency-selector">
      <div className="currency-selector-input">
        <span className="cur-flag">{current ? current.flag : '🏳️'}</span>
        <span className="cur-code">{value}</span>
        <select value={value} onChange={e => onChange(e.target.value)}>
          {currencies.map(c => (
            <option key={c.code} value={c.code}>
              {c.flag} {c.code} - {c.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default CurrencySelector;
