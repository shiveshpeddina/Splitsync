const currencyService = require('../services/currency.service');
const { success } = require('../utils/responseHelper');

const getRates = async (req, res, next) => {
  try {
    const base = req.query.base || 'INR';
    const rates = await currencyService.getRates(base);
    success(res, { base, rates }, 'Rates fetched successfully');
  } catch (err) { next(err); }
};

const convert = async (req, res, next) => {
  try {
    const { from, to, amount } = req.query;
    if (!from || !to || !amount) {
      return res.status(400).json({ success: false, message: 'from, to, amount queries required' });
    }
    const result = await currencyService.convertAmount(from, to, parseFloat(amount));
    success(res, { from, to, amount, result }, 'Conversion successful');
  } catch (err) { next(err); }
};

module.exports = { getRates, convert };
