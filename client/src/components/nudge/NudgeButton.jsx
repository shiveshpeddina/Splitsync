import { useState } from 'react';
import Button from '../ui/Button';
import NudgeTonePicker from './NudgeTonePicker';

const NudgeButton = ({ targetUser, amount, groupId, className }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="ghost" size="small" onClick={() => setIsOpen(true)} className={className}>
        👋 Nudge
      </Button>
      <NudgeTonePicker
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        targetUser={targetUser}
        amount={amount}
        groupId={groupId}
        onNudgeSent={() => {
          console.log('Nudge sent successfully!');
        }}
      />
    </>
  );
};

export default NudgeButton;
