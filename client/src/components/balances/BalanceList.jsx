import BalanceCard from './BalanceCard';
import EmptyState from '../common/EmptyState';

const BalanceList = ({ settlements, members, currency, rates, onSettle, onNudge, groupName, groupId, currentUserId }) => {
  if (!settlements || settlements.length === 0) {
    return (
      <EmptyState
        icon="🎉"
        title="All settled up!"
        description="No pending settlements. Everyone is even!"
      />
    );
  }

  const getMember = (id) => members?.find((m) => m.id === id) || { id, name: 'Unknown' };

  return (
    <div className="stagger-children" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      {settlements.map((s, i) => (
        <BalanceCard
          key={i}
          from={getMember(s.from)}
          to={getMember(s.to)}
          amount={s.amount}
          currency={currency}
          rates={rates}
          onSettle={onSettle}
          onNudge={onNudge}
          groupName={groupName}
          groupId={groupId}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  );
};

export default BalanceList;
