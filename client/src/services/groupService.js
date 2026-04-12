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
