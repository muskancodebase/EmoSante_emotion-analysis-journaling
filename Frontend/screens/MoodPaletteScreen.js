import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import theme from '../theme';

const { colors, spacing, radii, typography, shadows } = theme;

const MOODS = [
  { label: 'Happy', color: '#FFE6B3', weight: 0.2 },
  { label: 'Calm', color: '#D9F3FF', weight: 0.35 },
  { label: 'Neutral', color: '#E6E0D8', weight: 0.25 },
  { label: 'Tired', color: '#F5D9FF', weight: 0.1 },
  { label: 'Sad', color: '#F7C6C6', weight: 0.1 },
];

export default function MoodPaletteScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mood Palette</Text>

      <View style={styles.paletteRow}>
        {MOODS.map((mood) => (
          <View key={mood.label} style={[styles.blob, { backgroundColor: mood.color }]} />
        ))}
      </View>

      <View style={styles.moodsList}>
        {MOODS.map((mood) => (
          <View key={mood.label} style={styles.moodRow}>
            <View style={[styles.moodDot, { backgroundColor: mood.color }]} />
            <Text style={styles.moodLabel}>{mood.label}</Text>
            <View style={styles.barTrack}>
              <View
                style={[styles.barFill, { width: `${Math.max(mood.weight * 100, 8)}%`, backgroundColor: mood.color }]}
              />
            </View>
          </View>
        ))}
      </View>

      <View style={styles.descriptionCard}>
        <Text style={styles.descriptionText}>
          Your last 30 entries expressed mostly calm and neutral emotions, with moments of happiness
          and gentle tiredness.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xl,
  },
  title: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.title,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  paletteRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  blob: {
    width: 48,
    height: 48,
    borderRadius: 24,
    opacity: 0.9,
  },
  moodsList: {
    marginBottom: spacing.xl,
  },
  moodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  moodDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: spacing.sm,
  },
  moodLabel: {
    width: 70,
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.body,
    color: colors.text,
  },
  barTrack: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.surfaceSoft,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  descriptionCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    ...shadows.softer,
  },
  descriptionText: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.body,
    color: colors.textMuted,
  },
});
