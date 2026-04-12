import vibeTags from '../../constants/vibeTags';
import './VibeTagPicker.css';

const VibeTagPicker = ({ selected, onSelect }) => {
  return (
    <div className="vibe-tag-picker">
      {vibeTags.map((tag) => (
        <button
          type="button"
          key={tag.id}
          className={`vibe-tag-btn ${selected === tag.id ? 'vibe-tag-active' : ''}`}
          style={{
            '--tag-color': tag.color,
          }}
          onClick={() => onSelect(tag.id)}
        >
          <span className="vibe-tag-emoji">{tag.emoji}</span>
          <span className="vibe-tag-label">{tag.label}</span>
        </button>
      ))}
    </div>
  );
};

export default VibeTagPicker;
