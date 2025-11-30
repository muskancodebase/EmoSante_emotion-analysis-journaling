import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import theme from '../theme';
import { useJournal } from '../context/JournalContext';
import FloatingActionMenu from '../components/FloatingActionMenu';
import { MOOD_COLORS } from '../context/moodPalette';

const { colors, spacing, radii, typography, shadows } = theme;

export default function JournalListScreen({ navigation }) {
  const { entries } = useJournal();

  const getEntryBackground = (emotion) => {
    if (emotion && MOOD_COLORS[emotion]) {
      return MOOD_COLORS[emotion];
    }
    return colors.surface;
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.titleWrapper}>
          <Text style={styles.title}>My Journal</Text>
          <View style={styles.titleUnderline} />
        </View>
        <TouchableOpacity
          style={styles.searchIconButton}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={styles.searchIconText}>⚙️</Text>
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
            <View style={[styles.moodBadge, { backgroundColor: MOOD_COLORS.Happy }]}>
              <Text style={styles.moodBadgeText}>Happy</Text>
            </View>
            <View style={[styles.moodBadge, { backgroundColor: MOOD_COLORS.Calm }]}>
              <Text style={styles.moodBadgeText}>Calm</Text>
            </View>
            <View style={[styles.moodBadge, { backgroundColor: MOOD_COLORS.Tired }]}>
              <Text style={styles.moodBadgeText}>Tired</Text>
            </View>
            <View style={[styles.moodBadge, { backgroundColor: MOOD_COLORS.Neutral }]}>
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
      <TouchableOpacity
        style={styles.reportButton}
        activeOpacity={0.85}
        onPress={() => navigation.navigate('EmotionReport')}
      >
        <Text style={styles.reportButtonText}>Generate Trend Report</Text>
      </TouchableOpacity>


      <ScrollView contentContainerStyle={styles.listContent}>
        {entries.map((entry) => (
          <TouchableOpacity
            key={entry.id}
            style={[styles.entryCard, { backgroundColor: getEntryBackground(entry.emotion) }]}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('EditJournal', { entryId: entry.id })}
          >
            <View style={styles.entryHeaderRow}>
              <Text style={styles.entryTitle}>{entry.title}</Text>
              <TouchableOpacity
                style={[
                  styles.emotionTag,
                  {
                    backgroundColor:
                      entry.emotion && MOOD_COLORS[entry.emotion]
                        ? MOOD_COLORS[entry.emotion]
                        : MOOD_COLORS.Neutral,
                  },
                ]}
                activeOpacity={0.9}
                onPress={() =>
                  navigation.navigate('EmotionTag', { emotion: entry.emotion })
                }
              >
                <Text style={styles.emotionTagText}>
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

      {/* Floating action menu overlay for add / audio / search */}
      <FloatingActionMenu navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl + spacing.md,
    paddingBottom: spacing.xl,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  titleWrapper: {
    alignSelf: 'flex-start',
  },
  title: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.title + 2,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'left',
    letterSpacing: 0.5,
  },
  titleUnderline: {
    marginTop: spacing.xs,
    height: 3,
    borderRadius: 999,
    backgroundColor: colors.primaryLight,
    width: '60%',
  },
  searchIconButton: {
    marginLeft: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 999,
    backgroundColor: colors.surfaceSoft,
  },
  searchIconText: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.subtitle,
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
  // Mood badge colors now come from MOOD_COLORS for consistency.
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
  },
  emotionTagText: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.caption,
    color: colors.text,
  },
  emptyHintWrapper: {
    marginTop: spacing.lg,
  },
  reportButton: {
  backgroundColor: colors.primary,
  paddingVertical: spacing.lg,
  borderRadius: 20,  // ← same look as your cards
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: spacing.lg,
  marginTop: spacing.md,
  shadowColor: colors.primary,
  shadowOpacity: 0.18,
  shadowOffset: { width: 0, height: 3 },
  shadowRadius: 4,
  elevation: 3,
},
reportButtonText: {
  color: 'white',
  fontFamily: typography.fontFamilyPrimary,
  fontSize: typography.sizes.subtitle,
  fontWeight: '700',
  letterSpacing: 0.8,
},


  emptyHintText: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.body,
    color: colors.textMuted,
  },
  // FloatingActionMenu has its own positioning styles.
});
