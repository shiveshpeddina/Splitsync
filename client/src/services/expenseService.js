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
