import { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider } from '../config/firebase';
import { signInWithPopup, signOut, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
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
              phone: window.__PENDING_SIGNUP_PHONE || firebaseUser.phoneNumber,
              homeCurrency: window.__PENDING_SIGNUP_CURRENCY || 'INR',
              token
            });
            window.__PENDING_SIGNUP_PHONE = undefined;
            window.__PENDING_SIGNUP_CURRENCY = undefined;

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
      // Firebase not configured
      setLoading(false);
    }
  }, []);

  const loginWithGoogle = async () => {
    if (auth) {
      await signInWithPopup(auth, googleProvider);
    } else {
      throw new Error('Firebase Auth not initialized');
    }
  };

  const signupWithEmail = async (email, password, name, phone, homeCurrency) => {
    if (auth) {
      window.__PENDING_SIGNUP_PHONE = phone;
      window.__PENDING_SIGNUP_CURRENCY = homeCurrency;
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      // The onAuthStateChanged listener will handle the backend API call
    } else {
      throw new Error('Firebase Auth not initialized');
    }
  };

  const loginWithEmail = async (email, password) => {
    if (auth) {
      await signInWithEmailAndPassword(auth, email, password);
    } else {
      throw new Error('Firebase Auth not initialized');
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
    <AuthContext.Provider value={{ user, loading, login: loginWithGoogle, signupWithEmail, loginWithEmail, logout: performLogout, updateUser }}>
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
