import { fmt } from '../../utils/currencyUtils';
import './GroupStats.css';

const GroupStats = ({ totalSpent = 0, pendingSettlements = 0, baseCurrency = 'INR' }) => {

  return (
    <div className="group-stats">
      <div className="group-stat-card">
        <span className="group-stat-icon">💰</span>
        <div className="group-stat-info">
          <span className="group-stat-value gradient-text">{fmt(totalSpent, baseCurrency)}</span>
          <span className="group-stat-label">Total Spent</span>
        </div>
      </div>

      <div className="group-stat-card">
        <span className="group-stat-icon">⏳</span>
        <div className="group-stat-info">
          <span className="group-stat-value" style={{ color: pendingSettlements > 0 ? 'var(--warning)' : 'var(--success)' }}>
            {pendingSettlements}
          </span>
          <span className="group-stat-label">Pending</span>
        </div>
      </div>
    </div>
  );
};

export default GroupStats;
