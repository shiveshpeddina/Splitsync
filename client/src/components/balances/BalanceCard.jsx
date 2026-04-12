import Avatar from '../common/Avatar';
import Button from '../common/Button';
import RemindButton from './RemindButton';
import NudgeButton from '../nudge/NudgeButton';
import { fmt, convert } from '../../utils/currencyUtils';
import { useCurrency } from '../../context/CurrencyContext';
import './BalanceCard.css';

const BalanceCard = ({ from, to, amount, currency, onSettle, onNudge, groupId, currentUserId }) => {
  // Pull rates directly from context — same pattern as ExpenseCard — so we always have them.
  const { rates } = useCurrency();

  // `amount` from debtSimplifier is now ALREADY in the group's chosen display currency (e.g. EUR, USD, INR).
  // Detect if the counterparty is a direct friend of the current user with a custom currency
  const counterparty = from.id === currentUserId ? to : (to.id === currentUserId ? from : null);
  const targetCurrency = (counterparty && counterparty.customCurrency) ? counterparty.customCurrency : currency;

  const ratesAvailable = Object.keys(rates || {}).length > 0;
  const isNonINR = targetCurrency && targetCurrency !== 'INR';

  // Primary: convert strictly from the internal `currency` bounds (User's Base) to the target targetCurrency
  const displayAmount = (targetCurrency !== currency && ratesAvailable)
    ? convert(amount, currency, targetCurrency, rates)
    : amount;

  // Secondary: show INR equivalent only when target currency is non-INR
  const baseINRAmount = convert(amount, currency, 'INR', rates);
  const showINREquivalent = isNonINR && ratesAvailable;

  // Identify the user's role in this specific debt
  const isCreditor = currentUserId === to.id;
  const isDebtor = currentUserId === from.id;
  const isRelated = isCreditor || isDebtor;

  return (
    <div className="balance-card glass-card">
      <div className="balance-card-people">
        <div className="balance-card-person">
          <Avatar name={from.name} size={40} />
          <span className="balance-card-name">{from.name}</span>
        </div>
        <div className="balance-card-arrow">
          <span className="arrow-line" />
          <div className="arrow-amount-container">
            {/* Primary: always show in the counterparty's custom currency or baseline currency */}
            <span className="arrow-amount">{fmt(displayAmount, targetCurrency)}</span>
            {/* Secondary: show INR equivalent only when target currency is non-INR */}
            {showINREquivalent && (
              <span className="arrow-amount-secondary">≈ {fmt(baseINRAmount, 'INR')}</span>
            )}
          </div>
          <span className="arrow-head">→</span>
        </div>
        <div className="balance-card-person">
          <Avatar name={to.name} size={40} />
          <span className="balance-card-name">{to.name}</span>
        </div>
      </div>
      <div className="balance-card-actions">
        {isCreditor && (
          <>
            <NudgeButton targetUser={from} amount={fmt(displayAmount, targetCurrency)} groupId={groupId} />
            <RemindButton creditorName={to.name} amount={displayAmount} currency={targetCurrency} groupName="Group" targetPhone={from.phone} />
          </>
        )}
        <Button variant="accent" size="sm" onClick={() => onSettle?.(from.id, to.id, amount, currency)}>
          ✓ Settle
        </Button>
      </div>
    </div>
  );
};

export default BalanceCard;
