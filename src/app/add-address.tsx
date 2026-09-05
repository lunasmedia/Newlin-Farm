import React, { useState } from 'react';
import { View, ScrollView, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAddresses } from '@/state/addresses-context';
import { useCatalog } from '@/state/catalog-context';
import { isPostcodeCovered, normalizeStoreSettings } from '@/utils/store-settings';
import { colors, spacing } from '@/theme/tokens';

export default function AddAddress() {
  const router = useRouter();
  const { addAddress } = useAddresses();
  const { settings } = useCatalog();
  const { deliveryPostcodes } = normalizeStoreSettings(settings);
  const [label, setLabel] = useState('');
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [saving, setSaving] = useState(false);

  const commitSave = () => {
    setSaving(true);
    addAddress({ label: label.trim(), line1: line1.trim(), line2: line2.trim(), icon: 'home' });
    router.back();
  };

  const save = () => {
    if (!label.trim() || !line1.trim()) {
      Alert.alert('Missing details', 'Add a label and the first line of the address.');
      return;
    }
    if (!isPostcodeCovered(line2, deliveryPostcodes)) {
      Alert.alert(
        'Outside our delivery area',
        `We currently only deliver to ${deliveryPostcodes}. You can still save this address, but we may not be able to deliver here yet.`,
        [
          { text: 'Edit address', style: 'cancel' },
          { text: 'Save anyway', onPress: commitSave },
        ]
      );
      return;
    }
    commitSave();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <ScreenHeader eyebrow="Delivery" title="Add an address" />
      <ScrollView contentContainerStyle={styles.body}>
        <Input label="Label" placeholder="Home, Work…" value={label} onChangeText={setLabel} />
        <Input label="Address line 1" placeholder="12 Newlin Lane" value={line1} onChangeText={setLine1} />
        <Input label="Address line 2" placeholder="London, E5 0NP" value={line2} onChangeText={setLine2} />
        <Button label="Save address" arrow onPress={save} loading={saving} style={{ marginTop: spacing.md }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.lg, paddingBottom: spacing.xxl },
});
