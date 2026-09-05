import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useAuth } from '@/state/auth-context';
import { ApiOrder, fetchMyOrders } from '@/lib/newlin-api';

export type Order = ApiOrder;

// Matches the admin's own "open vs closed" split (see admin-views.tsx's
// Dashboard `openOrders` filter) — an order not yet in one of these is
// still "in progress" from the customer's point of view.
const CLOSED_STATUSES = ['Delivered', 'Cancelled'];

// The admin can change an order's status (or set its ETA/driver) at any
// time, and the admin API is plain REST with no websocket/SSE push, so
// this is the only way the app picks that up without the user manually
// pulling to refresh. Shorter than the catalogue's poll (see
// catalog-context.tsx) since a customer watching a live delivery cares
// about a status change within seconds, not minutes.
const POLL_INTERVAL_MS = 20_000;

type OrdersContextValue = {
  orders: Order[];
  currentOrder: Order | null;
  pastOrders: Order[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

const OrdersContext = createContext<OrdersContextValue | null>(null);

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Guards against overlapping requests — the poll interval firing while a
  // pull-to-refresh (or the previous poll) is still in flight.
  const loadingRef = useRef(false);

  // Reusable for pull-to-refresh / retry / polling — unguarded setState is
  // exactly what's wanted there, unlike the mount/user-change effect below.
  const load = useCallback(async () => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }
    if (loadingRef.current) return;
    loadingRef.current = true;
    try {
      setError(null);
      const idToken = await user.getIdToken();
      setOrders(await fetchMyOrders(idToken));
    } catch (e) {
      // Leave the last-known orders on screen rather than clearing them —
      // same reasoning as catalog-context.tsx's `load`.
      console.warn('[orders] refresh failed, keeping current data:', e);
      setError(e instanceof Error ? e.message : 'Could not load orders');
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [user]);

  useEffect(() => {
    // Own ignore-guarded fetch rather than calling `load()` — see the same
    // pattern (and why) in catalog-context.tsx.
    let ignore = false;
    (async () => {
      if (!user) {
        if (!ignore) {
          setOrders([]);
          setLoading(false);
        }
        return;
      }
      try {
        const idToken = await user.getIdToken();
        const data = await fetchMyOrders(idToken);
        if (!ignore) {
          setOrders(data);
          setError(null);
        }
      } catch (e) {
        if (!ignore) setError(e instanceof Error ? e.message : 'Could not load orders');
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [user]);

  useEffect(() => {
    if (!user) return;

    // Silent background poll, plus an immediate refetch whenever the app
    // comes back to the foreground — same approach as catalog-context.tsx.
    // `load` already no-ops with nothing to fetch when signed out, so this
    // is safe to leave running across a sign-out/sign-in inside the same
    // effect instance.
    const interval = setInterval(load, POLL_INTERVAL_MS);
    const subscription = AppState.addEventListener('change', (state: AppStateStatus) => {
      if (state === 'active') load();
    });

    return () => {
      clearInterval(interval);
      subscription.remove();
    };
  }, [user, load]);

  const currentOrder = orders.find((o) => !CLOSED_STATUSES.includes(o.status)) ?? null;
  const pastOrders = orders.filter((o) => CLOSED_STATUSES.includes(o.status));

  return (
    <OrdersContext.Provider value={{ orders, currentOrder, pastOrders, loading, error, refresh: load }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error('useOrders must be used within OrdersProvider');
  return ctx;
}
