import personalities from '../constants/personalities';

/**
 * Determine a user's spending personality based on their expense history
 *
 * Input:  splits — array of { amount, vibeTag } for a single user in a group
 * Output: { label, emoji, topCategory, topPercent, totalSpent, color, description }
 */
export const getSpendingPersonality = (splits) => {
  if (!splits || splits.length === 0) {
    return {
      ...personalities.find((p) => p.id === 'balanced'),
      topCategory: null,
      topPercent: 0,
      totalSpent: 0,
    };
  }

  // Tally spend per vibe tag
  const tagTotals = {};
  let totalSpent = 0;

  splits.forEach((split) => {
    const tag = split.vibeTag || 'other';
    tagTotals[tag] = (tagTotals[tag] || 0) + split.amount;
    totalSpent += split.amount;
  });

  // Find highest % category
  let topCategory = 'other';
  let topAmount = 0;

  Object.entries(tagTotals).forEach(([tag, amount]) => {
    if (amount > topAmount) {
      topAmount = amount;
      topCategory = tag;
    }
  });

  const topPercent = totalSpent > 0 ? Math.round((topAmount / totalSpent) * 100) : 0;

  // Match to personality based on threshold
  const matchedPersonality = personalities.find(
    (p) => p.tag === topCategory && p.threshold && topPercent >= p.threshold
  );

  const personality = matchedPersonality || personalities.find((p) => p.id === 'balanced');

  return {
    ...personality,
    topCategory,
    topPercent,
    totalSpent,
  };
};

/**
 * Get all spending breakdowns by category
 * Returns: [{ tag, amount, percent, color }]
 */
export const getCategoryBreakdown = (splits) => {
  const tagTotals = {};
  let total = 0;

  splits.forEach((split) => {
    const tag = split.vibeTag || 'other';
    tagTotals[tag] = (tagTotals[tag] || 0) + split.amount;
    total += split.amount;
  });

  return Object.entries(tagTotals)
    .map(([tag, amount]) => ({
      tag,
      amount,
      percent: total > 0 ? Math.round((amount / total) * 100) : 0,
    }))
    .sort((a, b) => b.amount - a.amount);
};
