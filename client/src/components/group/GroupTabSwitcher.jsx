import React from 'react';
import { motion } from 'framer-motion';
import styles from './GroupTabSwitcher.module.css';

export default function GroupTabSwitcher({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'expenses', label: '🧾 Expenses' },
    { id: 'balances', label: '💰 Balances' },
    { id: 'members', label: '👥 Members' },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.pillContainer}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTabPill"
                className={styles.activeBg}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
            <span className={styles.label}>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
