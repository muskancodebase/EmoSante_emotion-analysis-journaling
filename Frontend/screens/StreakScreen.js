import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import theme from '../theme';
import { useStreakStats } from '../context/useStreakStats';
import { MOOD_COLORS } from '../context/moodPalette';

const { colors, spacing, radii, typography, shadows } = theme;

export default function StreakScreen() {
  const {
    currentStreak,
    longestStreak,
    entriesLast7Days,
    lastEntryDateLabel,
    history,
  } = useStreakStats();

  const streakTitle = currentStreak > 0 ? `${currentStreak}-day streak` : 'No active streak yet';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Journaling Streak</Text>

      <View style={styles.streakCircleOuter}>
        <View style={styles.streakCircleInner}>
          <Text style={styles.streakEmoji}>🔥</Text>
          <Text style={styles.streakText}>{streakTitle}</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statsItem}>
          <Text style={styles.statsLabel}>Entries last 7 days</Text>
          <Text style={styles.statsValue}>{entriesLast7Days}</Text>
        </View>
        <View style={styles.statsItem}>
          <Text style={styles.statsLabel}>Last entry</Text>
          <Text style={styles.statsValue}>{lastEntryDateLabel || '—'}</Text>
        </View>
        <View style={styles.statsItem}>
          <Text style={styles.statsLabel}>Longest streak</Text>
          <Text style={styles.statsValue}>{longestStreak} days</Text>
        </View>
      </View>

      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Emotional history (last 7 days)</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chartScrollContent}
        >
          {history.map((day) => {
            const color =
              day.emotion && MOOD_COLORS[day.emotion]
                ? MOOD_COLORS[day.emotion]
                : colors.surfaceSoft;
            const barHeight = 20 + Math.min(day.total, 4) * 10; // scale with entry count

            return (
              <View key={day.dateKey} style={styles.chartDay}>
                <View
                  style={[
                    styles.chartBar,
                    {
                      backgroundColor: color,
                      height: barHeight,
                      opacity: day.total > 0 ? 1 : 0.4,
                    },
                  ]}
                />
                <Text style={styles.chartDayLabel}>{day.label}</Text>
              </View>
            );
          })}
        </ScrollView>

        <View style={styles.chartLegendRow}>
          {Object.entries(MOOD_COLORS).map(([emotion, color]) => (
            <View key={emotion} style={styles.legendItem}>
              <View style={[styles.legendSwatch, { backgroundColor: color }]} />
              <Text style={styles.legendLabel}>{emotion}</Text>
            </View>
          ))}
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
  chartCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    ...shadows.softer,
  },
  chartTitle: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.subtitle,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
  },
  chartScrollContent: {
    alignItems: 'flex-end',
  },
  chartDay: {
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  chartBar: {
    width: 18,
    borderRadius: 9,
  },
  chartDayLabel: {
    marginTop: spacing.xs,
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.caption,
    color: colors.textMuted,
  },
  chartLegendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.lg,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.md,
    marginBottom: spacing.xs,
  },
  legendSwatch: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: spacing.xs,
  },
  legendLabel: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.caption,
    color: colors.textMuted,
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
