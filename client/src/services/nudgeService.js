import api from './api';

export const sendNudge = async (toUserId, groupId, tone) => {
  return api.post('/nudge/send', { toUserId, groupId, tone });
};
