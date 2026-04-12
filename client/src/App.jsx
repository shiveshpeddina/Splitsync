import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { GroupProvider } from './context/GroupContext';
import { FriendProvider } from './context/FriendContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { ToastProvider } from './components/common/Toast';

import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import GroupDetailPage from './pages/GroupDetailPage';
import NotFound from './pages/NotFound';
import CurrencyPage from './pages/CurrencyPage';
import ProfilePage from './pages/ProfilePage';
import Analytics from './pages/Analytics';
import ProtectedRoute from './components/common/ProtectedRoute';

import './styles/index.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <GroupProvider>
          <FriendProvider>
            <CurrencyProvider>
            <ToastProvider>
              <div className="app">
                <Routes>
                  <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
                  <Route path="/currency" element={<ProtectedRoute><CurrencyPage /></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                  <Route path="/login" element={<AuthPage />} />
                  <Route path="/group/:id" element={<ProtectedRoute><GroupDetailPage /></ProtectedRoute>} />
                  <Route path="/analytics/:id" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </ToastProvider>
            </CurrencyProvider>
          </FriendProvider>
        </GroupProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
