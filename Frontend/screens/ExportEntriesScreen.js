import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import theme from '../theme';
import { useJournal } from '../context/JournalContext';
import { useFeedback } from '../context/FeedbackContext';
import { createExportEntriesUseCase } from '../services/exportEntries';

const { colors, spacing, typography, radii, shadows } = theme;

export default function ExportEntriesScreen({ navigation }) {
  const { entries } = useJournal();
  const { showToast } = useFeedback();

  const [selectedIds, setSelectedIds] = useState([]);
  const [isExporting, setIsExporting] = useState(false);

  const hasEntries = entries && entries.length > 0;

  const toggleSelection = (entryId) => {
    setSelectedIds((current) => {
      const idStr = String(entryId);
      if (current.includes(idStr)) {
        return current.filter((id) => id !== idStr);
      }
      return [...current, idStr];
    });
  };

  const isSelected = (entryId) => selectedIds.includes(String(entryId));

  const handleSelectAll = () => {
    if (!hasEntries) return;
    setSelectedIds(entries.map((entry) => String(entry.id)));
  };

  const handleClearSelection = () => {
    setSelectedIds([]);
  };

  const handleExport = async () => {
    if (!hasEntries) {
      showToast('error', 'No entries available to export');
      return;
    }
    if (selectedIds.length === 0) {
      showToast('error', 'Please select at least one entry to export');
      return;
    }

    try {
      setIsExporting(true);
      const useCase = createExportEntriesUseCase(entries);
      await useCase.execute(selectedIds);
      showToast('success', 'PDF generated. Use the share sheet to save it.');
    } catch (err) {
      console.error('Export failed', err);
      showToast('error', 'Could not export your entries');
    } finally {
      setIsExporting(false);
    }
  };

  const renderEntryLabel = (entry, index) => {
    const title = entry.title || `Entry ${index + 1}`;
    const dateLabel = entry.dateLabel || entry.created_at || '';
    if (dateLabel) {
      return `${title} — ${dateLabel}`;
    }
    return title;
  };

  const selectionSummary = useMemo(() => {
    if (!hasEntries) return 'No entries to export yet.';
    if (selectedIds.length === 0) return 'Select the entries you want to export as PDF.';
    if (selectedIds.length === 1) return '1 entry selected.';
    return `${selectedIds.length} entries selected.`;
  }, [hasEntries, selectedIds.length]);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Export entries</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Your entries</Text>
        <Text style={styles.helperText}>{selectionSummary}</Text>

        {hasEntries ? (
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.chipButton} onPress={handleSelectAll}>
              <Text style={styles.chipButtonText}>Select all</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.chipButton} onPress={handleClearSelection}>
              <Text style={styles.chipButtonText}>Clear</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>

      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {hasEntries ? (
          entries.map((entry, index) => {
            const selected = isSelected(entry.id);
            return (
              <TouchableOpacity
                key={entry.id}
                style={[styles.entryRow, selected && styles.entryRowSelected]}
                activeOpacity={0.8}
                onPress={() => toggleSelection(entry.id)}
              >
                <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
                  {selected ? <Text style={styles.checkboxMark}>✓</Text> : null}
                </View>
                <View style={styles.entryTextWrapper}>
                  <Text style={styles.entryTitle} numberOfLines={1}>
                    {renderEntryLabel(entry, index)}
                  </Text>
                  {entry.emotion ? (
                    <Text style={styles.entryMeta} numberOfLines={1}>
                      {entry.emotion}
                    </Text>
                  ) : null}
                </View>
              </TouchableOpacity>
            );
          })
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              You don't have any entries yet. Once you write in your journal, you can export them from here.
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.primaryButton, (!hasEntries || isExporting) && styles.primaryButtonDisabled]}
          onPress={handleExport}
          disabled={!hasEntries || isExporting}
        >
          {isExporting ? (
            <ActivityIndicator color={colors.textOnPrimary} />
          ) : (
            <Text style={styles.primaryButtonText}>Export as PDF</Text>
          )}
        </TouchableOpacity>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  backButton: {
    marginRight: spacing.sm,
    paddingVertical: spacing.xs,
    paddingRight: spacing.sm,
  },
  backIcon: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.subtitle,
    color: colors.text,
  },
  headerTitle: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.title,
    fontWeight: '700',
    color: colors.text,
  },
  section: {
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  sectionLabel: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.subtitle,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  helperText: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.caption,
    color: colors.textMuted,
  },
  actionsRow: {
    flexDirection: 'row',
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  chipButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 999,
    backgroundColor: colors.surfaceSoft,
  },
  chipButtonText: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.caption,
    color: colors.primary,
  },
  list: {
    flex: 1,
    marginTop: spacing.sm,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
  entryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    ...shadows.softer,
  },
  entryRowSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceSoft,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    backgroundColor: colors.background,
  },
  checkboxSelected: {
    backgroundColor: colors.primary,
  },
  checkboxMark: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: 14,
    color: colors.textOnPrimary,
  },
  entryTextWrapper: {
    flex: 1,
  },
  entryTitle: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.body,
    color: colors.text,
  },
  entryMeta: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.caption,
    color: colors.textMuted,
  },
  emptyState: {
    paddingVertical: spacing.lg,
  },
  emptyStateText: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.body,
    color: colors.textMuted,
  },
  footer: {
    marginTop: spacing.sm,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.subtitle,
    color: colors.textOnPrimary,
    fontWeight: '600',
  },
});
