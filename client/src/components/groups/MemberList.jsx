import Avatar from '../common/Avatar';
import { AvatarDisplay } from '../common/AvatarPicker';
import Badge from '../common/Badge';
import { motion, AnimatePresence } from 'framer-motion';
import './MemberList.css';

const MemberList = ({ members, onRemove }) => {
  return (
    <div className="member-list">
      <AnimatePresence>
        {members.map((member) => (
          <motion.div 
            key={member.id} 
            className="member-list-item"
            initial={{ opacity: 0, y: -15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            transition={{ duration: 0.3, type: "spring", stiffness: 200, damping: 20 }}
          >
            {member.avatar ? (
              <AvatarDisplay avatarId={member.avatar} name={member.name} size={36} />
            ) : (
              <Avatar name={member.name} size={36} />
            )}
            <div className="member-list-info">
              <span className="member-list-name">{member.name}</span>
              <span className="member-list-email">
                {member.email === 'you@example.com' ? member.phone : (member.email?.includes('@ghost') && member.phone ? member.phone : member.email)}
              </span>
              <span style={{ fontSize: '11px', color: '#64748b', marginTop: '2px', fontWeight: '600' }}>
                Base Currency: {member.customCurrency || member.homeCurrency || 'INR'}
              </span>
            </div>
            {member.role === 'admin' && <Badge variant="primary">Admin</Badge>}
            {onRemove && member.role !== 'admin' && (
              <button className="member-remove-btn" onClick={() => onRemove(member.id)}>
                Remove
              </button>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default MemberList;
