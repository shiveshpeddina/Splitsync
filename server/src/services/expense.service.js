const prisma = require('../prisma');
const currencyService = require('./currency.service');

const getExpensesForGroup = async (groupId) => {
  return await prisma.expense.findMany({
    where: { groupId },
    include: {
      payer: true,
      splits: true
    },
    orderBy: { createdAt: 'desc' }
  });
};

const addExpenseToGroup = async (userId, data) => {
  const expenseCurrency = data.currency || 'INR';
  
  // Convert expense amount to INR base for consistent calculations
  let amountInBase = data.amount;
  if (expenseCurrency !== 'INR') {
    try {
      // convertAmount(from, to, amount) — from EUR to INR
      amountInBase = await currencyService.convertAmount(expenseCurrency, 'INR', data.amount);
    } catch (err) {
      console.warn(`Currency conversion failed for ${expenseCurrency} → INR, using raw amount. Error: ${err.message}`);
      amountInBase = data.amount; // fallback: store raw, frontend will handle
    }
  }

  return await prisma.expense.create({
    data: {
      groupId: data.groupId,
      description: data.description,
      amount: data.amount,           // original amount in original currency (e.g. 50 EUR)
      currency: expenseCurrency,     // original currency code
      amountInBase: amountInBase,    // converted to INR for cross-currency math
      vibeTag: data.vibeTag,
      payerId: data.payerId || userId,
      splitType: data.splitType || 'equal',
      isRecurring: data.isRecurring || false,
      recurringDay: data.recurringDay || null,
      splits: {
        create: data.splits // Array of { userId, amount } — amounts are in original currency
      }
    },
    include: { splits: true, payer: true }
  });
};

const deleteExpense = async (userId, expenseId) => {
  const expense = await prisma.expense.findUnique({
    where: { id: expenseId },
    include: { group: { include: { members: true } } }
  });

  if (!expense) throw new Error('Expense not found');

  const isMember = expense.group.members.some(m => m.userId === userId);
  if (!isMember) throw new Error('You do not have permission to delete this expense');

  return await prisma.$transaction(async (tx) => {
    await tx.split.deleteMany({
      where: { expenseId }
    });
    return await tx.expense.delete({
      where: { id: expenseId }
    });
  });
};

module.exports = { getExpensesForGroup, addExpenseToGroup, deleteExpense };
