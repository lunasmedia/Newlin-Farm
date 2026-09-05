import { useCallback, useState } from 'react';
import { RefreshControl, RefreshControlProps } from 'react-native';
import { colors } from '@/theme/tokens';

type Props = Omit<RefreshControlProps, 'refreshing' | 'onRefresh'> & {
  onRefresh: () => Promise<void>;
};

// Shared pull-to-refresh control — was duplicated (identical `refreshing`
// state + try/finally wrapper) on home.tsx and orders.tsx. Owns its own
// `refreshing` state so a screen just passes its `refresh()` straight
// through instead of wiring that boilerplate up itself each time. Works
// regardless of where inside the ScrollView's content the pull gesture
// starts — including over a plain (non-scrollable) card like orders.tsx's
// delivery ProgressCard — since that's standard RN ScrollView behaviour as
// long as nothing in the content claims the vertical pan gesture, which no
// screen using this does.
export function AppRefreshControl({ onRefresh, tintColor = colors.forest, ...rest }: Props) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
    }
  }, [onRefresh]);

  return <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={tintColor} {...rest} />;
}
