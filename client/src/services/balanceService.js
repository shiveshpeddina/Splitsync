import api from './api';

export const getBalances = async (groupId) => {
  return api.get(`/balances?groupId=${groupId}`);
};

export const markSettled = async (data) => {
  return api.post('/balances/settle', data);
};
