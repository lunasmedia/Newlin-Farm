import React from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

try {
  // Auto-load example plugin and call run() for demonstration
  // Plugin will prefer compiled `dist` output if present (see plugin index loader)
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const plugin = require('../../plugins/example-plugin');
  if (plugin && typeof plugin.run === 'function') {
    const pluginInfo = plugin.run({ env: 'dev' });
    if (__DEV__) {
      console.log(pluginInfo.message);
    }
  }
} catch (e) {
  // ignore loader errors in environments where require isn't allowed
}

export default function Layout() {
  return (
    <SafeAreaProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="profile" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="(modal)/login" options={{ presentation: 'modal' }} />
      </Stack>
    </SafeAreaProvider>
  );
}
