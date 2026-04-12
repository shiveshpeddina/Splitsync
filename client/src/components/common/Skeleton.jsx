import React from 'react';
import './Skeleton.css';

export const Skeleton = ({ width, height, borderRadius, style, variant = 'rect', className = '' }) => {
  return (
    <div
      className={`skeleton-box skeleton-${variant} ${className}`}
      style={{ width, height, borderRadius, ...style }}
    ></div>
  );
};

export const CardSkeleton = () => (
  <div className="skeleton-card">
    <div className="skeleton-card-top">
      <Skeleton variant="circle" width="40px" height="40px" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        <Skeleton width="60%" height="16px" />
        <Skeleton width="40%" height="12px" />
      </div>
    </div>
    <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between' }}>
        <Skeleton width="30%" height="20px" />
        <Skeleton width="20%" height="14px" />
    </div>
  </div>
);

export const ListSkeleton = ({ count = 3 }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
