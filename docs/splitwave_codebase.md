# SplitWave Codebase Export

## File: client/src/App.jsx
```javascript
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { GroupProvider } from './context/GroupContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { ToastProvider } from './components/common/Toast';

import Home from './pages/Home';
import Login from './pages/Login';
import GroupDetail from './pages/GroupDetail';
import NotFound from './pages/NotFound';
import AddExpense from './pages/AddExpense';
import CurrencyPage from './pages/CurrencyPage';
import Profile from './pages/Profile';
import ProtectedRoute from './components/common/ProtectedRoute';

import './styles/globals.css';
import './styles/theme.css';
import './styles/animations.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <GroupProvider>
          <CurrencyProvider>
            <ToastProvider>
              <div className="app">
                <Routes>
                  <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                  <Route path="/add" element={<ProtectedRoute><AddExpense /></ProtectedRoute>} />
                  <Route path="/currency" element={<ProtectedRoute><CurrencyPage /></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/group/:id" element={<ProtectedRoute><GroupDetail /></ProtectedRoute>} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </ToastProvider>
          </CurrencyProvider>
        </GroupProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

```

## File: client/src/components/balances/BalanceCard.css
```css
.balance-card {
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.balance-card-people {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.balance-card-person {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  min-width: 70px;
}

.balance-card-name {
  font-size: var(--text-sm);
  font-weight: 600;
  text-align: center;
}

.balance-card-arrow {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  position: relative;
}

.arrow-line {
  width: 100%;
  height: 2px;
  background: var(--gradient-primary);
  border-radius: 1px;
}

.arrow-amount {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--primary-400);
}

.arrow-head {
  color: var(--primary-400);
  font-size: var(--text-xl);
}

.balance-card-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-2);
}

```

## File: client/src/components/balances/BalanceCard.jsx
```javascript
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import RemindButton from './RemindButton';
import { fmt } from '../../utils/currencyUtils';
import './BalanceCard.css';

const BalanceCard = ({ from, to, amount, currency, onSettle, onNudge }) => {
  return (
    <div className="balance-card glass-card">
      <div className="balance-card-people">
        <div className="balance-card-person">
          <Avatar name={from.name} size={40} />
          <span className="balance-card-name">{from.name}</span>
        </div>
        <div className="balance-card-arrow">
          <span className="arrow-line" />
          <span className="arrow-amount">{fmt(amount, currency)}</span>
          <span className="arrow-head">→</span>
        </div>
        <div className="balance-card-person">
          <Avatar name={to.name} size={40} />
          <span className="balance-card-name">{to.name}</span>
        </div>
      </div>
      <div className="balance-card-actions">
        <Button variant="ghost" size="sm" onClick={() => onNudge?.(from)}>
          👋 Nudge
        </Button>
        <Button variant="accent" size="sm" onClick={() => onSettle?.(from, to, amount)}>
          ✓ Settle
        </Button>
        <RemindButton creditorName={to.name} amount={amount} groupName="Group" targetPhone={from.phone} />
      </div>
    </div>
  );
};

export default BalanceCard;

```

## File: client/src/components/balances/BalanceList.jsx
```javascript
import BalanceCard from './BalanceCard';

const BalanceList = ({ settlements, members, currency, onSettle, onNudge }) => {
  if (!settlements || settlements.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🎉</div>
        <h3 className="empty-state-title">All settled up!</h3>
        <p className="empty-state-text">
          No pending settlements. Everyone is even!
        </p>
      </div>
    );
  }

  const getMember = (id) => members?.find((m) => m.id === id) || { id, name: 'Unknown' };

  return (
    <div className="stagger-children" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      {settlements.map((s, i) => (
        <BalanceCard
          key={i}
          from={getMember(s.from)}
          to={getMember(s.to)}
          amount={s.amount}
          currency={currency}
          onSettle={onSettle}
          onNudge={onNudge}
        />
      ))}
    </div>
  );
};

export default BalanceList;

```

## File: client/src/components/balances/RemindButton.jsx
```javascript
import React, { useState } from "react";

export default function RemindButton({ creditorName, amount, groupName, targetPhone }) {
  const [copied, setCopied] = useState(false);

  const message = `Hey, just a friendly reminder from ${creditorName} to settle up ₹${amount} in '${groupName}' on SplitWave!`;
  
  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${targetPhone}?text=${encoded}`, "_blank");
  };

  return (
    <div className="flex gap-2">
      {targetPhone ? (
        <button
          onClick={handleWhatsApp}
          className="bg-green-600 text-white text-xs px-3 py-1.5 rounded-md hover:bg-green-700 transition"
        >
          Remind on WhatsApp
        </button>
      ) : null}
      <button
        onClick={handleCopy}
        className="bg-gray-200 text-gray-800 text-xs px-3 py-1.5 rounded-md hover:bg-gray-300 transition"
      >
        {copied ? "Copied!" : "Copy Reminder"}
      </button>
    </div>
  );
}

```

## File: client/src/components/balances/SettlementRow.jsx
```javascript
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import { fmt } from '../../utils/currencyUtils';

const SettlementRow = ({ from, to, amount, currency, onMarkPaid }) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      padding: 'var(--space-3) var(--space-4)',
      borderRadius: 'var(--radius-lg)',
      transition: 'background 150ms',
    }}>
      <Avatar name={from.name} size={32} />
      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>{from.name}</span>
      <span style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>owes</span>
      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>{to.name}</span>
      <Avatar name={to.name} size={32} />
      <span style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        color: 'var(--primary-400)',
        marginLeft: 'auto',
      }}>
        {fmt(amount, currency)}
      </span>
      <Button variant="accent" size="sm" onClick={() => onMarkPaid(from, to, amount)}>
        Mark Paid
      </Button>
    </div>
  );
};

export default SettlementRow;

```

## File: client/src/components/common/Avatar.jsx
```javascript
const Avatar = ({ name, src, size = 40, className = '' }) => {
  const initials = name
    ? name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  // Generate a consistent color from name
  const hue = name
    ? name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360
    : 200;

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`avatar ${className}`}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          objectFit: 'cover',
        }}
      />
    );
  }

  return (
    <div
      className={`avatar ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: `hsl(${hue}, 60%, 45%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.38,
        fontWeight: 700,
        color: 'white',
        flexShrink: 0,
        letterSpacing: '0.5px',
      }}
      title={name}
    >
      {initials}
    </div>
  );
};

export default Avatar;

```

## File: client/src/components/common/Badge.jsx
```javascript
const Badge = ({ children, variant = 'primary', className = '' }) => {
  return (
    <span className={`badge badge-${variant} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;

```

## File: client/src/components/common/Button.css
```css
.btn-full {
  width: 100%;
}

.btn-loading {
  opacity: 0.8;
  pointer-events: none;
}

.btn-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.btn-icon-left,
.btn-icon-right {
  display: inline-flex;
  align-items: center;
  font-size: 1.1em;
}

```

## File: client/src/components/common/Button.jsx
```javascript
import './Button.css';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  const classes = [
    'btn',
    `btn-${variant}`,
    size !== 'md' && `btn-${size}`,
    fullWidth && 'btn-full',
    loading && 'btn-loading',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && <span className="btn-spinner" />}
      {!loading && icon && <span className="btn-icon-left">{icon}</span>}
      {children}
      {!loading && iconRight && <span className="btn-icon-right">{iconRight}</span>}
    </button>
  );
};

export default Button;

```

## File: client/src/components/common/Input.jsx
```javascript
const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  icon,
  disabled = false,
  required = false,
  className = '',
  id,
  ...props
}) => {
  return (
    <div className={`input-group ${className}`}>
      {label && (
        <label className="input-label" htmlFor={id}>
          {label} {required && <span style={{ color: 'var(--error)' }}>*</span>}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        {icon && (
          <span
            style={{
              position: 'absolute',
              left: 'var(--space-3)',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
              fontSize: 'var(--text-lg)',
              pointerEvents: 'none',
            }}
          >
            {icon}
          </span>
        )}
        <input
          id={id}
          type={type}
          className="input-field"
          style={icon ? { paddingLeft: 'var(--space-10)' } : {}}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          {...props}
        />
      </div>
      {error && (
        <span style={{ color: 'var(--error)', fontSize: 'var(--text-xs)', marginTop: '2px' }}>
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;

```

## File: client/src/components/common/Loader.css
```css
.loader-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
  padding: var(--space-8);
}

.loader-ring {
  position: relative;
  border-radius: 50%;
}

.loader-sm .loader-ring { width: 24px; height: 24px; }
.loader-md .loader-ring { width: 40px; height: 40px; }
.loader-lg .loader-ring { width: 56px; height: 56px; }

.loader-ring-inner {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 3px solid var(--border-default);
  border-top-color: var(--primary-500);
  animation: spin 0.8s linear infinite;
}

.loader-text {
  font-size: var(--text-sm);
  color: var(--text-muted);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

```

## File: client/src/components/common/Loader.jsx
```javascript
import './Loader.css';

const Loader = ({ size = 'md', text = '' }) => {
  return (
    <div className={`loader-container loader-${size}`}>
      <div className="loader-ring">
        <div className="loader-ring-inner" />
      </div>
      {text && <p className="loader-text">{text}</p>}
    </div>
  );
};

export default Loader;

```

## File: client/src/components/common/Modal.css
```css
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
  padding: var(--space-4);
  animation: overlayIn 0.2s ease-out;
}

.modal-content {
  background: var(--bg-secondary);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-2xl);
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  animation: modalIn 0.3s ease-out;
}

.modal-sm { max-width: 400px; }
.modal-md { max-width: 540px; }
.modal-lg { max-width: 720px; }

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-6);
  border-bottom: 1px solid var(--border-default);
}

.modal-title {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 700;
}

.modal-close {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-lg);
  color: var(--text-muted);
  transition: all var(--transition-fast);
  font-size: var(--text-lg);
}

.modal-close:hover {
  background: rgba(148, 163, 184, 0.1);
  color: var(--text-primary);
}

.modal-body {
  padding: var(--space-6);
}

```

## File: client/src/components/common/Modal.jsx
```javascript
import { useEffect } from 'react';
import './Modal.css';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`modal-content modal-${size}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

export default Modal;

```

## File: client/src/components/common/ProtectedRoute.jsx
```javascript
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        flexDirection: 'column',
        background: '#ffffff'
      }}>
        <h2 style={{ color: '#1a1a1a', fontWeight: '800' }}>Spliter</h2>
        <p style={{ color: '#5a5a5a', marginTop: 12, fontSize: 14 }}>Loading your setup...</p>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default ProtectedRoute;

```

## File: client/src/components/common/Toast.css
```css
.toast-container {
  position: fixed;
  top: var(--space-4);
  right: var(--space-4);
  z-index: var(--z-toast);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  max-width: 400px;
}

.toast {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-5);
  background: var(--bg-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  animation: toastIn 0.3s ease-out;
  backdrop-filter: blur(10px);
}

.toast-success {
  border-left: 3px solid var(--success);
}

.toast-error {
  border-left: 3px solid var(--error);
}

.toast-warning {
  border-left: 3px solid var(--warning);
}

.toast-info {
  border-left: 3px solid var(--info);
}

.toast-icon {
  font-size: var(--text-lg);
  flex-shrink: 0;
}

.toast-success .toast-icon { color: var(--success); }
.toast-error .toast-icon { color: var(--error); }
.toast-warning .toast-icon { color: var(--warning); }
.toast-info .toast-icon { color: var(--info); }

.toast-message {
  flex: 1;
  font-size: var(--text-sm);
  color: var(--text-primary);
}

.toast-close {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  color: var(--text-muted);
  font-size: var(--text-xs);
  transition: all var(--transition-fast);
  flex-shrink: 0;
}

.toast-close:hover {
  background: rgba(148, 163, 184, 0.1);
  color: var(--text-primary);
}

```

## File: client/src/components/common/Toast.jsx
```javascript
import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import './Toast.css';

const ToastContext = createContext(null);

let toastId = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            <span className="toast-icon">
              {toast.type === 'success' && '✓'}
              {toast.type === 'error' && '✕'}
              {toast.type === 'warning' && '⚠'}
              {toast.type === 'info' && 'ℹ'}
            </span>
            <span className="toast-message">{toast.message}</span>
            <button className="toast-close" onClick={() => removeToast(toast.id)}>
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};

export default ToastProvider;

```

## File: client/src/components/currency/CurrencySelector.css
```css
.currency-selector {
  position: relative;
  height: 54px;
  background: #f5f5f5;
  border-radius: 12px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  cursor: pointer;
}

.currency-selector-input {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 15px;
  color: #1a1a1a;
  position: relative;
}

.cur-flag {
  font-size: 18px;
}

.currency-selector select {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

```

## File: client/src/components/currency/CurrencySelector.jsx
```javascript
import React from 'react';
import currencies, { getCurrencyFlag } from '../../constants/currencies';
import './CurrencySelector.css';

const CurrencySelector = ({ value, onChange }) => {
  const current = currencies.find(c => c.code === value);
  
  return (
    <div className="currency-selector">
      <div className="currency-selector-input">
        <span className="cur-flag">{current ? current.flag : '🏳️'}</span>
        <span className="cur-code">{value}</span>
        <select value={value} onChange={e => onChange(e.target.value)}>
          {currencies.map(c => (
            <option key={c.code} value={c.code}>
              {c.flag} {c.code} - {c.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default CurrencySelector;

```

## File: client/src/components/expenses/ExactSplit.jsx
```javascript
import React from 'react';
import { getCurrencyFlag } from '../../constants/currencies';
import './SmartSplit.css';

const ExactSplit = ({ members, splitValues, onChange, totalAmount, currencyCode }) => {
  const currentTotal = members.reduce((sum, m) => sum + (splitValues[m.id] || 0), 0);
  const remaining = (parseFloat(totalAmount) || 0) - currentTotal;
  const isComplete = Math.abs(remaining) <= 0.05; // allow small floating precision margin

  const handleAmountChange = (id, val) => {
    let raw = val.trim();
    if (raw === '') raw = '0';
    const num = parseFloat(raw) || 0;
    onChange({ ...splitValues, [id]: num });
  };

  return (
    <div className="smart-split-container">
      <div className="split-status">
        <span style={{ color: isComplete ? '#8add5c' : '#ef4444', fontWeight: 'bold' }}>
          {remaining > 0.05 ? `${remaining.toFixed(2)} left` : remaining < -0.05 ? `${Math.abs(remaining).toFixed(2)} over` : 'Perfectly split'}
        </span>
      </div>
      
      {members.map(m => (
        <div key={m.id} className="split-input-row">
           <div className="split-member-info">
             <img src={m.img} alt={m.name} />
             <span>{m.name}</span>
           </div>
           <div className="amount-input-container">
             <span className="input-prefix">{getCurrencyFlag(currencyCode)}</span>
             <input 
               type="number"
               className="smart-number-input"
               placeholder="0.00"
               value={splitValues[m.id] || ''}
               onChange={(e) => handleAmountChange(m.id, e.target.value)}
             />
           </div>
        </div>
      ))}
    </div>
  );
};

export default ExactSplit;

```

## File: client/src/components/expenses/ExpenseCard.css
```css
.expense-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-fast);
  border: 1px solid transparent;
}

.expense-card:hover {
  background: var(--bg-card);
  border-color: var(--border-default);
}

.expense-card-left {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex: 1;
  min-width: 0;
}

.expense-card-tag {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.expense-card-info {
  flex: 1;
  min-width: 0;
}

.expense-card-desc {
  font-weight: 600;
  font-size: var(--text-sm);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.expense-card-meta {
  font-size: var(--text-xs);
  color: var(--text-muted);
}

.expense-card-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--space-1);
  flex-shrink: 0;
}

.expense-card-amount {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--text-primary);
}

.expense-card-badges {
  display: flex;
  gap: var(--space-1);
}

```

## File: client/src/components/expenses/ExpenseCard.jsx
```javascript
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import { fmt } from '../../utils/currencyUtils';
import { timeAgo } from '../../utils/dateUtils';
import { getVibeTag } from '../../constants/vibeTags';
import './ExpenseCard.css';

const ExpenseCard = ({ expense, members, onClick }) => {
  const { description, amount, currency, vibeTag, payerId, splitType, createdAt, isRecurring } = expense;
  const payer = members?.find((m) => m.id === payerId);
  const tag = getVibeTag(vibeTag);

  return (
    <div className="expense-card" onClick={onClick} id={`expense-${expense.id}`}>
      <div className="expense-card-left">
        {tag && (
          <div
            className="expense-card-tag"
            style={{ background: `${tag.color}20`, color: tag.color }}
          >
            {tag.emoji}
          </div>
        )}
        <div className="expense-card-info">
          <h4 className="expense-card-desc">{description}</h4>
          <span className="expense-card-meta">
            Paid by {payer?.name || 'Unknown'} • {timeAgo(createdAt)}
          </span>
        </div>
      </div>
      <div className="expense-card-right">
        <span className="expense-card-amount">{fmt(amount, currency)}</span>
        <div className="expense-card-badges">
          <Badge variant="primary">{splitType}</Badge>
          {isRecurring && <Badge variant="warning">🔄 Recurring</Badge>}
        </div>
      </div>
    </div>
  );
};

export default ExpenseCard;

```

## File: client/src/components/expenses/ExpenseForm.css
```css
.expense-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.expense-form-row {
  display: flex;
  gap: var(--space-4);
}

.expense-form-row .input-group {
  flex: 1;
}

.expense-form-toggle {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  cursor: pointer;
  font-size: var(--text-sm);
  user-select: none;
}

.toggle-label input {
  display: none;
}

.toggle-switch {
  width: 44px;
  height: 24px;
  background: var(--bg-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-full);
  position: relative;
  transition: all var(--transition-base);
}

.toggle-switch::after {
  content: '';
  position: absolute;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--text-muted);
  top: 2px;
  left: 2px;
  transition: all var(--transition-base);
}

.toggle-label input:checked + .toggle-switch {
  background: var(--primary-600);
  border-color: var(--primary-500);
}

.toggle-label input:checked + .toggle-switch::after {
  transform: translateX(20px);
  background: white;
}

.expense-form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  padding-top: var(--space-4);
  border-top: 1px solid var(--border-default);
}

```

## File: client/src/components/expenses/ExpenseForm.jsx
```javascript
import { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import SplitTypeSelector from './SplitTypeSelector';
import VibeTagPicker from './VibeTagPicker';
import './ExpenseForm.css';

const ExpenseForm = ({ members, onSubmit, onCancel, initialData = {} }) => {
  const [description, setDescription] = useState(initialData.description || '');
  const [amount, setAmount] = useState(initialData.amount || '');
  const [currency, setCurrency] = useState(initialData.currency || 'INR');
  const [payerId, setPayerId] = useState(initialData.payerId || '');
  const [splitType, setSplitType] = useState(initialData.splitType || 'equal');
  const [vibeTag, setVibeTag] = useState(initialData.vibeTag || '');
  const [isRecurring, setIsRecurring] = useState(initialData.isRecurring || false);
  const [recurringDay, setRecurringDay] = useState(initialData.recurringDay || 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description.trim() || !amount || !payerId) return;
    onSubmit({
      description: description.trim(),
      amount: parseFloat(amount),
      currency,
      payerId,
      splitType,
      vibeTag: vibeTag || null,
      isRecurring,
      recurringDay: isRecurring ? recurringDay : null,
    });
  };

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <Input
        id="expense-desc"
        label="What was it for?"
        placeholder="e.g., Dinner at Taj"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      <div className="expense-form-row">
        <Input
          id="expense-amount"
          label="Amount"
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          icon="💰"
          required
        />
        <div className="input-group" style={{ maxWidth: 140 }}>
          <label className="input-label">Currency</label>
          <select
            className="input-field"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            <option value="INR">🇮🇳 INR</option>
            <option value="USD">🇺🇸 USD</option>
            <option value="EUR">🇪🇺 EUR</option>
            <option value="GBP">🇬🇧 GBP</option>
          </select>
        </div>
      </div>

      <div className="input-group">
        <label className="input-label">Who paid?</label>
        <select
          className="input-field"
          value={payerId}
          onChange={(e) => setPayerId(e.target.value)}
          required
        >
          <option value="">Select payer</option>
          {members?.map((m) => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
      </div>

      <div className="input-group">
        <label className="input-label">Split Type</label>
        <SplitTypeSelector selected={splitType} onSelect={setSplitType} />
      </div>

      <div className="input-group">
        <label className="input-label">Category</label>
        <VibeTagPicker selected={vibeTag} onSelect={setVibeTag} />
      </div>

      <div className="expense-form-toggle">
        <label className="toggle-label">
          <input
            type="checkbox"
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)}
          />
          <span className="toggle-switch" />
          <span>Recurring expense</span>
        </label>
        {isRecurring && (
          <Input
            id="recurring-day"
            label="Day of month"
            type="number"
            min={1}
            max={28}
            value={recurringDay}
            onChange={(e) => setRecurringDay(parseInt(e.target.value))}
            style={{ maxWidth: 100 }}
          />
        )}
      </div>

      <div className="expense-form-actions">
        {onCancel && <Button variant="ghost" onClick={onCancel}>Cancel</Button>}
        <Button variant="primary" type="submit">
          {initialData.id ? 'Update Expense' : 'Add Expense'}
        </Button>
      </div>
    </form>
  );
};

export default ExpenseForm;

```

## File: client/src/components/expenses/ExpenseList.jsx
```javascript
import ExpenseCard from './ExpenseCard';

const ExpenseList = ({ expenses, members, onExpenseClick }) => {
  if (!expenses || expenses.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📝</div>
        <h3 className="empty-state-title">No expenses yet</h3>
        <p className="empty-state-text">
          Start adding expenses to track your group spending and settle up easily.
        </p>
      </div>
    );
  }

  return (
    <div className="expense-list stagger-children">
      {expenses.map((expense) => (
        <ExpenseCard
          key={expense.id}
          expense={expense}
          members={members}
          onClick={() => onExpenseClick?.(expense)}
        />
      ))}
    </div>
  );
};

export default ExpenseList;

```

## File: client/src/components/expenses/LiveConversionPanel.css
```css
.live-panel {
  margin-top: 16px;
  background: #fdfdfd;
  border: 1px solid #eeeeee;
  border-radius: 16px;
  padding: 16px;
}

.live-panel-header {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  font-weight: 700;
  color: #9e9e9e;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px dashed #ececec;
}

.live-panel-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.live-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.member-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.member-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #f5f5f5;
  overflow: hidden;
}

.member-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.member-name {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
}

.share-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.share-amount {
  font-size: 15px;
  font-weight: 700;
  color: #1a1a1a;
  display: flex;
  align-items: center;
  gap: 6px;
}

.c-flag {
  font-size: 14px;
}

.share-pct {
  font-size: 13px;
  font-weight: 600;
  color: #8add5c;
  background: rgba(138, 221, 92, 0.15);
  padding: 4px 8px;
  border-radius: 8px;
  min-width: 44px;
  text-align: center;
}

/* Loading state */
.loading-state {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.skeleton-row {
  height: 28px;
  background: #f0f0f0;
  border-radius: 8px;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
}

```

## File: client/src/components/expenses/LiveConversionPanel.jsx
```javascript
import React from 'react';
import { convert, fmt } from '../../utils/currencyUtils';
import { getCurrencyFlag } from '../../constants/currencies';
import './LiveConversionPanel.css';

const LiveConversionPanel = ({ amount, fromCurrency, members, splitType, splitValues, rates, loading }) => {
  const numAmount = parseFloat(amount) || 0;

  const getMemberShare = (member) => {
    let rawShare = 0;
    let percentage = 0;

    if (splitType === 'equal') {
      percentage = 100 / members.length;
      rawShare = numAmount / members.length;
    } else if (splitType === 'percentage') {
       percentage = splitValues[member.id] || 0;
       rawShare = numAmount * (percentage / 100);
    } else if (splitType === 'exact') {
       rawShare = splitValues[member.id] || 0;
       percentage = numAmount > 0 ? (rawShare / numAmount) * 100 : 0;
    } else if (splitType === 'itemized') {
       rawShare = splitValues[member.id] || 0;
       percentage = numAmount > 0 ? (rawShare / numAmount) * 100 : 0;
    }

    const targetCurrency = member.homeCurrency || 'INR';
    const convertedShare = convert(rawShare, fromCurrency, targetCurrency, rates);

    return { convertedShare, targetCurrency, percentage };
  };

  if (loading) {
     return (
       <div className="live-panel loading-state">
         <div className="skeleton-row"></div>
         <div className="skeleton-row"></div>
       </div>
     );
  }

  // Handle reminder if percentages don't match 100 (for exact/percentage/itemized)
  // To keep it simple, the math above works per member.

  return (
    <div className="live-panel">
      <div className="live-panel-header">
         <span className="live-h-member">Member</span>
         <span className="live-h-share">Est. Share</span>
      </div>
      <div className="live-panel-list">
         {members.map((m) => {
            const { convertedShare, targetCurrency, percentage } = getMemberShare(m);
            return (
              <div key={m.id} className="live-row">
                 <div className="member-info">
                   <div className="member-avatar">
                     <img src={m.img || `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.name}`} alt="" />
                   </div>
                   <span className="member-name">{m.name}</span>
                 </div>
                 <div className="share-info">
                   <span className="share-amount">
                      <span className="c-flag">{getCurrencyFlag(targetCurrency)}</span>
                      {fmt(convertedShare, targetCurrency)}
                   </span>
                   <span className="share-pct">{percentage.toFixed(0)}%</span>
                 </div>
              </div>
            )
         })}
      </div>
    </div>
  );
};
export default LiveConversionPanel;

```

## File: client/src/components/expenses/PercentageSplit.jsx
```javascript
import React from 'react';
import './SmartSplit.css';

const PercentageSplit = ({ members, splitValues, onChange }) => {
  const totalPct = members.reduce((sum, m) => sum + (splitValues[m.id] || 0), 0);
  const isComplete = totalPct === 100;

  const handleSliderChange = (id, val) => {
    const newVal = parseInt(val, 10) || 0;
    onChange({ ...splitValues, [id]: newVal });
  };

  return (
    <div className="smart-split-container">
      <div className="split-status">
        <span style={{ color: isComplete ? '#8add5c' : '#ef4444', fontWeight: 'bold' }}>
          {totalPct}% 
        </span>
        <span style={{ color: '#999', fontSize: 13, marginLeft: 6 }}>
          {isComplete ? 'Perfectly split' : 'Must equal 100%'}
        </span>
      </div>
      
      {members.map(m => (
        <div key={m.id} className="split-input-row">
          <div className="split-member-info">
             <img src={m.img} alt={m.name} />
             <span>{m.name}</span>
          </div>
          <div className="slider-container">
             <input 
               type="range" 
               min="0" 
               max="100" 
               value={splitValues[m.id] || 0}
               onChange={(e) => handleSliderChange(m.id, e.target.value)}
             />
             <span className="slider-val">{splitValues[m.id] || 0}%</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PercentageSplit;

```

## File: client/src/components/expenses/SmartSplit.css
```css
.smart-split-container {
  margin-top: 16px;
  background: #ffffff;
  border: 1px solid #eeeeee;
  border-radius: 16px;
  padding: 16px;
}

.split-status {
  text-align: right;
  margin-bottom: 16px;
  font-size: 14px;
}

.split-input-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px dashed #f0f0f0;
}

.split-input-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.split-member-info {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;
  font-size: 14px;
  color: #1a1a1a;
}

.split-member-info img {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
}

.slider-container {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  max-width: 65%;
}

.slider-container input[type="range"] {
  flex: 1;
  accent-color: #8add5c;
  cursor: pointer;
}

.slider-val {
  min-width: 44px;
  text-align: right;
  font-weight: 700;
  font-size: 14px;
  color: #1a1a1a;
}

.amount-input-container {
  display: flex;
  align-items: center;
  background: #f5f5f5;
  border-radius: 8px;
  padding: 8px 12px;
  width: 130px;
}

.input-prefix {
  font-size: 14px;
  color: #5a5a5a;
  margin-right: 6px;
}

.smart-number-input {
  border: none;
  background: transparent;
  width: 100%;
  font-size: 14px;
  font-weight: 700;
  color: #1a1a1a;
  outline: none;
  text-align: right;
}

.smart-number-input::placeholder {
  color: #a0a0a0;
  font-weight: 500;
}

```

## File: client/src/components/expenses/SplitTypeSelector.css
```css
.split-type-selector {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-2);
  padding: var(--space-1);
  background: var(--bg-secondary);
  border-radius: var(--radius-xl);
  border: 1px solid var(--border-default);
}

.split-type-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-3) var(--space-2);
  border-radius: var(--radius-lg);
  transition: all var(--transition-base);
  color: var(--text-muted);
}

.split-type-btn:hover {
  color: var(--text-primary);
  background: var(--bg-card);
}

.split-type-active {
  background: var(--gradient-primary) !important;
  color: white !important;
  box-shadow: var(--shadow-glow);
}

.split-type-emoji {
  font-size: 1.2rem;
}

.split-type-label {
  font-size: var(--text-xs);
  font-weight: 600;
}

```

## File: client/src/components/expenses/SplitTypeSelector.jsx
```javascript
import './SplitTypeSelector.css';

const SPLIT_TYPES = [
  { id: 'equal', label: 'Equal', emoji: '⚖️', desc: 'Split evenly' },
  { id: 'percentage', label: 'Percent', emoji: '📊', desc: 'Custom %' },
  { id: 'exact', label: 'Exact', emoji: '✏️', desc: 'Fixed amounts' },
  { id: 'itemized', label: 'Itemized', emoji: '🧾', desc: 'Per item' },
];

const SplitTypeSelector = ({ selected, onSelect }) => {
  return (
    <div className="split-type-selector">
      {SPLIT_TYPES.map((type) => (
        <button
          key={type.id}
          className={`split-type-btn ${selected === type.id ? 'split-type-active' : ''}`}
          onClick={() => onSelect(type.id)}
        >
          <span className="split-type-emoji">{type.emoji}</span>
          <span className="split-type-label">{type.label}</span>
        </button>
      ))}
    </div>
  );
};

export default SplitTypeSelector;

```

## File: client/src/components/expenses/VibeTagPicker.css
```css
.vibe-tag-picker {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.vibe-tag-btn {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-full);
  background: var(--bg-card);
  border: 1px solid var(--border-default);
  transition: all var(--transition-fast);
  font-size: var(--text-sm);
}

.vibe-tag-btn:hover {
  border-color: var(--tag-color);
  background: color-mix(in srgb, var(--tag-color) 10%, transparent);
}

.vibe-tag-active {
  background: color-mix(in srgb, var(--tag-color) 20%, transparent) !important;
  border-color: var(--tag-color) !important;
  color: var(--tag-color);
  box-shadow: 0 0 12px color-mix(in srgb, var(--tag-color) 25%, transparent);
}

.vibe-tag-emoji {
  font-size: 1rem;
}

.vibe-tag-label {
  font-weight: 500;
}

```

## File: client/src/components/expenses/VibeTagPicker.jsx
```javascript
import vibeTags from '../../constants/vibeTags';
import './VibeTagPicker.css';

const VibeTagPicker = ({ selected, onSelect }) => {
  return (
    <div className="vibe-tag-picker">
      {vibeTags.map((tag) => (
        <button
          key={tag.id}
          className={`vibe-tag-btn ${selected === tag.id ? 'vibe-tag-active' : ''}`}
          style={{
            '--tag-color': tag.color,
          }}
          onClick={() => onSelect(tag.id)}
        >
          <span className="vibe-tag-emoji">{tag.emoji}</span>
          <span className="vibe-tag-label">{tag.label}</span>
        </button>
      ))}
    </div>
  );
};

export default VibeTagPicker;

```

## File: client/src/components/groups/AddFriendPanel.jsx
```javascript
import React, { useState } from "react";
import axios from "axios";
import PhoneInput from "./PhoneInput";
import UserSearchInput from "./UserSearchInput";

export default function AddFriendPanel({ inviterId, inviterName, onFriendAdded }) {
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [whatsappResult, setWhatsappResult] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleValidNumber = (num) => {
    setPhoneNumber(num);
    setErrorMsg("");
  };

  const addByPhone = async () => {
    if (!phoneNumber) return;
    setIsAdding(true);
    setErrorMsg("");

    try {
      const res = await axios.post("http://localhost:5000/api/invite/send", {
        phone: phoneNumber,
        inviterId,
        groupName: "SplitWave"
      });

      if (res.data.method === "whatsapp_deeplink") {
        setWhatsappResult(res.data);
        onFriendAdded({ id: Date.now(), name: `User ${phoneNumber}`, phone: phoneNumber });
      } else if (res.data.method === "direct") {
        alert("User exists and was added to your friends!");
        onFriendAdded({ id: res.data.user.id, name: res.data.user.name, phone: phoneNumber });
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to add friend. Try again later.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-white flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Add Friend by Mobile Number</label>
        <PhoneInput onValidNumber={handleValidNumber} errorMsg={errorMsg} />
        <button
          onClick={addByPhone}
          disabled={!phoneNumber || isAdding}
          className="mt-2 bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 transition disabled:opacity-50"
        >
          {isAdding ? "Adding..." : "Add Friend (Free First)"}
        </button>

        {whatsappResult && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex flex-col items-center gap-3">
            <h4 className="text-green-800 font-medium">Friend Added!</h4>
            <p className="text-sm text-green-700 text-center">
              We created a profile for them. You can send them this quick free WhatsApp link so they can download the app.
            </p>
            <a
              href={whatsappResult.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-full inline-flex items-center gap-2"
            >
              <span>💬</span> Send App Invite
            </a>
          </div>
        )}
      </div>

      <div className="flex items-center">
        <div className="flex-1 border-t border-gray-200"></div>
        <span className="px-4 text-xs text-gray-400 font-medium uppercase">OR</span>
        <div className="flex-1 border-t border-gray-200"></div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Search Existing SplitWave User</label>
        <UserSearchInput
          onUserSelected={(user) => {
            onFriendAdded(user);
          }}
        />
      </div>
    </div>
  );
}

```

## File: client/src/components/groups/AddMemberPanel.jsx
```javascript
import React, { useState } from "react";
import axios from "axios";
import PhoneInput from "./PhoneInput";
import UserSearchInput from "./UserSearchInput";
import InviteLinkButton from "./InviteLinkButton";

export default function AddMemberPanel({ groupId, inviterId, groupName, onMemberAdded }) {
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [whatsappResult, setWhatsappResult] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleValidNumber = (num) => {
    setPhoneNumber(num);
    setErrorMsg("");
  };

  const addByPhone = async () => {
    if (!phoneNumber) return;
    setIsAdding(true);
    setErrorMsg("");

    try {
      const res = await axios.post("http://localhost:5000/api/invite/send", {
        phone: phoneNumber,
        groupId,
        inviterId,
        groupName
      });

      if (res.data.method === "whatsapp_deeplink") {
        setWhatsappResult(res.data);
      } else if (res.data.method === "direct") {
        onMemberAdded();
        alert("User exists and was added instantly!");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to add user. Try again later.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm flex flex-col gap-6">
      <h2 className="font-semibold text-lg text-gray-800">Add Member</h2>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Add by Phone (Free Invite First)</label>
        <PhoneInput onValidNumber={handleValidNumber} errorMsg={errorMsg} />
        <button
          onClick={addByPhone}
          disabled={!phoneNumber || isAdding}
          className="mt-2 bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 transition disabled:opacity-50"
        >
          {isAdding ? "Adding..." : "Add via Phone"}
        </button>

        {whatsappResult && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex flex-col items-center gap-3">
            <h4 className="text-green-800 font-medium">Almost there!</h4>
            <p className="text-sm text-green-700 text-center">
              We created a profile for them. Send them the invite link via WhatsApp to finish.
            </p>
            <a
              href={whatsappResult.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-full inline-flex items-center gap-2"
            >
              <span>💬</span> Send WhatsApp Invite (Free)
            </a>
          </div>
        )}
      </div>

      <div className="flex items-center">
        <div className="flex-1 border-t border-gray-200"></div>
        <span className="px-4 text-xs text-gray-400 font-medium uppercase">OR</span>
        <div className="flex-1 border-t border-gray-200"></div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Search Existing SplitWave User</label>
        <UserSearchInput
          onUserSelected={async (user) => {
            // direct add logic placeholder ...
            alert(`Selected user: ${user.name}`);
            onMemberAdded();
          }}
        />
      </div>

      <div className="flex items-center">
        <div className="flex-1 border-t border-gray-200"></div>
        <span className="px-4 text-xs text-gray-400 font-medium uppercase">OR</span>
        <div className="flex-1 border-t border-gray-200"></div>
      </div>

      <div className="flex flex-col gap-2">
        <InviteLinkButton groupId={groupId} />
      </div>
    </div>
  );
}

```

## File: client/src/components/groups/GroupCard.css
```css
.group-card {
  padding: var(--space-5);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.group-card-header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.group-card-emoji {
  font-size: 2rem;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(99, 102, 241, 0.1);
  border-radius: var(--radius-lg);
  flex-shrink: 0;
}

.group-card-info {
  flex: 1;
  min-width: 0;
}

.group-card-name {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.group-card-meta {
  font-size: var(--text-xs);
  color: var(--text-muted);
}

.group-card-stats {
  display: flex;
  gap: var(--space-6);
}

.group-card-stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-label {
  font-size: var(--text-xs);
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-value {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 700;
}

.group-card-members {
  display: flex;
  align-items: center;
}

.group-card-avatar {
  margin-left: -8px;
  border: 2px solid var(--bg-card);
}

.group-card-avatar:first-child {
  margin-left: 0;
}

.group-card-more {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--bg-elevated);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--text-secondary);
  margin-left: -8px;
  border: 2px solid var(--bg-card);
}

```

## File: client/src/components/groups/GroupCard.jsx
```javascript
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import { fmt } from '../../utils/currencyUtils';
import { timeAgo } from '../../utils/dateUtils';
import './GroupCard.css';

const GroupCard = ({ group, onClick }) => {
  const { name, emoji, baseCurrency, members, totalSpent, pendingSettlements, createdAt } = group;

  return (
    <div className="group-card glass-card" onClick={onClick} id={`group-card-${group.id}`}>
      <div className="group-card-header">
        <div className="group-card-emoji">{emoji || '👥'}</div>
        <div className="group-card-info">
          <h3 className="group-card-name">{name}</h3>
          <span className="group-card-meta">
            {members.length} members • {timeAgo(createdAt)}
          </span>
        </div>
        {pendingSettlements > 0 && (
          <Badge variant="warning">{pendingSettlements} pending</Badge>
        )}
      </div>

      <div className="group-card-stats">
        <div className="group-card-stat">
          <span className="stat-label">Total Spent</span>
          <span className="stat-value gradient-text">{fmt(totalSpent, baseCurrency)}</span>
        </div>
      </div>

      <div className="group-card-members">
        {members.slice(0, 5).map((member, i) => (
          <Avatar
            key={member.id}
            name={member.name}
            size={32}
            className="group-card-avatar"
          />
        ))}
        {members.length > 5 && (
          <div className="group-card-more">+{members.length - 5}</div>
        )}
      </div>
    </div>
  );
};

export default GroupCard;

```

## File: client/src/components/groups/GroupForm.css
```css
.group-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.group-form-emoji-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.emoji-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: var(--space-2);
}

.emoji-btn {
  width: 100%;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  border-radius: var(--radius-lg);
  background: var(--bg-card);
  border: 2px solid transparent;
  transition: all var(--transition-fast);
}

.emoji-btn:hover {
  background: var(--bg-card-hover);
  transform: scale(1.1);
}

.emoji-btn-active {
  border-color: var(--primary-500);
  background: rgba(99, 102, 241, 0.15);
  box-shadow: var(--shadow-glow);
}

.group-form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  padding-top: var(--space-4);
  border-top: 1px solid var(--border-default);
}

```

## File: client/src/components/groups/GroupForm.jsx
```javascript
import { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import './GroupForm.css';

const EMOJIS = ['🏖️', '🏠', '🍱', '✈️', '🎉', '💼', '🎮', '🏕️', '🎓', '🍕', '🚗', '💒'];

const GroupForm = ({ onSubmit, onCancel, initialData = {} }) => {
  const [name, setName] = useState(initialData.name || '');
  const [emoji, setEmoji] = useState(initialData.emoji || '👥');
  const [baseCurrency, setBaseCurrency] = useState(initialData.baseCurrency || 'INR');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), emoji, baseCurrency });
  };

  return (
    <form className="group-form" onSubmit={handleSubmit}>
      <div className="group-form-emoji-section">
        <label className="input-label">Pick an emoji</label>
        <div className="emoji-grid">
          {EMOJIS.map((e) => (
            <button
              key={e}
              type="button"
              className={`emoji-btn ${emoji === e ? 'emoji-btn-active' : ''}`}
              onClick={() => setEmoji(e)}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      <Input
        id="group-name"
        label="Group Name"
        placeholder="e.g., Goa Trip 2026"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <div className="input-group">
        <label className="input-label" htmlFor="base-currency">Base Currency</label>
        <select
          id="base-currency"
          className="input-field"
          value={baseCurrency}
          onChange={(e) => setBaseCurrency(e.target.value)}
        >
          <option value="INR">🇮🇳 INR — Indian Rupee</option>
          <option value="USD">🇺🇸 USD — US Dollar</option>
          <option value="EUR">🇪🇺 EUR — Euro</option>
          <option value="GBP">🇬🇧 GBP — British Pound</option>
        </select>
      </div>

      <div className="group-form-actions">
        {onCancel && (
          <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        )}
        <Button variant="primary" type="submit">
          {initialData.id ? 'Save Changes' : 'Create Group'}
        </Button>
      </div>
    </form>
  );
};

export default GroupForm;

```

## File: client/src/components/groups/GroupStats.css
```css
.group-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-4);
}

.group-stat-card {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4);
  background: var(--bg-glass);
  backdrop-filter: blur(12px);
  border: 1px solid var(--bg-glass-border);
  border-radius: var(--radius-xl);
}

.group-stat-icon {
  font-size: 1.5rem;
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(99, 102, 241, 0.1);
  border-radius: var(--radius-lg);
}

.group-stat-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.group-stat-value {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 700;
}

.group-stat-label {
  font-size: var(--text-xs);
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

@media (max-width: 640px) {
  .group-stats {
    grid-template-columns: 1fr;
  }
}

```

## File: client/src/components/groups/GroupStats.jsx
```javascript
import { fmt } from '../../utils/currencyUtils';
import './GroupStats.css';

const GroupStats = ({ group }) => {
  const { totalSpent, members, pendingSettlements, baseCurrency } = group;
  const perPerson = totalSpent / (members.length || 1);

  return (
    <div className="group-stats">
      <div className="group-stat-card">
        <span className="group-stat-icon">💰</span>
        <div className="group-stat-info">
          <span className="group-stat-value gradient-text">{fmt(totalSpent, baseCurrency)}</span>
          <span className="group-stat-label">Total Spent</span>
        </div>
      </div>
      <div className="group-stat-card">
        <span className="group-stat-icon">👤</span>
        <div className="group-stat-info">
          <span className="group-stat-value">{fmt(perPerson, baseCurrency)}</span>
          <span className="group-stat-label">Per Person</span>
        </div>
      </div>
      <div className="group-stat-card">
        <span className="group-stat-icon">⏳</span>
        <div className="group-stat-info">
          <span className="group-stat-value" style={{ color: pendingSettlements > 0 ? 'var(--warning)' : 'var(--success)' }}>
            {pendingSettlements}
          </span>
          <span className="group-stat-label">Pending</span>
        </div>
      </div>
    </div>
  );
};

export default GroupStats;

```

## File: client/src/components/groups/InviteLinkButton.jsx
```javascript
import React, { useState } from "react";

export default function InviteLinkButton({ groupId }) {
  const [copied, setCopied] = useState(false);
  const inviteLink = `${window.location.origin}/join/${groupId}`; // Basic link

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join my group on SplitWave",
          text: "I added you to a group on SplitWave. Join here to view your expenses!",
          url: inviteLink,
        });
      } catch (err) {
        console.error("Error sharing", err);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50 flex flex-col items-center text-center">
      <h3 className="text-sm font-semibold mb-2">Share Invite Link</h3>
      <p className="text-xs text-gray-500 mb-4">
        Send this link to someone so they can join the group directly.
      </p>
      <div className="flex items-center gap-2 w-full max-w-sm">
        <input
          type="text"
          readOnly
          value={inviteLink}
          className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none bg-white"
        />
        <button
          onClick={handleCopy}
          className="px-4 py-2 bg-gray-800 text-white text-xs font-medium rounded hover:bg-gray-700 transition"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      {navigator.share && (
        <button
          onClick={handleShare}
          className="mt-3 px-4 py-2 w-full max-w-sm bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition flex items-center justify-center gap-2"
        >
          Share via App
        </button>
      )}
    </div>
  );
}

```

## File: client/src/components/groups/MemberChip.css
```css
.member-chip {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-1) var(--space-3) var(--space-1) var(--space-1);
  background: var(--bg-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  transition: all var(--transition-fast);
}

.member-chip:hover {
  border-color: var(--primary-700);
}

.member-chip-name {
  font-weight: 500;
  white-space: nowrap;
}

.member-chip-remove {
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: var(--text-muted);
  font-size: 10px;
  transition: all var(--transition-fast);
  margin-left: var(--space-1);
}

.member-chip-remove:hover {
  background: var(--error);
  color: white;
}

```

## File: client/src/components/groups/MemberChip.jsx
```javascript
import Avatar from '../common/Avatar';
import './MemberChip.css';

const MemberChip = ({ member, removable = false, onRemove }) => {
  return (
    <div className="member-chip">
      <Avatar name={member.name} size={24} />
      <span className="member-chip-name">{member.name}</span>
      {removable && (
        <button className="member-chip-remove" onClick={() => onRemove(member.id)}>
          ✕
        </button>
      )}
    </div>
  );
};

export default MemberChip;

```

## File: client/src/components/groups/MemberList.css
```css
.member-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.member-list-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-lg);
  transition: background var(--transition-fast);
}

.member-list-item:hover {
  background: var(--bg-card);
}

.member-list-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.member-list-name {
  font-weight: 600;
  font-size: var(--text-sm);
}

.member-list-email {
  font-size: var(--text-xs);
  color: var(--text-muted);
}

.member-remove-btn {
  font-size: var(--text-xs);
  color: var(--error);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.member-remove-btn:hover {
  background: rgba(239, 68, 68, 0.1);
}

```

## File: client/src/components/groups/MemberList.jsx
```javascript
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import './MemberList.css';

const MemberList = ({ members, onRemove }) => {
  return (
    <div className="member-list">
      {members.map((member) => (
        <div key={member.id} className="member-list-item">
          <Avatar name={member.name} size={36} />
          <div className="member-list-info">
            <span className="member-list-name">{member.name}</span>
            <span className="member-list-email">{member.email}</span>
          </div>
          {member.role === 'admin' && <Badge variant="primary">Admin</Badge>}
          {onRemove && member.role !== 'admin' && (
            <button className="member-remove-btn" onClick={() => onRemove(member.id)}>
              Remove
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default MemberList;

```

## File: client/src/components/groups/PhoneInput.jsx
```javascript
import React, { useState, useEffect } from "react";
import { parsePhoneNumberFromString } from "libphonenumber-js";

const COUNTRIES = [
  { flag: "🇮🇳", name: "India", code: "+91", iso: "IN" },
  { flag: "🇦🇪", name: "UAE", code: "+971", iso: "AE" },
  { flag: "🇺🇸", name: "USA", code: "+1", iso: "US" },
  { flag: "🇬🇧", name: "UK", code: "+44", iso: "GB" },
  { flag: "🇸🇬", name: "Singapore", code: "+65", iso: "SG" },
  { flag: "🇦🇺", name: "Australia", code: "+61", iso: "AU" },
  { flag: "🇨🇦", name: "Canada", code: "+1", iso: "CA" },
  { flag: "🇩🇪", name: "Germany", code: "+49", iso: "DE" },
  { flag: "🇯🇵", name: "Japan", code: "+81", iso: "JP" },
  { flag: "🇫🇷", name: "France", code: "+33", iso: "FR" },
  { flag: "🇮🇹", name: "Italy", code: "+39", iso: "IT" },
  { flag: "🇧🇷", name: "Brazil", code: "+55", iso: "BR" },
  { flag: "🇲🇾", name: "Malaysia", code: "+60", iso: "MY" },
  { flag: "🇹🇭", name: "Thailand", code: "+66", iso: "TH" },
  { flag: "🇿🇦", name: "South Africa", code: "+27", iso: "ZA" },
  { flag: "🇳🇿", name: "New Zealand", code: "+64", iso: "NZ" },
  { flag: "🇳🇱", name: "Netherlands", code: "+31", iso: "NL" },
  { flag: "🇵🇭", name: "Philippines", code: "+63", iso: "PH" },
  { flag: "🇮🇩", name: "Indonesia", code: "+62", iso: "ID" },
  { flag: "🇵🇰", name: "Pakistan", code: "+92", iso: "PK" },
];

export default function PhoneInput({ onValidNumber, errorMsg }) {
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [inputValue, setInputValue] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [formattedNumber, setFormattedNumber] = useState("");
  const [internalError, setInternalError] = useState("");

  const handleChange = (e) => {
    const rawVal = e.target.value;
    setInputValue(rawVal);
    validate(rawVal, selectedCountry.iso);
  };

  const handleCountryChange = (e) => {
    const iso = e.target.value;
    const country = COUNTRIES.find((c) => c.iso === iso);
    setSelectedCountry(country);
    validate(inputValue, country.iso);
  };

  const validate = (value, iso) => {
    if (!value) {
      setIsValid(false);
      setInternalError("");
      setFormattedNumber("");
      onValidNumber(null);
      return;
    }

    try {
      const phone = parsePhoneNumberFromString(value, iso);
      if (phone && phone.isValid()) {
        setIsValid(true);
        setInternalError("");
        setFormattedNumber(phone.formatInternational());
        onValidNumber(phone.number); // E.164 format
      } else {
        setIsValid(false);
        setInternalError("Invalid phone number for selected country");
        setFormattedNumber("");
        onValidNumber(null);
      }
    } catch (err) {
      setIsValid(false);
      setInternalError("Invalid phone number format");
      onValidNumber(null);
    }
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex rounded-md shadow-sm">
        <select
          value={selectedCountry.iso}
          onChange={handleCountryChange}
          className="flex-shrink-0 bg-gray-50 border border-gray-300 text-gray-900 rounded-l-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 max-w-[120px]"
        >
          {COUNTRIES.map((c) => (
            <option key={c.iso} value={c.iso}>
              {c.flag} {c.code}
            </option>
          ))}
        </select>
        <div className="relative flex-grow flex items-stretch focus-within:z-10">
          <input
            type="tel"
            value={inputValue}
            onChange={handleChange}
            placeholder="Phone number"
            className="block w-full border border-l-0 border-gray-300 rounded-r-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          {isValid && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-green-500 text-lg">✓</span>
            </div>
          )}
        </div>
      </div>
      {formattedNumber && isValid && (
        <p className="text-xs text-green-600 mt-1">Formatted: {formattedNumber}</p>
      )}
      {(internalError || errorMsg) && inputValue.length > 0 && !isValid && (
        <p className="text-xs text-red-600 mt-1">{errorMsg || internalError}</p>
      )}
    </div>
  );
}

```

## File: client/src/components/groups/UserSearchInput.jsx
```javascript
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function UserSearchInput({ onUserSelected }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let timeoutId;
    if (query.length >= 2) {
      setLoading(true);
      timeoutId = setTimeout(async () => {
        try {
          const res = await axios.get(`http://localhost:5000/api/users/search?q=${query}`);
          setResults(res.data);
        } catch (err) {
          console.error("Error searching users:", err);
        } finally {
          setLoading(false);
        }
      }, 300); // 300ms debounce
    } else {
      setResults([]);
    }

    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search by name or email"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
      />
      {loading && <div className="absolute top-10 right-3 text-xs text-gray-400">Loading...</div>}
      
      {results.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
          {results.map((r) => (
            <li
              key={r.id}
              onClick={() => {
                onUserSelected(r);
                setQuery("");
                setResults([]);
              }}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm flex gap-3 items-center"
            >
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                {r.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-gray-900">{r.name}</span>
                <span className="text-xs text-gray-500">{r.email}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

```

## File: client/src/config/firebase.js
```javascript
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

let app, auth, googleProvider;

// Only initialize if keys are configured. Otherwise fall back to Development Mock Mode.
if (firebaseConfig.apiKey && !firebaseConfig.apiKey.includes('your_')) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
}

export { auth, googleProvider };

```

## File: client/src/constants/currencies.js
```javascript
// All supported currencies with metadata
const currencies = [
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳', decimals: 2 },
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸', decimals: 2 },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺', decimals: 2 },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧', decimals: 2 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵', decimals: 0 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺', decimals: 2 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦', decimals: 2 },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭', decimals: 2 },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳', decimals: 2 },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬', decimals: 2 },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', flag: '🇦🇪', decimals: 2 },
  { code: 'THB', name: 'Thai Baht', symbol: '฿', flag: '🇹🇭', decimals: 2 },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', flag: '🇲🇾', decimals: 2 },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', flag: '🇰🇷', decimals: 0 },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷', decimals: 2 },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', flag: '🇿🇦', decimals: 2 },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', flag: '🇸🇪', decimals: 2 },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', flag: '🇳🇿', decimals: 2 },
  { code: 'MXN', name: 'Mexican Peso', symbol: 'Mex$', flag: '🇲🇽', decimals: 2 },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', flag: '🇭🇰', decimals: 2 },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', flag: '🇳🇴', decimals: 2 },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr', flag: '🇩🇰', decimals: 2 },
  { code: 'PHP', name: 'Philippine Peso', symbol: '₱', flag: '🇵🇭', decimals: 2 },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', flag: '🇮🇩', decimals: 0 },
  { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼', flag: '🇸🇦', decimals: 2 },
  { code: 'TWD', name: 'Taiwan Dollar', symbol: 'NT$', flag: '🇹🇼', decimals: 0 },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺', flag: '🇹🇷', decimals: 2 },
  { code: 'PLN', name: 'Polish Złoty', symbol: 'zł', flag: '🇵🇱', decimals: 2 },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽', flag: '🇷🇺', decimals: 2 },
  { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč', flag: '🇨🇿', decimals: 2 },
];

export const getCurrency = (code) => currencies.find((c) => c.code === code);

export const getCurrencySymbol = (code) => {
  const c = getCurrency(code);
  return c ? c.symbol : code;
};

export const getCurrencyFlag = (code) => {
  const c = getCurrency(code);
  return c ? c.flag : '🏳️';
};

export default currencies;

```

## File: client/src/constants/nudgeTones.js
```javascript
// Nudge message templates per tone
const nudgeTones = {
  gentle: {
    id: 'gentle',
    label: 'Gentle',
    emoji: '😊',
    color: '#06d6a0',
    template: 'Hey {name}! Just a friendly reminder — you owe {amount}. No rush 😊',
    description: 'A soft, friendly nudge',
  },
  firm: {
    id: 'firm',
    label: 'Firm',
    emoji: '📢',
    color: '#f59e0b',
    template: 'Hi {name}, please settle your share of {amount} when you can.',
    description: 'Direct and professional',
  },
  savage: {
    id: 'savage',
    label: 'Savage',
    emoji: '👀',
    color: '#ef4444',
    template: '{name}. {amount}. Still waiting. You know who you are. 👀',
    description: 'No mercy',
  },
};

export const formatNudge = (tone, name, amount) => {
  const t = nudgeTones[tone];
  if (!t) return '';
  return t.template.replace('{name}', name).replace(/\{amount\}/g, amount);
};

export default nudgeTones;

```

## File: client/src/constants/personalities.js
```javascript
// Spending personality definitions + thresholds
const personalities = [
  {
    id: 'foodie',
    label: 'The Foodie',
    emoji: '🍕',
    tag: 'food',
    threshold: 40,
    description: 'You never miss a meal — or a chance to split the bill!',
    color: '#f97316',
  },
  {
    id: 'party-starter',
    label: 'The Party Starter',
    emoji: '🍺',
    tag: 'drinks',
    threshold: 35,
    description: 'First to order, last to leave. Legendary.',
    color: '#8b5cf6',
  },
  {
    id: 'uber-caller',
    label: 'The Uber Caller',
    emoji: '🚗',
    tag: 'travel',
    threshold: 40,
    description: 'Always on the move — and always splitting the ride.',
    color: '#3b82f6',
  },
  {
    id: 'adventurer',
    label: 'The Adventurer',
    emoji: '🎡',
    tag: 'fun',
    threshold: 40,
    description: 'Life is short. Your expense list is long.',
    color: '#06d6a0',
  },
  {
    id: 'comfort-royalty',
    label: 'Comfort King/Queen',
    emoji: '🛏️',
    tag: 'stay',
    threshold: 40,
    description: 'Only the finest Airbnbs and hotel rooms for you.',
    color: '#ec4899',
  },
  {
    id: 'balanced',
    label: 'The Balanced One',
    emoji: '⚖️',
    tag: null,
    threshold: null,
    description: 'A true adult. You spread your spending evenly. Respect.',
    color: '#64748b',
  },
];

export const getPersonality = (id) => personalities.find((p) => p.id === id);

export default personalities;

```

## File: client/src/constants/vibeTags.js
```javascript
// Vibe tags for categorizing expenses
const vibeTags = [
  { id: 'food',   label: 'Food',    emoji: '🍕', color: '#f97316' },
  { id: 'drinks', label: 'Drinks',  emoji: '🍺', color: '#8b5cf6' },
  { id: 'travel', label: 'Travel',  emoji: '🚗', color: '#3b82f6' },
  { id: 'fun',    label: 'Fun',     emoji: '🎡', color: '#06d6a0' },
  { id: 'stay',   label: 'Stay',    emoji: '🛏️', color: '#ec4899' },
  { id: 'shop',   label: 'Shopping', emoji: '🛍️', color: '#f59e0b' },
  { id: 'bills',  label: 'Bills',   emoji: '📄', color: '#64748b' },
  { id: 'other',  label: 'Other',   emoji: '✨', color: '#94a3b8' },
];

export const getVibeTag = (id) => vibeTags.find((t) => t.id === id);

export const getVibeColor = (id) => {
  const tag = getVibeTag(id);
  return tag ? tag.color : '#94a3b8';
};

export default vibeTags;

```

## File: client/src/context/AuthContext.jsx
```javascript
import { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider } from '../config/firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          const token = await firebaseUser.getIdToken();
          localStorage.setItem('authToken', token);
          
          try {
            const res = await api.post('/auth/login', {
              email: firebaseUser.email,
              name: firebaseUser.displayName,
              phone: firebaseUser.phoneNumber,
              token
            });
            setUser(res.data.user);
          } catch (err) {
            console.error('API Sync Error:', err);
            setUser(null);
          }
        } else {
          setUser(null);
          localStorage.removeItem('authToken');
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      // MOCK DEV MODE
      const mockLogin = async () => {
        const token = localStorage.getItem('authToken');
        if (token === 'mock-dev-token') {
          try {
            const res = await api.post('/auth/login', {
              email: 'you@example.com',
              name: 'Demo User',
              token: 'mock-dev-token'
            });
            setUser(res.data.user);
          } catch (err) {
            console.error(err);
            setUser(null);
          }
        }
        setLoading(false);
      };
      mockLogin();
    }
  }, []);

  const loginWithGoogle = async () => {
    if (auth) {
      await signInWithPopup(auth, googleProvider);
    } else {
      // Mock login handling
      localStorage.setItem('authToken', 'mock-dev-token');
      const res = await api.post('/auth/login', {
        email: 'you@example.com',
        name: 'Demo User',
        token: 'mock-dev-token'
      });
      setUser(res.data.user);
    }
  };

  const performLogout = async () => {
    if (auth) {
      await signOut(auth);
    }
    setUser(null);
    localStorage.removeItem('authToken');
  };

  const updateUser = (data) => setUser((prev) => ({ ...prev, ...data }));

  return (
    <AuthContext.Provider value={{ user, loading, login: loginWithGoogle, logout: performLogout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export default AuthContext;

```

## File: client/src/context/CurrencyContext.jsx
```javascript
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const CurrencyContext = createContext(null);

export const CurrencyProvider = ({ children }) => {
  const [rates, setRates] = useState({});
  const [homeCurrency, setHomeCurrency] = useState('INR');
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchRates = async (base = 'INR') => {
    setLoading(true);
    try {
      const response = await api.get(`/currency/rates?base=${base}`);
      setRates(response.data?.rates || {});
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch rates:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  return (
    <CurrencyContext.Provider
      value={{ rates, homeCurrency, setHomeCurrency, loading, lastUpdated, fetchRates }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error('useCurrency must be used within a CurrencyProvider');
  return context;
};

export default CurrencyContext;

```

## File: client/src/context/GroupContext.jsx
```javascript
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const GroupContext = createContext(null);

export const GroupProvider = ({ children }) => {
  const [groups, setGroups] = useState([]);
  const [activeGroup, setActiveGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchGroups();
    } else {
      setGroups([]);
      setActiveGroup(null);
      setLoading(false);
    }
  }, [user]);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const res = await api.get('/groups');
      setGroups(res.data || []);
    } catch (err) {
      console.error('Failed to fetch groups', err);
    } finally {
      setLoading(false);
    }
  };

  const createGroup = async (data) => {
    try {
      const res = await api.post('/groups', data);
      setGroups((prev) => [res.data, ...prev]);
      return res.data;
    } catch (err) {
      console.error('Failed to create group', err);
      throw err;
    }
  };

  const updateGroup = async (id, data) => {
    // Implement API call later when endpoints exist
    setGroups((prev) => prev.map((g) => (g.id === id ? { ...g, ...data } : g)));
  };

  const deleteGroup = async (id) => {
    // Implement API call later when endpoints exist
    setGroups((prev) => prev.filter((g) => g.id !== id));
  };

  const selectGroup = (id) => {
    const group = groups.find((g) => g.id === id);
    setActiveGroup(group || null);
  };

  return (
    <GroupContext.Provider
      value={{
        groups,
        activeGroup,
        loading,
        createGroup,
        updateGroup,
        deleteGroup,
        selectGroup,
        setActiveGroup,
        fetchGroups,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
};

export const useGroups = () => {
  const context = useContext(GroupContext);
  if (!context) throw new Error('useGroups must be used within a GroupProvider');
  return context;
};

export default GroupContext;

```

## File: client/src/main.jsx
```javascript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

```

## File: client/src/pages/AddExpense.css
```css
.add-container {
  padding: 24px;
  background: #ffffff;
  min-height: 100vh;
  max-width: 480px;
  margin: 0 auto;
  font-family: 'Inter', sans-serif;
  color: #1a1a1a;
  display: flex;
  flex-direction: column;
}

.add-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.add-header h2 {
  font-size: 18px;
  font-weight: 700;
}

.form-content {
  flex: 1;
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 12px;
}

.full-input {
  width: 100%;
  padding: 16px 20px;
  background: #f5f5f5;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-family: inherit;
  color: #1a1a1a;
}

.full-input::placeholder {
  color: #1a1a1a;
}

.select-input {
  width: 100%;
  padding: 16px 20px;
  background: #f5f5f5;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 15px;
  cursor: pointer;
}
.select-val { font-weight: 600; }
.arrow { color: #5a5a5a; font-size: 20px; }

.split-avatars {
  display: flex;
  gap: 20px;
}

.avatar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.avatar {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: #f5f5f5;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e0e0e0;
}
.avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.add-friend-btn {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: transparent;
  border: 1px dashed #737373;
  font-size: 24px;
  color: #1a1a1a;
  cursor: pointer;
}

.avatar-item span {
  font-size: 12px;
  font-weight: 600;
  color: #1a1a1a;
}

.check-badge {
  position: absolute;
  bottom: -4px;
  right: -4px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #ef4444; /* red as fallback */
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  border: 2px solid #fff;
}
.check-badge:not(.text-red) {
  background: #1a1a1a;
}

.label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.label-row label {
  margin: 0;
}

.add-img-btn {
  font-size: 13px;
  color: #737373;
  background: none;
  font-weight: 500;
  border: none;
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}

.add-new-item-btn {
  width: 100%;
  padding: 16px;
  background: transparent;
  border: 1px solid #dcdcdc;
  border-radius: 100px;
  font-weight: 600;
  margin-bottom: 32px;
  font-size: 15px;
  cursor: pointer;
  color: #1a1a1a;
}

.add-summary {
  margin-top: 16px;
  border-top: 1px solid #f0f0f0;
  padding-top: 24px;
}

.add-summary h3 {
  font-size: 16px;
  margin-bottom: 16px;
  font-weight: 700;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.summary-label {
  font-size: 15px;
  font-weight: 600;
  color: #1a1a1a;
}

.summary-value {
  font-size: 18px;
  font-weight: 800;
}

.split-action-btn {
  width: 100%;
  padding: 18px;
  background: #8add5c;
  color: #1a1a1a;
  border-radius: 100px;
  font-weight: 700;
  font-size: 16px;
  border: none;
  cursor: pointer;
}

.split-type-tabs {
  display: flex;
  background: #f5f5f5;
  border-radius: 12px;
  padding: 4px;
}

.split-type-tabs button {
  flex: 1;
  padding: 12px 0;
  border: none;
  background: transparent;
  font-weight: 600;
  font-size: 14px;
  color: #5a5a5a;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.split-type-tabs button.active {
  background: #ffffff;
  color: #1a1a1a;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

```

## File: client/src/pages/AddExpense.jsx
```javascript
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';
import { useGroups } from '../context/GroupContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import CurrencySelector from '../components/currency/CurrencySelector';
import LiveConversionPanel from '../components/expenses/LiveConversionPanel';
import PercentageSplit from '../components/expenses/PercentageSplit';
import ExactSplit from '../components/expenses/ExactSplit';
import AddMemberPanel from '../components/groups/AddMemberPanel';
import Modal from '../components/common/Modal';
import './AddExpense.css';

const AddExpense = () => {
  const navigate = useNavigate();
  const { rates, loading: ratesLoading } = useCurrency();
  const { groups, fetchGroups } = useGroups();
  const { user } = useAuth();

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [splitType, setSplitType] = useState('equal');
  const [splitValues, setSplitValues] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);

  // 1. Target a real group (use the first one available for the generic + button)
  const targetGroup = groups && groups.length > 0 ? groups[0] : null;
  
  // 2. Map real members from the database to UI objects featuring demo international currencies
  const uiMembers = targetGroup ? targetGroup.members.map((gm, idx) => ({
    id: gm.user.id,
    name: gm.user.name,
    img: `https://api.dicebear.com/7.x/avataaars/svg?seed=${gm.user.name}`,
    homeCurrency: ['INR', 'USD', 'GBP', 'EUR', 'JPY'][idx % 5]
  })) : [];

  useEffect(() => {
    if (splitType === 'percentage' && uiMembers.length > 0) {
       const mockVals = {};
       const portion = Math.floor(100 / uiMembers.length);
       uiMembers.forEach(m => mockVals[m.id] = portion);
       if (uiMembers.length > 0) mockVals[uiMembers[0].id] += (100 - (portion * uiMembers.length)); 
       setSplitValues(mockVals);
    } else if (splitType === 'exact' && uiMembers.length > 0) {
       const mockVals = {};
       const numAmount = parseFloat(amount) || 0;
       const portion = numAmount / uiMembers.length;
       uiMembers.forEach(m => mockVals[m.id] = portion);
       setSplitValues(mockVals);
    } else {
       setSplitValues({});
    }
  }, [splitType]);

  const handleSplitBill = async () => {
    if (!amount || parseFloat(amount) <= 0) return alert('Please enter a valid amount');
    if (!description.trim()) return alert('Please enter a bill name');
    if (!targetGroup) return alert('No active group found. Please create a group first.');

    const numAmount = parseFloat(amount);
    let splitsArray = [];

    uiMembers.forEach((rm) => {
      let rawShare = 0;
      if (splitType === 'equal') {
        rawShare = numAmount / uiMembers.length;
      } else if (splitType === 'percentage') {
         const pct = splitValues[rm.id] || 0;
         rawShare = numAmount * (pct / 100);
      } else if (splitType === 'exact' || splitType === 'itemized') {
         rawShare = splitValues[rm.id] || 0;
      }
      splitsArray.push({
         userId: rm.id,
         amount: rawShare
      });
    });

    try {
      setSubmitting(true);
      await api.post('/expenses', {
        groupId: targetGroup.id,
        description,
        amount: numAmount,
        currency,
        payerId: user.id,
        splitType,
        splits: splitsArray
      });
      await fetchGroups(); // Trigger global refresh 
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Failed to submit expense. Check console.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="add-container">
      <header className="add-header">
        <button className="icon-btn" onClick={() => navigate(-1)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"></path></svg>
        </button>
        <h2>Split The Bill</h2>
        {targetGroup && (
          <button className="icon-btn" style={{fontSize: 14, color: '#4f46e5', fontWeight: 'bold'}} onClick={() => setShowAddMember(true)}>
            + Add Person
          </button>
        )}
      </header>

      <div className="form-content">
        <div className="form-group">
          <label>Bill Name</label>
          <input 
            type="text" 
            className="full-input" 
            placeholder="Dinner at Marios" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="form-group inline-flex-row" style={{ display: 'flex', gap: '12px' }}>
          <div style={{ flex: 1 }}>
            <label>Amount</label>
            <input 
              type="number" 
              className="full-input" 
              placeholder="0.00" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div>
            <label>Currency</label>
            <CurrencySelector value={currency} onChange={setCurrency} />
          </div>
        </div>

        <LiveConversionPanel 
          amount={amount} 
          fromCurrency={currency} 
          members={uiMembers} 
          splitType={splitType} 
          splitValues={splitValues} 
          rates={rates} 
          loading={ratesLoading} 
        />

        <div className="form-group" style={{ marginTop: 32 }}>
          <label>Split Rules</label>
          <div className="split-type-tabs">
            <button className={splitType === 'equal' ? 'active' : ''} onClick={() => setSplitType('equal')}>Equal</button>
            <button className={splitType === 'percentage' ? 'active' : ''} onClick={() => setSplitType('percentage')}>%</button>
            <button className={splitType === 'exact' ? 'active' : ''} onClick={() => setSplitType('exact')}>Exact</button>
            <button className={splitType === 'itemized' ? 'active' : ''} onClick={() => setSplitType('itemized')}>Items</button>
          </div>
          
          {splitType === 'percentage' && (
            <PercentageSplit 
              members={uiMembers} 
              splitValues={splitValues} 
              onChange={setSplitValues} 
            />
          )}

          {splitType === 'exact' && (
            <ExactSplit 
              members={uiMembers} 
              splitValues={splitValues} 
              onChange={setSplitValues} 
              totalAmount={amount} 
              currencyCode={currency} 
            />
          )}
        </div>
      </div>

      <div className="add-summary">
        <button 
          className="split-action-btn" 
          onClick={handleSplitBill}
          disabled={submitting || !targetGroup}
        >
          {submitting ? 'Splitting...' : (targetGroup ? 'Split Bill' : 'Need a group first')}
        </button>
      </div>

      <Modal isOpen={showAddMember} onClose={() => setShowAddMember(false)} title="Add Person to Bill" size="lg">
        <AddMemberPanel 
          groupId={targetGroup?.id} 
          inviterId={user?.id} 
          groupName={targetGroup?.name || "Group"} 
          onMemberAdded={async () => {
            setShowAddMember(false);
            await fetchGroups(); // refresh groups to pull new member
          }} 
        />
      </Modal>
    </div>
  );
};
export default AddExpense;

```

## File: client/src/pages/CurrencyPage.css
```css
.currency-container {
  padding: 24px;
  background: #ffffff;
  min-height: 100vh;
  max-width: 480px;
  margin: 0 auto;
  font-family: 'Inter', sans-serif;
  color: #1a1a1a;
  display: flex;
  flex-direction: column;
}

.converter-card {
  background: #f5f5f5;
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 24px;
}

.card-title {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
}

.card-title span {
  color: #5a5a5a;
  font-weight: 500;
  font-size: 14px;
}

.input-row {
  display: flex;
  gap: 12px;
}

.amount-group {
  flex: 1;
}

.amount-group label, .currency-select-group label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #5a5a5a;
  margin-bottom: 8px;
}

.amount-group input {
  width: 100%;
  padding: 14px 16px;
  background: #e0e0e0;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
}

.currency-select-group {
  width: 105px;
}

.custom-select {
  display: flex;
  align-items: center;
  background: #e0e0e0;
  border-radius: 12px;
  padding: 0 12px;
  height: 48px;
}

.custom-select .flag {
  font-size: 18px;
  margin-right: 4px;
}

.custom-select select {
  background: transparent;
  border: none;
  font-weight: 700;
  font-size: 15px;
  color: #1a1a1a;
  width: 100%;
  padding-right: 4px;
  appearance: none;
  cursor: pointer;
}

.swap-container {
  display: flex;
  justify-content: center;
  margin: -12px 0;
  position: relative;
  z-index: 2;
}

.swap-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #1a1a1a;
  color: #fff;
  border: 4px solid #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.converted-box {
  background: #ffffff;
  border-radius: 12px;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.converted-val {
  font-size: 18px;
  font-weight: 800;
  color: #1a1a1a;
}

.rates-section {
  flex: 1;
}

.last-updated {
  font-size: 12px;
  color: #9e9e9e;
  margin-bottom: 16px;
}

.rates-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-bottom: 24px;
}

.rate-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f5f5f5;
  border-radius: 16px;
}

.rate-left {
  display: flex;
  align-items: center;
}

.rate-flag {
  font-size: 20px;
  margin-right: 12px;
}

.rate-code {
  font-size: 15px;
  font-weight: 700;
  margin-right: 6px;
}

.rate-name {
  font-size: 13px;
  color: #5a5a5a;
}

.rate-right {
  font-size: 15px;
  font-weight: 700;
}

```

## File: client/src/pages/CurrencyPage.jsx
```javascript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';
import currencies, { getCurrencySymbol, getCurrencyFlag } from '../constants/currencies';
import './CurrencyPage.css';

const CurrencyPage = () => {
  const navigate = useNavigate();
  const { rates, loading, lastUpdated } = useCurrency();
  
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [targetCurrency, setTargetCurrency] = useState('INR');
  const [amount, setAmount] = useState('1');

  // Convert generic amount based on fetched rates mapping cross-referenced to USD generally 
  const calculateConversion = () => {
    if (!amount || isNaN(amount)) return '0.00';
    const baseRate = rates[baseCurrency];
    const targetRate = rates[targetCurrency];
    if (!baseRate || !targetRate) return '0.00';
    
    // Cross conversion logic (In case base isn't 1)
    const numAmount = parseFloat(amount);
    const converted = (numAmount / baseRate) * targetRate;
    return converted.toFixed(2);
  };

  const handleSwap = () => {
    setBaseCurrency(targetCurrency);
    setTargetCurrency(baseCurrency);
  };

  return (
    <div className="currency-container">
      <header className="home-header">
        <button className="icon-btn" onClick={() => navigate(-1)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"></path></svg>
        </button>
        <h2 style={{ fontSize: '18px', fontWeight: '700' }}>Rates</h2>
        <div style={{ width: 36 }}></div>
      </header>

      <div className="converter-card">
        <h3 className="card-title">Converter</h3>
        
        <div className="input-row">
          <div className="amount-group">
             <label>Amount</label>
             <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
          <div className="currency-select-group">
            <label>From</label>
            <div className="custom-select">
              <span className="flag">{getCurrencyFlag(baseCurrency)}</span>
              <select value={baseCurrency} onChange={(e) => setBaseCurrency(e.target.value)}>
                {currencies.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="swap-container">
           <button className="swap-btn" onClick={handleSwap}>
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path></svg>
           </button>
        </div>

        <div className="input-row">
          <div className="amount-group converted-box">
             <label>Converted Amount</label>
             <div className="converted-val">{getCurrencySymbol(targetCurrency)}{calculateConversion()}</div>
          </div>
          <div className="currency-select-group">
            <label>To</label>
            <div className="custom-select">
              <span className="flag">{getCurrencyFlag(targetCurrency)}</span>
              <select value={targetCurrency} onChange={(e) => setTargetCurrency(e.target.value)}>
                {currencies.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="rates-section">
        <h3 className="card-title">Live Rates <span>1 {baseCurrency} =</span></h3>
        <p className="last-updated">Last updated: {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : '...'} {loading && '(Syncing...)'}</p>
        
        <div className="rates-list">
          {currencies.filter(c => c.code !== baseCurrency).map(c => {
             const baseR = rates[baseCurrency];
             const targetR = rates[c.code];
             const rateVal = baseR && targetR ? ((1 / baseR) * targetR).toFixed(4) : '...';
             
             return (
               <div key={c.code} className="rate-row">
                 <div className="rate-left">
                   <span className="rate-flag">{c.flag}</span>
                   <span className="rate-code">{c.code}</span>
                   <span className="rate-name">{c.name}</span>
                 </div>
                 <div className="rate-right">
                   {c.symbol} {rateVal}
                 </div>
               </div>
             )
          })}
        </div>
      </div>
    </div>
  );
};

export default CurrencyPage;

```

## File: client/src/pages/GroupDetail.css
```css
.group-detail-page {
  animation: fadeInUp 0.5s ease-out;
}

.group-detail-header {
  margin-bottom: var(--space-6);
}

.back-btn {
  font-size: var(--text-sm);
  color: var(--text-muted);
  margin-bottom: var(--space-3);
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.back-btn:hover {
  color: var(--text-primary);
  background: var(--bg-card);
}

.group-detail-title-row {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.group-detail-emoji {
  font-size: 2.5rem;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(99, 102, 241, 0.1);
  border-radius: var(--radius-xl);
}

.group-detail-name {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  font-weight: 800;
}

/* Tabs */
.group-detail-tabs {
  display: flex;
  gap: var(--space-1);
  margin: var(--space-8) 0 var(--space-6);
  padding: var(--space-1);
  background: var(--bg-secondary);
  border-radius: var(--radius-xl);
  border: 1px solid var(--border-default);
}

.group-tab {
  flex: 1;
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-lg);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text-muted);
  transition: all var(--transition-base);
  text-align: center;
}

.group-tab:hover {
  color: var(--text-primary);
}

.group-tab-active {
  background: var(--gradient-primary);
  color: white;
  box-shadow: var(--shadow-glow);
}

/* Tab content */
.group-detail-content {
  animation: fadeIn 0.3s ease-out;
}

.tab-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-5);
}

.tab-header h3 {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: 700;
}

.tab-header-info {
  font-size: var(--text-sm);
  color: var(--text-muted);
}

```

## File: client/src/pages/GroupDetail.jsx
```javascript
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGroups } from '../context/GroupContext';
import GroupStats from '../components/groups/GroupStats';
import ExpenseList from '../components/expenses/ExpenseList';
import BalanceList from '../components/balances/BalanceList';
import MemberList from '../components/groups/MemberList';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import ExpenseForm from '../components/expenses/ExpenseForm';
import AddMemberPanel from '../components/groups/AddMemberPanel';
import { simplifyDebts, calculateNetBalances } from '../utils/debtSimplifier';
import './GroupDetail.css';

// Mock expenses for this group
const MOCK_EXPENSES = [
  { id: 'exp-1', description: 'Beach Shack Dinner', amount: 4200, currency: 'INR', amountInBase: 4200, vibeTag: 'food', payerId: 'user-1', splitType: 'equal', isRecurring: false, createdAt: '2026-03-27T19:00:00Z', splits: [{ userId: 'user-1', amount: 1050 }, { userId: 'user-2', amount: 1050 }, { userId: 'user-3', amount: 1050 }, { userId: 'user-4', amount: 1050 }] },
  { id: 'exp-2', description: 'Uber to Calangute', amount: 650, currency: 'INR', amountInBase: 650, vibeTag: 'travel', payerId: 'user-2', splitType: 'equal', isRecurring: false, createdAt: '2026-03-27T14:00:00Z', splits: [{ userId: 'user-1', amount: 162.5 }, { userId: 'user-2', amount: 162.5 }, { userId: 'user-3', amount: 162.5 }, { userId: 'user-4', amount: 162.5 }] },
  { id: 'exp-3', description: 'Drinks at Titos', amount: 3800, currency: 'INR', amountInBase: 3800, vibeTag: 'drinks', payerId: 'user-3', splitType: 'equal', isRecurring: false, createdAt: '2026-03-26T22:00:00Z', splits: [{ userId: 'user-1', amount: 950 }, { userId: 'user-2', amount: 950 }, { userId: 'user-3', amount: 950 }, { userId: 'user-4', amount: 950 }] },
  { id: 'exp-4', description: 'Airbnb Stay (3 nights)', amount: 12000, currency: 'INR', amountInBase: 12000, vibeTag: 'stay', payerId: 'user-1', splitType: 'equal', isRecurring: false, createdAt: '2026-03-25T12:00:00Z', splits: [{ userId: 'user-1', amount: 3000 }, { userId: 'user-2', amount: 3000 }, { userId: 'user-3', amount: 3000 }, { userId: 'user-4', amount: 3000 }] },
  { id: 'exp-5', description: 'Parasailing', amount: 6000, currency: 'INR', amountInBase: 6000, vibeTag: 'fun', payerId: 'user-4', splitType: 'equal', isRecurring: false, createdAt: '2026-03-26T10:00:00Z', splits: [{ userId: 'user-1', amount: 1500 }, { userId: 'user-2', amount: 1500 }, { userId: 'user-3', amount: 1500 }, { userId: 'user-4', amount: 1500 }] },
];

const GroupDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { groups } = useGroups();
  const [activeTab, setActiveTab] = useState('expenses');
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);

  const group = groups.find((g) => g.id === id);

  if (!group) {
    return (
      <div className="page-container empty-state">
        <div className="empty-state-icon">🔍</div>
        <h3 className="empty-state-title">Group not found</h3>
        <Button variant="primary" onClick={() => navigate('/')}>Go Home</Button>
      </div>
    );
  }

  // Calculate settlements
  const netBalances = calculateNetBalances(MOCK_EXPENSES);
  const settlements = simplifyDebts(netBalances);

  const handleAddExpense = (data) => {
    console.log('New expense:', data);
    setShowAddExpense(false);
  };

  return (
    <div className="group-detail-page page-container">
      {/* Header */}
      <div className="group-detail-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <div className="group-detail-title-row">
          <span className="group-detail-emoji">{group.emoji}</span>
          <h1 className="group-detail-name">{group.name}</h1>
        </div>
      </div>

      {/* Stats */}
      <GroupStats group={group} />

      {/* Tabs */}
      <div className="group-detail-tabs">
        <button
          className={`group-tab ${activeTab === 'expenses' ? 'group-tab-active' : ''}`}
          onClick={() => setActiveTab('expenses')}
        >
          📝 Expenses
        </button>
        <button
          className={`group-tab ${activeTab === 'balances' ? 'group-tab-active' : ''}`}
          onClick={() => setActiveTab('balances')}
        >
          💰 Balances
        </button>
        <button
          className={`group-tab ${activeTab === 'members' ? 'group-tab-active' : ''}`}
          onClick={() => setActiveTab('members')}
        >
          👥 Members
        </button>
      </div>

      {/* Tab Content */}
      <div className="group-detail-content">
        {activeTab === 'expenses' && (
          <>
            <div className="tab-header">
              <h3>All Expenses</h3>
              <Button variant="primary" size="sm" onClick={() => setShowAddExpense(true)}>
                + Add Expense
              </Button>
            </div>
            <ExpenseList
              expenses={MOCK_EXPENSES}
              members={group.members}
            />
          </>
        )}

        {activeTab === 'balances' && (
          <>
            <div className="tab-header">
              <h3>Simplified Settlements</h3>
              <span className="tab-header-info">{settlements.length} transfers needed</span>
            </div>
            <BalanceList
              settlements={settlements}
              members={group.members}
              currency={group.baseCurrency}
            />
          </>
        )}

        {activeTab === 'members' && (
          <>
            <div className="tab-header">
              <h3>Members ({group.members.length})</h3>
              <Button variant="outline" size="sm" onClick={() => setShowAddMember(true)}>+ Add Member</Button>
            </div>
            <MemberList members={group.members} />
          </>
        )}
      </div>

      {/* Add Member Modal */}
      <Modal isOpen={showAddMember} onClose={() => setShowAddMember(false)} title="Add Member" size="lg">
        <AddMemberPanel 
          groupId={group.id} 
          inviterId="current-user-id" 
          groupName={group.name} 
          onMemberAdded={() => setShowAddMember(false)} 
        />
      </Modal>

      {/* Add Expense Modal */}
      <Modal isOpen={showAddExpense} onClose={() => setShowAddExpense(false)} title="Add Expense" size="lg">
        <ExpenseForm
          members={group.members}
          onSubmit={handleAddExpense}
          onCancel={() => setShowAddExpense(false)}
        />
      </Modal>
    </div>
  );
};

export default GroupDetail;

```

## File: client/src/pages/Home.css
```css
.home-container {
  padding: 24px;
  background: #ffffff;
  min-height: 100vh;
  max-width: 480px;
  margin: 0 auto;
  font-family: 'Inter', sans-serif;
  color: #1a1a1a;
}

.home-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.logo-text {
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.5px;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.icon-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  color: #1a1a1a;
  cursor: pointer;
}

.balance-section {
  text-align: center;
  margin-bottom: 36px;
}

.balance-subtitle {
  color: #737373;
  font-size: 14px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.info-icon {
  font-size: 12px;
  color: #9e9e9e;
}

.balance-amount {
  font-size: 40px;
  font-weight: 800;
  margin-bottom: 24px;
  letter-spacing: -1px;
}

.action-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.btn-manual {
  background: #8add5c;
  color: #000;
  border-radius: 100px;
  padding: 14px 24px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;
  cursor: pointer;
  font-size: 15px;
}

.btn-scan {
  background: #111111;
  color: #fff;
  border-radius: 100px;
  padding: 14px 24px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;
  cursor: pointer;
  font-size: 15px;
}

.section-header-minimal {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header-minimal h3 {
  font-size: 16px;
  font-weight: 700;
}

.see-more {
  font-size: 13px;
  color: #737373;
  background: none;
  border: none;
  font-weight: 500;
  cursor: pointer;
}

.friends-scroll {
  display: flex;
  overflow-x: auto;
  gap: 16px;
  padding-bottom: 12px;
  margin-bottom: 24px;
  scrollbar-width: none;
}
.friends-scroll::-webkit-scrollbar {
  display: none;
}

.friend-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  min-width: 60px;
}

.friend-avatar-wrap {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 1px solid #e0e0e0;
  padding: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.friend-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  background: #f5f5f5;
}

.friend-name {
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  color: #5a5a5a;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-card {
  background: #f5f5f5;
  border-radius: 20px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.history-card-top {
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px dashed #dcdcdc;
  padding-bottom: 16px;
}

.history-icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.history-info {
  flex: 1;
}

.history-info h4 {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 4px;
}

.history-info p {
  font-size: 12px;
  color: #737373;
}

.history-avatars {
  display: flex;
}

.history-avatars .tiny-avatar {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid #f5f5f5;
  margin-left: -8px;
  position: relative;
  overflow: hidden;
}
.history-avatars .tiny-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.history-avatars .tiny-avatar:first-child {
  margin-left: 0;
}

.history-card-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.history-total {
  color: #737373;
}
.history-total strong {
  color: #1a1a1a;
  font-weight: 800;
  font-size: 15px;
  margin-left: 4px;
}

.history-paid {
  font-weight: 600;
}
.text-red {
  color: #ef4444;
}
.text-green {
  color: #8add5c;
}

```

## File: client/src/pages/Home.jsx
```javascript
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGroups } from '../context/GroupContext';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/common/Modal';
import AddFriendPanel from '../components/groups/AddFriendPanel';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const { groups, loading: groupsLoading } = useGroups();
  const { user, logout } = useAuth();
  
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friends, setFriends] = useState([
    { id: 1, name: 'Lina Punk', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lina1' },
    { id: 2, name: 'Ravi', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ravi' },
    { id: 3, name: 'Arjun', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun' },
  ]);

  if (groupsLoading) {
    return <div style={{padding: 24, textAlign: 'center'}}>Loading groups...</div>;
  }

  // Flatten all expenses from all groups to make a "recent history"
  const history = groups
    .flatMap(g => g.expenses || [])
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 10); // Show max 10 recent

  // Get total owed across all groups (mock balance logic for dashboard view)
  const calculateTotalOwed = () => {
    let owed = 0;
    groups.forEach(g => {
       g.expenses?.forEach(exp => {
          if (exp.payerId === user.id) {
             exp.splits?.forEach(s => {
               if (s.userId !== user.id) owed += s.amount;
             });
          }
       });
    });
    return owed;
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <h1 className="logo-text">Spliter</h1>
        <div className="header-actions">
          <button className="icon-btn" onClick={() => logout()}>
             {/* Use basic text logout for now to avoid SVGs */}
             Exit
          </button>
          <button className="icon-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
          </button>
        </div>
      </header>

      <div className="balance-section">
        <p className="balance-subtitle">Friends are owing you <span className="info-icon">ⓘ</span></p>
        <h2 className="balance-amount">INR {calculateTotalOwed().toFixed(0)}</h2>
        
        <div className="action-buttons">
          <button className="btn-manual" onClick={() => navigate('/add')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"></path></svg> 
            Add Manually
          </button>
          <button className="btn-scan">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h4v4H4zM16 4h4v4h-4zM4 16h4v4H4zM16 16h4v4h-4z"></path></svg> 
            Quick Scan
          </button>
        </div>
      </div>

      <div className="friends-section">
        <div className="section-header-minimal" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
            <h3>Friends List</h3>
            <button 
              onClick={() => setShowAddFriend(true)}
              style={{backgroundColor: '#eef2ff', color: '#4f46e5', border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer'}}
            >
              + Add Friend
            </button>
          </div>
          <button className="see-more">See more</button>
        </div>
        <div className="friends-scroll">
          {friends.map(f => (
            <div key={f.id} className="friend-item">
              <div className="friend-avatar-wrap">
                 <img src={f.img || `https://api.dicebear.com/7.x/avataaars/svg?seed=${f.id}`} alt={f.name} className="friend-avatar" />
              </div>
              <span className="friend-name">{f.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="history-section">
        <div className="section-header-minimal">
          <h3>Split History</h3>
          <button className="see-more">See more</button>
        </div>
        <div className="history-list">
          {history.length === 0 ? <p style={{color: '#999', fontSize: 14}}>No recent activity</p> : null}
          {history.map(item => (
            <div 
              key={item.id} 
              className="history-card" 
              onClick={() => navigate(`/group/${item.groupId}`)}
              style={{ cursor: 'pointer' }}
            >
              <div className="history-card-top">
                <div className="history-icon">☕</div>
                <div className="history-info">
                  <h4>{item.description}</h4>
                  <p>{new Date(item.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="history-avatars">
                  {item.splits.slice(0,3).map((split, idx) => (
                    <div className="tiny-avatar" style={{ zIndex: 3-idx }} key={split.id}>
                       <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${split.userId}`} alt="" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="history-card-bottom">
                <span className="history-total">Total <strong>INR {item.amount}</strong></span>
                <span className="history-paid text-red">
                  Not Settled
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal isOpen={showAddFriend} onClose={() => setShowAddFriend(false)} title="Add Friend" size="lg">
        <AddFriendPanel 
          inviterId={user?.id}
          inviterName={user?.name || "I"}
          onFriendAdded={(newFriend) => {
            setFriends(prev => [newFriend, ...prev]);
            setShowAddFriend(false);
          }}
        />
      </Modal>

    </div>
  );
};
export default Home;

```

## File: client/src/pages/Login.css
```css
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  padding: var(--space-4);
}

.login-bg-effects {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.login-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.5;
}

.login-orb-1 {
  width: 400px;
  height: 400px;
  background: rgba(99, 102, 241, 0.3);
  top: -100px;
  left: -100px;
  animation: float 6s ease-in-out infinite;
}

.login-orb-2 {
  width: 300px;
  height: 300px;
  background: rgba(139, 92, 246, 0.25);
  bottom: -80px;
  right: -80px;
  animation: float 8s ease-in-out infinite reverse;
}

.login-orb-3 {
  width: 200px;
  height: 200px;
  background: rgba(6, 214, 160, 0.2);
  top: 40%;
  right: 20%;
  animation: float 7s ease-in-out infinite;
}

.login-card {
  padding: var(--space-10) var(--space-8);
  max-width: 420px;
  width: 100%;
  text-align: center;
  animation: scaleIn 0.5s ease-out;
  position: relative;
  z-index: 1;
}

.login-logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}

.login-logo-icon {
  font-size: 3.5rem;
  animation: float 3s ease-in-out infinite;
}

.login-logo-text {
  font-family: var(--font-display);
  font-size: var(--text-4xl);
  font-weight: 900;
  letter-spacing: -1px;
}

.login-subtitle {
  color: var(--text-secondary);
  font-size: var(--text-base);
  margin-bottom: var(--space-8);
}

.login-buttons {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-bottom: var(--space-6);
}

.login-footer {
  font-size: var(--text-xs);
  color: var(--text-muted);
  line-height: 1.5;
}

```

## File: client/src/pages/Login.jsx
```javascript
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await login();
      navigate('/');
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg-effects">
        <div className="login-orb login-orb-1" />
        <div className="login-orb login-orb-2" />
        <div className="login-orb login-orb-3" />
      </div>
      <div className="login-card glass-card" style={{ background: '#fff' }}>
        <div className="login-logo">
          <h1 className="login-logo-text" style={{ color: '#1a1a1a' }}>Spliter</h1>
        </div>
        <p className="login-subtitle" style={{ color: '#5a5a5a' }}>
          Split expenses. Settle debts. Stay friends.
        </p>

        <div className="login-buttons">
          <button className="btn-manual" style={{width: '100%', justifyContent: 'center'}} onClick={handleLogin}>
            Continue with Google / Dev Login
          </button>
        </div>
      </div>
    </div>
  );
};
export default Login;

```

## File: client/src/pages/NotFound.css
```css
.not-found-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  text-align: center;
  padding: var(--space-8);
}

.not-found-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
}

.not-found-code {
  font-family: var(--font-display);
  font-size: 8rem;
  font-weight: 900;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1;
  opacity: 0.5;
}

.not-found-title {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: 700;
}

.not-found-text {
  color: var(--text-muted);
  max-width: 360px;
}

```

## File: client/src/pages/NotFound.jsx
```javascript
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <span className="not-found-code">404</span>
        <h1 className="not-found-title">Page not found</h1>
        <p className="not-found-text">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button variant="primary" size="lg">Go Home</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

```

## File: client/src/pages/Profile.jsx
```javascript
import React, { useState } from "react";

export default function Profile() {
  const [fcmPush, setFcmPush] = useState(true);
  const [whatsappReminders, setWhatsappReminders] = useState(true);
  const [autoSms, setAutoSms] = useState(false);

  // In a real app you'd fetch user preferences from backend and toggle them via API

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow mt-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Profile Settings</h1>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Notification Preferences</h2>
          
          <div className="space-y-4 text-sm text-gray-800">
            {/* FCM */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Push Notifications (App Users)</p>
                <p className="text-xs text-gray-500">Always free</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={fcmPush} onChange={() => setFcmPush(!fcmPush)} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* WhatsApp */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">WhatsApp Link Reminders</p>
                <p className="text-xs text-gray-500">Always free</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={whatsappReminders} onChange={() => setWhatsappReminders(!whatsappReminders)} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* SMS */}
            <div className="flex items-center justify-between mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div>
                <p className="font-semibold text-orange-800">Auto SMS Reminders</p>
                <div className="text-xs text-orange-700 mt-1 space-y-1">
                  <p>Send standard SMS to users without the app.</p>
                  <ul className="list-disc ml-4 space-y-1">
                    <li>₹0.15–0.20/SMS (India)</li>
                    <li>₹1.50–2.00/SMS (International)</li>
                  </ul>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={autoSms} onChange={() => setAutoSms(!autoSms)} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
              </label>
            </div>
            
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Cost Summary</h2>
          <div className="bg-gray-50 p-4 rounded-lg border text-sm text-gray-700 space-y-2 font-mono">
            <div className="flex justify-between"><span>Push notifications (app users)</span><span className="text-green-600 font-bold">Always free</span></div>
            <div className="flex justify-between"><span>WhatsApp link reminders</span><span className="text-green-600 font-bold">Always free</span></div>
            <div className="flex justify-between"><span>Invite links</span><span className="text-green-600 font-bold">Always free</span></div>
            <div className="flex justify-between"><span>Auto SMS reminders (India)</span><span className="text-orange-600">₹0.15–0.20/SMS</span></div>
            <div className="flex justify-between"><span>Auto SMS reminders (Global)</span><span className="text-orange-600">₹1.50–2.00/SMS</span></div>
          </div>
        </section>
      </div>
    </div>
  );
}

```

## File: client/src/services/api.js
```javascript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor — attach auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    console.error('API Error:', message);
    return Promise.reject({ message, status: error.response?.status });
  }
);

export default api;

```

## File: client/src/services/authService.js
```javascript
import api from './api';

export const login = async (firebaseToken) => {
  return api.post('/auth/login', { token: firebaseToken });
};

export const register = async (userData) => {
  return api.post('/auth/register', userData);
};

export const logout = () => {
  localStorage.removeItem('authToken');
};

export const getProfile = async () => {
  return api.get('/auth/profile');
};

export const updateProfile = async (data) => {
  return api.put('/auth/profile', data);
};

```

## File: client/src/services/balanceService.js
```javascript
import api from './api';

export const getBalances = async (groupId) => {
  return api.get(`/balances?groupId=${groupId}`);
};

export const markSettled = async (data) => {
  return api.post('/balances/settle', data);
};

```

## File: client/src/services/currencyService.js
```javascript
import api from './api';

export const getRates = async (base = 'INR') => {
  return api.get(`/currency/rates?base=${base}`);
};

export const convertAmount = async (from, to, amount) => {
  return api.get(`/currency/convert?from=${from}&to=${to}&amount=${amount}`);
};

```

## File: client/src/services/expenseService.js
```javascript
import api from './api';

export const getExpenses = async (groupId) => {
  return api.get(`/expenses?groupId=${groupId}`);
};

export const getExpense = async (id) => {
  return api.get(`/expenses/${id}`);
};

export const addExpense = async (data) => {
  return api.post('/expenses', data);
};

export const updateExpense = async (id, data) => {
  return api.put(`/expenses/${id}`, data);
};

export const deleteExpense = async (id) => {
  return api.delete(`/expenses/${id}`);
};

```

## File: client/src/services/groupService.js
```javascript
import api from './api';

export const getGroups = async () => {
  return api.get('/groups');
};

export const getGroup = async (id) => {
  return api.get(`/groups/${id}`);
};

export const createGroup = async (data) => {
  return api.post('/groups', data);
};

export const updateGroup = async (id, data) => {
  return api.put(`/groups/${id}`, data);
};

export const deleteGroup = async (id) => {
  return api.delete(`/groups/${id}`);
};

export const addMember = async (groupId, data) => {
  return api.post(`/groups/${groupId}/members`, data);
};

export const removeMember = async (groupId, userId) => {
  return api.delete(`/groups/${groupId}/members/${userId}`);
};

```

## File: client/src/services/nudgeService.js
```javascript
import api from './api';

export const sendNudge = async (toUserId, groupId, tone) => {
  return api.post('/nudge/send', { toUserId, groupId, tone });
};

```

## File: client/src/services/receiptService.js
```javascript
import api from './api';

export const uploadReceipt = async (file) => {
  const formData = new FormData();
  formData.append('receipt', file);
  return api.post('/receipt/scan', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const parseItems = async (imageUrl) => {
  return api.post('/receipt/parse', { imageUrl });
};

```

## File: client/src/styles/animations.css
```css
/* ============================================
   SplitWave — Animations
   ============================================ */

/* ── Page Transitions ── */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* ── Spin Wheel ── */
@keyframes spinWheel {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(var(--spin-degrees, 1800deg));
  }
}

.spin-wheel {
  animation: spinWheel 4s cubic-bezier(0.17, 0.67, 0.12, 0.99) forwards;
}

/* ── Pulse Glow ── */
@keyframes pulseGlow {
  0%, 100% {
    box-shadow: 0 0 10px rgba(99, 102, 241, 0.2);
  }
  50% {
    box-shadow: 0 0 30px rgba(99, 102, 241, 0.4), 0 0 60px rgba(99, 102, 241, 0.1);
  }
}

.pulse-glow {
  animation: pulseGlow 2s ease-in-out infinite;
}

/* ── Float ── */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
}

.float {
  animation: float 3s ease-in-out infinite;
}

/* ── Shimmer / Skeleton ── */
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--bg-card) 25%,
    var(--bg-card-hover) 50%,
    var(--bg-card) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: var(--radius-md);
}

/* ── Bounce ── */
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(-10px);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}

.bounce {
  animation: bounce 1s infinite;
}

/* ── Confetti ── */
@keyframes confettiFall {
  0% {
    transform: translateY(-100vh) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
}

/* ── Ripple (button click) ── */
@keyframes ripple {
  to {
    transform: scale(4);
    opacity: 0;
  }
}

.ripple-effect {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  transform: scale(0);
  animation: ripple 0.6s linear;
  pointer-events: none;
}

/* ── Slide counter ── */
@keyframes countUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ── Stagger children ── */
.stagger-children > * {
  animation: fadeInUp 0.4s ease-out both;
}

.stagger-children > *:nth-child(1) { animation-delay: 0ms; }
.stagger-children > *:nth-child(2) { animation-delay: 60ms; }
.stagger-children > *:nth-child(3) { animation-delay: 120ms; }
.stagger-children > *:nth-child(4) { animation-delay: 180ms; }
.stagger-children > *:nth-child(5) { animation-delay: 240ms; }
.stagger-children > *:nth-child(6) { animation-delay: 300ms; }
.stagger-children > *:nth-child(7) { animation-delay: 360ms; }
.stagger-children > *:nth-child(8) { animation-delay: 420ms; }

/* ── Toast notification ── */
@keyframes toastIn {
  from {
    opacity: 0;
    transform: translateX(100%) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}

@keyframes toastOut {
  from {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateX(100%) scale(0.9);
  }
}

/* ── Modal Overlay ── */
@keyframes overlayIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

```

## File: client/src/styles/globals.css
```css
/* ============================================
   SplitWave — Global Reset & Root Variables
   ============================================ */

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap');

*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  /* ── Primary Palette ── */
  --primary-50:  #f4fce8;
  --primary-100: #e6f7cd;
  --primary-200: #d0f0a2;
  --primary-300: #b1e56b;
  --primary-400: #97d840;
  --primary-500: #8add5c; /* Vibrant green from image */
  --primary-600: #6ab03b;
  --primary-700: #528a2c;
  --primary-800: #426e25;
  --primary-900: #385b21;

  /* ── Accent / Success / Warning / Error ── */
  --accent:       #111111; /* Dark for Quick Scan */
  --accent-light: #333333;
  --accent-dark:  #000000;

  --success:     #8add5c;
  --warning:     #f59e0b;
  --error:       #ef4444;
  --info:        #3b82f6;

  /* ── Neutrals (Light Mode First) ── */
  --bg-primary:    #ffffff;
  --bg-secondary:  #f9f9f9;
  --bg-card:       #f3f4f6;
  --bg-card-hover: #e5e7eb;
  --bg-elevated:   #ffffff;
  --bg-glass:      rgba(255, 255, 255, 0.85);
  --bg-glass-border: rgba(0, 0, 0, 0.05);

  --text-primary:   #1a1a1a;
  --text-secondary: #5a5a5a;
  --text-muted:     #9e9e9e;
  --text-inverse:   #ffffff;

  --border-default: #e5e7eb;
  --border-subtle:  #f3f4f6;

  /* ── Gradients ── */
  --gradient-primary: linear-gradient(135deg, #9ae66e 0%, #8add5c 100%);
  --gradient-accent:  linear-gradient(135deg, #222222 0%, #000000 100%);
  --gradient-warm:    linear-gradient(135deg, #f97316 0%, #ef4444 100%);
  --gradient-bg:      linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%);
  --gradient-card:    linear-gradient(145deg, #ffffff 0%, #f3f4f6 100%);
  --gradient-glow:    radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(138,221,92,0.1), transparent 40%);

  /* ── Shadows ── */
  --shadow-sm:   0 1px 3px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2);
  --shadow-md:   0 4px 14px rgba(0,0,0,0.35), 0 2px 6px rgba(0,0,0,0.2);
  --shadow-lg:   0 10px 40px rgba(0,0,0,0.4), 0 4px 12px rgba(0,0,0,0.25);
  --shadow-xl:   0 20px 60px rgba(0,0,0,0.5);
  --shadow-glow: 0 0 20px rgba(99,102,241,0.3), 0 0 60px rgba(99,102,241,0.1);
  --shadow-accent-glow: 0 0 20px rgba(6,214,160,0.3);

  /* ── Typography ── */
  --font-primary:   'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-display:   'Space Grotesk', 'Inter', sans-serif;
  --font-mono:      'JetBrains Mono', 'Fira Code', monospace;

  --text-xs:   0.75rem;
  --text-sm:   0.875rem;
  --text-base: 1rem;
  --text-lg:   1.125rem;
  --text-xl:   1.25rem;
  --text-2xl:  1.5rem;
  --text-3xl:  1.875rem;
  --text-4xl:  2.25rem;
  --text-5xl:  3rem;

  /* ── Spacing ── */
  --space-1:  0.25rem;
  --space-2:  0.5rem;
  --space-3:  0.75rem;
  --space-4:  1rem;
  --space-5:  1.25rem;
  --space-6:  1.5rem;
  --space-8:  2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-20: 5rem;

  /* ── Radius ── */
  --radius-sm:   0.375rem;
  --radius-md:   0.5rem;
  --radius-lg:   0.75rem;
  --radius-xl:   1rem;
  --radius-2xl:  1.5rem;
  --radius-full: 9999px;

  /* ── Transitions ── */
  --transition-fast:   150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-base:   250ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow:   350ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-spring: 500ms cubic-bezier(0.34, 1.56, 0.64, 1);

  /* ── Z-index Scale ── */
  --z-base:     1;
  --z-dropdown: 10;
  --z-sticky:   20;
  --z-overlay:  30;
  --z-modal:    40;
  --z-toast:    50;

  /* ── Layout ── */
  --sidebar-width: 280px;
  --header-height: 72px;
  --max-content-width: 1200px;
}

html {
  font-size: 16px;
  scroll-behavior: smooth;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: var(--font-primary);
  background: var(--bg-primary);
  color: var(--text-primary);
  line-height: 1.6;
  min-height: 100vh;
  overflow-x: hidden;
}

#root {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

a {
  color: inherit;
  text-decoration: none;
}

button {
  cursor: pointer;
  border: none;
  background: none;
  font-family: inherit;
  font-size: inherit;
  color: inherit;
}

input, textarea, select {
  font-family: inherit;
  font-size: inherit;
  color: inherit;
  outline: none;
}

ul, ol {
  list-style: none;
}

img {
  max-width: 100%;
  display: block;
}

/* ── Scrollbar ── */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: var(--bg-secondary);
}
::-webkit-scrollbar-thumb {
  background: var(--primary-700);
  border-radius: var(--radius-full);
}
::-webkit-scrollbar-thumb:hover {
  background: var(--primary-600);
}

/* ── Selection ── */
::selection {
  background: var(--primary-500);
  color: white;
}

```

## File: client/src/styles/theme.css
```css
/* ============================================
   SplitWave — Theme Utility Classes
   ============================================ */

/* ── Glass Card ── */
.glass-card {
  background: var(--bg-glass);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--bg-glass-border);
  border-radius: var(--radius-xl);
  transition: all var(--transition-base);
}

.glass-card:hover {
  border-color: rgba(99, 102, 241, 0.3);
  box-shadow: var(--shadow-glow);
  transform: translateY(-2px);
}

/* ── Solid Card ── */
.card {
  background: var(--bg-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  transition: all var(--transition-base);
}

.card:hover {
  background: var(--bg-card-hover);
  border-color: var(--primary-500);
  box-shadow: var(--shadow-md);
}

/* ── Gradient Text ── */
.gradient-text {
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.gradient-text-accent {
  background: var(--gradient-accent);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ── Buttons ── */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-lg);
  font-weight: 600;
  font-size: var(--text-sm);
  transition: all var(--transition-base);
  position: relative;
  overflow: hidden;
  white-space: nowrap;
}

.btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.1), transparent);
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.btn:hover::before {
  opacity: 1;
}

.btn-primary {
  background: var(--gradient-primary);
  color: white;
  box-shadow: var(--shadow-sm);
}

.btn-primary:hover {
  box-shadow: var(--shadow-glow);
  transform: translateY(-1px);
}

.btn-primary:active {
  transform: translateY(0);
}

.btn-accent {
  background: var(--gradient-accent);
  color: var(--text-inverse);
  box-shadow: var(--shadow-sm);
}

.btn-accent:hover {
  box-shadow: var(--shadow-accent-glow);
  transform: translateY(-1px);
}

.btn-outline {
  background: transparent;
  border: 1px solid var(--border-default);
  color: var(--text-primary);
}

.btn-outline:hover {
  border-color: var(--primary-400);
  background: rgba(99, 102, 241, 0.1);
}

.btn-ghost {
  background: transparent;
  color: var(--text-secondary);
}

.btn-ghost:hover {
  background: rgba(148, 163, 184, 0.08);
  color: var(--text-primary);
}

.btn-danger {
  background: var(--gradient-warm);
  color: white;
}

.btn-danger:hover {
  box-shadow: 0 0 20px rgba(239, 68, 68, 0.3);
  transform: translateY(-1px);
}

.btn-sm {
  padding: var(--space-2) var(--space-4);
  font-size: var(--text-xs);
  border-radius: var(--radius-md);
}

.btn-lg {
  padding: var(--space-4) var(--space-8);
  font-size: var(--text-base);
  border-radius: var(--radius-xl);
}

.btn-icon {
  padding: var(--space-3);
  border-radius: var(--radius-lg);
}

/* ── Inputs ── */
.input-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.input-label {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--text-secondary);
}

.input-field {
  padding: var(--space-3) var(--space-4);
  background: var(--bg-secondary);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  color: var(--text-primary);
  transition: all var(--transition-base);
}

.input-field::placeholder {
  color: var(--text-muted);
}

.input-field:focus {
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
  background: var(--bg-card);
}

.input-field:hover:not(:focus) {
  border-color: var(--primary-700);
}

/* ── Badges ── */
.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.02em;
}

.badge-primary {
  background: rgba(99, 102, 241, 0.15);
  color: var(--primary-300);
}

.badge-success {
  background: rgba(16, 185, 129, 0.15);
  color: var(--success);
}

.badge-warning {
  background: rgba(245, 158, 11, 0.15);
  color: var(--warning);
}

.badge-error {
  background: rgba(239, 68, 68, 0.15);
  color: var(--error);
}

/* ── Section headers ── */
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-6);
}

.section-title {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--text-primary);
}

.section-subtitle {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin-top: var(--space-1);
}

/* ── Page Container ── */
.page-container {
  max-width: var(--max-content-width);
  margin: 0 auto;
  padding: var(--space-8);
}

/* ── Divider ── */
.divider {
  height: 1px;
  background: var(--border-default);
  margin: var(--space-6) 0;
}

/* ── Empty State ── */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-16) var(--space-8);
  text-align: center;
}

.empty-state-icon {
  font-size: 4rem;
  margin-bottom: var(--space-4);
  opacity: 0.5;
}

.empty-state-title {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-2);
}

.empty-state-text {
  font-size: var(--text-sm);
  color: var(--text-muted);
  max-width: 360px;
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .page-container {
    padding: var(--space-4);
  }
  
  .section-title {
    font-size: var(--text-xl);
  }
}

```

## File: client/src/utils/currencyUtils.js
```javascript
export const toBase = (amount, currencyCode, rates) => {
  if (!amount || isNaN(amount) || currencyCode === 'INR') return amount;
  const rate = rates[currencyCode];
  if (!rate) return amount;
  return amount / rate; // If 1 INR = 0.012 USD, 100 USD / 0.012 = 8333.33 INR
};

export const fromBase = (inrAmount, targetCurrency, rates) => {
  if (!inrAmount || isNaN(inrAmount) || targetCurrency === 'INR') return inrAmount;
  const rate = rates[targetCurrency];
  if (!rate) return inrAmount;
  return inrAmount * rate;
};

export const convert = (amount, fromCode, toCode, rates) => {
  if (fromCode === toCode) return amount;
  const inrAmount = toBase(amount, fromCode, rates);
  return fromBase(inrAmount, toCode, rates);
};

export const fmt = (amount, currencyCode, locale = 'en-US') => {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      maximumFractionDigits: 2,
      minimumFractionDigits: 0
    }).format(amount);
  } catch (e) {
    // Fallback if currency code is not supported by Intl
    return `${currencyCode} ${amount.toFixed(2)}`;
  }
};

```

## File: client/src/utils/dateUtils.js
```javascript
/**
 * Format a date as a readable string
 * e.g., "Mar 28, 2026"
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Format as relative time
 * e.g., "2 hours ago", "Yesterday", "Mar 25"
 */
export const timeAgo = (date) => {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(date);
};

/**
 * Group expenses by date for timeline view
 * Returns: [{ date: "Mar 28, 2026", expenses: [...] }]
 */
export const groupByDate = (expenses) => {
  const groups = {};

  expenses.forEach((expense) => {
    const dateKey = new Date(expense.createdAt).toDateString();
    if (!groups[dateKey]) {
      groups[dateKey] = {
        date: formatDate(expense.createdAt),
        dateKey,
        expenses: [],
      };
    }
    groups[dateKey].expenses.push(expense);
  });

  return Object.values(groups).sort(
    (a, b) => new Date(b.dateKey) - new Date(a.dateKey)
  );
};

/**
 * Get day suffix (1st, 2nd, 3rd, etc.)
 */
export const getDaySuffix = (day) => {
  if (day >= 11 && day <= 13) return `${day}th`;
  switch (day % 10) {
    case 1: return `${day}st`;
    case 2: return `${day}nd`;
    case 3: return `${day}rd`;
    default: return `${day}th`;
  }
};

```

## File: client/src/utils/debtSimplifier.js
```javascript
/**
 * Debt Simplification Algorithm
 * Minimizes the number of transactions needed to settle all debts.
 *
 * Input:  balances = { userId: netBalance }
 *   positive = owed money (creditor)
 *   negative = owes money (debtor)
 *
 * Output: Array of { from, to, amount }
 */
export const simplifyDebts = (balances) => {
  // Separate into creditors and debtors
  const creditors = [];
  const debtors = [];

  Object.entries(balances).forEach(([userId, balance]) => {
    if (balance > 0.01) {
      creditors.push({ userId, amount: balance });
    } else if (balance < -0.01) {
      debtors.push({ userId, amount: Math.abs(balance) });
    }
  });

  // Sort both lists descending by amount
  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);

  const settlements = [];
  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];
    const settlement = Math.min(debtor.amount, creditor.amount);

    settlements.push({
      from: debtor.userId,
      to: creditor.userId,
      amount: Math.round(settlement * 100) / 100,
    });

    debtor.amount -= settlement;
    creditor.amount -= settlement;

    if (debtor.amount < 0.01) i++;
    if (creditor.amount < 0.01) j++;
  }

  return settlements;
};

/**
 * Calculate net balances from expenses and splits
 * expenses: [{ payerId, amount, splits: [{ userId, amount }] }]
 * Returns: { userId: netBalance }
 */
export const calculateNetBalances = (expenses) => {
  const balances = {};

  expenses.forEach((expense) => {
    // Payer gets credit for what they paid
    balances[expense.payerId] = (balances[expense.payerId] || 0) + expense.amountInBase;

    // Each person in the split owes their share
    expense.splits.forEach((split) => {
      balances[split.userId] = (balances[split.userId] || 0) - split.amount;
    });
  });

  return balances;
};

```

## File: client/src/utils/personalityEngine.js
```javascript
import personalities from '../constants/personalities';

/**
 * Determine a user's spending personality based on their expense history
 *
 * Input:  splits — array of { amount, vibeTag } for a single user in a group
 * Output: { label, emoji, topCategory, topPercent, totalSpent, color, description }
 */
export const getSpendingPersonality = (splits) => {
  if (!splits || splits.length === 0) {
    return {
      ...personalities.find((p) => p.id === 'balanced'),
      topCategory: null,
      topPercent: 0,
      totalSpent: 0,
    };
  }

  // Tally spend per vibe tag
  const tagTotals = {};
  let totalSpent = 0;

  splits.forEach((split) => {
    const tag = split.vibeTag || 'other';
    tagTotals[tag] = (tagTotals[tag] || 0) + split.amount;
    totalSpent += split.amount;
  });

  // Find highest % category
  let topCategory = 'other';
  let topAmount = 0;

  Object.entries(tagTotals).forEach(([tag, amount]) => {
    if (amount > topAmount) {
      topAmount = amount;
      topCategory = tag;
    }
  });

  const topPercent = totalSpent > 0 ? Math.round((topAmount / totalSpent) * 100) : 0;

  // Match to personality based on threshold
  const matchedPersonality = personalities.find(
    (p) => p.tag === topCategory && p.threshold && topPercent >= p.threshold
  );

  const personality = matchedPersonality || personalities.find((p) => p.id === 'balanced');

  return {
    ...personality,
    topCategory,
    topPercent,
    totalSpent,
  };
};

/**
 * Get all spending breakdowns by category
 * Returns: [{ tag, amount, percent, color }]
 */
export const getCategoryBreakdown = (splits) => {
  const tagTotals = {};
  let total = 0;

  splits.forEach((split) => {
    const tag = split.vibeTag || 'other';
    tagTotals[tag] = (tagTotals[tag] || 0) + split.amount;
    total += split.amount;
  });

  return Object.entries(tagTotals)
    .map(([tag, amount]) => ({
      tag,
      amount,
      percent: total > 0 ? Math.round((amount / total) * 100) : 0,
    }))
    .sort((a, b) => b.amount - a.amount);
};

```

## File: client/src/utils/splitUtils.js
```javascript
/**
 * Equal split — divide total evenly among members
 * Returns array of { userId, amount } objects
 */
export const equalSplit = (totalAmount, memberIds) => {
  const share = totalAmount / memberIds.length;
  return memberIds.map((userId) => ({
    userId,
    amount: Math.round(share * 100) / 100,
  }));
};

/**
 * Percentage split — each member pays a percentage of total
 * percentages: { userId: 40, userId2: 60 }
 * Returns array of { userId, amount, percentage }
 */
export const pctSplit = (totalAmount, percentages) => {
  return Object.entries(percentages).map(([userId, pct]) => ({
    userId,
    amount: Math.round((totalAmount * pct / 100) * 100) / 100,
    percentage: pct,
  }));
};

/**
 * Exact split — each member pays a fixed amount
 * amounts: { userId: 500, userId2: 300 }
 * Returns array of { userId, amount }
 */
export const exactSplit = (amounts) => {
  return Object.entries(amounts).map(([userId, amount]) => ({
    userId,
    amount: Math.round(amount * 100) / 100,
  }));
};

/**
 * Itemized split — assign receipt items to members
 * items: [{ name, amount, assignedTo: [userId1, userId2] }]
 * Returns array of { userId, amount }
 */
export const itemizedSplit = (items) => {
  const totals = {};
  items.forEach((item) => {
    if (!item.assignedTo || item.assignedTo.length === 0) return;
    const share = item.amount / item.assignedTo.length;
    item.assignedTo.forEach((userId) => {
      totals[userId] = (totals[userId] || 0) + share;
    });
  });
  return Object.entries(totals).map(([userId, amount]) => ({
    userId,
    amount: Math.round(amount * 100) / 100,
  }));
};

/**
 * Validate that split amounts add up to total
 */
export const validateSplit = (splits, totalAmount) => {
  const sum = splits.reduce((acc, s) => acc + s.amount, 0);
  return Math.abs(sum - totalAmount) < 0.01; // Allow 1 cent rounding
};

/**
 * Validate that percentages add up to 100
 */
export const validatePercentages = (percentages) => {
  const sum = Object.values(percentages).reduce((acc, p) => acc + p, 0);
  return Math.abs(sum - 100) < 0.01;
};

```

## File: client/src/utils/validators.js
```javascript
/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Validate phone number (basic international format)
 */
export const isValidPhone = (phone) => {
  const re = /^\+?[\d\s-]{10,15}$/;
  return re.test(phone);
};

/**
 * Validate amount (positive number)
 */
export const isValidAmount = (amount) => {
  const num = parseFloat(amount);
  return !isNaN(num) && num > 0;
};

/**
 * Validate required string
 */
export const isRequired = (value) => {
  return value !== null && value !== undefined && String(value).trim().length > 0;
};

/**
 * Validate min length
 */
export const minLength = (value, min) => {
  return String(value).trim().length >= min;
};

/**
 * Validate max length
 */
export const maxLength = (value, max) => {
  return String(value).trim().length <= max;
};

/**
 * Run multiple validators and return error messages
 * rules: [{ test: fn, message: 'Error message' }]
 */
export const validate = (value, rules) => {
  for (const rule of rules) {
    if (!rule.test(value)) {
      return rule.message;
    }
  }
  return null;
};

/**
 * Validate expense form
 */
export const validateExpenseForm = (data) => {
  const errors = {};

  if (!isRequired(data.description)) errors.description = 'Description is required';
  if (!isValidAmount(data.amount)) errors.amount = 'Enter a valid amount';
  if (!isRequired(data.currency)) errors.currency = 'Select a currency';
  if (!isRequired(data.payerId)) errors.payerId = 'Select who paid';

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate group form
 */
export const validateGroupForm = (data) => {
  const errors = {};

  if (!isRequired(data.name)) errors.name = 'Group name is required';
  if (!minLength(data.name, 2)) errors.name = 'Name must be at least 2 characters';

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

```

## File: server/src/controllers/auth.controller.js
```javascript
const authService = require('../services/auth.service');
const { success } = require('../utils/responseHelper');

const login = async (req, res, next) => {
  try {
    const { email, name, phone, token, fcmToken } = req.body;
    
    // In production, verify `token` with Firebase Admin here to extract email/uid securely.
    // Since Firebase keys are not configured yet, we mock this by accepting the client payload.
    const user = await authService.loginOrCreateUser({ 
      email: email || 'you@example.com', 
      name: name || 'Demo User', 
      phone, 
      fcmToken 
    });
    
    success(res, { user, token: token || 'mock-dev-token' }, 'Login successful');
  } catch (err) {
    next(err);
  }
};

module.exports = { login };

```

## File: server/src/controllers/balance.controller.js
```javascript
const balanceService = require('../services/balance.service');
const { success } = require('../utils/responseHelper');

const getBalances = async (req, res, next) => {
  try {
    const { groupId } = req.query;
    if (!groupId) return res.status(400).json({ success: false, message: 'groupId is required' });
    const settlements = await balanceService.calculateBalancesForGroup(groupId);
    success(res, settlements, 'Balances fetched');
  } catch (err) { next(err); }
};

const settle = async (req, res, next) => {
  try {
    const { groupId } = req.body;
    const settlement = await balanceService.settleBalance(groupId, req.body);
    success(res, settlement, 'Settlement recorded');
  } catch (err) { next(err); }
};

module.exports = { getBalances, settle };

```

## File: server/src/controllers/currency.controller.js
```javascript
const currencyService = require('../services/currency.service');
const { success } = require('../utils/responseHelper');

const getRates = async (req, res, next) => {
  try {
    const base = req.query.base || 'INR';
    const rates = await currencyService.getRates(base);
    success(res, { base, rates }, 'Rates fetched successfully');
  } catch (err) { next(err); }
};

const convert = async (req, res, next) => {
  try {
    const { from, to, amount } = req.query;
    if (!from || !to || !amount) {
      return res.status(400).json({ success: false, message: 'from, to, amount queries required' });
    }
    const result = await currencyService.convertAmount(from, to, parseFloat(amount));
    success(res, { from, to, amount, result }, 'Conversion successful');
  } catch (err) { next(err); }
};

module.exports = { getRates, convert };

```

## File: server/src/controllers/expense.controller.js
```javascript
const expenseService = require('../services/expense.service');
const { success } = require('../utils/responseHelper');

const getExpenses = async (req, res, next) => {
  try {
    const { groupId } = req.query;
    if (!groupId) return res.status(400).json({ success: false, message: 'groupId is required' });
    const expenses = await expenseService.getExpensesForGroup(groupId);
    success(res, expenses, 'Expenses fetched');
  } catch (err) { next(err); }
};

const createExpense = async (req, res, next) => {
  try {
    const expense = await expenseService.addExpenseToGroup(req.user.id, req.body);
    success(res, expense, 'Expense added', 201);
  } catch (err) { next(err); }
};

module.exports = { getExpenses, createExpense };

```

## File: server/src/controllers/group.controller.js
```javascript
const groupService = require('../services/group.service');
const { success } = require('../utils/responseHelper');

const getGroups = async (req, res, next) => {
  try {
    const groups = await groupService.getGroupsForUser(req.user.id);
    success(res, groups, 'Groups fetched successfully');
  } catch (err) { next(err); }
};

const createGroup = async (req, res, next) => {
  try {
    const group = await groupService.createGroup(req.user.id, req.body);
    success(res, group, 'Group created successfully', 201);
  } catch (err) { next(err); }
};

const getGroup = async (req, res, next) => {
  try {
    const group = await groupService.getGroupById(req.params.id, req.user.id);
    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });
    success(res, group, 'Group returned');
  } catch (err) { next(err); }
};

const addMember = async (req, res, next) => {
  try {
    const member = await groupService.addMemberToGroup(req.params.id, req.body.userId);
    success(res, member, 'Member added', 201);
  } catch (err) { next(err); }
};

module.exports = { getGroups, createGroup, getGroup, addMember };

```

## File: server/src/index.js
```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { errorHandler } = require('./middleware/errorHandler');
const { rateLimiter } = require('./middleware/rateLimiter');

// Route imports
const authRoutes = require('./routes/auth.routes');
const groupRoutes = require('./routes/group.routes');
const expenseRoutes = require('./routes/expense.routes');
const balanceRoutes = require('./routes/balance.routes');
const currencyRoutes = require('./routes/currency.routes');
const receiptRoutes = require('./routes/receipt.routes');
const nudgeRoutes = require('./routes/nudge.routes');
const inviteRoutes = require('./routes/invite.routes');
const userRoutes = require('./routes/user.routes');

// Start cron jobs
require('./jobs/currencyRefresh.job');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(rateLimiter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', name: 'SplitWave API', version: '1.0.0' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/balances', balanceRoutes);
app.use('/api/currency', currencyRoutes);
app.use('/api/receipt', receiptRoutes);
app.use('/api/nudge', nudgeRoutes);
app.use('/api/invite', inviteRoutes);
app.use('/api/users', userRoutes);

// Error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 SplitWave API running on http://localhost:${PORT}`);
});

module.exports = app;

```

## File: server/src/jobs/currencyRefresh.job.js
```javascript
const cron = require('node-cron');
const currencyService = require('../services/currency.service');

// Schedule job to run every 1 hour (at minute 0)
cron.schedule('0 * * * *', async () => {
  console.log('[CRON] Starting currency rates refresh...');
  try {
    // Primary bases to sync
    const bases = ['INR', 'USD', 'EUR', 'GBP'];
    for (const base of bases) {
      await currencyService.fetchAndStoreRatesFromAPI(base);
    }
    console.log('[CRON] Currency rates refresh completed successfully.');
  } catch (error) {
    console.error('[CRON] Currency rates refresh failed:', error.message);
  }
});

```

## File: server/src/jobs/reminderCron.job.js
```javascript
const cron = require("node-cron");
const { PrismaClient } = require("@prisma/client");
const { sendFCMNotification } = require("../services/invite.service");

const prisma = new PrismaClient();

// Run daily at 9:00 AM
cron.schedule("0 9 * * *", async () => {
  console.log("Running Daily Reminder Cron Job...");

  // Find users who have splits not yet settled
  const pendingSplits = await prisma.split.findMany({
    where: { 
      settled: false,
      amount: { gt: 0 } 
    },
    include: {
      user: true, // Person who owes
      expense: {
        include: { payer: true, group: true } // Need payer to know who they owe
      }
    }
  });

  const remindersSent = new Set();

  for (const split of pendingSplits) {
    const debtor = split.user;
    const creditor = split.expense.payer;
    const group = split.expense.group;

    // Prevent sending too many to same user
    const reminderKey = `${debtor.id}-${creditor.id}-${group.id}`;
    if (remindersSent.has(reminderKey)) continue;

    // 1. FREE: In-App User with Push notification
    if (!debtor.isGhost && debtor.fcmToken) {
      await sendFCMNotification(debtor.fcmToken, {
        title: `You owe ${creditor.name} ${split.expense.currency} ${split.amount}`,
        body: `Settle up in '${group.name}' on SplitWave`
      });
      remindersSent.add(reminderKey);

      // Log last reminder
      await prisma.split.update({
        where: { id: split.id },
        data: { lastReminderAt: new Date() }
      });
    } 
    // 2. PAID: Opt-in SMS via Twilio/MSG91 (for Ghost users or users without app installed)
    else if (creditor.autoSMSReminders && debtor.phone) {
      // Stub for actual SMS Integration (Twilio/MSG91)
      console.log(`[SMS COST] Sending Paid Reminder SMS to Ghost ${debtor.phone} on behalf of ${creditor.name}`);
      
      remindersSent.add(reminderKey);
      
      await prisma.split.update({
        where: { id: split.id },
        data: { lastReminderAt: new Date() }
      });
    }
  }
});

```

## File: server/src/middleware/auth.middleware.js
```javascript
const prisma = require('../prisma');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    // TODO: Verify with Firebase Admin
    // const decoded = await admin.auth().verifyIdToken(token);
    // const email = decoded.email;

    // DEV MOCK:
    const email = 'you@example.com'; 

    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        user = await prisma.user.create({ data: { email, name: 'Demo User' } });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid authentication token' });
  }
};

module.exports = { authMiddleware };

```

## File: server/src/middleware/errorHandler.js
```javascript
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = { errorHandler };

```

## File: server/src/middleware/rateLimiter.js
```javascript
const rateLimit = require('express-rate-limit');

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // max 200 requests per window per IP
  message: {
    success: false,
    message: 'Too many requests. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { rateLimiter };

```

## File: server/src/prisma.js
```javascript
const { PrismaClient } = require('@prisma/client');

// Use a singleton pattern for PrismaClient
const prisma = new PrismaClient();

module.exports = prisma;

```

## File: server/src/routes/auth.routes.js
```javascript
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// POST /api/auth/login
router.post('/login', authController.login);

module.exports = router;

```

## File: server/src/routes/balance.routes.js
```javascript
const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth.middleware');
const balanceController = require('../controllers/balance.controller');

router.use(authMiddleware);
router.get('/', balanceController.getBalances);
router.post('/settle', balanceController.settle);

module.exports = router;

```

## File: server/src/routes/currency.routes.js
```javascript
const express = require('express');
const router = express.Router();
const currencyController = require('../controllers/currency.controller');

// Removing authMiddleware requirement here so Currency widget can be used universally
router.get('/rates', currencyController.getRates);
router.get('/convert', currencyController.convert);

module.exports = router;

```

## File: server/src/routes/expense.routes.js
```javascript
const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth.middleware');
const expenseController = require('../controllers/expense.controller');

router.use(authMiddleware);
router.get('/', expenseController.getExpenses);
router.post('/', expenseController.createExpense);

module.exports = router;

```

## File: server/src/routes/group.routes.js
```javascript
const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth.middleware');
const groupController = require('../controllers/group.controller');

router.use(authMiddleware);
router.get('/', groupController.getGroups);
router.post('/', groupController.createGroup);
router.get('/:id', groupController.getGroup);
router.post('/:id/members', groupController.addMember);

module.exports = router;

```

## File: server/src/routes/invite.routes.js
```javascript
const express = require("express");
const router = express.Router();
const inviteService = require("../services/invite.service");

// POST /api/invite/send
router.post("/send", async (req, res, next) => {
  try {
    const { phone, groupId, inviterId, groupName } = req.body;
    if (!phone || !inviterId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await inviteService.inviteMember(phone, groupId, inviterId, groupName);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// GET /api/invite/:token
router.get("/:token", (req, res) => {
  // Real app logic would verify token and add current user to group
  res.send("Join via link endpoint (stub)");
});

module.exports = router;

```

## File: server/src/routes/nudge.routes.js
```javascript
const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth.middleware');
const { success } = require('../utils/responseHelper');

// POST /api/nudge/send
router.post('/send', authMiddleware, async (req, res, next) => {
  try {
    const { toUserId, groupId, tone } = req.body;
    // TODO: Build message from template, send via FCM
    success(res, { toUserId, tone, sent: true }, 'Nudge sent');
  } catch (err) {
    next(err);
  }
});

module.exports = router;

```

## File: server/src/routes/receipt.routes.js
```javascript
const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth.middleware');
const { success } = require('../utils/responseHelper');

// POST /api/receipt/scan
router.post('/scan', authMiddleware, async (req, res, next) => {
  try {
    // TODO: Handle file upload + call GPT-4o Vision
    success(res, {
      items: [
        { name: 'Sample Item 1', amount: 250, quantity: 1 },
        { name: 'Sample Item 2', amount: 180, quantity: 2 },
      ],
    }, 'Receipt scanned');
  } catch (err) {
    next(err);
  }
});

module.exports = router;

```

## File: server/src/routes/user.routes.js
```javascript
const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// GET /api/users/search?q=
router.get("/search", async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) {
      return res.json([]);
    }

    const users = await prisma.user.findMany({
      where: {
        AND: [
          { isGhost: false },
          {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { email: { contains: q, mode: "insensitive" } },
              { phone: { contains: q } }
            ]
          }
        ]
      },
      take: 10,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true
      }
    });

    res.json(users);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

```

## File: server/src/services/auth.service.js
```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const loginOrCreateUser = async ({ email, name, phone, fcmToken }) => {
  const user = await prisma.user.upsert({
    where: { email },
    update: fcmToken ? { fcmToken } : {},
    create: { email, name, phone, fcmToken }
  });
  return user;
};

const getUserById = async (id) => {
  return await prisma.user.findUnique({ where: { id } });
}

module.exports = { loginOrCreateUser, getUserById };

```

## File: server/src/services/balance.service.js
```javascript
const prisma = require('../prisma');
const { simplifyDebts } = require('../utils/debtSimplifier');

const calculateBalancesForGroup = async (groupId) => {
  const expenses = await prisma.expense.findMany({
    where: { groupId },
    include: { splits: true }
  });

  const netBalances = {};
  
  expenses.forEach(exp => {
    if (!netBalances[exp.payerId]) netBalances[exp.payerId] = 0;
    netBalances[exp.payerId] += exp.amountInBase;
    
    exp.splits.forEach(split => {
      if (!netBalances[split.userId]) netBalances[split.userId] = 0;
      netBalances[split.userId] -= split.amount;
    });
  });
  
  return simplifyDebts(netBalances);
};

const settleBalance = async (groupId, data) => {
  return await prisma.settlement.create({
    data: {
      groupId,
      fromUserId: data.fromUserId,
      toUserId: data.toUserId,
      amount: data.amount,
      currency: data.currency || 'INR'
    }
  });
};

module.exports = { calculateBalancesForGroup, settleBalance };

```

## File: server/src/services/currency.service.js
```javascript
const axios = require('axios');
const prisma = require('../prisma');

const fetchAndStoreRatesFromAPI = async (base = 'INR') => {
  const apiKey = process.env.EXCHANGERATE_API_KEY;
  if (!apiKey || apiKey === 'your_exchangerate_api_key') {
    console.warn('EXCHANGERATE_API_KEY is missing or using default. Skipping live sync.');
    return null;
  }

  try {
    const response = await axios.get(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/${base}`);
    if (response.data && response.data.result === 'success') {
       const rates = response.data.conversion_rates;
       
       await prisma.currencyRate.deleteMany({ where: { base } });
       
       const insertData = Object.entries(rates).map(([target, rate]) => ({
         base,
         target,
         rate
       }));
       
       await prisma.currencyRate.createMany({ data: insertData });
       return insertData;
    }
  } catch (error) {
    if (error.response?.data?.['error-type'] === 'invalid-key') {
      console.warn('ExchangeRate-API: Invalid API Key. Please update your .env file.');
    } else {
      console.error('Failed to fetch from ExchangeRate-API', error.message);
    }
    throw error;
  }
};

const getRates = async (base = 'INR') => {
  let ratesFromDb = await prisma.currencyRate.findMany({ where: { base } });
  
  if (ratesFromDb.length === 0) {
    // Attempt to fetch from API if DB is empty for this base
    try {
      await fetchAndStoreRatesFromAPI(base);
      ratesFromDb = await prisma.currencyRate.findMany({ where: { base } });
    } catch (e) {
      // Ignore API errors strictly and fall back to empty map
    }
  }

  // Fallback to offline defaults if DB remains empty and API failed
  if (ratesFromDb.length === 0 && base === 'INR') {
     console.log('Using offline mock rates fallback for INR');
     const MOCK_RATES = {
       INR: 1, USD: 0.012, EUR: 0.011, GBP: 0.0095, JPY: 1.79, AUD: 0.018, CAD: 0.016, 
       CHF: 0.0106, CNY: 0.087, SGD: 0.016, AED: 0.044, THB: 0.42, MYR: 0.056, 
       KRW: 16.2, BRL: 0.06, ZAR: 0.22,
     };
     return MOCK_RATES;
  } else if (ratesFromDb.length === 0 && base === 'USD') {
     const MOCK_RATES = {
       USD: 1, INR: 83.33, EUR: 0.92, GBP: 0.79, JPY: 150.8,
     };
     return MOCK_RATES;
  }

  const ratesMap = {};
  ratesFromDb.forEach(r => ratesMap[r.target] = r.rate);
  return ratesMap;
};

const convertAmount = async (from, to, amount) => {
   const baseRates = await getRates(from);
   const targetRate = baseRates[to];
   if (!targetRate) throw new Error('Unsupported currency conversion');
   return amount * targetRate;
};

module.exports = {
  fetchAndStoreRatesFromAPI,
  getRates,
  convertAmount
};

```

## File: server/src/services/expense.service.js
```javascript
const prisma = require('../prisma');

const getExpensesForGroup = async (groupId) => {
  return await prisma.expense.findMany({
    where: { groupId },
    include: {
      payer: true,
      splits: true
    },
    orderBy: { createdAt: 'desc' }
  });
};

const addExpenseToGroup = async (userId, data) => {
  return await prisma.expense.create({
    data: {
      groupId: data.groupId,
      description: data.description,
      amount: data.amount,
      currency: data.currency || 'INR',
      amountInBase: data.amount, // Assume INR for now
      vibeTag: data.vibeTag,
      payerId: data.payerId || userId,
      splitType: data.splitType || 'equal',
      splits: {
        create: data.splits // Array of { userId, amount }
      }
    },
    include: { splits: true, payer: true }
  });
};

module.exports = { getExpensesForGroup, addExpenseToGroup };

```

## File: server/src/services/group.service.js
```javascript
const prisma = require('../prisma');

const getGroupsForUser = async (userId) => {
  return await prisma.group.findMany({
    where: { members: { some: { userId } } },
    include: {
      members: { include: { user: true } },
      expenses: { include: { splits: true } }
    }
  });
};

const createGroup = async (userId, data) => {
  return await prisma.group.create({
    data: {
      name: data.name,
      emoji: data.emoji,
      baseCurrency: data.baseCurrency || 'INR',
      members: {
        create: {
          userId,
          role: 'admin'
        }
      }
    },
    include: { members: true }
  });
};

const getGroupById = async (groupId, userId) => {
  return await prisma.group.findUnique({
    where: { id: groupId, members: { some: { userId } } },
    include: { members: { include: { user: true } }, expenses: true }
  });
};

const addMemberToGroup = async (groupId, targetUserId) => {
  return await prisma.groupMember.create({
    data: {
      groupId,
      userId: targetUserId,
      role: 'member'
    }
  });
};

module.exports = {
  getGroupsForUser,
  createGroup,
  getGroupById,
  addMemberToGroup
};

```

## File: server/src/services/invite.service.js
```javascript
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const admin = require("firebase-admin");
const crypto = require("crypto");

// Dummy twilio setup (only if you have keys)
// const twilioClient = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_AUTH);

async function sendFCMNotification(token, payload) {
  if (!token) return;
  try {
    // Only works if admin.initializeApp() is called elsewhere in your server
    if (admin.apps.length > 0) {
      await admin.messaging().send({
        token,
        notification: payload
      });
    }
  } catch (err) {
    console.error("FCM Send Error:", err);
  }
}

function generateInviteLink(groupId) {
  // Real app logic might involve signed tokens. Here we just return a frontend route.
  // E.g., https://splitwave.app/join/{token}
  const token = crypto.randomUUID();
  // Here we'd store the token mapping to the group if needed, but for simplicity:
  return `http://localhost:5173/join/${groupId}?t=${token}`;
}

function buildWhatsAppUrl(phone, link, groupName, inviterName) {
  const message = `Hey! ${inviterName} added you to '${groupName}' on SplitWave. Join here to see your expenses: ${link}`;
  return `https://wa.me/${phone.replace("+", "")}?text=${encodeURIComponent(message)}`;
}

async function addToGroup(userId, groupId) {
  try {
    const existing = await prisma.groupMember.findUnique({
      where: { userId_groupId: { userId, groupId } }
    });
    if (!existing) {
      await prisma.groupMember.create({
        data: { userId, groupId, role: "member" }
      });
    }
  } catch(err) {
    console.warn("User already in group or error:", err);
  }
}

async function inviteMember(phone, groupId, inviterId, groupName) {
  const inviter = await prisma.user.findUnique({ where: { id: inviterId } });
  
  // Step 1: Check if user exists
  const existing = await prisma.user.findFirst({
    where: { phone }
  });

  if (existing) {
    if (groupId) {
      await addToGroup(existing.id, groupId);
      if (existing.fcmToken) {
        await sendFCMNotification(existing.fcmToken, {
          title: "You've been added to a group!",
          body: `${inviter?.name || "Someone"} added you to '${groupName}' on SplitWave`
        });
      }
    }
    return { method: "direct", success: true, user: existing };
  }

  // Step 2 & 3: create ghost member + invite link
  // Use phone as a placeholder name and a fake email since email is @unique and required
  const fakeEmail = `ghost_${Date.now()}_${Math.random().toString(36).substring(7)}@ghost.com`;
  
  const ghost = await prisma.user.create({
    data: {
      name: `User ${phone}`,
      email: fakeEmail,
      phone,
      isGhost: true
    }
  });

  if (groupId) {
    await addToGroup(ghost.id, groupId);
    const inviteLink = generateInviteLink(groupId);
    const whatsappUrl = buildWhatsAppUrl(phone, inviteLink, groupName, inviter?.name || "Someone");
    
    if (inviter && inviter.autoSMSReminders) console.log(`[SMS] Paid invite sent to ${phone}`);
    return { method: "whatsapp_deeplink", whatsappUrl, inviteLink, success: true, user: ghost };
  } else {
    // Just a friend connection
    const inviteLink = "https://splitwave.app/join";
    const message = `Hey! ${inviter?.name || "I"} added you on SplitWave to split expenses. Download the app here: ${inviteLink}`;
    const whatsappUrl = `https://wa.me/${phone.replace("+", "")}?text=${encodeURIComponent(message)}`;
    
    if (inviter && inviter.autoSMSReminders) console.log(`[SMS] Paid invite sent to ${phone}`);
    return { method: "whatsapp_deeplink", whatsappUrl, inviteLink, success: true, user: ghost };
  }
}

module.exports = {
  inviteMember,
  buildWhatsAppUrl,
  generateInviteLink,
  sendFCMNotification
};

```

## File: server/src/utils/debtSimplifier.js
```javascript
const simplifyDebts = (balances) => {
  const creditors = [];
  const debtors = [];

  Object.entries(balances).forEach(([userId, balance]) => {
    if (balance > 0.01) {
      creditors.push({ userId, amount: balance });
    } else if (balance < -0.01) {
      debtors.push({ userId, amount: Math.abs(balance) });
    }
  });

  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);

  const settlements = [];
  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];
    const settlement = Math.min(debtor.amount, creditor.amount);

    settlements.push({
      from: debtor.userId,
      to: creditor.userId,
      amount: Math.round(settlement * 100) / 100,
    });

    debtor.amount -= settlement;
    creditor.amount -= settlement;

    if (debtor.amount < 0.01) i++;
    if (creditor.amount < 0.01) j++;
  }

  return settlements;
};

module.exports = { simplifyDebts };

```

## File: server/src/utils/responseHelper.js
```javascript
const success = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

const error = (res, message = 'Error', statusCode = 400) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = { success, error };

```

## File: server/prisma/schema.prisma
```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id               String        @id @default(uuid())
  name             String
  email            String        @unique
  phone            String?
  homeCurrency     String        @default("INR")
  fcmToken         String?
  autoSMSReminders Boolean       @default(false)
  isGhost          Boolean       @default(false)
  createdAt        DateTime      @default(now())
  groups           GroupMember[]
  paidExpenses     Expense[]     @relation("Payer")
  splits           Split[]
}

model Group {
  id           String        @id @default(uuid())
  name         String
  emoji        String?
  baseCurrency String        @default("INR")
  createdAt    DateTime      @default(now())
  members      GroupMember[]
  expenses     Expense[]
}

model GroupMember {
  id      String @id @default(uuid())
  user    User   @relation(fields: [userId], references: [id])
  userId  String
  group   Group  @relation(fields: [groupId], references: [id])
  groupId String
  role    String @default("member")

  @@unique([userId, groupId])
}

model Expense {
  id           String   @id @default(uuid())
  group        Group    @relation(fields: [groupId], references: [id])
  groupId      String
  description  String
  amount       Float
  currency     String
  amountInBase Float
  vibeTag      String?
  payer        User     @relation("Payer", fields: [payerId], references: [id])
  payerId      String
  splitType    String   @default("equal")
  isRecurring  Boolean  @default(false)
  recurringDay Int?
  receiptUrl   String?
  createdAt    DateTime @default(now())
  splits       Split[]
}

model Split {
  id             String    @id @default(uuid())
  expense        Expense   @relation(fields: [expenseId], references: [id])
  expenseId      String
  user           User      @relation(fields: [userId], references: [id])
  userId         String
  amount         Float
  percentage     Float?
  settled        Boolean   @default(false)
  settledAt      DateTime?
  lastReminderAt DateTime?
}

model Settlement {
  id         String   @id @default(uuid())
  groupId    String
  fromUserId String
  toUserId   String
  amount     Float
  currency   String
  settledAt  DateTime @default(now())
}

model CurrencyRate {
  id        String   @id @default(uuid())
  base      String
  target    String
  rate      Float
  updatedAt DateTime @updatedAt

  @@unique([base, target])
}

```

## File: server/prisma/seed.js
```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial data...');
  
  const user1 = await prisma.user.upsert({
    where: { email: 'you@example.com' },
    update: {},
    create: {
      email: 'you@example.com',
      name: 'Demo User',
      homeCurrency: 'INR'
    }
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'lina@example.com' },
    update: {},
    create: {
      email: 'lina@example.com',
      name: 'Lina Punk',
      homeCurrency: 'INR'
    }
  });

  const group = await prisma.group.create({
    data: {
      name: 'Goa Trip 2026',
      emoji: '🏖️',
      baseCurrency: 'INR',
      members: {
        create: [
          { userId: user1.id, role: 'admin' },
          { userId: user2.id, role: 'member' }
        ]
      }
    }
  });

  const expense = await prisma.expense.create({
    data: {
      groupId: group.id,
      description: 'Coffee',
      amount: 1453,
      currency: 'INR',
      amountInBase: 1453,
      vibeTag: 'food',
      payerId: user1.id,
      splitType: 'equal',
      splits: {
        create: [
          { userId: user1.id, amount: 726.5 },
          { userId: user2.id, amount: 726.5 }
        ]
      }
    }
  });

  console.log('Seeding complete!', { user1Id: user1.id, groupId: group.id });
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });

```

