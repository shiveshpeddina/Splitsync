import React from 'react';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import Badge from '../ui/Badge';
import { fmt } from '../../utils/currencyUtils';
import styles from './ExpensesList.module.css';

export default function ExpensesList({ expenses, members, onDeleteExpense }) {
  if (expenses.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>📝</div>
        <p>No expenses yet. Add one to get started!</p>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className={styles.list}
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {expenses.map((expense) => {
        const payer = members.find(m => m.id === expense.payerId);
        const payerName = payer ? (payer.name.split(' ')[0]) : 'Unknown';
        const date = new Date(expense.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
        
        // Pick an emoji based on category or default
        const emoji = expense.vibeTag === 'settlement' ? '💸' : '🛒';

        return (
          <motion.div key={expense.id} variants={itemVariants} className={styles.row}>
            <div className={styles.left}>
              <div className={styles.iconCircle}>{emoji}</div>
              <div className={styles.info}>
                <div className={styles.title}>{expense.description}</div>
                <div className={styles.subtitle}>Paid by {payerName} • {date}</div>
              </div>
            </div>
            
            <div className={styles.right}>
              <div className={styles.amountWrap}>
                <div className={styles.amount}>
                  {fmt(expense.amount, expense.currency || 'INR')}
                </div>
                <Badge variant="default" size="small">
                  {expense.splitType || 'equal'}
                </Badge>
              </div>
              <button 
                className={styles.deleteBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteExpense(expense);
                }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
