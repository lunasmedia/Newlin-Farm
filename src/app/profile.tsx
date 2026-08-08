import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function Profile() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = params.id ?? 'unknown';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text>User ID: {String(id)}</Text>
      <Button title="Go back" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, marginBottom: 8 }
});
