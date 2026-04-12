import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const CurrencyContext = createContext(null);

export const CurrencyProvider = ({ children }) => {
  const [rates, setRates] = useState({});
  const [homeCurrency, setHomeCurrency] = useState('INR');
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchRates = async (base = 'INR') => {
    setLoading(true);
    try {
      const response = await api.get(`/currency/rates?base=${base}`);
      setRates(response.data?.rates || {});
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch rates:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  return (
    <CurrencyContext.Provider
      value={{ rates, homeCurrency, setHomeCurrency, loading, lastUpdated, fetchRates }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error('useCurrency must be used within a CurrencyProvider');
  return context;
};

export default CurrencyContext;
