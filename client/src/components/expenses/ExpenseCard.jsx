import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import { fmt, convert } from '../../utils/currencyUtils';
import { timeAgo } from '../../utils/dateUtils';
import { getVibeTag } from '../../constants/vibeTags';
import { useCurrency } from '../../context/CurrencyContext';
import './ExpenseCard.css';

const ExpenseCard = ({ expense, members, onClick, onDelete }) => {
  const { description, amount, currency, vibeTag, payerId, splitType, createdAt, isRecurring, amountInBase } = expense;
  const payer = members?.find((m) => m.id === payerId);
  const tag = getVibeTag(vibeTag);
  const { rates } = useCurrency();

  // Convert to INR for display — use stored amountInBase if available and correctly converted,
  // otherwise use live rates from context as fallback. Only show if rates are loaded.
  const isNonINR = currency && currency !== 'INR';
  const ratesAvailable = Object.keys(rates || {}).length > 0;
  
  const amountINR = (isNonINR && ratesAvailable)
    ? (amountInBase && amountInBase !== amount 
        ? amountInBase
        : convert(amount, currency, 'INR', rates))
    : null;

  return (
    <div className="expense-card" onClick={onClick} id={`expense-${expense.id}`}>
      <div className="expense-card-left">
        {tag && (
          <div
            className="expense-card-tag"
            style={{ background: `${tag.color}20`, color: tag.color }}
          >
            {tag.emoji}
          </div>
        )}
        <div className="expense-card-info">
          <h4 className="expense-card-desc">{description}</h4>
          <span className="expense-card-meta">
            Paid by {payer?.name || 'Unknown'} • {new Date(createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        </div>
      </div>
      <div className="expense-card-right">
        <div style={{ textAlign: 'right' }}>
          {/* Primary: always show in original bill currency */}
          <span className="expense-card-amount">{fmt(amount, currency)}</span>
          {/* Secondary: show INR equivalent if expense is in a foreign currency */}
          {isNonINR && amountINR && (
            <div style={{ 
              fontSize: '11px', 
              color: 'var(--text-muted, #94a3b8)',
              marginTop: '2px',
              fontWeight: 500
            }}>
              ≈ {fmt(amountINR, 'INR')}
            </div>
          )}
        </div>
        <div className="expense-card-badges">
          <Badge variant="primary">{splitType}</Badge>
          {isRecurring && <Badge variant="warning">🔄 Recurring</Badge>}
        </div>
        {onDelete && (
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(expense); }}
            style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px', marginLeft: '8px' }}
            title="Delete Expense"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"></path></svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default ExpenseCard;
