import React from 'react';
import { motion } from 'framer-motion';
import StatCard from '../ui/StatCard';
import { fmt } from '../../utils/currencyUtils';

export default function GroupStatCards({ totalSpent, pendingSettlements, baseCurrency, loading = false }) {
  if (loading) {
    return (
      <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', padding: '16px 20px', scrollbarWidth: 'none' }}>
        <div style={{ width: 140, height: 100, background: 'var(--color-surface-2)', borderRadius: 'var(--radius-md)', flexShrink: 0 }} />
        <div style={{ width: 140, height: 100, background: 'var(--color-surface-2)', borderRadius: 'var(--radius-md)', flexShrink: 0 }} />
        <div style={{ width: 140, height: 100, background: 'var(--color-surface-2)', borderRadius: 'var(--radius-md)', flexShrink: 0 }} />
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      gap: '16px', 
      overflowX: 'auto', 
      padding: '20px', 
      scrollbarWidth: 'none',
      scrollSnapType: 'x mandatory'
    }}>
      <div style={{ scrollSnapAlign: 'start', flexShrink: 0 }}>
        <StatCard 
          icon="💳" 
          value={fmt(totalSpent, baseCurrency)} 
          label="Total Spent"
          iconBgColor="var(--color-primary-light)"
          valueColor="var(--color-primary-dark)" 
        />
      </div>
      <div style={{ scrollSnapAlign: 'start', flexShrink: 0 }}>
        <StatCard 
          icon="👥" 
          value={fmt(totalSpent / 2, baseCurrency)} // Just an example per person calculation, real app would divide by member count
          label="Per Person"
          iconBgColor="#eff3ff"
          valueColor="var(--color-info)"
        />
      </div>
      <div style={{ scrollSnapAlign: 'start', flexShrink: 0 }}>
        <StatCard 
          icon="⏳" 
          value={pendingSettlements.toString()} 
          label="Pending"
          iconBgColor="#fff8e6"
          valueColor="var(--color-warning)"
        />
      </div>
    </div>
  );
}
