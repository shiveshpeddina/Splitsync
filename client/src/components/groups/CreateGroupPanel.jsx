import React, { useState } from 'react';
import { useFriends } from '../../context/FriendContext';
import { useGroups } from '../../context/GroupContext';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';
import Input from '../common/Input';
import { AvatarDisplay } from '../common/AvatarPicker';

export default function CreateGroupPanel({ onGroupCreated }) {
  const { friends, loading: friendsLoading } = useFriends();
  const { createGroup } = useGroups();
  const { user } = useAuth();

  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('🤑');
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [includeSelf, setIncludeSelf] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const toggleFriend = (id) => {
    if (selectedFriends.includes(id)) {
      setSelectedFriends(selectedFriends.filter((fid) => fid !== id));
    } else {
      setSelectedFriends([...selectedFriends, id]);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsCreating(true);
    setErrorMsg('');

    try {
      const newGroup = await createGroup({
        name: name.trim(),
        emoji: emoji || '🤑',
        memberIds: selectedFriends,
        includeSelf
      });
      if (onGroupCreated) onGroupCreated(newGroup);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to create group');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div style={{ padding: 'var(--space-2)' }}>
      {errorMsg && (
        <div style={{ color: 'var(--error)', marginBottom: 'var(--space-4)', fontSize: 'var(--text-sm)', background: '#fee2e2', padding: 'var(--space-2)', borderRadius: 'var(--radius-sm)' }}>
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <div style={{ width: '60px' }}>
            <Input
              label="Emoji"
              type="text"
              value={emoji}
              onChange={(e) => setEmoji(e.target.value)}
              placeholder="🏖️"
              maxLength={2}
            />
          </div>
          <div style={{ flex: 1 }}>
            <Input
              label="Group Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="E.g. Weekend Trip"
              required
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: '600', marginBottom: 'var(--space-2)' }}>
            Add Friends to Group
          </label>
          
          {friendsLoading ? (
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>Loading friends...</p>
          ) : friends.length === 0 ? (
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', background: 'var(--bg-card)', padding: 'var(--space-3)', borderRadius: 'var(--radius-sm)' }}>
              You don't have any friends added yet. Go back and add friends first!
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', maxHeight: '200px', overflowY: 'auto', paddingRight: 'var(--space-2)' }}>
              {friends.map((friend) => {
                const isSelected = selectedFriends.includes(friend.id);
                return (
                  <div 
                    key={friend.id}
                    onClick={() => toggleFriend(friend.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '12px', padding: 'var(--space-2)', 
                      borderRadius: 'var(--radius-md)', cursor: 'pointer',
                      border: `1px solid ${isSelected ? 'var(--primary-600)' : 'var(--border-default)'}`,
                      background: isSelected ? 'var(--primary-50)' : 'transparent',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{
                      width: '20px', height: '20px', borderRadius: '4px',
                      border: `2px solid ${isSelected ? 'var(--primary-600)' : '#cbd5e1'}`,
                      background: isSelected ? 'var(--primary-600)' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      {isSelected && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                    </div>
                    {friend.avatar ? (
                      <AvatarDisplay avatarId={friend.avatar} name={friend.alias || friend.name} size={32} />
                    ) : (
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: `hsl(${(friend.name || '').split('').reduce((a,c)=>a+c.charCodeAt(0),0) % 360}, 60%, 45%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 13, fontWeight: 700 }}>
                        {(friend.alias || friend.name || '?')[0].toUpperCase()}
                      </div>
                    )}
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontWeight: '600', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>{friend.alias || friend.name}</p>
                      <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                        {friend.email?.includes('@ghost') && friend.phone ? friend.phone : (friend.email || friend.phone)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div 
          onClick={() => setIncludeSelf(!includeSelf)}
          style={{
            display: 'flex', alignItems: 'center', gap: '12px', padding: 'var(--space-3)',
            borderRadius: 'var(--radius-md)', cursor: 'pointer',
            border: `1px solid ${includeSelf ? 'var(--primary-600)' : 'var(--border-default)'}`,
            background: includeSelf ? 'var(--primary-50)' : 'transparent',
            transition: 'all 0.2s ease', marginTop: 'var(--space-2)'
          }}
        >
          <div style={{
            width: '20px', height: '20px', borderRadius: '4px',
            border: `2px solid ${includeSelf ? 'var(--primary-600)' : '#cbd5e1'}`,
            background: includeSelf ? 'var(--primary-600)' : 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            {includeSelf && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontWeight: '600', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>Include myself in this group</p>
            <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
              Added as admin
            </p>
          </div>
        </div>

        <div style={{ marginTop: 'var(--space-4)' }}>
          <Button type="submit" variant="primary" loading={isCreating} disabled={!name.trim()} fullWidth>
            {isCreating ? 'Creating...' : `Create Group (${selectedFriends.length} friends${includeSelf ? ' + you' : ''})`}
          </Button>
        </div>
      </form>
    </div>
  );
}
