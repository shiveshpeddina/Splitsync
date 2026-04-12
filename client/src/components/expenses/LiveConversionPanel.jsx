import React from 'react';
import { convert, fmt } from '../../utils/currencyUtils';
import { getCurrencyFlag } from '../../constants/currencies';
import './LiveConversionPanel.css';

const LiveConversionPanel = ({ amount, fromCurrency, members, splitType, splitValues, rates, loading }) => {
  const numAmount = parseFloat(amount) || 0;

  const getMemberShare = (member) => {
    let rawShare = 0;
    let percentage = 0;

    if (splitType === 'equal') {
      percentage = 100 / members.length;
      rawShare = numAmount / members.length;
    } else if (splitType === 'percentage') {
       percentage = splitValues[member.id] || 0;
       rawShare = numAmount * (percentage / 100);
    } else if (splitType === 'exact') {
       rawShare = splitValues[member.id] || 0;
       percentage = numAmount > 0 ? (rawShare / numAmount) * 100 : 0;
    } else if (splitType === 'itemized') {
       rawShare = splitValues[member.id] || 0;
       percentage = numAmount > 0 ? (rawShare / numAmount) * 100 : 0;
    }

    const targetCurrency = member.customCurrency || member.homeCurrency || 'INR';
    const convertedShare = convert(rawShare, fromCurrency, targetCurrency, rates);

    return { convertedShare, targetCurrency, percentage };
  };

  if (loading) {
     return (
       <div className="live-panel loading-state">
         <div className="skeleton-row"></div>
         <div className="skeleton-row"></div>
       </div>
     );
  }

  // Handle reminder if percentages don't match 100 (for exact/percentage/itemized)
  // To keep it simple, the math above works per member.

  return (
    <div className="live-panel">
      <div className="live-panel-header">
         <span className="live-h-member">Member</span>
         <span className="live-h-share">Est. Share</span>
      </div>
      <div className="live-panel-list">
         {members.map((m) => {
            const { convertedShare, targetCurrency, percentage } = getMemberShare(m);
            return (
              <div key={m.id} className="live-row">
                 <div className="member-info">
                   <div className="member-avatar">
                     <img src={m.img || `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.name}`} alt="" />
                   </div>
                   <span className="member-name">{m.name}</span>
                 </div>
                 <div className="share-info">
                   <span className="share-amount">
                      <span className="c-flag">{getCurrencyFlag(targetCurrency)}</span>
                      {fmt(convertedShare, targetCurrency)}
                   </span>
                   <span className="share-pct">{percentage.toFixed(0)}%</span>
                 </div>
              </div>
            )
         })}
      </div>
    </div>
  );
};
export default LiveConversionPanel;
