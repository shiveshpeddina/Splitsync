import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import styles from './GroupsRow.module.css';

export default function GroupsRow({ groups = [], onCreateGroup }) {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <h3 className={styles.title}>My Groups</h3>
        <button className={styles.createLink} onClick={onCreateGroup}>
          + Create
        </button>
      </div>
      
      <motion.div 
        className={styles.scrollRow}
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {groups.map((group) => (
          <motion.div 
            key={group.id} 
            variants={itemVariants}
            className={styles.groupCard}
            onClick={() => navigate(`/group/${group.id}`)}
          >
            <div className={styles.emoji}>{group.emoji || '👥'}</div>
            <div className={styles.info}>
              <div className={styles.name}>{group.name}</div>
              <div className={styles.members}>{group.members?.length || 0} members</div>
            </div>
          </motion.div>
        ))}

        <motion.div 
          variants={itemVariants}
          className={`${styles.groupCard} ${styles.newCard}`}
          onClick={onCreateGroup}
        >
          <div className={styles.newIconWrapper}>
            <Plus size={24} className={styles.newIcon} />
          </div>
          <div className={styles.name}>New Group</div>
        </motion.div>
      </motion.div>
    </div>
  );
}
