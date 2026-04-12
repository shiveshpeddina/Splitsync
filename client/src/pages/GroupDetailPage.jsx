import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import api from '../services/api';
import { useGroups } from '../context/GroupContext';
import { useCurrency } from '../context/CurrencyContext';
import { useFriends } from '../context/FriendContext';
import { useAuth } from '../context/AuthContext';
import { simplifyDebts, calculateNetBalances } from '../utils/debtSimplifier';
import { convert } from '../utils/currencyUtils';

import GroupHeader from '../components/group/GroupHeader';
import GroupStatCards from '../components/group/GroupStatCards';
import GroupTabSwitcher from '../components/group/GroupTabSwitcher';
import ExpensesList from '../components/group/ExpensesList';
import BalancesList from '../components/group/BalancesList';
import MembersList from '../components/group/MembersList';

// Temporarily import existing modals/panels until we refactor them
import AddExpenseModal from '../components/modals/AddExpenseModal';
import Modal from '../components/ui/Modal';
import AddMemberModal from '../components/modals/AddMemberModal';
import SpinWheel from '../components/spin/SpinWheel';
import Button from '../components/ui/Button';

import styles from './GroupDetailPage.module.css';

export default function GroupDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { groups, fetchGroups } = useGroups();
  const { rates, loading: ratesLoading } = useCurrency();
  const { friends } = useFriends();
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState('expenses');
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showSpinWheel, setShowSpinWheel] = useState(false);
  const [expenses, setExpenses] = useState([]);

  const group = groups.find((g) => g.id === id);

  const fetchExpenses = async () => {
    try {
      const res = await api.get(`/expenses?groupId=${id}`);
      setExpenses(res.data || []);
    } catch (err) {
      console.error('Failed to fetch expenses', err);
    }
  };

  useEffect(() => {
    if (group) fetchExpenses();
  }, [id, group]);

  if (!group) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', padding: '24px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
        <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '24px' }}>Group not found</h3>
        <Button variant="primary" onClick={() => navigate('/')}>Go Home</Button>
      </div>
    );
  }

  const handleDeleteGroup = async () => {
    if (!window.confirm('Are you sure you want to completely delete this group? All expenses inside will be erased!')) return;
    try {
      await api.delete(`/groups/${id}`);
      await fetchGroups();
      navigate('/', { replace: true });
    } catch (err) {
      console.error(err);
      alert('Failed to delete group.');
    }
  };

  const flatMembers = group.members.map(gm => {
    const friendMatch = friends?.find(f => f.id === gm.user.id);
    return {
      id: gm.user.id,
      name: friendMatch?.alias || gm.user.name,
      email: gm.user.email,
      phone: gm.user.phone,
      avatar: friendMatch?.avatar || null,
      homeCurrency: gm.user.homeCurrency || 'INR',
      customCurrency: friendMatch?.customCurrency || null,
      role: gm.role
    };
  });

  const ratesAvailable = Object.keys(rates || {}).length > 0;
  const balanceDisplayCurrency = user?.homeCurrency || 'INR';

  const netBalances = calculateNetBalances(expenses, rates || {}, balanceDisplayCurrency);
  const settlements = simplifyDebts(netBalances);

  const totalSpent = ratesAvailable 
    ? expenses
      .filter(e => e.vibeTag !== 'settlement')
      .reduce((sum, e) => {
        const expCurrency = e.currency || 'INR';
        const amountDisplay = expCurrency === balanceDisplayCurrency
          ? e.amount
          : convert(e.amount, expCurrency, balanceDisplayCurrency, rates);
        return sum + (amountDisplay || 0);
      }, 0)
    : 0;
  
  const pendingSettlementsCount = settlements.length;

  const handleAddExpense = async (data) => {
    try {
      await api.post('/expenses', { ...data, groupId: id });
      await fetchExpenses();
      setShowAddExpense(false);
    } catch (err) {
      console.error(err);
      alert("Failed to create expense");
    }
  };

  const handleDeleteExpense = async (expense) => {
    if (!window.confirm(`Are you sure you want to delete "${expense.description}"?`)) return;
    try {
      await api.delete(`/expenses/${expense.id}`);
      await fetchExpenses();
      await fetchGroups();
    } catch (err) {
      console.error(err);
      alert('Failed to delete expense.');
    }
  };

  const handleSettle = async (fromId, toId, amount, currency) => {
    if (!window.confirm(`Settle ${amount} ${currency}? This will record a payment and clear the debt.`)) return;
    try {
      const roundedAmount = Math.round(amount * 100) / 100;
      await api.post('/expenses', {
        groupId: id,
        description: 'Payment',
        amount: roundedAmount,
        currency: currency,
        payerId: fromId,
        splitType: 'exact',
        splits: [{ userId: toId, amount: roundedAmount }],
        vibeTag: 'settlement'
      });
      await fetchExpenses();
      await fetchGroups();
    } catch (err) {
      console.error(err);
      alert('Failed to record settlement.');
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      await api.delete(`/groups/${id}/members/${memberId}`);
      await fetchGroups();
      await fetchExpenses();
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to remove member.');
    }
  };

  const tabVariants = {
    hidden: { opacity: 0, x: -20 },
    enter: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 }
  };

  return (
    <div className={styles.pageContainer}>
      <GroupHeader 
        group={group} 
        onDeleteGroup={handleDeleteGroup}
        onSpin={() => setShowSpinWheel(true)}
        onInsights={() => navigate(`/analytics/${id}`)}
      />

      <div className={styles.content}>
        <GroupStatCards 
          totalSpent={totalSpent}
          pendingSettlements={pendingSettlementsCount}
          baseCurrency={balanceDisplayCurrency}
          loading={ratesLoading}
        />

        <GroupTabSwitcher activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className={styles.tabContentArea}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial="hidden"
              animate="enter"
              exit="exit"
              variants={tabVariants}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'expenses' && (
                <>
                  <div className={styles.tabSectionHeader}>
                    <h3 className={styles.tabSectionTitle}>All Expenses</h3>
                    <Button variant="primary" size="small" onClick={() => setShowAddExpense(true)} className={styles.addBtn}>
                      + Add Expense
                    </Button>
                  </div>
                  <ExpensesList 
                    expenses={expenses} 
                    members={flatMembers} 
                    onDeleteExpense={handleDeleteExpense} 
                  />
                </>
              )}

              {activeTab === 'balances' && (
                <>
                  <div className={styles.tabSectionHeader}>
                    <h3 className={styles.tabSectionTitle}>Simplified Settlements</h3>
                    <span className={styles.tabSectionSubtitle}>{settlements.length} transfers needed</span>
                  </div>
                  <BalancesList 
                    settlements={settlements} 
                    members={flatMembers} 
                    currency={balanceDisplayCurrency}
                    rates={rates}
                    onSettle={handleSettle}
                    groupId={group.id}
                    currentUserId={user?.id}
                  />
                </>
              )}

              {activeTab === 'members' && (
                <>
                  <div className={styles.tabSectionHeader}>
                    <h3 className={styles.tabSectionTitle}>Members ({group.members.length})</h3>
                    <Button variant="outline" size="small" onClick={() => setShowAddMember(true)}>
                      + Add Member
                    </Button>
                  </div>
                  <MembersList 
                    members={flatMembers} 
                    onRemoveMember={handleRemoveMember}
                    currentUserId={user?.id}
                  />
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <AddExpenseModal 
        isOpen={showAddExpense} 
        onClose={(success) => {
          setShowAddExpense(false);
          if (success) {
            fetchExpenses();
            fetchGroups();
          }
        }} 
        initialGroupId={id} 
      />

      <AddMemberModal 
        isOpen={showAddMember} 
        onClose={(success) => {
          setShowAddMember(false);
          if (success) {
            fetchGroups();
          }
        }} 
        groupId={group.id} 
        inviterId="current-user-id" 
        groupName={group.name} 
        currentMembers={flatMembers}
      />

      <Modal isOpen={showSpinWheel} onClose={() => setShowSpinWheel(false)} title="Spin to Pay!">
        <SpinWheel members={flatMembers} onCancel={() => setShowSpinWheel(false)} />
      </Modal>
    </div>
  );
}
