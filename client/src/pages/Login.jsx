import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import CurrencySelector from '../components/currency/CurrencySelector';
import './Login.css';

const Login = () => {
  const { login, loginWithEmail, signupWithEmail, user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [homeCurrency, setHomeCurrency] = useState('INR');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await login();
    } catch (err) {
      console.error('Google Login failed:', err);
      setError('Google Sign-In failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isSignUp) {
        await signupWithEmail(email, password, name, phone, homeCurrency);
      } else {
        await loginWithEmail(email, password);
      }
    } catch (err) {
      console.error('Email Auth failed:', err);
      // Map Firebase error codes to user-friendly messages
      let friendlyMessage = 'Authentication failed. Please try again.';
      if (err.code === 'auth/invalid-credential') {
        friendlyMessage = 'Invalid email or password. Please check your credentials and try again.';
      } else if (err.code === 'auth/email-already-in-use') {
        friendlyMessage = 'An account with this email already exists. Try signing in instead.';
      } else if (err.code === 'auth/weak-password') {
        friendlyMessage = 'Password should be at least 6 characters.';
      } else if (err.message) {
        // Fallback for unexpected errors, remove the "Firebase:" prefix if present
        friendlyMessage = err.message.replace('Firebase: ', '').split(' (')[0];
      }
      
      setError(friendlyMessage);
    } finally {
      setLoading(false);
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
          <img src="/splitsync-icon.png" alt="SplitSync" style={{ width: 48, height: 48, borderRadius: 12, marginBottom: 8 }} />
          <h1 className="login-logo-text" style={{ color: '#1a1a1a' }}>SplitSync</h1>
        </div>
        <p className="login-subtitle" style={{ color: '#5a5a5a' }}>
          Split expenses. Settle debts. Stay friends.
        </p>

        {error && <div style={{ color: 'var(--error)', marginBottom: 'var(--space-4)', fontSize: 'var(--text-sm)' }}>{error}</div>}

        <form onSubmit={handleEmailSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
          {isSignUp && (
            <>
              <Input
                label="Full Name"
                type="text"
                placeholder="e.g. John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                label="Phone Number"
                type="tel"
                placeholder="e.g. +91 9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                <label style={{ fontSize: 'var(--text-sm)', fontWeight: '600', color: '#374151' }}>Preferred Currency</label>
                <div style={{ border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: '2px' }}>
                  <CurrencySelector 
                    value={homeCurrency} 
                    onChange={setHomeCurrency} 
                  />
                </div>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                  All balances will be displayed in this currency
                </p>
              </div>
            </>
          )}
          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" variant="primary" loading={loading} fullWidth>
            {isSignUp ? 'Create Account' : 'Sign In'}
          </Button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', margin: 'var(--space-4) 0', color: 'var(--text-muted)' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-default)' }} />
          <span style={{ padding: '0 var(--space-3)', fontSize: 'var(--text-xs)' }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-default)' }} />
        </div>

        <div className="login-buttons">
          <Button variant="outline" fullWidth onClick={handleGoogleLogin} disabled={loading}>
            Continue with Google
          </Button>
        </div>

        <p style={{ marginTop: 'var(--space-6)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => { setIsSignUp(!isSignUp); setError(null); }}
            style={{ color: 'var(--primary-600)', background: 'none', border: 'none', fontWeight: 600, cursor: 'pointer', padding: 0 }}
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
};
export default Login;
