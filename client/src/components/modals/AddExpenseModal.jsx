import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScanText, X, Plus } from 'lucide-react';

import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useGroups } from '../../context/GroupContext';
import { useFriends } from '../../context/FriendContext';

import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import CurrencySelector from '../currency/CurrencySelector';
import Avatar from '../ui/Avatar';
import { fmt, convert } from '../../utils/currencyUtils';
import ItemizedSplit from '../expenses/ItemizedSplit';

import styles from './AddExpenseModal.module.css';

const CATEGORIES = [
  { id: 'food', emoji: '🍕', label: 'Food' },
  { id: 'drinks', emoji: '🍺', label: 'Drinks' },
  { id: 'travel', emoji: '🚗', label: 'Travel' },
  { id: 'fun', emoji: '🎉', label: 'Fun' },
  { id: 'stay', emoji: '🏨', label: 'Stay' },
  { id: 'shopping', emoji: '🛍', label: 'Shopping' },
];

export default function AddExpenseModal({ isOpen, onClose, initialGroupId, initialSplitType = 'equal', onCreateGroup }) {
  const { user } = useAuth();
  const { rates } = useCurrency();
  const { groups } = useGroups();
  const { friends } = useFriends();

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState(user?.homeCurrency || 'INR');
  const [splitType, setSplitType] = useState(initialSplitType);
  const [activeCategory, setActiveCategory] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [splitValues, setSplitValues] = useState({});
  const [payerId, setPayerId] = useState(user?.id);
  const [selectedGroupId, setSelectedGroupId] = useState(initialGroupId || '');

  useEffect(() => {
    if (isOpen) {
      setDescription('');
      setAmount('');
      setCurrency(user?.homeCurrency || 'INR');
      setSplitType(initialSplitType);
      setActiveCategory(null);
      setSplitValues({});
      setPayerId(user?.id);
      setSelectedGroupId(initialGroupId || groups?.[0]?.id || '');
    }
  }, [isOpen, initialSplitType, initialGroupId]);

  const group = groups?.find(g => g.id === selectedGroupId);
  const members = useMemo(() => {
    return group ? group.members.map(gm => {
      const friendMatch = friends?.find(f => f.id === gm.user.id);
      return {
        id: gm.user.id,
        name: friendMatch?.alias || gm.user.name,
        ...friendMatch
      };
    }) : [];
  }, [group, friends]);

  useEffect(() => {
    // Generate split preview values
    if (!members || members.length === 0) return;
    const numAmt = parseFloat(amount) || 0;

    let mockVals = {};
    if (splitType === 'equal') {
      const share = numAmt / members.length;
      members.forEach(m => mockVals[m.id] = share);
    } else if (splitType === 'exact' && Object.keys(splitValues).length === 0) {
      const share = numAmt / members.length;
      members.forEach(m => mockVals[m.id] = share);
    } else if (splitType === 'percentage' && Object.keys(splitValues).length === 0) {
       const pct = Math.floor(100 / members.length);
       members.forEach(m => mockVals[m.id] = pct);
       if (members.length > 0) mockVals[members[0].id] += (100 - (pct * members.length));
    } else {
      mockVals = splitValues; // Preserve existing if modified
    }
    setSplitValues(mockVals);
  }, [amount, splitType, members]); // Only run on amount/split type change

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return alert('Enter a valid amount');
    if (!description.trim()) return alert('Enter a description');

    const numAmt = parseFloat(amount);
    let splitsArray = [];

    members.forEach((m) => {
       let share = 0;
       if (splitType === 'equal') share = numAmt / members.length;
       else if (splitType === 'percentage') share = numAmt * ((splitValues[m.id] || 0) / 100);
       else share = splitValues[m.id] || 0;
       
       splitsArray.push({ userId: m.id, amount: share });
    });

    try {
      setSubmitting(true);
      await api.post('/expenses', {
        groupId: selectedGroupId,
        description,
        amount: numAmt,
        currency,
        payerId: payerId || user?.id,
        splitType,
        splits: splitsArray
      });
      onClose(true); // pass true indicating success
    } catch (err) {
      console.error(err);
      alert('Failed to add expense');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateSplit = (memberId, value) => {
    setSplitValues(prev => ({...prev, [memberId]: parseFloat(value) || 0}));
  };

  return (
    <Modal isOpen={isOpen} onClose={() => onClose(false)} title="Add Expense">
      <form onSubmit={handleSubmit} className={styles.form}>
        
        {/* Group Selector */}
        <div className={styles.field} style={{ marginBottom: '16px' }}>
          <label className={styles.label}>WHICH GROUP?</label>
          <select
            value={selectedGroupId}
            onChange={(e) => {
              if (e.target.value === 'new_group') {
                if (onCreateGroup) onCreateGroup();
              } else {
                setSelectedGroupId(e.target.value);
              }
            }}
            style={{
              width: '100%',
              padding: '0 12px',
              height: '48px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface)',
              color: 'var(--color-text)',
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              outline: 'none'
            }}
            required
          >
            <option value="" disabled>Select a group</option>
            {groups?.map((g) => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
            <option value="new_group">+ Create New Group</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          {/* Description */}
          <div className={styles.field} style={{ flex: 2 }}>
            <label className={styles.label}>WHAT WAS IT FOR?</label>
            <Input 
              placeholder="e.g., Dinner at Taj" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* Payer */}
          <div className={styles.field} style={{ flex: 1 }}>
            <label className={styles.label}>WHO PAID?</label>
            <select
              value={payerId}
              onChange={(e) => setPayerId(e.target.value)}
              style={{
                width: '100%',
                padding: '0 12px',
                height: '48px', // matches typical input height 
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border)',
                background: 'var(--color-surface)',
                color: 'var(--color-text)',
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                outline: 'none'
              }}
              required
            >
              {members.map(m => (
                <option key={m.id} value={m.id}>
                  {m.id === user?.id ? 'You' : m.name.split(' ')[0]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Amount & Currency */}
        <div className={styles.amountRow}>
          <div className={styles.amountInputWrap}>
            <span className={styles.currencyIcon}>💰</span>
            <input 
              type="number"
              className={styles.amountInput}
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div className={styles.currencyPillWrap}>
            <CurrencySelector value={currency} onChange={setCurrency} />
          </div>
        </div>

        {/* Categories */}
        <div className={styles.categoriesRow}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              type="button"
              className={`${styles.categoryChip} ${activeCategory === cat.id ? styles.activeCategory : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              <span className={styles.catEmoji}>{cat.emoji}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Split Type */}
        <div className={styles.splitTypeTabs}>
          {['equal', 'percentage', 'exact', 'itemized'].map(type => (
            <button
              key={type}
              type="button"
              className={`${styles.splitTab} ${splitType === type ? styles.activeTab : ''}`}
              onClick={() => setSplitType(type)}
            >
              {type === 'equal' && '⚖️ Equal'}
              {type === 'percentage' && '📊 Percent'}
              {type === 'exact' && '✏️ Exact'}
              {type === 'itemized' && '🧾 Itemized'}
            </button>
          ))}
        </div>

        {/* Itemized specific block */}
        <AnimatePresence>
          {splitType === 'itemized' && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className={styles.itemizedBlock}
            >
              <ItemizedSplit 
                members={members}
                splitValues={splitValues}
                onChange={setSplitValues}
                totalAmount={amount}
                currencyCode={currency}
                rates={rates}
                onReceiptData={(data) => {
                  if (data.description) setDescription(data.description);
                  if (data.total) setAmount(data.total.toString());
                  if (data.currency && data.currency.length === 3) setCurrency(data.currency.toUpperCase());
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Member Preview (for non-itemized) */}
        {splitType !== 'itemized' && members.length > 0 && (
          <div className={styles.previewTable}>
            <div className={styles.tableHeader}>
              <span>MEMBER</span>
              <span>EST. SHARE</span>
            </div>
            {members.map(m => {
               const val = splitValues[m.id] || 0;
               let baseVal = val;
               let pctStr = '';

               if (splitType === 'equal') {
                 baseVal = (parseFloat(amount) || 0) / members.length;
               } else if (splitType === 'percentage') {
                 baseVal = (parseFloat(amount) || 0) * (val / 100);
                 pctStr = `${val}%`;
               }

               const targetCurrency = m.customCurrency || m.homeCurrency || 'INR';
               let displayVal = baseVal;
               if (targetCurrency !== currency && Object.keys(rates || {}).length > 0) {
                 displayVal = convert(baseVal, currency, targetCurrency, rates);
               }

               return (
                 <div key={m.id} className={styles.tableRow}>
                   <div className={styles.memberInfo}>
                     <Avatar name={m.name} size="small" />
                     <div style={{ display: 'flex', flexDirection: 'column' }}>
                       <span>{m.name.split(' ')[0]}</span>
                       <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', fontWeight: 'bold' }}>{targetCurrency}</span>
                     </div>
                   </div>
                   <div className={styles.shareInfo}>
                     {splitType !== 'equal' ? (
                       <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                         <input 
                           type="number"
                           className={styles.shareInput}
                           value={val}
                           onChange={(e) => handleUpdateSplit(m.id, e.target.value)}
                           placeholder="0"
                         />
                         {splitType === 'exact' && targetCurrency !== currency && (
                           <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                             (≈ {fmt(convert(val, currency, targetCurrency, rates), targetCurrency)})
                           </span>
                         )}
                       </div>
                     ) : (
                       <span className={styles.amountBold}>{fmt(displayVal, targetCurrency)}</span>
                     )}
                     {splitType === 'percentage' && <span className={styles.pctBadge}>%</span>}
                   </div>
                 </div>
               );
            })}
          </div>
        )}

        <Button 
          type="submit" 
          variant="primary" 
          size="large" 
          fullWidth
          disabled={submitting}
          className={styles.submitBtn}
        >
          {submitting ? 'Adding...' : 'Add Expense'}
        </Button>
      </form>
    </Modal>
  );
}
