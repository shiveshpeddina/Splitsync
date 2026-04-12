import { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import './GroupForm.css';

const EMOJIS = ['🏖️', '🏠', '🍱', '✈️', '🎉', '💼', '🎮', '🏕️', '🎓', '🍕', '🚗', '💒'];

const GroupForm = ({ onSubmit, onCancel, initialData = {} }) => {
  const [name, setName] = useState(initialData.name || '');
  const [emoji, setEmoji] = useState(initialData.emoji || '👥');
  const [baseCurrency, setBaseCurrency] = useState(initialData.baseCurrency || 'INR');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), emoji, baseCurrency });
  };

  return (
    <form className="group-form" onSubmit={handleSubmit}>
      <div className="group-form-emoji-section">
        <label className="input-label">Pick an emoji</label>
        <div className="emoji-grid">
          {EMOJIS.map((e) => (
            <button
              key={e}
              type="button"
              className={`emoji-btn ${emoji === e ? 'emoji-btn-active' : ''}`}
              onClick={() => setEmoji(e)}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      <Input
        id="group-name"
        label="Group Name"
        placeholder="e.g., Goa Trip 2026"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <div className="input-group">
        <label className="input-label" htmlFor="base-currency">Base Currency</label>
        <select
          id="base-currency"
          className="input-field"
          value={baseCurrency}
          onChange={(e) => setBaseCurrency(e.target.value)}
        >
          <option value="INR">🇮🇳 INR — Indian Rupee</option>
          <option value="USD">🇺🇸 USD — US Dollar</option>
          <option value="EUR">🇪🇺 EUR — Euro</option>
          <option value="GBP">🇬🇧 GBP — British Pound</option>
        </select>
      </div>

      <div className="group-form-actions">
        {onCancel && (
          <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        )}
        <Button variant="primary" type="submit">
          {initialData.id ? 'Save Changes' : 'Create Group'}
        </Button>
      </div>
    </form>
  );
};

export default GroupForm;
