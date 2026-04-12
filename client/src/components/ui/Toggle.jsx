import React from 'react';
import { motion } from 'framer-motion';
import styles from './Toggle.module.css';

export default function Toggle({ 
  checked, 
  onChange, 
  disabled = false,
  label
}) {
  return (
    <div className={styles.container}>
      {label && <span className={styles.label}>{label}</span>}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => !disabled && onChange(!checked)}
        className={`${styles.toggle} ${checked ? styles.checked : ''} ${disabled ? styles.disabled : ''}`}
        disabled={disabled}
      >
        <motion.div
          className={styles.thumb}
          layout
          transition={{ type: "spring", stiffness: 700, damping: 30 }}
        />
      </button>
    </div>
  );
}
