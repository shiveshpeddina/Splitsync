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
