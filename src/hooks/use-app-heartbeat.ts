import { useEffect } from 'react';
import { AppState } from 'react-native';
import { sendApiHeartbeat } from '@/lib/newlin-api';

const HEARTBEAT_INTERVAL_MS = 4 * 60 * 1000;

export function useAppHeartbeat() {
  useEffect(() => {
    let currentState = AppState.currentState;
    let timer: ReturnType<typeof setInterval> | undefined;
    let sending = false;

    const send = async () => {
      if (sending) return;

      sending = true;

      try {
        await sendApiHeartbeat();
      } catch (error) {
        if (__DEV__) {
          console.warn('[heartbeat] Could not update app status:', error);
        }
      } finally {
        sending = false;
      }
    };

    const stopTimer = () => {
      if (timer) clearInterval(timer);
      timer = undefined;
    };

    const startTimer = () => {
      stopTimer();
      timer = setInterval(() => void send(), HEARTBEAT_INTERVAL_MS);
    };

    if (currentState === 'active') {
      void send();
      startTimer();
    }

    const subscription = AppState.addEventListener('change', nextState => {
      if (nextState === 'active' && currentState !== 'active') {
        void send();
        startTimer();
      } else if (nextState !== 'active') {
        stopTimer();
      }

      currentState = nextState;
    });

    return () => {
      stopTimer();
      subscription.remove();
    };
  }, []);
}
