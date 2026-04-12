import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import { fmt } from '../../utils/currencyUtils';
import { timeAgo } from '../../utils/dateUtils';
import './GroupCard.css';

const GroupCard = ({ group, onClick }) => {
  const { name, emoji, baseCurrency, members, totalSpent, pendingSettlements, createdAt } = group;

  return (
    <div className="group-card glass-card" onClick={onClick} id={`group-card-${group.id}`}>
      <div className="group-card-header">
        <div className="group-card-emoji">{emoji || '👥'}</div>
        <div className="group-card-info">
          <h3 className="group-card-name">{name}</h3>
          <span className="group-card-meta">
            {members.length} members • {timeAgo(createdAt)}
          </span>
        </div>
        {pendingSettlements > 0 && (
          <Badge variant="warning">{pendingSettlements} pending</Badge>
        )}
      </div>

      <div className="group-card-stats">
        <div className="group-card-stat">
          <span className="stat-label">Total Spent</span>
          <span className="stat-value gradient-text">{fmt(totalSpent, baseCurrency)}</span>
        </div>
      </div>

      <div className="group-card-members">
        {members.slice(0, 5).map((member, i) => (
          <Avatar
            key={member.id}
            name={member.name}
            size={32}
            className="group-card-avatar"
          />
        ))}
        {members.length > 5 && (
          <div className="group-card-more">+{members.length - 5}</div>
        )}
      </div>
    </div>
  );
};

export default GroupCard;
