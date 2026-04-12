import { convert } from './currencyUtils';

/**
 * Debt Simplification Algorithm
 * Minimizes the number of transactions needed to settle all debts.
 *
 * Input:  balances = { userId: netBalance }
 *   positive = owed money (creditor)
 *   negative = owes money (debtor)
 *
 * Output: Array of { from, to, amount }
 */
export const simplifyDebts = (balances) => {
  // Separate into creditors and debtors
  const creditors = [];
  const debtors = [];

  Object.entries(balances).forEach(([userId, balance]) => {
    if (balance > 0.01) {
      creditors.push({ userId, amount: balance });
    } else if (balance < -0.01) {
      debtors.push({ userId, amount: Math.abs(balance) });
    }
  });

  // Sort both lists descending by amount
  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);

  const settlements = [];
  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];
    const settlement = Math.min(debtor.amount, creditor.amount);

    settlements.push({
      from: debtor.userId,
      to: creditor.userId,
      amount: Math.round(settlement * 100) / 100,
    });

    debtor.amount -= settlement;
    creditor.amount -= settlement;

    if (debtor.amount < 0.01) i++;
    if (creditor.amount < 0.01) j++;
  }

  return settlements;
};

/**
 * Calculate net balances from expenses and splits.
 * All amounts are converted to INR (base currency) using live rates.
 *
 * expenses: [{ payerId, amount, currency, splits: [{ userId, amount }] }]
 * rates: exchange rates from CurrencyContext (base = INR)
 * Returns: { userId: netBalanceInINR }
 */
export const calculateNetBalances = (expenses, rates = {}, targetCurrency = 'INR') => {
  const balances = {};

  expenses.forEach((expense) => {
    const expenseCurrency = expense.currency || 'INR';

    // Payer gets credit for what they paid — strictly use live conversion to targetCurrency
    const paidAmount = convert(expense.amount, expenseCurrency, targetCurrency, rates);
    balances[expense.payerId] = (balances[expense.payerId] || 0) + paidAmount;

    // Each person's share is in the expense's currency — convert to targetCurrency
    expense.splits.forEach((split) => {
      const splitAmount = convert(split.amount, expenseCurrency, targetCurrency, rates);
      balances[split.userId] = (balances[split.userId] || 0) - splitAmount;
    });
  });

  return balances;
};
