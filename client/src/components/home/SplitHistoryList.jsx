import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X, Check } from 'lucide-react';
import Badge from '../ui/Badge';
import Avatar from '../ui/Avatar';
import { fmt, convert } from '../../utils/currencyUtils';
import { calculateNetBalances } from '../../utils/debtSimplifier';
import styles from './SplitHistoryList.module.css';

export default function SplitHistoryList({ history = [], groups = [], user, rates }) {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <h3 className={styles.title}>Split History</h3>
        <button className={styles.seeMore}>See more</button>
      </div>

      <motion.div 
        className={styles.list}
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {history.length === 0 ? (
          <div className={styles.emptyState}>
            No recent activity. Let's add some expenses!
          </div>
        ) : null}

        {history.map(item => {
          const isNonINR = item.currency && item.currency !== (user?.homeCurrency || 'INR');
          const ratesAvailable = Object.keys(rates || {}).length > 0;
          const amountConverted = (isNonINR && ratesAvailable)
            ? (item.amountInBase && item.amountInBase !== item.amount 
                ? item.amountInBase
                : convert(item.amount, item.currency, user?.homeCurrency || 'INR', rates))
            : null;

          const group = groups.find(g => g.id === item.groupId);
          const userBalance = group ? (calculateNetBalances(group.expenses, rates)[user?.id] || 0) : 0;
          const isSettled = Math.abs(userBalance) < 0.01;
          
          let statusText = isSettled ? 'Settled' : 'Not Settled';
          let statusVariant = isSettled ? 'success' : 'danger';
          let StatusIcon = isSettled ? Check : X;
          
          if (item.vibeTag === 'settlement') {
            statusText = 'Payment';
            statusVariant = 'success';
            StatusIcon = Check;
          }

          return (
            <motion.div 
              key={item.id} 
              variants={itemVariants}
              className={styles.card}
              onClick={() => navigate(`/group/${item.groupId}`)}
            >
              <div className={styles.cardTop}>
                <div className={styles.iconCircle}>☕</div>
                <div className={styles.info}>
                  <div className={styles.itemName}>{item.description}</div>
                  <div className={styles.dateGroup}>
                    {group?.name || 'Group'} • {new Date(item.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>
                <div className={styles.avatars}>
                  {item.splits.slice(0,3).map((split, idx) => (
                    <Avatar 
                      key={split.id}
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${split.userId}`} 
                      name={split.userId}
                      size="small"
                      className={styles.overlapAvatar}
                      style={{ zIndex: 3 - idx, marginLeft: idx > 0 ? '-8px' : '0' }}
                    />
                  ))}
                  {item.splits.length > 3 && (
                    <div className={styles.moreAvatars} style={{ zIndex: 0 }}>
                      +{item.splits.length - 3}
                    </div>
                  )}
                </div>
              </div>
              
              <div className={styles.divider} />
              
              <div className={styles.cardBottom}>
                <div className={styles.amountWrap}>
                  <span className={styles.totalLabel}>Total</span>
                  <span className={styles.amountBold}>
                    {fmt(item.amount, item.currency || 'INR')}
                  </span>
                  {isNonINR && amountConverted && (
                    <span className={styles.convertedAmount}>
                      ≈ {fmt(amountConverted, user?.homeCurrency || 'INR')}
                    </span>
                  )}
                </div>
                
                <Badge variant={statusVariant} icon={<StatusIcon size={12} />}>
                  {statusText}
                </Badge>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
