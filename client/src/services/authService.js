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
