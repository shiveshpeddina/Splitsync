const prisma = require('../prisma');
const { simplifyDebts } = require('../utils/debtSimplifier');

const calculateBalancesForGroup = async (groupId) => {
  const expenses = await prisma.expense.findMany({
    where: { groupId },
    include: { splits: true }
  });

  const netBalances = {};
  
  expenses.forEach(exp => {
    if (!netBalances[exp.payerId]) netBalances[exp.payerId] = 0;
    netBalances[exp.payerId] += exp.amountInBase;
    
    exp.splits.forEach(split => {
      if (!netBalances[split.userId]) netBalances[split.userId] = 0;
      netBalances[split.userId] -= split.amount;
    });
  });
  
  return simplifyDebts(netBalances);
};

const settleBalance = async (groupId, data) => {
  return await prisma.settlement.create({
    data: {
      groupId,
      fromUserId: data.fromUserId,
      toUserId: data.toUserId,
      amount: data.amount,
      currency: data.currency || 'INR'
    }
  });
};

module.exports = { calculateBalancesForGroup, settleBalance };
