import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Address = {
  id: string;
  label: string;
  icon: 'home' | 'business' | 'location';
  line1: string;
  line2: string;
  isDefault: boolean;
};

type AddressesContextValue = {
  addresses: Address[];
  defaultAddress: Address | null;
  addAddress: (address: Omit<Address, 'id' | 'isDefault'>) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
};

const STORAGE_KEY = 'newlin.addresses.v1';
const AddressesContext = createContext<AddressesContextValue | null>(null);

export function AddressesProvider({ children }: { children: React.ReactNode }) {
  // No delivery-address backend exists — real addresses live only on this
  // device (same on-device-only approach as the rest of this app's local
  // state), so a fresh install genuinely starts with none rather than a
  // seeded fake one.
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let ignore = false;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (ignore || !raw) return;
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) setAddresses(parsed);
        } catch {
          // Malformed storage — start empty rather than crash.
        }
      })
      .finally(() => {
        if (!ignore) setHydrated(true);
      });
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    // Skip the write on the very first render, before hydration has read
    // whatever was already saved — otherwise that first empty `[]` state
    // would overwrite it before the read even resolves.
    if (hydrated) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(addresses)).catch(() => {});
  }, [addresses, hydrated]);

  const addAddress = useCallback((address: Omit<Address, 'id' | 'isDefault'>) => {
    setAddresses((prev) => {
      const makeDefault = prev.length === 0;
      const withResetDefault = makeDefault ? prev : prev.map((a) => ({ ...a, isDefault: false }));
      return [...withResetDefault, { ...address, id: `addr-${Date.now()}`, isDefault: makeDefault || prev.length === 0 }];
    });
  }, []);

  const removeAddress = useCallback((id: string) => {
    setAddresses((prev) => {
      const next = prev.filter((a) => a.id !== id);
      if (next.length && !next.some((a) => a.isDefault)) next[0] = { ...next[0], isDefault: true };
      return next;
    });
  }, []);

  const setDefaultAddress = useCallback((id: string) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
  }, []);

  const defaultAddress = useMemo(
    () => addresses.find((a) => a.isDefault) ?? addresses[0] ?? null,
    [addresses]
  );

  return (
    <AddressesContext.Provider value={{ addresses, defaultAddress, addAddress, removeAddress, setDefaultAddress }}>
      {children}
    </AddressesContext.Provider>
  );
}

export function useAddresses() {
  const ctx = useContext(AddressesContext);
  if (!ctx) throw new Error('useAddresses must be used within AddressesProvider');
  return ctx;
}
