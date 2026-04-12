import React, { useState } from 'react';

const SpinWheel = ({ members, onComplete, onCancel }) => {
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState(null);
  const [rotation, setRotation] = useState(0);

  const handleSpin = () => {
    if (spinning || members.length <= 1) return;
    setSpinning(true);
    setWinner(null);
    
    const extraTurns = Math.floor(Math.random() * 5) + 5;
    const randomSegment = Math.floor(Math.random() * members.length);
    const segmentAngle = 360 / members.length;
    
    const targetRotation = (extraTurns * 360) + (randomSegment * segmentAngle) + (segmentAngle / 2);
    const newRotation = rotation + targetRotation;
    setRotation(newRotation);
    
    setTimeout(() => {
      setSpinning(false);
      const normalized = newRotation % 360;
      let landedAngle = 360 - normalized;
      if (landedAngle === 360) landedAngle = 0;
      const winnerIndex = Math.floor(landedAngle / segmentAngle) % members.length;
      
      setWinner(members[winnerIndex]);
      if (onComplete) onComplete(members[winnerIndex]);
    }, 4000); 
  };

  const colors = ['#f87171', '#fb923c', '#fbbf24', '#a3e635', '#34d399', '#38bdf8', '#818cf8', '#c084fc', '#f472b6'];

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      {winner ? (
        <div style={{ animation: 'popIn 0.5s', padding: 20 }}>
          <h2 style={{ fontSize: 28, margin: '0 0 8px 0', color: '#1e293b' }}>🎉 {winner.name} 🎉</h2>
          <p style={{ color: '#64748b' }}>is paying this time!</p>
          <img 
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${winner.name}`} 
            alt="winner" 
            style={{ width: 100, height: 100, margin: '24px auto', borderRadius: '50%', background: '#f1f5f9', border: '4px solid #4f46e5' }} 
            onError={(e) => { e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=fallback`; }}
          />
          <button 
            onClick={onCancel} 
            style={{ display: 'block', width: '100%', marginTop: 24, padding: '12px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold' }}
          >
            Awesome
          </button>
        </div>
      ) : (
        <div style={{ position: 'relative', width: 250, height: 250, margin: '20px auto' }}>
          {/* Pointer */}
          <div style={{ position: 'absolute', top: -15, left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}>
            <div style={{ width: 0, height: 0, borderLeft: '15px solid transparent', borderRight: '15px solid transparent', borderTop: '25px solid #1e293b' }}></div>
          </div>
          
          {/* Wheel */}
          <div 
            style={{ 
              width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', 
              position: 'relative', transform: `rotate(${rotation}deg)`, 
              transition: 'transform 4s cubic-bezier(0.1, 0.7, 0.1, 1)',
              boxShadow: '0 0 0 8px #f1f5f9, 0 4px 12px rgba(0,0,0,0.1)'
            }}
          >
            {members.map((m, i) => {
               const angle = 360 / members.length;
               // Valid only for simple wedges. If members > 2 we skew the rectangle to form a wedge
               // Actually using conic-gradient is much easier in React!
               return null; 
            })}
            {/* Let's just use CSS conic-gradient since it supports it perfectly */}
            <div style={{
              width: '100%', height: '100%',
              background: `conic-gradient(${members.map((m, i) => {
                 const step = 360 / members.length;
                 const color = colors[i % colors.length];
                 return `${color} ${i * step}deg ${(i + 1) * step}deg`;
              }).join(', ')})`
            }}></div>
            
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 5 }}>
              {members.map((m, i) => {
                 const angle = (360 / members.length) * i + (360 / members.length) / 2;
                 return (
                   <div 
                     key={`text-${m.id}`}
                     style={{
                       position: 'absolute', top: '50%', left: '50%', width: '50%', height: 20,
                       marginTop: -10, transformOrigin: '0 50%', transform: `rotate(${angle - 90}deg)`,
                       display: 'flex', alignItems: 'center', justifyContent: 'center', paddingLeft: '20%'
                     }}
                   >
                     <span style={{ fontSize: 13, fontWeight: 'bold', color: 'rgba(255,255,255,0.9)', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                       {m.name.split(' ')[0]}
                     </span>
                   </div>
                 )
              })}
            </div>
          </div>
          
          {/* Center */}
          <div 
            onClick={handleSpin}
            style={{ 
              position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', 
              width: 56, height: 56, background: '#fff', borderRadius: '50%', zIndex: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: spinning ? 'default' : 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)', border: '4px solid #f1f5f9'
            }}
          >
            <span style={{ fontWeight: '900', color: spinning ? '#cbd5e1' : '#4f46e5', fontSize: 14 }}>SPIN</span>
          </div>
        </div>
      )}
    </div>
  );
};
export default SpinWheel;
