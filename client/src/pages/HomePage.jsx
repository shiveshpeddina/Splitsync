import React, { useState } from 'react';
import splitSyncLogo from '../assets/splitsync-icon.png';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import { useGroups } from '../context/GroupContext';
import { useAuth } from '../context/AuthContext';
import { useFriends } from '../context/FriendContext';
import { useCurrency } from '../context/CurrencyContext';
import { convert } from '../utils/currencyUtils';

import HeroBalance from '../components/home/HeroBalance';
import GroupsRow from '../components/home/GroupsRow';
import FriendsList from '../components/home/FriendsList';
import SplitHistoryList from '../components/home/SplitHistoryList';
import BottomNav from '../components/layout/BottomNav';
import Modal from '../components/ui/Modal';

// Modals
import AddExpenseModal from '../components/modals/AddExpenseModal';
import AddFriendModal from '../components/modals/AddFriendModal';
import CreateGroupModal from '../components/modals/CreateGroupModal';
import FriendProfileModal from '../components/groups/FriendProfileModal'; // keeping this old one for now

import styles from './HomePage.module.css';

export default function HomePage() {
  const navigate = useNavigate();
  const { groups, loading: groupsLoading, fetchGroups } = useGroups();
  const { user } = useAuth();
  const { friends } = useFriends();
  const { rates } = useCurrency();
  
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [initialSplitType, setInitialSplitType] = useState('equal');
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [selectedFriendProfile, setSelectedFriendProfile] = useState(null);

  const history = (groups || [])
    .flatMap(g => g.expenses || [])
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 10);

  const calculateTotalOwed = () => {
    let owed = 0;
    if (!user) return owed;
    const userCurrency = user?.homeCurrency || 'INR';

    groups?.forEach(g => {
       g.expenses?.forEach(exp => {
          if (exp.payerId === user.id) {
             exp.splits?.forEach(s => {
               if (s.userId !== user.id && !s.settled) {
                 const expCurrency = exp.currency || g.baseCurrency || 'INR';
                 const ratesAvailable = Object.keys(rates || {}).length > 0;
                 if (ratesAvailable && expCurrency !== userCurrency) {
                   owed += convert(s.amount, expCurrency, userCurrency, rates);
                 } else {
                   owed += s.amount;
                 }
               }
             });
          }
       });
    });
    return owed;
  };

  return (
    <div className={styles.pageContainer}>
      {/* Top Header Bar */}
      <header className={styles.header}>
        <div className={styles.logoWrap}>
          <img src={splitSyncLogo} alt="SplitSync" className={styles.logoIcon} />
          <h1 className={styles.logoText}>SplitSync</h1>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.currencyPill}>
            {user?.homeCurrency || 'INR'}
          </div>
          <button 
            className={styles.addGroupBtn} 
            onClick={() => setShowCreateGroup(true)}
          >
            + Group
          </button>
          <div 
            className={styles.avatarWrap}
            onClick={() => navigate('/profile')}
          >
            <img 
              src={user?.img || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`} 
              alt="Profile" 
            />
          </div>
        </div>
      </header>

      <div className={styles.content}>
        <HeroBalance 
          amountOwed={calculateTotalOwed()} 
          currency={user?.homeCurrency || 'INR'} 
          onAdd={() => { setInitialSplitType('equal'); setShowAddExpense(true); }}
          onScan={() => { setInitialSplitType('itemized'); setShowAddExpense(true); }}
        />
        
        <GroupsRow 
          groups={groups} 
          onCreateGroup={() => setShowCreateGroup(true)} 
        />
        
        <FriendsList 
          friends={friends} 
          onAddFriend={() => setShowAddFriend(true)}
          onFriendClick={(friend) => setSelectedFriendProfile(friend)}
        />
        
        <SplitHistoryList 
          history={history} 
          groups={groups} 
          user={user} 
          rates={rates} 
        />
      </div>

      <BottomNav />

      {/* Modals */}
      <AddExpenseModal
        isOpen={showAddExpense}
        onClose={(success) => {
          setShowAddExpense(false);
          if (success) fetchGroups();
        }}
        initialGroupId={groups?.[0]?.id || ''}
        initialSplitType={initialSplitType}
        onCreateGroup={() => {
          setShowAddExpense(false);
          setShowCreateGroup(true);
        }}
      />

      <AddFriendModal 
        isOpen={showAddFriend} 
        onClose={(success) => {
          setShowAddFriend(false);
          if (success) {
            // Friend added
          }
        }} 
      />

      <CreateGroupModal 
        isOpen={showCreateGroup} 
        onClose={(success) => {
          setShowCreateGroup(false);
          if (success) fetchGroups();
        }} 
      />

      {/* FriendProfileModal is an older component but keeping it inside the old Modal layout for now */}
      <Modal isOpen={!!selectedFriendProfile} onClose={() => setSelectedFriendProfile(null)} title="Friend Settings">
        <FriendProfileModal friend={selectedFriendProfile} onClose={() => setSelectedFriendProfile(null)} />
      </Modal>
    </div>
  );
}
