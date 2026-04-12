import React from 'react';
import { motion } from 'framer-motion';
import styles from './StatCard.module.css';

export default function StatCard({ 
  icon, 
  value, 
  label, 
  valueColor = 'var(--color-primary)',
  iconBgColor = 'rgba(61, 186, 95, 0.15)'
}) {
  return (
    <motion.div 
      className={styles.card}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className={styles.iconContainer} style={{ backgroundColor: iconBgColor }}>
        {icon}
      </div>
      <div className={styles.content}>
        <div className={styles.value} style={{ color: valueColor }}>
          {value}
        </div>
        <div className={styles.label}>
          {label}
        </div>
      </div>
    </motion.div>
  );
}
