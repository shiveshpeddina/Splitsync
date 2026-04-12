import React from 'react';
import { motion } from 'framer-motion';
import styles from './Button.module.css';

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  fullWidth = false,
  className = '',
  loading = false,
  disabled = false,
  ...props 
}) {
  const classes = [
    styles.button,
    styles[variant],
    styles[`size-${size}`],
    fullWidth ? styles.fullWidth : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <motion.button 
      className={classes}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.96 }}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <span className="spinner" style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          Loading...
        </span>
      ) : (
        children
      )}
    </motion.button>
  );
}
