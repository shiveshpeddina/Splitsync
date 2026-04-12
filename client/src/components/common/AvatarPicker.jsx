import React, { useState } from 'react';
import './AvatarPicker.css';

// 12 unique profile faces — compact grid that fits on one screen
const AVATAR_OPTIONS = [
  { id: 'face_1', bg: '#6366f1', face: '\u{1F60A}' },
  { id: 'face_2', bg: '#ec4899', face: '\u{1F60E}' },
  { id: 'face_3', bg: '#f59e0b', face: '\u{1F929}' },
  { id: 'face_4', bg: '#10b981', face: '\u{1F607}' },
  { id: 'face_5', bg: '#ef4444', face: '\u{1F973}' },
  { id: 'face_6', bg: '#8b5cf6', face: '\u{1F60F}' },
  { id: 'face_7', bg: '#0ea5e9', face: '\u{1F917}' },
  { id: 'face_8', bg: '#f97316', face: '\u{1F61C}' },
  { id: 'face_9', bg: '#14b8a6', face: '\u{1F9D0}' },
  { id: 'face_10', bg: '#e11d48', face: '\u{1F624}' },
  { id: 'face_11', bg: '#7c3aed', face: '\u{1F920}' },
  { id: 'face_12', bg: '#06b6d4', face: '\u{1F913}' },
];

export { AVATAR_OPTIONS };

export function getAvatarById(avatarId) {
  return AVATAR_OPTIONS.find(a => a.id === avatarId) || null;
}

export function AvatarDisplay({ avatarId, name, size = 40, className = '' }) {
  const avatar = getAvatarById(avatarId);

  if (avatar) {
    return (
      <div
        className={`avatar-display ${className}`}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${avatar.bg}, ${avatar.bg}dd)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: size * 0.5,
          flexShrink: 0,
          boxShadow: `0 2px 8px ${avatar.bg}40`,
          lineHeight: 1,
        }}
        title={name}
      >
        {avatar.face}
      </div>
    );
  }

  // Fallback to initials
  const initials = name
    ? name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '?';
  const hue = name
    ? name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360
    : 200;

  return (
    <div
      className={`avatar-display ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: `hsl(${hue}, 60%, 45%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.38,
        fontWeight: 700,
        color: 'white',
        flexShrink: 0,
        letterSpacing: '0.5px',
      }}
      title={name}
    >
      {initials}
    </div>
  );
}

export default function AvatarPicker({ value, onChange, size = 'medium' }) {
  const [isOpen, setIsOpen] = useState(false);

  const selected = getAvatarById(value);

  const triggerSize = size === 'small' ? 36 : size === 'large' ? 68 : 52;
  const triggerFontSize = size === 'small' ? 18 : size === 'large' ? 34 : 26;

  return (
    <div className="avatar-picker-container">
      {/* Trigger button */}
      <button
        type="button"
        className="avatar-picker-trigger"
        style={{ width: triggerSize, height: triggerSize, fontSize: triggerFontSize }}
        onClick={() => setIsOpen(!isOpen)}
        title="Choose profile face"
      >
        {selected ? (
          <span className="avatar-picker-face">{selected.face}</span>
        ) : (
          <span className="avatar-picker-placeholder">{'\u{1F600}'}</span>
        )}
        <span className="avatar-picker-edit-badge">{'\u270F\uFE0F'}</span>
      </button>

      {/* Inline grid — expands below the trigger, no dropdown/portal needed */}
      {isOpen && (
        <div className="avatar-picker-inline">
          <div className="avatar-picker-header">
            <span className="avatar-picker-title">Choose a Face</span>
            {value && (
              <button
                type="button"
                className="avatar-picker-clear"
                onClick={() => { onChange(null); setIsOpen(false); }}
              >
                Remove
              </button>
            )}
          </div>
          <div className="avatar-picker-grid">
            {AVATAR_OPTIONS.map(opt => (
              <button
                key={opt.id}
                type="button"
                className={`avatar-picker-option ${value === opt.id ? 'selected' : ''}`}
                style={{
                  background: `linear-gradient(135deg, ${opt.bg}, ${opt.bg}cc)`,
                  boxShadow: value === opt.id
                    ? `0 0 0 3px ${opt.bg}, 0 4px 12px ${opt.bg}50`
                    : `0 2px 6px ${opt.bg}30`,
                }}
                onClick={() => {
                  onChange(opt.id);
                  setIsOpen(false);
                }}
              >
                <span role="img" aria-label="face">{opt.face}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
