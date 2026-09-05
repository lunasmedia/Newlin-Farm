import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { syncCustomerProfile } from '@/lib/newlin-api';

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  // Whether an admin has suspended this account (see the admin's Customers
  // tab). Unknown until the sync call below resolves, so this starts
  // `false` rather than blocking anything on it — a screen that needs to
  // react to a suspension (AccountSuspendedModal) does so once this flips.
  suspended: boolean;
};

const AuthContext = createContext<AuthContextValue>({ user: null, loading: true, suspended: false });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [suspended, setSuspended] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);
      if (nextUser) {
        // Fire-and-forget — this is what puts the user under the admin's
        // Customers tab (see newlin-api.ts). Runs on every sign-in,
        // including a persisted session resolving on cold launch, so it
        // also backfills accounts registered before this existed, and
        // picks up a suspension applied since the last sign-in. Never
        // blocks app usage on it succeeding.
        nextUser
          .getIdToken()
          .then(syncCustomerProfile)
          .then((result) => setSuspended(!result.active))
          .catch((e) => console.warn('[auth] customer profile sync failed:', e));
      } else {
        setSuspended(false);
      }
    });
  }, []);

  return <AuthContext.Provider value={{ user, loading, suspended }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}