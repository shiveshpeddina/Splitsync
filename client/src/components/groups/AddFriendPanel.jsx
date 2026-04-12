import React, { useState } from 'react';
import { useFriends } from '../../context/FriendContext';
import Button from '../common/Button';
import Input from '../common/Input';
import CurrencySelector from '../currency/CurrencySelector';
import { AVATAR_OPTIONS, getAvatarById } from '../common/AvatarPicker';

export default function AddFriendPanel({ onFriendAdded }) {
  const [contact, setContact] = useState('');
  const [contactName, setContactName] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [avatar, setAvatar] = useState(null);
  const [showFacePicker, setShowFacePicker] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const { addFriend, updateFriend } = useFriends();

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!contact.trim()) return;

    setIsAdding(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const result = await addFriend(contact.trim(), contactName.trim(), currency);
      
      // If an avatar was selected, update it right after creating
      if (avatar && result.friend?.id) {
        await updateFriend(result.friend.id, { avatar });
      }

      setSuccessMsg(`Successfully added ${result.friend.name}!`);
      setContact('');
      setContactName('');
      setCurrency('INR');
      setAvatar(null);
      setShowFacePicker(false);
      if (onFriendAdded) {
        onFriendAdded(result.friend);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to add friend. Try again later.');
    } finally {
      setIsAdding(false);
    }
  };

  const selectedAvatar = getAvatarById(avatar);

  return (
    <div style={{ padding: 'var(--space-2)' }}>
      <p style={{ marginBottom: 'var(--space-4)', color: 'var(--text-muted)' }}>
        Add your friends using their phone number.
      </p>

      {errorMsg && (
        <div style={{ color: 'var(--error)', marginBottom: 'var(--space-4)', fontSize: 'var(--text-sm)', background: '#fee2e2', padding: 'var(--space-2)', borderRadius: 'var(--radius-sm)' }}>
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div style={{ color: '#166534', marginBottom: 'var(--space-4)', fontSize: 'var(--text-sm)', background: '#dcfce7', padding: 'var(--space-2)', borderRadius: 'var(--radius-sm)' }}>
          {successMsg}
        </div>
      )}

      <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {/* Avatar Picker + Name row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            type="button"
            onClick={() => setShowFacePicker(!showFacePicker)}
            style={{
              width: 52, height: 52, borderRadius: '50%', border: '2px dashed rgba(99,102,241,0.35)',
              background: selectedAvatar 
                ? `linear-gradient(135deg, ${selectedAvatar.bg}, ${selectedAvatar.bg}dd)`
                : 'linear-gradient(135deg, #f0f0ff, #e8e8ff)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 26, position: 'relative', padding: 0, flexShrink: 0,
              transition: 'all 0.25s ease',
              boxShadow: selectedAvatar ? `0 2px 8px ${selectedAvatar.bg}40` : 'none',
            }}
          >
            {selectedAvatar ? selectedAvatar.face : '\u{1F600}'}
            <span style={{
              position: 'absolute', bottom: -2, right: -2, width: 18, height: 18,
              background: '#6366f1', borderRadius: '50%', display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontSize: 9,
              border: '2px solid white', boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
            }}>✏️</span>
          </button>
          <div style={{ flex: 1 }}>
            <Input
              label="Name (Optional)"
              type="text"
              placeholder="e.g. John Doe"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
            />
          </div>
        </div>

        {/* Face picker grid — appears inline */}
        {showFacePicker && (
          <div style={{
            background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 14,
            padding: 12, animation: 'fadeSlideIn 0.2s ease-out',
          }}>
            <style>{`
              @keyframes fadeSlideIn {
                from { opacity: 0; transform: translateY(-4px); }
                to { opacity: 1; transform: translateY(0); }
              }
            `}</style>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>Choose a Face</span>
              {avatar && (
                <button type="button" onClick={() => { setAvatar(null); setShowFacePicker(false); }}
                  style={{ fontSize: 11, color: '#ef4444', background: '#fef2f2', border: 'none', borderRadius: 6, padding: '3px 8px', cursor: 'pointer', fontWeight: 600 }}>
                  Remove
                </button>
              )}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 6 }}>
              {AVATAR_OPTIONS.map(opt => (
                <button key={opt.id} type="button"
                  onClick={() => { setAvatar(opt.id); setShowFacePicker(false); }}
                  style={{
                    width: 42, height: 42, borderRadius: '50%',
                    border: avatar === opt.id ? '3px solid white' : '2px solid transparent',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 20, padding: 0, lineHeight: 1,
                    background: `linear-gradient(135deg, ${opt.bg}, ${opt.bg}cc)`,
                    boxShadow: avatar === opt.id ? `0 0 0 2px ${opt.bg}, 0 4px 12px ${opt.bg}50` : `0 2px 6px ${opt.bg}30`,
                    transition: 'all 0.2s ease',
                  }}
                >
                  {opt.face}
                </button>
              ))}
            </div>
          </div>
        )}

        <Input
          label="Phone Number"
          type="tel"
          placeholder="e.g. +1234567890"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          required
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
          <label style={{ fontSize: 'var(--text-sm)', fontWeight: '600', color: 'var(--text-primary)' }}>Preferred Currency</label>
          <div style={{ border: '1px solid var(--border-default)', padding: '2px', borderRadius: 'var(--radius-md)' }}>
            <CurrencySelector value={currency} onChange={setCurrency} />
          </div>
        </div>
        
        <Button
          type="submit"
          variant="primary"
          loading={isAdding}
          disabled={!contact.trim()}
          fullWidth
        >
          {isAdding ? 'Adding...' : 'Add Friend'}
        </Button>
      </form>
    </div>
  );
}
