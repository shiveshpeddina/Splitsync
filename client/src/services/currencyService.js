import api from './api';

export const getRates = async (base = 'INR') => {
  return api.get(`/currency/rates?base=${base}`);
};

export const convertAmount = async (from, to, amount) => {
  return api.get(`/currency/convert?from=${from}&to=${to}&amount=${amount}`);
};
