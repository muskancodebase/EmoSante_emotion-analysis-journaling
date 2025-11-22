import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import theme from '../theme';
import { useJournal } from '../context/JournalContext';

const { colors, spacing, radii, typography, shadows } = theme;

const FILTER_CHIPS = ['Emotion', 'Date', 'Keywords'];

export default function SearchEntriesScreen({ navigation }) {
  const { entries } = useJournal();
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Keywords');

  const filtered = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return entries;
    return entries.filter((entry) => {
      const haystack = `${entry.title} ${entry.preview} ${entry.emotion}`.toLowerCase();
      return haystack.includes(trimmed);
    });
  }, [entries, query]);

  const hasResults = filtered.length > 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search Entries</Text>

      <View style={styles.searchBarWrapper}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by keywords, emotion, or date"
          placeholderTextColor={colors.textMutedSoft}
          value={query}
          onChangeText={setQuery}
        />
      </View>

      <View style={styles.chipsRow}>
        {FILTER_CHIPS.map((chip) => {
          const selected = chip === activeFilter;
          return (
            <TouchableOpacity
              key={chip}
              style={selected ? styles.chipSelected : styles.chip}
              onPress={() => setActiveFilter(chip)}
            >
              <Text style={selected ? styles.chipTextSelected : styles.chipText}>{chip}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={styles.resultsContent}>
        {hasResults ? (
          filtered.map((entry) => (
            <TouchableOpacity
              key={entry.id}
              style={styles.entryCard}
              activeOpacity={0.9}
              onPress={() => navigation.navigate('EditJournal', { entryId: entry.id })}
            >
              <View style={styles.entryHeaderRow}>
                <Text style={styles.entryTitle}>{entry.title}</Text>
                <View
                  style={
                    entry.emotion === 'Calm'
                      ? styles.emotionTag
                      : styles.emotionTagNeutral
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
                </View>
              </View>
              <Text style={styles.entryMeta}>{entry.dateLabel}</Text>
              <Text style={styles.entryPreview} numberOfLines={2}>
                {entry.preview}
              </Text>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyTitle}>No entries found</Text>
            <Text style={styles.emptyText}>
              Try another keyword, or search by a different emotion or date range.
            </Text>
          </View>
        )}
      </ScrollView>
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
  searchBarWrapper: {
    marginBottom: spacing.md,
  },
  searchInput: {
    fontFamily: typography.fontFamilyPrimary,
    backgroundColor: colors.surface,
    borderRadius: 25,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.primaryLight,
    color: colors.text,
  },
  chipsRow: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 999,
    backgroundColor: colors.surfaceSoft,
    marginRight: spacing.sm,
  },
  chipSelected: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 999,
    backgroundColor: colors.primary,
    marginRight: spacing.sm,
  },
  chipText: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.caption,
    color: colors.text,
  },
  chipTextSelected: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.caption,
    color: colors.textOnPrimary,
    fontWeight: '600',
  },
  resultsContent: {
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
  emptyState: {
    marginTop: spacing.xl,
    alignItems: 'center',
  },
  emptyEmoji: {
    fontSize: 36,
    marginBottom: spacing.sm,
  },
  emptyTitle: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.subtitle,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  emptyText: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.body,
    color: colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
});
