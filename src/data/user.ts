export const user = {
  name: 'Tracy Manoka',
  initials: 'TM',
  points: 1240,
  pointsToNextReward: 260,
  rewardValue: 5,
};

export const addresses = [
  {
    id: 'home',
    label: 'Home',
    icon: 'home' as const,
    line1: '12 Newlin Lane',
    line2: 'London, E5 0NP',
    isDefault: true,
  },
  {
    id: 'work',
    label: 'Work',
    icon: 'business' as const,
    line1: '1 Finsbury Avenue',
    line2: 'London, EC2M 2PF',
    isDefault: false,
  },
];

export const paymentMethods = [
  { id: 'mastercard', label: 'Mastercard •••• 1842', expiry: 'Expires 09/29' },
];
