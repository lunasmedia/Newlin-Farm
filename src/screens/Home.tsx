import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Hello from '../components/Hello';

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Template Expo App</Text>
      <Hello name="Developer" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 18, marginBottom: 12 }
});
