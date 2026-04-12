const balanceService = require('../services/balance.service');
const { success } = require('../utils/responseHelper');

const getBalances = async (req, res, next) => {
  try {
    const { groupId } = req.query;
    if (!groupId) return res.status(400).json({ success: false, message: 'groupId is required' });
    const settlements = await balanceService.calculateBalancesForGroup(groupId);
    success(res, settlements, 'Balances fetched');
  } catch (err) { next(err); }
};

const settle = async (req, res, next) => {
  try {
    const { groupId } = req.body;
    const settlement = await balanceService.settleBalance(groupId, req.body);
    success(res, settlement, 'Settlement recorded');
  } catch (err) { next(err); }
};

module.exports = { getBalances, settle };
