/**
 * Equal split — divide total evenly among members
 * Returns array of { userId, amount } objects
 */
export const equalSplit = (totalAmount, memberIds) => {
  const share = totalAmount / memberIds.length;
  return memberIds.map((userId) => ({
    userId,
    amount: Math.round(share * 100) / 100,
  }));
};

/**
 * Percentage split — each member pays a percentage of total
 * percentages: { userId: 40, userId2: 60 }
 * Returns array of { userId, amount, percentage }
 */
export const pctSplit = (totalAmount, percentages) => {
  return Object.entries(percentages).map(([userId, pct]) => ({
    userId,
    amount: Math.round((totalAmount * pct / 100) * 100) / 100,
    percentage: pct,
  }));
};

/**
 * Exact split — each member pays a fixed amount
 * amounts: { userId: 500, userId2: 300 }
 * Returns array of { userId, amount }
 */
export const exactSplit = (amounts) => {
  return Object.entries(amounts).map(([userId, amount]) => ({
    userId,
    amount: Math.round(amount * 100) / 100,
  }));
};

/**
 * Itemized split — assign receipt items to members
 * items: [{ name, amount, assignedTo: [userId1, userId2] }]
 * Returns array of { userId, amount }
 */
export const itemizedSplit = (items) => {
  const totals = {};
  items.forEach((item) => {
    if (!item.assignedTo || item.assignedTo.length === 0) return;
    const share = item.amount / item.assignedTo.length;
    item.assignedTo.forEach((userId) => {
      totals[userId] = (totals[userId] || 0) + share;
    });
  });
  return Object.entries(totals).map(([userId, amount]) => ({
    userId,
    amount: Math.round(amount * 100) / 100,
  }));
};

/**
 * Validate that split amounts add up to total
 */
export const validateSplit = (splits, totalAmount) => {
  const sum = splits.reduce((acc, s) => acc + s.amount, 0);
  return Math.abs(sum - totalAmount) < 0.01; // Allow 1 cent rounding
};

/**
 * Validate that percentages add up to 100
 */
export const validatePercentages = (percentages) => {
  const sum = Object.values(percentages).reduce((acc, p) => acc + p, 0);
  return Math.abs(sum - 100) < 0.01;
};
