import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { getSpendingPersonality, getCategoryBreakdown } from '../utils/personalityEngine';
import SpendingPersonality from '../components/analytics/SpendingPersonality';
import CategoryBreakdown from '../components/analytics/CategoryBreakdown';
import TimelineView from '../components/analytics/TimelineView';

const Analytics = () => {
  const { id } = useParams(); // groupId
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [personality, setPersonality] = useState(null);
  const [breakdown, setBreakdown] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch group info and expenses in parallel
        const [groupRes, expensesRes] = await Promise.all([
          api.get(`/groups/${id}`),
          api.get(`/expenses?groupId=${id}`)
        ]);

        const groupData = groupRes.data;
        const expenseList = expensesRes.data || [];
        
        setGroup(groupData);
        setExpenses(expenseList);

        // Extract splits for the current user
        let userSplits = [];
        expenseList.forEach(exp => {
          if (exp.splits) {
            const mySplit = exp.splits.find(s => s.userId === user.id);
            if (mySplit) {
              userSplits.push({
                amount: mySplit.amount,
                vibeTag: exp.vibeTag || 'other'
              });
            }
          }
        });

        // Calculate personality and chart data
        const pResult = getSpendingPersonality(userSplits);
        const bResult = getCategoryBreakdown(userSplits);
        
        setPersonality(pResult);
        setBreakdown(bResult);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    if (id && user) {
      fetchData();
    }
  }, [id, user]);

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center' }}>Crunching the numbers...</div>;
  }

  if (!group) {
    return <div style={{ padding: 40, textAlign: 'center' }}>Group not found</div>;
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <header style={{ display: 'flex', alignItems: 'center', marginBottom: '24px', gap: '12px' }}>
        <button 
          onClick={() => navigate(-1)} 
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '50%' }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <h2 style={{ margin: 0, color: '#1e293b' }}>Analytics: {group.name}</h2>
      </header>

      {personality && personality.totalSpent > 0 ? (
        <>
          <SpendingPersonality 
            personality={personality} 
            totalSpent={personality.totalSpent} 
            currencyCode={group.baseCurrency} 
          />
          <CategoryBreakdown 
            breakdown={breakdown} 
          />
          <TimelineView 
            expenses={expenses} 
            currencyCode={group.baseCurrency} 
          />
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 20px', background: '#f8fafc', borderRadius: '16px', border: '2px dashed #cbd5e1' }}>
          <h3 style={{ color: '#64748b' }}>No data yet!</h3>
          <p style={{ color: '#94a3b8' }}>Add some expenses to discover your spending personality.</p>
        </div>
      )}
    </div>
  );
};

export default Analytics;
