import Avatar from '../common/Avatar';
import './MemberChip.css';

const MemberChip = ({ member, removable = false, onRemove }) => {
  return (
    <div className="member-chip">
      <Avatar name={member.name} size={24} />
      <span className="member-chip-name">{member.name}</span>
      {removable && (
        <button className="member-chip-remove" onClick={() => onRemove(member.id)}>
          ✕
        </button>
      )}
    </div>
  );
};

export default MemberChip;
