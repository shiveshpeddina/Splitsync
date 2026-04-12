import api from './api';

export const uploadReceipt = async (file) => {
  const formData = new FormData();
  formData.append('receipt', file);
  return api.post('/receipt/scan', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const parseItems = async (imageUrl) => {
  return api.post('/receipt/parse', { imageUrl });
};
