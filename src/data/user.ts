// No delivery-address, payment-method, or loyalty backend exists yet —
// these all start empty/zeroed rather than showing made-up personal data.
// Real identity (name/email) comes from Firebase auth (see auth-context),
// not from here.
export type Address = {
  id: string;
  label: string;
  icon: 'home' | 'business' | 'location';
  line1: string;
  line2: string;
  isDefault: boolean;
};

export type PaymentMethod = { id: string; label: string; expiry: string };

export const addresses: Address[] = [];
export const paymentMethods: PaymentMethod[] = [];

export const loyalty = { points: 0, pointsToNextReward: 0, rewardValue: 0 };
