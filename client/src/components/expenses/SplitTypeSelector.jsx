import './SplitTypeSelector.css';

const SPLIT_TYPES = [
  { id: 'equal', label: 'Equal', emoji: '⚖️', desc: 'Split evenly' },
  { id: 'percentage', label: 'Percent', emoji: '📊', desc: 'Custom %' },
  { id: 'exact', label: 'Exact', emoji: '✏️', desc: 'Fixed amounts' },
  { id: 'itemized', label: 'Itemized', emoji: '🧾', desc: 'Per item' },
];

const SplitTypeSelector = ({ selected, onSelect }) => {
  return (
    <div className="split-type-selector">
      {SPLIT_TYPES.map((type) => (
        <button
          type="button"
          key={type.id}
          className={`split-type-btn ${selected === type.id ? 'split-type-active' : ''}`}
          onClick={() => onSelect(type.id)}
        >
          <span className="split-type-emoji">{type.emoji}</span>
          <span className="split-type-label">{type.label}</span>
        </button>
      ))}
    </div>
  );
};

export default SplitTypeSelector;
