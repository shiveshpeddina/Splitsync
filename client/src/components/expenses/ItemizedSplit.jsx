import React, { useState, useEffect } from 'react';
import ReceiptScanner from '../receipt/ReceiptScanner';
import { fmt, convert } from '../../utils/currencyUtils';
import './SmartSplit.css';

const ItemizedSplit = ({ members, splitValues, onChange, totalAmount, currencyCode, rates, autoStartScan, onReceiptData }) => {
  const [showScanner, setShowScanner] = useState(autoStartScan || false);
  const [items, setItems] = useState([
    { id: Date.now().toString(), name: '', price: '', assignedTo: [] }
  ]);

  // Bubble up calculated splits whenever items change
  useEffect(() => {
    const newSplitValues = {};
    items.forEach(item => {
      const price = parseFloat(item.price) || 0;
      if (price > 0 && item.assignedTo.length > 0) {
        const splitShare = price / item.assignedTo.length;
        item.assignedTo.forEach(userId => {
          newSplitValues[userId] = (newSplitValues[userId] || 0) + splitShare;
        });
      }
    });
    
    // Round to 2 decimals
    Object.keys(newSplitValues).forEach(id => {
      newSplitValues[id] = Math.round(newSplitValues[id] * 100) / 100;
    });

    onChange(newSplitValues);
  }, [items]);

  const handleAddItem = (e) => {
    e.preventDefault();
    setItems([...items, { id: Date.now().toString(), name: '', price: '', assignedTo: [] }]);
  };

  const handleUpdateItem = (id, field, value) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleRemoveItem = (e, id) => {
    e.preventDefault();
    setItems(items.filter(item => item.id !== id));
  };

  const toggleAssign = (itemId, userId) => {
    setItems(items.map(item => {
      if (item.id === itemId) {
        const assigned = item.assignedTo.includes(userId)
          ? item.assignedTo.filter(id => id !== userId)
          : [...item.assignedTo, userId];
        return { ...item, assignedTo: assigned };
      }
      return item;
    }));
  };

  const currentTotal = items.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
  const remaining = (parseFloat(totalAmount) || 0) - currentTotal;
  const isComplete = Math.abs(remaining) <= 0.05;

  const handleScanComplete = (scanResult) => {
    // scanResult = { items: [{name, price}], description, total }
    const scannedItems = scanResult.items || [];
    
    const formattedItems = scannedItems.map(item => ({
      ...item,
      id: Date.now().toString() + Math.random(),
      assignedTo: []
    }));

    // Remove the empty default row if it's there
    const filteredCurrent = items.filter(i => i.name || i.price);
    setItems([...filteredCurrent, ...formattedItems]);
    setShowScanner(false);

    // Pass receipt metadata (description, total, currency) up to the parent ExpenseForm
    if (onReceiptData) {
      onReceiptData({
        description: scanResult.description || '',
        total: scanResult.total || 0,
        currency: scanResult.currency || ''
      });
    }
  };

  return (
    <div className="smart-split-container">
      {showScanner ? (
        <ReceiptScanner 
          onScanComplete={handleScanComplete} 
          onCancel={() => setShowScanner(false)} 
        />
      ) : (
        <button 
          type="button"
          onClick={() => setShowScanner(true)}
          style={{ 
            width: '100%', marginBottom: 16, padding: '14px', 
            background: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)', 
            color: '#4f46e5', border: '1px solid #c7d2fe', borderRadius: 10, 
            cursor: 'pointer', fontWeight: 600, 
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            transition: 'all 0.2s',
            fontSize: 14
          }}
          onMouseOver={(e) => { e.target.style.background = '#e0e7ff'; e.target.style.borderColor = '#a5b4fc'; }}
          onMouseOut={(e) => { e.target.style.background = 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)'; e.target.style.borderColor = '#c7d2fe'; }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
          🧾 Scan Receipt with AI
        </button>
      )}

      <div className="split-status">
        <span style={{ color: isComplete ? '#8add5c' : '#ef4444', fontWeight: 'bold' }}>
          {totalAmount ? (isComplete ? '✅ All items accounted for' : remaining > 0 ? `${fmt(remaining, currencyCode)} remaining` : `${fmt(Math.abs(remaining), currencyCode)} over limit`) : `Total: ${fmt(currentTotal, currencyCode)}`}
        </span>
      </div>

      <div className="itemized-list">
        {items.map((item, index) => (
          <div key={item.id} className="itemized-row" style={{ 
            border: '1px solid #e5e7eb', padding: 14, borderRadius: 10, marginBottom: 14,
            background: item.name && item.price ? '#fafbfc' : '#fff',
            transition: 'all 0.2s'
          }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <input 
                type="text" 
                placeholder="Item name" 
                value={item.name}
                onChange={(e) => handleUpdateItem(item.id, 'name', e.target.value)}
                style={{ 
                  flex: 1, padding: '10px 12px', border: '1px solid #d1d5db', 
                  borderRadius: 8, outline: 'none', fontSize: 14,
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#4f46e5'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <input 
                  type="number" 
                  placeholder="Price" 
                  value={item.price}
                  onChange={(e) => handleUpdateItem(item.id, 'price', e.target.value)}
                  style={{ 
                    width: 80, padding: '10px 12px', border: '1px solid #d1d5db', 
                    borderRadius: 8, outline: 'none', fontSize: 14,
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#4f46e5'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
                <span style={{ 
                  fontSize: 11, fontWeight: 600, color: '#6366f1', 
                  background: '#eef2ff', padding: '4px 8px', borderRadius: 6,
                  whiteSpace: 'nowrap', letterSpacing: '0.02em'
                }}>
                  {currencyCode || 'INR'}
                </span>
              </div>
              <button 
                type="button"
                onClick={(e) => handleRemoveItem(e, item.id)}
                style={{ 
                  background: 'none', border: 'none', color: '#ef4444', 
                  cursor: 'pointer', fontSize: 22, lineHeight: 1, padding: '0 4px',
                  transition: 'transform 0.2s'
                }}
                onMouseOver={(e) => e.target.style.transform = 'scale(1.2)'}
                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
              >
                ×
              </button>
            </div>
            
            <div className="item-assign-avatars" style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {members.map(m => {
                const isAssigned = item.assignedTo.includes(m.id);
                return (
                  <div 
                    key={m.id} 
                    onClick={() => toggleAssign(item.id, m.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 4, padding: '5px 12px',
                      borderRadius: 20, border: `1.5px solid ${isAssigned ? '#4f46e5' : '#e5e7eb'}`,
                      background: isAssigned ? '#eef2ff' : '#f9fafb',
                      cursor: 'pointer', fontSize: 12, fontWeight: isAssigned ? 'bold' : 'normal',
                      color: isAssigned ? '#4f46e5' : '#6b7280', transition: 'all 0.2s',
                      userSelect: 'none'
                    }}
                  >
                    <img 
                      src={m.img || `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.name}`} 
                      alt=""
                      style={{ width: 18, height: 18, borderRadius: '50%' }}
                      onError={(e) => { e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=fallback`; }}
                    />
                    {m.name.split(' ')[0]}
                    {isAssigned && <span style={{ fontSize: 10 }}>✓</span>}
                  </div>
                )
              })}
            </div>

            {/* Per-item share breakdown */}
            {item.assignedTo.length > 0 && parseFloat(item.price) > 0 && (
              <div style={{
                marginTop: 10, padding: '8px 12px',
                background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
                borderRadius: 8, border: '1px solid #bbf7d0'
              }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: '#16a34a', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                  Split {item.assignedTo.length > 1 ? `between ${item.assignedTo.length}` : 'to 1'} — {fmt(parseFloat(item.price) / item.assignedTo.length, currencyCode)}/person
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {item.assignedTo.map(userId => {
                    const member = members.find(m => m.id === userId);
                    const perPersonShare = parseFloat(item.price) / item.assignedTo.length;
                    return (
                      <div key={userId} style={{
                        display: 'flex', alignItems: 'center', gap: 4,
                        fontSize: 11, color: '#15803d', fontWeight: 500
                      }}>
                        <span style={{ 
                          width: 16, height: 16, borderRadius: '50%', 
                          background: '#dcfce7', display: 'inline-flex', 
                          alignItems: 'center', justifyContent: 'center',
                          fontSize: 9, fontWeight: 700, color: '#16a34a'
                        }}>
                          {(member?.name || '?')[0].toUpperCase()}
                        </span>
                        {member?.name?.split(' ')[0]}: {fmt(perPersonShare, currencyCode)}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <button 
        type="button"
        onClick={handleAddItem}
        className="add-item-btn"
        style={{ 
          width: '100%', padding: '12px', background: '#f3f4f6', 
          border: '1px dashed #cbd5e1', borderRadius: 10, cursor: 'pointer', 
          fontWeight: 600, color: '#64748b', transition: 'all 0.2s', fontSize: 14
        }}
        onMouseOver={(e) => { e.target.style.background = '#e5e7eb'; e.target.style.borderColor = '#94a3b8'; }}
        onMouseOut={(e) => { e.target.style.background = '#f3f4f6'; e.target.style.borderColor = '#cbd5e1'; }}
      >
        + Add Item
      </button>

      <div style={{ marginTop: 24, fontSize: 13, borderTop: '1px solid #eee', paddingTop: 16 }}>
        <strong style={{ display: 'block', marginBottom: 8, color: '#333' }}>Calculated Shares:</strong>
        {members.map(m => {
          const share = splitValues[m.id] || 0;
          if (share <= 0) return null;
          const targetCurrency = m.customCurrency || m.homeCurrency || 'INR';
          const billCurrency = currencyCode || 'INR';
          const ratesAvailable = Object.keys(rates || {}).length > 0;
          const convertedShare = (ratesAvailable && targetCurrency !== billCurrency)
            ? convert(share, billCurrency, targetCurrency, rates)
            : null;

          return (
            <div key={`share-${m.id}`} style={{ 
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '6px 0', color: '#4b5563', borderBottom: '1px solid #f3f4f6'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: 500 }}>{m.name.split(' ')[0]}</span>
                <span style={{ fontSize: 10, color: '#9ca3af', fontWeight: 600 }}>{targetCurrency}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span style={{ fontWeight: 'bold', color: '#1e293b' }}>{fmt(share, billCurrency)}</span>
                {convertedShare !== null && (
                  <span style={{ fontSize: 11, color: '#6366f1', fontWeight: 500 }}>
                    ≈ {fmt(convertedShare, targetCurrency)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ItemizedSplit;
