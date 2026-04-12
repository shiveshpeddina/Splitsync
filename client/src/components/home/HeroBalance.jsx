import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Plus } from 'lucide-react';
import Button from '../ui/Button';
import { fmt } from '../../utils/currencyUtils';

export default function HeroBalance({ amountOwed, currency, onAdd, onScan }) {
  const navigate = useNavigate();
  
  const isPositive = amountOwed >= 0;
  
  const glowStyle = {
    textShadow: isPositive 
      ? '0 0 40px rgba(61,186,95,0.3)' 
      : '0 0 40px rgba(240,62,62,0.3)',
    color: 'var(--color-text)'
  };

  return (
    <div style={{ padding: '28px', textAlign: 'center' }}>
      <p style={{ 
        color: 'var(--color-text-muted)', 
        fontSize: '13px', 
        textTransform: 'uppercase', 
        letterSpacing: '0.08em',
        fontWeight: 600,
        marginBottom: '8px'
      }}>
        {isPositive ? 'Friends are owing you' : 'You are owing'}
      </p>
      
      <motion.h2 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={{ 
          fontFamily: 'var(--font-mono)', 
          fontSize: '42px', 
          fontWeight: 700, 
          margin: '0 0 24px 0',
          ...glowStyle
        }}
      >
        {fmt(Math.abs(amountOwed), currency)}
      </motion.h2>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <Button 
          variant="primary" 
          onClick={() => onAdd ? onAdd() : navigate('/add')}
          style={{ flex: 1, height: '48px' }}
        >
          <Plus size={18} />
          Add Manually
        </Button>
        <Button 
          variant="dark" 
          onClick={() => onScan ? onScan() : navigate('/add?scan=true')}
          style={{ flex: 1, height: '48px' }}
        >
          <Zap size={18} />
          Quick Scan
        </Button>
      </div>
    </div>
  );
}
