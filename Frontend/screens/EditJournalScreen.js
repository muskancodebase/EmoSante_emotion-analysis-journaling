import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import theme from '../theme';
import { useJournal } from '../context/JournalContext';
import { useFeedback } from '../context/FeedbackContext';

const { colors, spacing, radii, typography, shadows } = theme;

export default function EditJournalScreen({ navigation, route }) {
  const { entries, updateEntry, deleteEntry } = useJournal();
  const { showToast, showDialog } = useFeedback();
  const entryId = route?.params?.entryId;
  const entry = entries.find((item) => item.id === entryId);

  const [text, setText] = useState(entry?.preview ?? '');
  const [error, setError] = useState('');

  const handleUpdate = async () => {
    const trimmed = text.trim();
    if (!trimmed) {
      setError('Entry cannot be saved without text');
      return;
    }

    if (!entry) {
      return;
    }

    const result = await updateEntry(entry.id, {
      content: trimmed,
      emotion: entry.emotion,
    });

    if (!result) {
      return;
    }

    setError('');
    showToast('success', 'Entry updated');

    setTimeout(() => {
      navigation.navigate('JournalList');
    }, 1500);
  };

  const handleDelete = () => {
    if (!entry) {
      navigation.navigate('JournalList');
      return;
    }

    showDialog({
      title: 'Delete entry?',
      message: 'Are you sure you want to delete this entry? This cannot be undone.',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
      variant: 'danger',
      onConfirm: () => {
        deleteEntry(entry.id);
        showToast('success', 'Entry deleted');
        navigation.navigate('JournalList');
      },
    });
  };

  const handleCancel = () => {
    navigation.navigate('JournalList');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Edit Entry</Text>

        <TextInput
          style={styles.textArea}
          value={text}
          onChangeText={(value) => {
            setText(value);
            if (error) {
              setError('');
            }
          }}
          multiline
          textAlignVertical="top"
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleUpdate}
        >
          <Text style={styles.primaryButtonText}>Update</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dangerButton}
          onPress={handleDelete}
        >
          <Text style={styles.dangerButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.cancelLink}
        onPress={handleCancel}
      >
        <Text style={styles.cancelText}>Cancel</Text>
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
    paddingBottom: spacing.lg,
  },
  content: {
    flex: 1,
  },
  title: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.title,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  textArea: {
    fontFamily: typography.fontFamilyPrimary,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderWidth: 1,
    borderColor: colors.primaryLight,
    fontSize: typography.sizes.body,
    color: colors.text,
    minHeight: 300,
    ...shadows.softer,
  },
  errorText: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.caption,
    color: colors.dangerText,
    marginTop: spacing.xs,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  primaryButton: {
    flex: 1,
    maxWidth: 150,
    backgroundColor: colors.primary,
    borderRadius: 25,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  primaryButtonText: {
    fontFamily: typography.fontFamilyPrimary,
    color: colors.textOnPrimary,
    fontWeight: '600',
    fontSize: typography.sizes.subtitle,
  },
  dangerButton: {
    flex: 1,
    maxWidth: 150,
    backgroundColor: colors.danger,
    borderRadius: 25,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
  dangerButtonText: {
    fontFamily: typography.fontFamilyPrimary,
    color: colors.dangerText,
    fontWeight: '600',
    fontSize: typography.sizes.subtitle,
  },
  cancelLink: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  cancelText: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.body,
    color: colors.textMuted,
  },
});
