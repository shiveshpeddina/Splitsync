import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import CurrencySelector from '../components/currency/CurrencySelector';
import splitSyncLogo from '../assets/splitsync-icon.png';
import styles from './AuthPage.module.css';

export default function AuthPage() {
  const { login, loginWithEmail, signupWithEmail, user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
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
        await signupWithEmail(email, password, name, '', homeCurrency);
      } else {
        await loginWithEmail(email, password);
      }
    } catch (err) {
      console.error('Email Auth failed:', err);
      let friendlyMessage = 'Authentication failed. Please try again.';
      if (err.code === 'auth/invalid-credential') {
        friendlyMessage = 'Invalid email or password. Please check your credentials and try again.';
      } else if (err.code === 'auth/email-already-in-use') {
        friendlyMessage = 'An account with this email already exists. Try signing in instead.';
      } else if (err.code === 'auth/weak-password') {
        friendlyMessage = 'Password should be at least 6 characters.';
      } else if (err.message) {
        friendlyMessage = err.message.replace('Firebase: ', '').split(' (')[0];
      }
      setError(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className={styles.container}>
      {/* Left Panel - Hidden on Mobile */}
      <div className={styles.leftPanel}>
        <div className={styles.blob} />
        
        <div className={styles.leftContent}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className={styles.brandLogoWrap}>
              <img src={splitSyncLogo} alt="SplitSync" className={styles.brandLogo} />
              <h1 className={styles.brandName}>SplitSync</h1>
            </div>
            <p className={styles.tagline}>
              Split expenses. Settle debts. Stay friends.
            </p>
          </motion.div>

          <div className={styles.mockupContainer}>
            <motion.div 
              className={styles.mockupCard}
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            >
              <div className={styles.mockupHeader}>
                <div className={styles.mockupIcon}>🍔</div>
                <div style={{flex: 1}}>
                  <div className={styles.mockupTitle}>Dinner at Taj</div>
                  <div className={styles.mockupDate}>Paid by John</div>
                </div>
                <div className={styles.mockupAmount}>₹4,500</div>
              </div>
            </motion.div>
            
            <motion.div 
              className={styles.mockupCard}
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
              style={{ marginLeft: '40px', marginTop: '-20px', zIndex: 2 }}
            >
              <div className={styles.mockupHeader}>
                <div className={styles.mockupIcon}>🚕</div>
                <div style={{flex: 1}}>
                  <div className={styles.mockupTitle}>Uber to Airport</div>
                  <div className={styles.mockupDate}>Paid by You</div>
                </div>
                <div className={styles.mockupAmount}>₹850</div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className={styles.rightPanel}>
        <div className={styles.formContainer}>
          <div className={styles.formLogo}>
            <img src={splitSyncLogo} alt="SplitSync" className={styles.formLogoImg} />
            <span>SplitSync</span>
          </div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={formVariants}
            className={styles.formWrapper}
          >
            <motion.div variants={itemVariants} className={styles.formHeader}>
              <h2 className={styles.welcomeText}>
                {isSignUp ? 'Create an account' : 'Welcome back'}
              </h2>
              <p className={styles.subtitle}>
                {isSignUp ? 'Sign up to start splitting expenses' : 'Sign in to your account'}
              </p>
            </motion.div>

            {error && (
              <motion.div variants={itemVariants} className={styles.errorMessage}>
                {error}
              </motion.div>
            )}

            <form onSubmit={handleEmailSubmit} className={styles.form}>
              <motion.div variants={itemVariants} className={styles.inputs}>
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
                    <div className={styles.currencySelect}>
                      <label className={styles.inputLabel}>Preferred Currency</label>
                      <div className={styles.currencyWrapper}>
                        <CurrencySelector 
                          value={homeCurrency} 
                          onChange={setHomeCurrency} 
                        />
                      </div>
                    </div>
                  </>
                )}
                
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  prefix={<Mail size={18} />}
                  required
                />
                
                <Input
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  suffix={
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className={styles.passwordToggle}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  }
                  required
                />
              </motion.div>

              <motion.div variants={itemVariants} style={{ marginTop: '24px' }}>
                <Button 
                  type="submit" 
                  variant="primary" 
                  size="large"
                  fullWidth 
                  disabled={loading}
                >
                  {isSignUp ? 'Sign Up' : 'Sign In'}
                </Button>
              </motion.div>
            </form>

            <motion.div variants={itemVariants} className={styles.divider}>
              <div className={styles.dividerLine} />
              <span className={styles.dividerText}>OR</span>
              <div className={styles.dividerLine} />
            </motion.div>

            <motion.div variants={itemVariants}>
              <Button 
                type="button" 
                variant="outline" 
                size="large"
                fullWidth 
                onClick={handleGoogleLogin} 
                disabled={loading}
                className={styles.googleButton}
              >
                <img 
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                  alt="Google" 
                  className={styles.googleIcon} 
                />
                Continue with Google
              </Button>
            </motion.div>

            <motion.p variants={itemVariants} className={styles.switchMode}>
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={() => { setIsSignUp(!isSignUp); setError(null); }}
                className={styles.switchModeButton}
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </motion.p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
