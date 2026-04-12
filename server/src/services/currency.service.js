const axios = require('axios');
const prisma = require('../prisma');

const fetchAndStoreRatesFromAPI = async (base = 'INR') => {
  try {
    console.log(`Fetching live rates for ${base} from open.er-api.com...`);
    const response = await axios.get(`https://open.er-api.com/v6/latest/${base}`);
    if (response.data && response.data.result === 'success') {
       const rates = response.data.rates; // er-api uses 'rates', not 'conversion_rates'
       
       await prisma.currencyRate.deleteMany({ where: { base } });
       
       const insertData = Object.entries(rates).map(([target, rate]) => ({
         base,
         target,
         rate
       }));
       
       await prisma.currencyRate.createMany({ data: insertData });
       console.log(`Successfully synced ${insertData.length} live rates for ${base}`);
       return insertData;
    }
  } catch (error) {
    console.error('Failed to fetch from open.er-api.com', error.message);
    throw error;
  }
};

const getRates = async (base = 'INR') => {
  let ratesFromDb = await prisma.currencyRate.findMany({ where: { base } });
  
  if (ratesFromDb.length === 0) {
    // Attempt to fetch from API if DB is empty for this base
    try {
      await fetchAndStoreRatesFromAPI(base);
      ratesFromDb = await prisma.currencyRate.findMany({ where: { base } });
    } catch (e) {
      // Ignore API errors strictly and fall back to empty map
    }
  }

  // Fallback to offline defaults if DB remains empty and API failed
  if (ratesFromDb.length === 0 && base === 'INR') {
     console.log('Using offline mock rates fallback for INR');
     const MOCK_RATES = {
       INR: 1, USD: 0.012, EUR: 0.011, GBP: 0.0095, JPY: 1.79, AUD: 0.018, CAD: 0.016, 
       CHF: 0.0106, CNY: 0.087, SGD: 0.016, AED: 0.044, THB: 0.42, MYR: 0.056, 
       KRW: 16.2, BRL: 0.06, ZAR: 0.22,
     };
     return MOCK_RATES;
  } else if (ratesFromDb.length === 0 && base === 'USD') {
     const MOCK_RATES = {
       USD: 1, INR: 83.33, EUR: 0.92, GBP: 0.79, JPY: 150.8,
     };
     return MOCK_RATES;
  }

  const ratesMap = {};
  ratesFromDb.forEach(r => ratesMap[r.target] = r.rate);
  return ratesMap;
};

const convertAmount = async (from, to, amount) => {
   const baseRates = await getRates(from);
   const targetRate = baseRates[to];
   if (!targetRate) throw new Error('Unsupported currency conversion');
   return amount * targetRate;
};

module.exports = {
  fetchAndStoreRatesFromAPI,
  getRates,
  convertAmount
};
