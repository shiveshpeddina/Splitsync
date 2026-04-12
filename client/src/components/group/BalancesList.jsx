import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import Avatar from '../ui/Avatar';
import { AvatarDisplay } from '../common/AvatarPicker';
import { fmt, convert } from '../../utils/currencyUtils';
import NudgeButton from '../nudge/NudgeButton';
import styles from './BalancesList.module.css';

export default function BalancesList({ 
  settlements, 
  members, 
  currency, 
  rates, 
  onSettle,
  groupId,
  currentUserId
}) {
  const [animatedWidths, setAnimatedWidths] = useState({});

  useEffect(() => {
    // Trigger the animation shortly after mount
    const timer = setTimeout(() => {
      const widths = {};
      settlements.forEach((s, idx) => {
        widths[idx] = '100%';
      });
      setAnimatedWidths(widths);
    }, 100);
    return () => clearTimeout(timer);
  }, [settlements]);

  if (settlements.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>🎉</div>
        <p>All settled up! No pending balances.</p>
      </div>
    );
  }

  return (
    <div className={styles.list}>
      {settlements.map((settlement, idx) => {
        const fromMember = members.find(m => m.id === settlement.from);
        const toMember = members.find(m => m.id === settlement.to);
        const fromName = fromMember ? fromMember.name.split(' ')[0] : 'Unknown';
        const toName = toMember ? toMember.name.split(' ')[0] : 'Unknown';
        
        let displayAmount = settlement.amount;
        let convertedSubtext = null;
        let settlementCurrency = currency;
        
        // Handling multi-currency display if the user has custom currency
        if (fromMember?.customCurrency && fromMember.customCurrency !== currency && Object.keys(rates || {}).length > 0) {
           const convertedAmt = convert(settlement.amount, currency, fromMember.customCurrency, rates);
           displayAmount = convertedAmt;
           settlementCurrency = fromMember.customCurrency;
           convertedSubtext = `≈ ${fmt(settlement.amount, currency)}`;
        }

        return (
          <div key={idx} className={styles.settlementRow}>
            <div className={styles.transactionVisual}>
              <div className={styles.party}>
                {fromMember?.avatar ? (
                  <AvatarDisplay avatarId={fromMember.avatar} name={fromName} size={40} />
                ) : (
                  <Avatar name={fromName} />
                )}
                <span className={styles.name}>{fromName}</span>
              </div>
              
              <div className={styles.lineArea}>
                <div className={styles.amountBold}>
                  {fmt(displayAmount, settlementCurrency)}
                </div>
                <div className={styles.track}>
                  <motion.div 
                    className={styles.line} 
                    initial={{ width: '0%' }}
                    animate={{ width: animatedWidths[idx] || '0%' }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                  <div className={styles.arrowHead} />
                </div>
                {convertedSubtext && (
                  <div className={styles.convertedText}>{convertedSubtext}</div>
                )}
              </div>

              <div className={styles.party}>
                {toMember?.avatar ? (
                  <AvatarDisplay avatarId={toMember.avatar} name={toName} size={40} />
                ) : (
                  <Avatar name={toName} />
                )}
                <span className={styles.name}>{toName}</span>
              </div>
            </div>

            <div className={styles.actionRow}>
              {currentUserId === toMember?.id && (
                <NudgeButton 
                  targetUser={fromMember}
                  amount={fmt(displayAmount, settlementCurrency)}
                  groupId={groupId}
                  className={styles.actionBtn}
                />
              )}
              <Button 
                variant="dark" 
                size="small" 
                className={styles.actionBtn}
                onClick={() => onSettle(settlement.from, settlement.to, displayAmount, settlementCurrency)}
              >
                ✓ Settle
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
