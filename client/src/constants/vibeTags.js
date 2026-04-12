// Vibe tags for categorizing expenses
const vibeTags = [
  { id: 'food',   label: 'Food',    emoji: '🍕', color: '#f97316' },
  { id: 'drinks', label: 'Drinks',  emoji: '🍺', color: '#8b5cf6' },
  { id: 'travel', label: 'Travel',  emoji: '🚗', color: '#3b82f6' },
  { id: 'fun',    label: 'Fun',     emoji: '🎡', color: '#06d6a0' },
  { id: 'stay',   label: 'Stay',    emoji: '🛏️', color: '#ec4899' },
  { id: 'shop',   label: 'Shopping', emoji: '🛍️', color: '#f59e0b' },
  { id: 'bills',  label: 'Bills',   emoji: '📄', color: '#64748b' },
  { id: 'other',  label: 'Other',   emoji: '✨', color: '#94a3b8' },
];

export const getVibeTag = (id) => vibeTags.find((t) => t.id === id);

export const getVibeColor = (id) => {
  const tag = getVibeTag(id);
  return tag ? tag.color : '#94a3b8';
};

export default vibeTags;
