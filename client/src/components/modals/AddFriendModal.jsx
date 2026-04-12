import React from 'react';
import Modal from '../ui/Modal';
import AddFriendPanel from '../groups/AddFriendPanel';
import { useFriends } from '../../context/FriendContext';

export default function AddFriendModal({ isOpen, onClose }) {
  const { fetchFriends } = useFriends();

  return (
    <Modal isOpen={isOpen} onClose={() => onClose(false)} title="Add Friend">
      <AddFriendPanel 
        onFriendAdded={() => {
          fetchFriends();
          onClose(true);
        }} 
      />
    </Modal>
  );
}
