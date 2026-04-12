// Nudge message templates per tone
const nudgeTones = {
  gentle: {
    id: 'gentle',
    label: 'Gentle',
    emoji: '😊',
    color: '#06d6a0',
    template: 'Hey {name}! Just a friendly reminder — you owe {amount}. No rush 😊',
    description: 'A soft, friendly nudge',
  },
  firm: {
    id: 'firm',
    label: 'Firm',
    emoji: '📢',
    color: '#f59e0b',
    template: 'Hi {name}, please settle your share of {amount} when you can.',
    description: 'Direct and professional',
  },
  savage: {
    id: 'savage',
    label: 'Savage',
    emoji: '👀',
    color: '#ef4444',
    template: '{name}. {amount}. Still waiting. You know who you are. 👀',
    description: 'No mercy',
  },
};

export const formatNudge = (tone, name, amount) => {
  const t = nudgeTones[tone];
  if (!t) return '';
  return t.template.replace('{name}', name).replace(/\{amount\}/g, amount);
};

export default nudgeTones;
