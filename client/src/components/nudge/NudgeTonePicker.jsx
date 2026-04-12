import { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import nudgeTones, { formatNudge } from '../../constants/nudgeTones';
import { sendNudge } from '../../services/nudgeService';
import './NudgeTonePicker.css';

const NudgeTonePicker = ({ isOpen, onClose, targetUser, amount, groupId, onNudgeSent }) => {
  const [selectedTone, setSelectedTone] = useState('gentle');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSend = async () => {
    setLoading(true);
    setError(null);

    try {
      // Log the nudge on our backend (fail silently if it hiccups, we still want to open whatsapp)
      await sendNudge(targetUser.id, groupId, selectedTone);
    } catch (err) {
      console.warn('Backend nudge tracking failed:', err);
    }

    try {
      // Actually launch the Notification/Message on their device!
      const textToShare = formatNudge(selectedTone, targetUser?.name, amount);
      const phone = targetUser?.phone;

      if (phone) {
        // Found a phone number! Open WhatsApp directly.
        // Strip non-numeric chars except a leading plus sign
        const cleanPhone = phone.replace(/[^\d+]/g, '');
        const waLink = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(textToShare)}`;
        window.open(waLink, '_blank', 'noopener,noreferrer');
      } else if (navigator.share) {
        // Mobile fallback if no phone number exists (opens native iOS/Android share sheet)
        await navigator.share({
          title: 'SplitSync Reminder',
          text: textToShare
        });
      } else {
        // Desktop fallback if no phone number and no native sharing supported
        alert(`Message copied! We couldn't find a phone number to open WhatsApp correctly.\n\nReminder:\n"${textToShare}"`);
        navigator.clipboard.writeText(textToShare).catch(() => { });
      }

      onNudgeSent?.();
      onClose();
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        // User cancelled the native share sheet, ignore
      } else {
        setError('Failed to open sharing action');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Send a Nudge" size="md">
      <div className="nudge-picker-container">
        <p className="nudge-picker-desc">
          How do you want to remind <strong>{targetUser?.name}</strong>?
        </p>

        <div className="nudge-tone-options">
          {Object.values(nudgeTones).map((tone) => (
            <div
              key={tone.id}
              className={`nudge-tone-card ${selectedTone === tone.id ? 'selected' : ''}`}
              onClick={() => setSelectedTone(tone.id)}
              style={{ '--tone-color': tone.color }}
            >
              <div className="nudge-tone-header">
                <span className="nudge-tone-emoji">{tone.emoji}</span>
                <span className="nudge-tone-label">{tone.label}</span>
              </div>
              <p className="nudge-tone-desc">{tone.description}</p>
            </div>
          ))}
        </div>

        <div className="nudge-preview-box">
          <span className="preview-label">Preview:</span>
          <p className="preview-text">
            "{formatNudge(selectedTone, targetUser?.name, amount)}"
          </p>
        </div>

        {error && <div className="nudge-error">{error}</div>}

        <div className="nudge-actions">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="accent" onClick={handleSend} loading={loading}>
            Send Notification ✨
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default NudgeTonePicker;
