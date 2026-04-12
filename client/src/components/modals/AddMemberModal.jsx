import React from 'react';
import Modal from '../ui/Modal';
import AddMemberPanel from '../groups/AddMemberPanel';

export default function AddMemberModal({ 
  isOpen, 
  onClose, 
  groupId, 
  inviterId, 
  groupName, 
  currentMembers = [] 
}) {
  return (
    <Modal isOpen={isOpen} onClose={() => onClose(false)} title="Add Member">
      <AddMemberPanel 
        groupId={groupId}
        inviterId={inviterId}
        groupName={groupName}
        currentMembers={currentMembers}
        onMemberAdded={() => onClose(true)} 
      />
    </Modal>
  );
}

