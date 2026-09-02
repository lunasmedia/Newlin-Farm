import { getApp, getApps, initializeApp } from 'firebase/app';
// @ts-expect-error — getReactNativePersistence exists on the "react-native"
// export condition Metro resolves at runtime, but firebase's shipped .d.ts
// for the `firebase/auth` wrapper only documents the web build's surface.
import { getAuth, getReactNativePersistence, initializeAuth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBzpq4i-bXdg5fDLHpT2L2U7yjVEWeqwUY',
  authDomain: 'newlinfarm-f4b4d.firebaseapp.com',
  projectId: 'newlinfarm-f4b4d',
  storageBucket: 'newlinfarm-f4b4d.firebasestorage.app',
  messagingSenderId: '545486333062',
  appId: '1:545486333062:web:41f17839a1c4323362dd07',
  measurementId: 'G-N6CN8B0MX0',
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// initializeAuth must run before getAuth in React Native — it's what registers
// the "auth" component against the app instance. Fast Refresh can re-run this
// module after auth is already initialized, so fall back to getAuth then.
export const auth = (() => {
  try {
    return initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    return getAuth(app);
  }
})();