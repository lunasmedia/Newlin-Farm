import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Hello({ name }: { name: string }) {
  return (
    <View style={styles.box}>
      <Text style={styles.text}>Hello, {name} 👋</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { padding: 12, backgroundColor: '#f0f0f0', borderRadius: 8 },
  text: { fontSize: 16 }
});
