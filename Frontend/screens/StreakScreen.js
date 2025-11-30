import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import theme from '../theme';

const { colors, spacing, radii, typography, shadows } = theme;

export default function StreakScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Journaling Streak</Text>

      <View style={styles.streakCircleOuter}>
        <View style={styles.streakCircleInner}>
          <Text style={styles.streakEmoji}>🔥</Text>
          <Text style={styles.streakText}>7-Day Streak</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statsItem}>
          <Text style={styles.statsLabel}>Entries this month</Text>
          <Text style={styles.statsValue}>14</Text>
        </View>
        <View style={styles.statsItem}>
          <Text style={styles.statsLabel}>Last entry</Text>
          <Text style={styles.statsValue}>Nov 16</Text>
        </View>
        <View style={styles.statsItem}>
          <Text style={styles.statsLabel}>Longest streak</Text>
          <Text style={styles.statsValue}>9 days</Text>
        </View>
      </View>

      <View style={styles.quoteCard}>
        <Text style={styles.quoteText}>
          "Keep going! You're building a positive habit. One entry at a time makes a difference."
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
  streakCircleOuter: {
    alignSelf: 'center',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 14,
    borderColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  streakCircleInner: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.softer,
  },
  streakEmoji: {
    fontSize: 32,
    marginBottom: spacing.xs,
  },
  streakText: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.subtitle,
    fontWeight: '600',
    color: colors.text,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  statsItem: {
    flex: 1,
    marginHorizontal: spacing.xs,
    padding: spacing.md,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    ...shadows.softer,
  },
  statsLabel: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.caption,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  statsValue: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.subtitle,
    fontWeight: '600',
    color: colors.text,
  },
  quoteCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    ...shadows.soft,
  },
  quoteText: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.body,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
