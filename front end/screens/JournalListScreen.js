import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import theme from '../theme';
import { useJournal } from '../context/JournalContext';

const { colors, spacing, radii, typography, shadows } = theme;

export default function JournalListScreen({ navigation }) {
  const { entries } = useJournal();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Journal</Text>

      <View style={styles.searchWrapper}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search entries"
          placeholderTextColor={colors.textMutedSoft}
        />
        <TouchableOpacity
          style={styles.advancedButton}
          onPress={() => navigation.navigate('SearchEntries')}
        >
          <Text style={styles.advancedButtonText}>Advanced</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.summaryRow}>
        <TouchableOpacity
          style={styles.streakCard}
          activeOpacity={0.9}
          onPress={() => navigation.navigate('Streak')}
        >
          <Text style={styles.streakLabel}>🔥 2-day streak</Text>
        </TouchableOpacity>
        <View style={styles.moodStrip}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.moodScrollContent}
          >
            <View style={[styles.moodBadge, styles.moodBadgeHappy]}>
              <Text style={styles.moodBadgeText}>Happy</Text>
            </View>
            <View style={[styles.moodBadge, styles.moodBadgeCalm]}>
              <Text style={styles.moodBadgeText}>Calm</Text>
            </View>
            <View style={[styles.moodBadge, styles.moodBadgeTired]}>
              <Text style={styles.moodBadgeText}>Tired</Text>
            </View>
            <View style={[styles.moodBadge, styles.moodBadgeNeutral]}>
              <Text style={styles.moodBadgeText}>Neutral</Text>
            </View>
          </ScrollView>
        </View>
      </View>

      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>This Month's Stats</Text>
        <View style={styles.statsRow}>
          <View>
            <Text style={styles.statsLabel}>Entries</Text>
            <Text style={styles.statsValue}>{entries.length}</Text>
          </View>
          <View>
            <Text style={styles.statsLabel}>Most common emotion</Text>
            <Text style={styles.statsValue}>Calm</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.listContent}>
        {entries.map((entry) => (
          <TouchableOpacity
            key={entry.id}
            style={styles.entryCard}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('EditJournal')}
          >
            <View style={styles.entryHeaderRow}>
              <Text style={styles.entryTitle}>{entry.title}</Text>
              <TouchableOpacity
                style={
                  entry.emotion === 'Calm'
                    ? styles.emotionTag
                    : styles.emotionTagNeutral
                }
                activeOpacity={0.9}
                onPress={() =>
                  navigation.navigate('EmotionTag', { emotion: entry.emotion })
                }
              >
                <Text
                  style={
                    entry.emotion === 'Calm'
                      ? styles.emotionTagText
                      : styles.emotionTagTextNeutral
                  }
                >
                  {entry.emotion}
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.entryMeta}>{entry.dateLabel}</Text>
            <Text style={styles.entryPreview} numberOfLines={2}>
              {entry.preview}
            </Text>
          </TouchableOpacity>
        ))}

        <View style={styles.emptyHintWrapper}>
          <Text style={styles.emptyHintText}>
            Your future entries will appear here, in a soft and safe space.
          </Text>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddJournal')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
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
    marginBottom: spacing.lg,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  searchInput: {
    flex: 1,
    fontFamily: typography.fontFamilyPrimary,
    backgroundColor: colors.surface,
    borderRadius: 25,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.primaryLight,
    color: colors.text,
    marginRight: spacing.sm,
  },
  advancedButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 999,
    backgroundColor: colors.surfaceSoft,
  },
  advancedButtonText: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.caption,
    color: colors.primary,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  streakCard: {
    flexBasis: '35%',
    marginRight: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primaryLight,
    ...shadows.softer,
  },
  streakLabel: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.body,
    color: colors.text,
  },
  moodStrip: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  moodScrollContent: {
    alignItems: 'center',
  },
  moodBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 999,
    marginRight: spacing.sm,
  },
  moodBadgeHappy: {
    backgroundColor: '#FFE6B3',
  },
  moodBadgeCalm: {
    backgroundColor: '#D9F3FF',
  },
  moodBadgeTired: {
    backgroundColor: '#F5D9FF',
  },
  moodBadgeNeutral: {
    backgroundColor: '#E6E0D8',
  },
  moodBadgeText: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.caption,
    color: colors.text,
  },
  statsCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.softer,
  },
  statsTitle: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.subtitle,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statsLabel: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.caption,
    color: colors.textMuted,
  },
  statsValue: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.subtitle,
    fontWeight: '600',
    color: colors.text,
  },
  listContent: {
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
  },
  entryCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.secondaryLight,
    ...shadows.softer,
  },
  entryHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  entryTitle: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.subtitle,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  entryMeta: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.caption,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  entryPreview: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.body,
    color: colors.textMuted,
  },
  emotionTag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 999,
    backgroundColor: '#D9F3FF',
  },
  emotionTagNeutral: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 999,
    backgroundColor: '#E6E0D8',
  },
  emotionTagText: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.caption,
    color: colors.text,
  },
  emotionTagTextNeutral: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.caption,
    color: colors.text,
  },
  emptyHintWrapper: {
    marginTop: spacing.lg,
  },
  emptyHintText: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.body,
    color: colors.textMuted,
  },
  fab: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.soft,
  },
  fabText: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: 28,
    color: colors.textOnPrimary,
    lineHeight: 32,
  },
});
