import React from 'react';
import Button from './Button';
import './EmptyState.css';

const EmptyState = ({ icon = '📦', title, description, actionLabel, onAction }) => {
  return (
    <div className="empty-state-wrapper">
      <div className="empty-state-icon-large">{icon}</div>
      <h3 className="empty-state-heading">{title}</h3>
      <p className="empty-state-text-body">{description}</p>
      {actionLabel && onAction && (
        <Button variant="accent" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
