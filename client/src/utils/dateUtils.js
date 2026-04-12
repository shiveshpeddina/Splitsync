/**
 * Format a date as a readable string
 * e.g., "Mar 28, 2026"
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Format as relative time
 * e.g., "2 hours ago", "Yesterday", "Mar 25"
 */
export const timeAgo = (date) => {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(date);
};

/**
 * Group expenses by date for timeline view
 * Returns: [{ date: "Mar 28, 2026", expenses: [...] }]
 */
export const groupByDate = (expenses) => {
  const groups = {};

  expenses.forEach((expense) => {
    const dateKey = new Date(expense.createdAt).toDateString();
    if (!groups[dateKey]) {
      groups[dateKey] = {
        date: formatDate(expense.createdAt),
        dateKey,
        expenses: [],
      };
    }
    groups[dateKey].expenses.push(expense);
  });

  return Object.values(groups).sort(
    (a, b) => new Date(b.dateKey) - new Date(a.dateKey)
  );
};

/**
 * Get day suffix (1st, 2nd, 3rd, etc.)
 */
export const getDaySuffix = (day) => {
  if (day >= 11 && day <= 13) return `${day}th`;
  switch (day % 10) {
    case 1: return `${day}st`;
    case 2: return `${day}nd`;
    case 3: return `${day}rd`;
    default: return `${day}th`;
  }
};
