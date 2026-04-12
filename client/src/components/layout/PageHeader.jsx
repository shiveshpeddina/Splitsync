import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import styles from './PageHeader.module.css';

export default function PageHeader({ 
  title, 
  showBack = false, 
  onBack,
  rightContent,
  className = ''
}) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) onBack();
    else navigate(-1);
  };

  return (
    <header className={`${styles.header} ${className}`}>
      <div className={styles.left}>
        {showBack && (
          <button onClick={handleBack} className={styles.backButton}>
            <ArrowLeft size={24} />
          </button>
        )}
        <h1 className={styles.title}>{title}</h1>
      </div>
      <div className={styles.right}>
        {rightContent}
      </div>
    </header>
  );
}
