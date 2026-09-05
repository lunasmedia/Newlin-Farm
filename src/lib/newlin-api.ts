import { Platform } from 'react-native';
import Constants from 'expo-constants';
// Generated from the admin's published contract (GET /api/v1/schema) — run
// `npm run sync-api-types` to refresh these after a shape change on
// Newlin-Farm-Admin, rather than hand-editing them here.
import type { ApiCategory, ApiDeliverySlot, ApiProduct, ApiPromotion, CatalogResponse } from './newlin-api.types.generated';

export type { ApiCategory, ApiDeliverySlot, ApiProduct, ApiPromotion, CatalogResponse };

// A `localhost`/`127.0.0.1` API URL only reaches the admin's dev server
// from the iOS Simulator, which shares the host Mac's network namespace.
// Android's emulator and physical devices on either platform have their
// own loopback, so "localhost" there means the device itself, not the dev
// machine — the catalogue fetch fails, and the app silently falls back to
// the bundled local data (by design, so a real network hiccup doesn't
// break the app), which looks like "the API isn't wired up" even though it
// is. Resolve the dev machine's real LAN address from the Metro bundler's
// own host — Expo already reports it correctly — and swap it in.
function resolveApiUrl(): string | undefined {
  const configured = process.env.EXPO_PUBLIC_NEWLIN_API_URL;
  if (!configured || Platform.OS === 'web') return configured;

  let url: URL;
  try {
    url = new URL(configured);
  } catch {
    return configured;
  }
  if (url.hostname !== 'localhost' && url.hostname !== '127.0.0.1') return configured;

  const hostUri = Constants.expoConfig?.hostUri;
  const lanHost = hostUri?.split(':')[0];
  if (lanHost && lanHost !== 'localhost' && lanHost !== '127.0.0.1') {
    url.hostname = lanHost;
  } else if (Platform.OS === 'android') {
    // Metro's host wasn't available (e.g. a standalone/EAS build still
    // pointed at a dev server) — fall back to the Android emulator's
    // documented alias for the host machine's loopback interface. This
    // only actually resolves on the emulator, not a physical device.
    url.hostname = '10.0.2.2';
  }
  return url.toString().replace(/\/$/, '');
}

const API_URL = resolveApiUrl();

export async function fetchCatalog(signal?: AbortSignal): Promise<CatalogResponse> {
  if (!API_URL) throw new Error('EXPO_PUBLIC_NEWLIN_API_URL is not configured');

  const response = await fetch(`${API_URL}/api/v1/catalog`, {
    headers: { Accept: 'application/json' },
    signal,
  });

  if (!response.ok) {
    throw new Error(`Catalogue request failed (${response.status})`);
  }

  return response.json() as Promise<CatalogResponse>;
}

export async function sendApiHeartbeat(): Promise<void> {
  if (!API_URL) {
    throw new Error('EXPO_PUBLIC_NEWLIN_API_URL is not configured');
  }

  const response = await fetch(`${API_URL}/api/v1/heartbeat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      appName: 'Newlin Farm',
      appVersion: Constants.expoConfig?.version ?? 'Unknown',
      environment: __DEV__ ? 'development' : 'production',
    }),
  });

  if (!response.ok) {
    throw new Error(`Heartbeat failed (${response.status})`);
  }
}

export type PlaceOrderPayload = {
  // Fallback display name only — the admin uses the verified ID token's own
  // `name` claim when present, so this is just for the (rare) case a token
  // hasn't been re-minted since a display name was first set at registration.
  customerName?: string;
  itemCount: number;
  // Kept as two separate figures (not one pre-summed total) so the admin's
  // minimum-order check applies to the value of goods alone, not the
  // delivery fee on top of it — see checkout/review.tsx.
  itemsPence: number;
  deliveryFeePence: number;
  deliveryAddress: string;
};

export type PlaceOrderResult = { id: string; status: string };

// Thrown instead of a plain Error when the admin has suspended this
// account (HTTP 403 — see the admin's app/api/v1/orders/route.ts) so the
// caller can show the proper AccountSuspendedModal rather than a generic
// "could not place order" alert.
export class SuspendedAccountError extends Error {}

// Customer-authenticated: `idToken` is the signed-in Firebase user's own ID
// token (`await user.getIdToken()`), verified server-side against Google's
// JWKS (see the admin's lib/customer-auth.ts) — the admin derives the real
// customerEmail from that verified token rather than trusting anything the
// client claims, so a forged request can't place an order as someone else.
export async function placeOrder(idToken: string, payload: PlaceOrderPayload): Promise<PlaceOrderResult> {
  if (!API_URL) throw new Error('EXPO_PUBLIC_NEWLIN_API_URL is not configured');

  const response = await fetch(`${API_URL}/api/v1/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({ error: undefined }));
    const message = body.error ?? `Could not place order (${response.status})`;
    if (response.status === 403) throw new SuspendedAccountError(message);
    throw new Error(message);
  }

  return response.json() as Promise<PlaceOrderResult>;
}

export type ApiOrder = {
  id: string;
  customerName: string;
  customerEmail: string;
  itemCount: number;
  totalPence: number;
  deliveryFeePence: number;
  status: string;
  eta: string | null;
  driver: string | null;
  deliveryAddress: string;
  createdAt: string;
  updatedAt: string;
};

// Customer-authenticated the same way as placeOrder — scoped server-side to
// whichever email the verified token belongs to, so this can only ever
// return the signed-in user's own orders.
export async function fetchMyOrders(idToken: string): Promise<ApiOrder[]> {
  if (!API_URL) throw new Error('EXPO_PUBLIC_NEWLIN_API_URL is not configured');

  const response = await fetch(`${API_URL}/api/v1/orders`, {
    headers: { Accept: 'application/json', Authorization: `Bearer ${idToken}` },
  });

  if (!response.ok) {
    throw new Error(`Could not load orders (${response.status})`);
  }

  const data = (await response.json()) as { orders: ApiOrder[] };
  return data.orders;
}

export type SyncCustomerProfileResult = { active: boolean };

// Upserts this signed-in user's profile into the admin's Customers tab
// (see auth-context.tsx, which calls this on every sign-in) so an admin can
// find and manage every registered shopper there — not just ones who've
// placed an order. Safe to call repeatedly; the admin only ever overwrites
// name/email from this, never the phone number or suspension status an
// admin sets themselves. Returns the account's current `active` flag so
// auth-context.tsx can surface AccountSuspendedModal proactively, rather
// than the customer only discovering a suspension via a failed order.
export async function syncCustomerProfile(idToken: string): Promise<SyncCustomerProfileResult> {
  if (!API_URL) throw new Error('EXPO_PUBLIC_NEWLIN_API_URL is not configured');

  const response = await fetch(`${API_URL}/api/v1/customers/sync`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${idToken}` },
  });

  if (!response.ok) {
    throw new Error(`Could not sync profile (${response.status})`);
  }

  const data = (await response.json()) as { active?: boolean };
  return { active: data.active ?? true };
}
