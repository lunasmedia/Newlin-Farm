import React, { createContext, useContext, useState } from 'react';

type Slot = { day: string; date: string; time: string; price: string };

type CheckoutContextValue = {
  slot: Slot;
  setSlot: (s: Slot) => void;
  paymentId: string;
  setPaymentId: (id: string) => void;
  useFieldNotes: boolean;
  setUseFieldNotes: (v: boolean) => void;
};

const defaultSlot: Slot = { day: 'Today', date: '17 Aug', time: '10:00 – 11:00', price: 'FREE' };

const CheckoutContext = createContext<CheckoutContextValue | null>(null);

export function CheckoutProvider({ children }: { children: React.ReactNode }) {
  const [slot, setSlot] = useState<Slot>(defaultSlot);
  const [paymentId, setPaymentId] = useState('mastercard');
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
