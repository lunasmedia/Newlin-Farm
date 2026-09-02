import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { colors, radii, spacing } from '@/theme/tokens';

const QUESTIONS = [
  'Where is my order?',
  'How do substitutions work?',
  'Can I change my delivery slot?',
  'How do Field Notes points work?',
  'Report an item problem',
];

export default function Help() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState<string | null>(null);

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <ScreenHeader eyebrow="How can we help?" title="Help & support" />
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={colors.muted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search help articles"
            placeholderTextColor={colors.mutedLight}
            style={styles.searchInput}
          />
        </View>

        <View style={styles.cardsRow}>
          <View style={styles.card}>
            <Ionicons name="chatbubble-ellipses-outline" size={22} color={colors.forest} />
            <Text style={styles.cardTitle}>Live chat</Text>
            <Text style={styles.cardSubtitle}>Replies in 2 min</Text>
          </View>
          <View style={styles.card}>
            <Ionicons name="call-outline" size={22} color={colors.forest} />
            <Text style={styles.cardTitle}>Call us</Text>
            <Text style={styles.cardSubtitle}>8am to 8pm</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Popular questions</Text>
        <View style={styles.list}>
          {QUESTIONS.map((q, i) => (
            <React.Fragment key={q}>
              <Pressable style={styles.row} onPress={() => setOpen((cur) => (cur === q ? null : q))}>
                <Text style={styles.rowText}>{q}</Text>
                <Ionicons name={open === q ? 'remove' : 'add'} size={20} color={colors.ink} />
              </Pressable>
              {open === q ? (
                <Text style={styles.answer}>
                  Our team can help with this from the Help & support screen — tap Live chat or Call
                  us above and we'll sort it out.
                </Text>
              ) : null}
              {i < QUESTIONS.length - 1 ? <View style={styles.divider} /> : null}
            </React.Fragment>
          ))}
          <View style={styles.divider} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.inputBg,
    borderRadius: radii.pill,
    paddingVertical: 14,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  searchInput: { flex: 1, fontSize: 15, color: colors.ink },
  cardsRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xl },
  card: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    paddingVertical: spacing.lg,
  },
  cardTitle: { fontSize: 15, fontWeight: '800', color: colors.ink },
  cardSubtitle: { fontSize: 12, color: colors.muted },
  sectionTitle: { fontSize: 22, fontWeight: '800', color: colors.ink, marginBottom: spacing.sm },
  list: {},
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing.md },
  rowText: { fontSize: 15, fontWeight: '800', color: colors.ink, flex: 1 },
  answer: { fontSize: 13, color: colors.muted, paddingBottom: spacing.md, lineHeight: 19 },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border },
});
