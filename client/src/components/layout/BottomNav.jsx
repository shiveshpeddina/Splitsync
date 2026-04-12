import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, Clock, User } from 'lucide-react';
import styles from './BottomNav.module.css';

export default function BottomNav() {
  const tabs = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Groups', path: '#', icon: Users }, // we can keep it single page for groups on home or adjust path if needed
    { name: 'History', path: '#', icon: Clock },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <div className={styles.container}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <NavLink
            key={tab.name}
            to={tab.path}
            className={({ isActive }) => 
              `${styles.tab} ${isActive && tab.path !== '#' ? styles.active : ''}`
            }
          >
            <Icon size={24} strokeWidth={2.5} />
            <span className={styles.label}>{tab.name}</span>
          </NavLink>
        );
      })}
    </div>
  );
}
