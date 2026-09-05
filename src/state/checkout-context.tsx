import React, { createContext, useContext, useState } from 'react';
import { getUpcomingDeliveryDays } from '@/utils/format-date';

export type Slot = { day: string; date: string; time: string; feePence: number };

type CheckoutContextValue = {
  slot: Slot;
  setSlot: (s: Slot) => void;
  paymentId: string;
  setPaymentId: (id: string) => void;
  useFieldNotes: boolean;
  setUseFieldNotes: (v: boolean) => void;
};

// Today's real date, not a fixed "17 Aug" that goes stale — the time/fee
// stay as a sensible default slot, overwritten as soon as the user actually
// picks one on the delivery screen (from the admin's real delivery slots —
// see checkout/delivery.tsx).
const [today] = getUpcomingDeliveryDays(1);
const defaultSlot: Slot = { day: today.day, date: today.date, time: '10:00 – 11:00', feePence: 0 };

const CheckoutContext = createContext<CheckoutContextValue | null>(null);

export function CheckoutProvider({ children }: { children: React.ReactNode }) {
  const [slot, setSlot] = useState<Slot>(defaultSlot);
  // 'apple-pay' — the only checkout payment option backed by anything real
  // right now (a saved card would mean fabricating or storing real card
  // data with no payment processor behind it; see checkout/payment.tsx).
  const [paymentId, setPaymentId] = useState('apple-pay');
  const [useFieldNotes, setUseFieldNotes] = useState(false);

  return (
    <CheckoutContext.Provider
      value={{ slot, setSlot, paymentId, setPaymentId, useFieldNotes, setUseFieldNotes }}>
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const ctx = useContext(CheckoutContext);
  if (!ctx) throw new Error('useCheckout must be used within CheckoutProvider');
  return ctx;
}
