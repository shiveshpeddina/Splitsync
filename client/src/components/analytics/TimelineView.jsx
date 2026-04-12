import React from 'react';

const TimelineView = ({ expenses, currencyCode }) => {
  if (!expenses || expenses.length === 0) return null;

  // Group expenses by date
  const grouped = {};
  expenses.forEach(exp => {
    const dateObj = new Date(exp.createdAt);
    const dateStr = dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    if (!grouped[dateStr]) grouped[dateStr] = [];
    grouped[dateStr].push(exp);
  });

  const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a));

  return (
    <div style={{ marginTop: '32px' }}>
      <h3 style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '20px', color: '#1e293b' }}>Recent Timeline</h3>
      <div style={{ position: 'relative', borderLeft: '2px solid #e2e8f0', marginLeft: '12px' }}>
        {sortedDates.map(dateStr => (
          <div key={dateStr} style={{ marginBottom: '24px', paddingLeft: '24px', position: 'relative' }}>
            <div style={{ 
               position: 'absolute', left: '-7px', top: '0', width: '12px', height: '12px', 
               background: '#4f46e5', borderRadius: '50%', border: '2px solid #fff' 
            }} />
            <h4 style={{ margin: '0 0 12px 0', color: '#64748b', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
               {dateStr}
            </h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {grouped[dateStr].map(exp => (
                <div key={exp.id} style={{ 
                  background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' 
                }}>
                  <div>
                    <div style={{ fontWeight: 600, color: '#1e293b' }}>{exp.description}</div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', textTransform: 'capitalize' }}>
                       {exp.vibeTag || 'expense'}
                    </div>
                  </div>
                  <div style={{ fontWeight: 'bold', color: '#ef4444' }}>
                    {currencyCode} {exp.amount.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimelineView;
