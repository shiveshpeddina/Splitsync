import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';
import currencies, { getCurrencySymbol, getCurrencyFlag } from '../constants/currencies';
import './CurrencyPage.css';

const CurrencyPage = () => {
  const navigate = useNavigate();
  const { rates, loading, lastUpdated } = useCurrency();
  
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [targetCurrency, setTargetCurrency] = useState('INR');
  const [amount, setAmount] = useState('1');

  // Convert generic amount based on fetched rates mapping cross-referenced to USD generally 
  const calculateConversion = () => {
    if (!amount || isNaN(amount)) return '0.00';
    
    // Cross conversion logic (In case base isn't 1)
    const numAmount = parseFloat(amount);
    const inINR = numAmount / (rates[baseCurrency] || 1);
    const converted = inINR * (rates[targetCurrency] || 1);
    
    return converted.toFixed(2);
  };

  const handleSwap = () => {
    setBaseCurrency(targetCurrency);
    setTargetCurrency(baseCurrency);
  };

  return (
    <div className="currency-container">
      <header className="home-header">
        <button className="icon-btn" onClick={() => navigate(-1)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"></path></svg>
        </button>
        <h2 style={{ fontSize: '18px', fontWeight: '700' }}>Rates</h2>
        <div style={{ width: 36 }}></div>
      </header>

      <div className="converter-card">
        <h3 className="card-title">Converter</h3>
        
        <div className="input-row">
          <div className="amount-group">
             <label>Amount</label>
             <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
          <div className="currency-select-group">
            <label>From</label>
            <div className="custom-select">
              <span className="flag">{getCurrencyFlag(baseCurrency)}</span>
              <select value={baseCurrency} onChange={(e) => setBaseCurrency(e.target.value)}>
                {currencies.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="swap-container">
           <button className="swap-btn" onClick={handleSwap}>
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path></svg>
           </button>
        </div>

        <div className="input-row">
          <div className="amount-group converted-box">
             <label>Converted Amount</label>
             <div className="converted-val">{getCurrencySymbol(targetCurrency)}{calculateConversion()}</div>
          </div>
          <div className="currency-select-group">
            <label>To</label>
            <div className="custom-select">
              <span className="flag">{getCurrencyFlag(targetCurrency)}</span>
              <select value={targetCurrency} onChange={(e) => setTargetCurrency(e.target.value)}>
                {currencies.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="rates-section">
        <h3 className="card-title">Live Rates <span>1 {baseCurrency} =</span></h3>
        <p className="last-updated">Last updated: {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : '...'} {loading && '(Syncing...)'}</p>
        
        <div className="rates-list">
          {currencies.filter(c => c.code !== baseCurrency).map(c => {
             const baseR = rates[baseCurrency];
             const targetR = rates[c.code];
             const rateVal = baseR && targetR ? ((1 / baseR) * targetR).toFixed(4) : '...';
             
             return (
               <div key={c.code} className="rate-row">
                 <div className="rate-left">
                   <span className="rate-flag">{c.flag}</span>
                   <span className="rate-code">{c.code}</span>
                   <span className="rate-name">{c.name}</span>
                 </div>
                 <div className="rate-right">
                   {c.symbol} {rateVal}
                 </div>
               </div>
             )
          })}
        </div>
      </div>
    </div>
  );
};

export default CurrencyPage;
