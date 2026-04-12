import React from 'react';
import { motion } from 'framer-motion';
import Badge from '../ui/Badge';
import Avatar from '../ui/Avatar';
import { AvatarDisplay } from '../common/AvatarPicker';
import styles from './FriendsList.module.css';

export default function FriendsList({ friends = [], onAddFriend, onFriendClick }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 10 },
    show: { opacity: 1, scale: 1, y: 0 }
  };

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <h3 className={styles.title}>Friends List</h3>
          <button className={styles.addBadge} onClick={onAddFriend}>
            + Add Friend
          </button>
        </div>
        <button className={styles.seeMore}>See more</button>
      </div>

      <motion.div 
        className={styles.scrollRow}
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {friends.map(friend => {
          const currencyBadge = friend.customCurrency 
            ? <Badge 
                variant={`currency-${friend.customCurrency.toLowerCase()}`}
                size="small"
              >
                {friend.customCurrency}
              </Badge>
            : null;

          return (
            <motion.div 
              key={friend.id}
              className={styles.friendItem}
              variants={itemVariants}
              onClick={() => onFriendClick && onFriendClick(friend)}
            >
              {friend.avatar ? (
                <div className={styles.avatarWrap}>
                  <AvatarDisplay 
                    avatarId={friend.avatar} 
                    name={friend.alias || friend.name} 
                    size={52} 
                  />
                  {currencyBadge && (
                    <div className={styles.badgePos}>{currencyBadge}</div>
                  )}
                </div>
              ) : (
                <Avatar 
                  name={friend.alias || friend.name}
                  size="large"
                  badge={currencyBadge}
                  className={styles.avatar}
                />
              )}
              <span className={styles.name}>{(friend.alias || friend.name).split(' ')[0]}</span>
            </motion.div>
          );
        })}

        {friends.length === 0 && (
          <div className={styles.emptyState}>
            No friends added yet.
          </div>
        )}
      </motion.div>
    </div>
  );
}
