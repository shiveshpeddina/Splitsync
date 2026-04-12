import { useState } from 'react';
import Button from '../common/Button';
import NudgeTonePicker from './NudgeTonePicker';

const NudgeButton = ({ targetUser, amount, groupId }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setIsOpen(true)}>
        👋 Nudge
      </Button>
      <NudgeTonePicker
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        targetUser={targetUser}
        amount={amount}
        groupId={groupId}
        onNudgeSent={() => {
          // Could fire off a toast notification here
          console.log('Nudge sent successfully!');
        }}
      />
    </>
  );
};

export default NudgeButton;
