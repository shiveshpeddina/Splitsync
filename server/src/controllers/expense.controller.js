const expenseService = require('../services/expense.service');
const { success } = require('../utils/responseHelper');

const getExpenses = async (req, res, next) => {
  try {
    const { groupId } = req.query;
    if (!groupId) return res.status(400).json({ success: false, message: 'groupId is required' });
    const expenses = await expenseService.getExpensesForGroup(groupId);
    success(res, expenses, 'Expenses fetched');
  } catch (err) { next(err); }
};

const createExpense = async (req, res, next) => {
  try {
    const expense = await expenseService.addExpenseToGroup(req.user.id, req.body);
    success(res, expense, 'Expense added', 201);
  } catch (err) { next(err); }
};

const deleteExpense = async (req, res, next) => {
  try {
    await expenseService.deleteExpense(req.user.id, req.params.id);
    success(res, null, 'Expense deleted successfully');
  } catch (err) {
    if (err.message.includes('permission')) {
      return res.status(403).json({ success: false, message: err.message });
    }
    next(err);
  }
};

module.exports = { getExpenses, createExpense, deleteExpense };
