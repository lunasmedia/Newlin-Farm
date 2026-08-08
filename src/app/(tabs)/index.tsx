import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import Hello from '../../components/Hello';

export default function HomeTab() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home (Tabs)</Text>
      <Hello name="Tabs Home" />
      <Link href="/profile?id=42" style={styles.link}>
        Go to Profile (id=42)
      </Link>
      <Link href="/settings" style={styles.link}>
        Open Settings
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, marginBottom: 12 },
  link: { marginTop: 10, color: '#1e90ff' }
});
