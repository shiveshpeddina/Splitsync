const cron = require('node-cron');
const currencyService = require('../services/currency.service');

// Schedule job to run every 1 hour (at minute 0)
cron.schedule('0 * * * *', async () => {
  console.log('[CRON] Starting currency rates refresh...');
  try {
    // Primary bases to sync
    const bases = ['INR', 'USD', 'EUR', 'GBP'];
    for (const base of bases) {
      await currencyService.fetchAndStoreRatesFromAPI(base);
    }
    console.log('[CRON] Currency rates refresh completed successfully.');
  } catch (error) {
    console.error('[CRON] Currency rates refresh failed:', error.message);
  }
});
