import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const FriendContext = createContext(null);

export const FriendProvider = ({ children }) => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchFriends();
    } else {
      setFriends([]);
      setLoading(false);
    }
  }, [user]);

  const fetchFriends = async () => {
    setLoading(true);
    try {
      const res = await api.get('/friends');
      setFriends(res.data || []);
    } catch (err) {
      console.error('Failed to fetch friends', err);
    } finally {
      setLoading(false);
    }
  };

  const addFriend = async (contact, name = '', currency = '') => {
    try {
      const res = await api.post('/friends/add', { contact, name, currency });
      setFriends((prev) => [res.data.friend, ...prev]);
      return res.data;
    } catch (err) {
      console.error('Failed to add friend', err);
      throw err;
    }
  };

  const updateFriend = async (friendId, data) => {
    try {
      const res = await api.put(`/friends/${friendId}`, data);
      setFriends(prev => prev.map(f => f.id === friendId ? { ...f, ...res.data.data } : f));
      return res.data;
    } catch (err) {
      console.error('Failed to update friend', err);
      throw err;
    }
  };

  const deleteFriend = async (friendId) => {
    try {
      await api.delete(`/friends/${friendId}`);
      setFriends(prev => prev.filter(f => f.id !== friendId));
    } catch (err) {
      console.error('Failed to delete friend', err);
      throw err;
    }
  };

  return (
    <FriendContext.Provider value={{ friends, loading, addFriend, updateFriend, deleteFriend, fetchFriends }}>
      {children}
    </FriendContext.Provider>
  );
};

export const useFriends = () => {
  const context = useContext(FriendContext);
  if (!context) throw new Error('useFriends must be used within a FriendProvider');
  return context;
};

export default FriendContext;
