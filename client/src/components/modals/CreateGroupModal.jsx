import React, { useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useFriends } from '../../context/FriendContext';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Avatar from '../ui/Avatar';
import { AvatarDisplay } from '../common/AvatarPicker';
import styles from './CreateGroupModal.module.css';

const EMOJIS = ['🎓', '🏠', '🍕', '🚗', '✈️', '🏝️', '🎊', '🎁', '🎸', '⚽️', '👥', '💼'];

export default function CreateGroupModal({ isOpen, onClose }) {
  const { user } = useAuth();
  const { friends } = useFriends();
  
  const [emoji, setEmoji] = useState('👥');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [name, setName] = useState('');
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [includeMe, setIncludeMe] = useState(true);
  const [loading, setLoading] = useState(false);

  // Quick reset on open
  React.useEffect(() => {
    if (isOpen) {
      setEmoji('👥');
      setName('');
      setSelectedFriends([]);
      setIncludeMe(true);
      setShowEmojiPicker(false);
    }
  }, [isOpen]);

  const toggleFriend = (friendId) => {
    setSelectedFriends(prev => 
      prev.includes(friendId) 
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    );
  };

  const handleCreate = async () => {
    if (!name.trim()) return alert('Please enter a group name');
    
    if (!includeMe && selectedFriends.length === 0) {
       return alert('Select at least one member');
    }

    try {
      setLoading(true);
      await api.post('/groups', {
        name,
        emoji,
        memberIds: selectedFriends,
        includeSelf: includeMe
      });
      onClose(true); // pass true indicating success
    } catch (err) {
      console.error(err);
      alert('Failed to create group');
    } finally {
      setLoading(false);
    }
  };

  const selectedCount = selectedFriends.length;

  return (
    <Modal isOpen={isOpen} onClose={() => onClose(false)} title="Create Group">
      <div className={styles.container}>
        
        {/* Row 1: Emoji & Name */}
        <div className={styles.nameRow}>
          <div className={styles.emojiPickerWrap}>
            <button 
              className={styles.emojiBtn}
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              type="button"
            >
              {emoji}
            </button>
            {showEmojiPicker && (
              <div className={styles.emojiDropdown}>
                {EMOJIS.map(e => (
                  <button 
                    key={e} 
                    className={styles.emojiOption}
                    onClick={() => { setEmoji(e); setShowEmojiPicker(false); }}
                    type="button"
                  >
                    {e}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className={styles.nameInputWrap}>
            <Input 
              placeholder="e.g., Weekend Trip"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        {/* Add Friends Section */}
        <div className={styles.friendsSection}>
          <label className={styles.sectionLabel}>Add Friends to Group</label>
          <div className={styles.friendsList}>
            {friends.length === 0 ? (
              <div className={styles.emptyFriends}>
                No friends available. Create group with just yourself first.
              </div>
            ) : (
              friends.map((friend) => {
                const isSelected = selectedFriends.includes(friend.id);
                return (
                  <div 
                    key={friend.id} 
                    className={`${styles.friendRow} ${isSelected ? styles.selectedRow : ''}`}
                    onClick={() => toggleFriend(friend.id)}
                  >
                    <div className={`${styles.checkbox} ${isSelected ? styles.checkboxActive : ''}`}>
                      {isSelected && <span className={styles.checkIcon}>✓</span>}
                    </div>
                    {friend.avatar ? (
                      <AvatarDisplay avatarId={friend.avatar} name={friend.alias || friend.name} size={32} />
                    ) : (
                      <Avatar name={friend.alias || friend.name} size="small" />
                    )}
                    <div className={styles.friendInfo}>
                      <span className={styles.friendName}>{friend.alias || friend.name}</span>
                      <span className={styles.friendId}>{friend.phone || friend.email}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Include myself checkbox */}
        <div 
          className={`${styles.includeRow} ${includeMe ? styles.includeRowActive : ''}`}
          onClick={() => setIncludeMe(!includeMe)}
        >
          <div className={`${styles.simpleCheck} ${includeMe ? styles.simpleCheckActive : ''}`}>
            {includeMe && '✓'}
          </div>
          <span className={styles.includeLabel}>Include myself in this group</span>
          {includeMe && <span className={styles.adminLabel}>Added as admin</span>}
        </div>

        {/* Submit */}
        <Button 
          variant="primary" 
          size="large"
          fullWidth 
          onClick={handleCreate}
          disabled={loading || (!includeMe && selectedCount === 0)}
          className={styles.submitBtn}
        >
          {loading ? 'Creating...' : `Create Group (${selectedCount} friend${selectedCount !== 1 ? 's' : ''} + you)`}
        </Button>
      </div>
    </Modal>
  );
}
