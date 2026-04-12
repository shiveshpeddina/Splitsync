import React from 'react';
import styles from './Badge.module.css';

export default function Badge({ 
  children, 
  variant = 'default',
  size = 'small',
  icon,
  className = '' 
}) {
  const classes = [
    styles.badge,
    styles[variant],
    styles[`size-${size}`],
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {icon && <span className={styles.icon}>{icon}</span>}
      <span>{children}</span>
    </div>
  );
}
