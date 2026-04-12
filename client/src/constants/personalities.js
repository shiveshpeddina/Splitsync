// Spending personality definitions + thresholds
const personalities = [
  {
    id: 'foodie',
    label: 'The Foodie',
    emoji: '🍕',
    tag: 'food',
    threshold: 40,
    description: 'You never miss a meal — or a chance to split the bill!',
    color: '#f97316',
  },
  {
    id: 'party-starter',
    label: 'The Party Starter',
    emoji: '🍺',
    tag: 'drinks',
    threshold: 35,
    description: 'First to order, last to leave. Legendary.',
    color: '#8b5cf6',
  },
  {
    id: 'uber-caller',
    label: 'The Uber Caller',
    emoji: '🚗',
    tag: 'travel',
    threshold: 40,
    description: 'Always on the move — and always splitting the ride.',
    color: '#3b82f6',
  },
  {
    id: 'adventurer',
    label: 'The Adventurer',
    emoji: '🎡',
    tag: 'fun',
    threshold: 40,
    description: 'Life is short. Your expense list is long.',
    color: '#06d6a0',
  },
  {
    id: 'comfort-royalty',
    label: 'Comfort King/Queen',
    emoji: '🛏️',
    tag: 'stay',
    threshold: 40,
    description: 'Only the finest Airbnbs and hotel rooms for you.',
    color: '#ec4899',
  },
  {
    id: 'balanced',
    label: 'The Balanced One',
    emoji: '⚖️',
    tag: null,
    threshold: null,
    description: 'A true adult. You spread your spending evenly. Respect.',
    color: '#64748b',
  },
];

export const getPersonality = (id) => personalities.find((p) => p.id === id);

export default personalities;
