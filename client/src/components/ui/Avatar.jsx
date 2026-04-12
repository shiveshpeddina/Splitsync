import React from 'react';
import styles from './Avatar.module.css';

export default function Avatar({ 
  src, 
  name, 
  emoji,
  size = 'medium', 
  color = '#cbd5e1', 
  badge,
  className = '' 
}) {
  const getInitials = (name) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };

  const cssClasses = [
    styles.avatar,
    styles[`size-${size}`],
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={styles.container}>
      <div 
        className={cssClasses} 
        style={{ 
          backgroundColor: src ? 'transparent' : color,
          color: '#ffffff'
        }}
      >
        {src ? (
          <img src={src} alt={name} className={styles.image} />
        ) : emoji ? (
          <span className={styles.emoji}>{emoji}</span>
        ) : (
          <span className={styles.initials}>{getInitials(name)}</span>
        )}
      </div>
      {badge && (
        <div className={styles.badgeWrapper}>
          {badge}
        </div>
      )}
    </div>
  );
}
