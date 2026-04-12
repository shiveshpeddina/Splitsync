import React, { useState } from 'react';
import { useFriends } from '../../context/FriendContext';
import Button from '../common/Button';
import Input from '../common/Input';
import CurrencySelector from '../currency/CurrencySelector';
import { AvatarDisplay, AVATAR_OPTIONS, getAvatarById } from '../common/AvatarPicker';

export default function FriendProfileModal({ friend, onClose }) {
  const { updateFriend, deleteFriend } = useFriends();
  
  const [alias, setAlias] = useState(friend?.alias || '');
  const [avatar, setAvatar] = useState(friend?.avatar || null);
  const [customCurrency, setCustomCurrency] = useState(friend?.customCurrency || '');
  const [showFacePicker, setShowFacePicker] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');

    try {
      await updateFriend(friend.id, {
        alias: alias.trim() || null,
        avatar: avatar || null,
        customCurrency: customCurrency || null
      });
      if (onClose) onClose();
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to update friend profile');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setDeleting(true);
    setErrorMsg('');
    try {
      await deleteFriend(friend.id);
      if (onClose) onClose();
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to remove friend');
    } finally {
      setDeleting(false);
    }
  };

  if (!friend) return null;

  const selectedAvatar = getAvatarById(avatar);

  return (
    <div style={{ padding: 'var(--space-2)' }}>
      {/* Profile header — avatar trigger + name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
        <button
          type="button"
          onClick={() => setShowFacePicker(!showFacePicker)}
          style={{
            width: 64, height: 64, borderRadius: '50%', border: '2px dashed rgba(99,102,241,0.35)',
            background: selectedAvatar 
              ? `linear-gradient(135deg, ${selectedAvatar.bg}, ${selectedAvatar.bg}dd)` 
              : 'linear-gradient(135deg, #f0f0ff, #e8e8ff)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32, position: 'relative', padding: 0,
            transition: 'all 0.25s ease',
            boxShadow: selectedAvatar ? `0 2px 8px ${selectedAvatar.bg}40` : 'none',
          }}
        >
          {selectedAvatar ? selectedAvatar.face : '\u{1F600}'}
          <span style={{
            position: 'absolute', bottom: -2, right: -2, width: 20, height: 20,
            background: '#6366f1', borderRadius: '50%', display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontSize: 10,
            border: '2px solid white', boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
          }}>✏️</span>
        </button>
        <div>
          <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--text-primary)' }}>{friend.alias || friend.name}</h3>
          <p style={{ margin: '4px 0 0', fontSize: '14px', color: 'var(--text-muted)' }}>
            {friend.email?.includes('@ghost') && friend.phone ? friend.phone : (friend.email || friend.phone || 'No contact info')}
          </p>
          <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#6366f1', cursor: 'pointer', fontWeight: 600 }}
            onClick={() => setShowFacePicker(!showFacePicker)}
          >
            {showFacePicker ? '▲ Hide faces' : '▼ Change face'}
          </p>
        </div>
      </div>

      {/* Inline Face Grid — appears right below header, above the form */}
      {showFacePicker && (
        <div style={{
          background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 14,
          padding: 12, marginBottom: 16,
          animation: 'fadeSlideIn 0.2s ease-out',
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
              <button
                type="button"
                onClick={() => { setAvatar(null); setShowFacePicker(false); }}
                style={{ fontSize: 11, color: '#ef4444', background: '#fef2f2', border: 'none', borderRadius: 6, padding: '3px 8px', cursor: 'pointer', fontWeight: 600 }}
              >
                Remove
              </button>
            )}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 6 }}>
            {AVATAR_OPTIONS.map(opt => (
              <button
                key={opt.id}
                type="button"
                onClick={() => { setAvatar(opt.id); setShowFacePicker(false); }}
                style={{
                  width: 42, height: 42, borderRadius: '50%', border: avatar === opt.id ? '3px solid white' : '2px solid transparent',
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

      {errorMsg && (
        <div style={{ color: 'var(--error)', marginBottom: 'var(--space-4)', fontSize: 'var(--text-sm)', background: '#fee2e2', padding: 'var(--space-2)', borderRadius: 'var(--radius-sm)' }}>
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <Input
          label="Custom Display Name (Alias)"
          type="text"
          placeholder="e.g. My Roommate"
          value={alias}
          onChange={(e) => setAlias(e.target.value)}
        />
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
          <label style={{ fontSize: 'var(--text-sm)', fontWeight: '600' }}>Preferred Currency</label>
          <div style={{ width: '100%', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: 'var(--space-1)' }}>
            <CurrencySelector 
              value={customCurrency || 'INR'} 
              onChange={setCustomCurrency} 
            />
          </div>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: '4px' }}>
            Sets the default currency for balances regarding this friend.
          </p>
        </div>

        <div style={{ marginTop: 'var(--space-2)', display: 'flex', gap: '12px' }}>
          <Button type="button" variant="outline" fullWidth onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={saving} fullWidth>
            Save Settings
          </Button>
        </div>
      </form>

      {/* Danger Zone - Remove Friend */}
      <div style={{ 
        marginTop: 'var(--space-6)', paddingTop: 'var(--space-4)', 
        borderTop: '1px solid var(--border-light)' 
      }}>
        {confirmDelete && (
          <p style={{ fontSize: 'var(--text-sm)', color: '#b91c1c', marginBottom: 'var(--space-3)', fontWeight: 500 }}>
            Are you sure? This will remove {friend.alias || friend.name} from your friends list.
          </p>
        )}
        <Button 
          type="button" 
          variant="outline" 
          fullWidth 
          loading={deleting}
          onClick={handleDelete}
          style={{ borderColor: '#ef4444', color: '#ef4444', backgroundColor: confirmDelete ? '#fef2f2' : '#fff' }}
        >
          {confirmDelete ? 'Confirm Remove' : 'Remove Friend'}
        </Button>
        {confirmDelete && (
          <button 
            type="button" 
            onClick={() => setConfirmDelete(false)} 
            style={{ 
              width: '100%', marginTop: '8px', padding: '8px', 
              background: 'transparent', border: 'none', 
              color: 'var(--text-muted)', fontSize: 'var(--text-sm)', 
              cursor: 'pointer' 
            }}
          >
            Never mind
          </button>
        )}
      </div>
    </div>
  );
}
