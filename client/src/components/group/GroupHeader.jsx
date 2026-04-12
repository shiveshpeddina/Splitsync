import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2 } from 'lucide-react';
import styles from './GroupHeader.module.css';

export default function GroupHeader({ group, onDeleteGroup, onSpin, onInsights }) {
  const navigate = useNavigate();

  return (
    <div className={styles.headerContainer}>
      <header className={styles.topBar}>
        <button className={styles.iconButton} onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
        </button>
        <h1 className={styles.title}>
          <span className={styles.emoji}>{group.emoji}</span> {group.name}
        </h1>
        <button className={`${styles.iconButton} ${styles.dangerIcon}`} onClick={onDeleteGroup}>
          <Trash2 size={22} />
        </button>
      </header>

      <div className={styles.actionPillsRow}>
        <button className={`${styles.actionPill} ${styles.pillSpin}`} onClick={onSpin}>
          🎰 Spin
        </button>
        <button className={`${styles.actionPill} ${styles.pillInsights}`} onClick={onInsights}>
          📊 Insights
        </button>
      </div>
    </div>
  );
}
