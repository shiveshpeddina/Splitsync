import React, { forwardRef } from 'react';
import styles from './Input.module.css';

const Input = forwardRef(({ 
  label, 
  prefix, 
  suffix, 
  error, 
  className = '', 
  wrapperClassName = '',
  id,
  ...props 
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`${styles.container} ${wrapperClassName}`}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}
      <div className={`${styles.inputWrapper} ${error ? styles.hasError : ''}`}>
        {prefix && <span className={styles.prefix}>{prefix}</span>}
        <input
          ref={ref}
          id={inputId}
          className={`${styles.input} ${prefix ? styles.withPrefix : ''} ${suffix ? styles.withSuffix : ''} ${className}`}
          {...props}
        />
        {suffix && <span className={styles.suffix}>{suffix}</span>}
      </div>
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
