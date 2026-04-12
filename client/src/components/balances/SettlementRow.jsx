import Avatar from '../common/Avatar';
import Button from '../common/Button';
import { fmt } from '../../utils/currencyUtils';

const SettlementRow = ({ from, to, amount, currency, onMarkPaid }) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      padding: 'var(--space-3) var(--space-4)',
      borderRadius: 'var(--radius-lg)',
      transition: 'background 150ms',
    }}>
      <Avatar name={from.name} size={32} />
      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>{from.name}</span>
      <span style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>owes</span>
      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>{to.name}</span>
      <Avatar name={to.name} size={32} />
      <span style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        color: 'var(--primary-400)',
        marginLeft: 'auto',
      }}>
        {fmt(amount, currency)}
      </span>
      <Button variant="accent" size="sm" onClick={() => onMarkPaid(from, to, amount)}>
        Mark Paid
      </Button>
    </div>
  );
};

export default SettlementRow;
