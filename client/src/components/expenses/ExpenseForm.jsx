import { useState, useCallback } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import SplitTypeSelector from './SplitTypeSelector';
import VibeTagPicker from './VibeTagPicker';
import LiveConversionPanel from './LiveConversionPanel';
import CurrencySelector from '../currency/CurrencySelector';
import PercentageSplit from './PercentageSplit';
import ExactSplit from './ExactSplit';
import ItemizedSplit from './ItemizedSplit';
import { useCurrency } from '../../context/CurrencyContext';
import './ExpenseForm.css';

const ExpenseForm = ({ members, onSubmit, onCancel, initialData = {} }) => {
  const [description, setDescription] = useState(initialData.description || '');
  const [amount, setAmount] = useState(initialData.amount || '');
  const [currency, setCurrency] = useState(initialData.currency || 'INR');
  const [payerId, setPayerId] = useState(initialData.payerId || '');
  const [splitType, setSplitType] = useState(initialData.splitType || 'equal');
  const [vibeTag, setVibeTag] = useState(initialData.vibeTag || '');
  const [isRecurring, setIsRecurring] = useState(initialData.isRecurring || false);
  const [recurringDay, setRecurringDay] = useState(initialData.recurringDay || 1);
  const [splitValues, setSplitValues] = useState({}); // Optional: added for LiveConversionPanel
  const [receiptScanned, setReceiptScanned] = useState(false);

  const { rates, loading: ratesLoading } = useCurrency();

  // Handle receipt scan data — auto-fill description, amount, and currency
  const handleReceiptData = useCallback(({ description: desc, total, currency: scanCurrency }) => {
    if (desc && !description) {
      setDescription(desc);
    }
    if (total && (!amount || parseFloat(amount) === 0)) {
      setAmount(String(total));
    }
    if (scanCurrency && rates) {
      // Check if the scanned currency is supported by our app (e.g., in rates mapping)
      // Otherwise fallback to whatever was there
      if (rates[scanCurrency] || scanCurrency === 'USD') {
        setCurrency(scanCurrency);
      }
    }
    setReceiptScanned(true);
  }, [description, amount, rates]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description.trim() || !amount || !payerId) return;

    const numAmount = parseFloat(amount);
    let splitsArray = [];

    members.forEach((rm) => {
      let rawShare = 0;
      if (splitType === 'equal') {
        rawShare = numAmount / members.length;
      } else if (splitType === 'percentage') {
         const pct = splitValues[rm.id] || 0;
         rawShare = numAmount * (pct / 100);
      } else if (splitType === 'exact' || splitType === 'itemized') {
         rawShare = splitValues[rm.id] || 0;
      }
      splitsArray.push({
         userId: rm.id,
         amount: rawShare
      });
    });

    onSubmit({
      description: description.trim(),
      amount: numAmount,
      currency,
      payerId,
      splitType,
      splits: splitsArray,
      vibeTag: vibeTag || null,
      isRecurring,
      recurringDay: isRecurring ? recurringDay : null,
    });
  };

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <Input
        id="expense-desc"
        label="What was it for?"
        placeholder="e.g., Dinner at Taj"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      {receiptScanned && description && (
        <div style={{ 
          display: 'flex', alignItems: 'center', gap: 6,
          marginTop: -8, marginBottom: 12, padding: '6px 10px',
          background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8,
          fontSize: 12, color: '#16a34a'
        }}>
          ✨ Auto-filled from receipt scan
        </div>
      )}

      <div className="expense-form-row">
        <Input
          id="expense-amount"
          label="Amount"
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          icon="💰"
          required
        />
          <div className="input-group" style={{ maxWidth: 140 }}>
            <label className="input-label">Currency</label>
            <CurrencySelector value={currency} onChange={setCurrency} />
          </div>
        </div>

        {amount && (
          <LiveConversionPanel 
            amount={amount} 
            fromCurrency={currency} 
            members={members || []} 
            splitType={splitType} 
            splitValues={splitValues} 
            rates={rates} 
            loading={ratesLoading} 
          />
        )}

      <div className="input-group">
        <label className="input-label">Who paid?</label>
        <select
          className="input-field"
          value={payerId}
          onChange={(e) => setPayerId(e.target.value)}
          required
        >
          <option value="">Select payer</option>
          {members?.map((m) => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
      </div>

      <div className="input-group">
        <label className="input-label">Split Type</label>
        <SplitTypeSelector selected={splitType} onSelect={setSplitType} />
      </div>

      <div style={{ marginBottom: 20 }}>
        {splitType === 'percentage' && (
          <PercentageSplit 
            members={members} 
            splitValues={splitValues} 
            onChange={setSplitValues} 
          />
        )}
        {splitType === 'exact' && (
          <ExactSplit 
            members={members} 
            splitValues={splitValues} 
            onChange={setSplitValues} 
            totalAmount={amount} 
            currencyCode={currency} 
          />
        )}
        {splitType === 'itemized' && (
          <ItemizedSplit 
            members={members} 
            splitValues={splitValues} 
            onChange={setSplitValues} 
            totalAmount={amount} 
            currencyCode={currency}
            onReceiptData={handleReceiptData}
          />
        )}
      </div>

      <div className="input-group">
        <label className="input-label">Category</label>
        <VibeTagPicker selected={vibeTag} onSelect={setVibeTag} />
      </div>

      <div className="expense-form-toggle">
        <label className="toggle-label">
          <input
            type="checkbox"
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)}
          />
          <span className="toggle-switch" />
          <span>Recurring expense</span>
        </label>
        {isRecurring && (
          <Input
            id="recurring-day"
            label="Day of month"
            type="number"
            min={1}
            max={28}
            value={recurringDay}
            onChange={(e) => setRecurringDay(parseInt(e.target.value))}
            style={{ maxWidth: 100 }}
          />
        )}
      </div>

      <div className="expense-form-actions">
        {onCancel && <Button variant="ghost" onClick={onCancel}>Cancel</Button>}
        <Button variant="primary" type="submit">
          {initialData.id ? 'Update Expense' : 'Add Expense'}
        </Button>
      </div>
    </form>
  );
};

export default ExpenseForm;
