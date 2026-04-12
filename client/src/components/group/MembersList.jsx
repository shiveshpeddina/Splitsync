import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserMinus } from 'lucide-react';
import Avatar from '../ui/Avatar';
import { AvatarDisplay } from '../common/AvatarPicker';
import styles from './MembersList.module.css';

export default function MembersList({ members, onRemoveMember, currentUserId }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <motion.div 
      className={styles.list}
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <AnimatePresence>
        {members.map((member) => (
          <motion.div 
            key={member.id} 
            variants={itemVariants} 
            exit={{ opacity: 0, x: -30, height: 0, marginBottom: 0, transition: { duration: 0.25 } }}
            layout
            className={styles.row}
          >
            {member.avatar ? (
              <AvatarDisplay avatarId={member.avatar} name={member.name} size={40} />
            ) : (
              <Avatar 
                name={member.name}
                size="medium"
              />
            )}
            <div className={styles.info}>
              <div className={styles.name}>{member.name}</div>
              <div className={styles.identifier}>
                {member.phone || member.email || 'No contact info'}
              </div>
            </div>
            {member.role === 'admin' && (
              <div className={styles.adminBadge}>Admin</div>
            )}
            {onRemoveMember && member.id !== currentUserId && (
              <button
                className={styles.removeBtn}
                onClick={() => {
                  if (window.confirm(`Remove ${member.name} from this group?`)) {
                    onRemoveMember(member.id);
                  }
                }}
                title={`Remove ${member.name}`}
              >
                <UserMinus size={16} />
              </button>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
