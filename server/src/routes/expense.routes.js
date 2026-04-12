const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth.middleware');
const expenseController = require('../controllers/expense.controller');

router.use(authMiddleware);
router.get('/', expenseController.getExpenses);
router.post('/', expenseController.createExpense);
router.delete('/:id', expenseController.deleteExpense);

module.exports = router;
