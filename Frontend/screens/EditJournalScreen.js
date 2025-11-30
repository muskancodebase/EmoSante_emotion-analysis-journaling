import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import theme from '../theme';
import { useJournal } from '../context/JournalContext';
import { useFeedback } from '../context/FeedbackContext';
import { MOOD_OPTIONS } from '../context/moodPalette';

const { colors, spacing, radii, typography, shadows } = theme;

export default function EditJournalScreen({ navigation, route }) {
  const { entries, updateEntry, deleteEntry } = useJournal();
  const { showToast, showDialog } = useFeedback();
  const entryId = route?.params?.entryId;
  const entry = entries.find((item) => item.id === entryId);

  const [title, setTitle] = useState(entry?.title ?? '');
  const [text, setText] = useState(entry?.content ?? entry?.preview ?? '');
  const [emotion, setEmotion] = useState(entry?.emotion ?? 'Neutral');
  const [error, setError] = useState('');

  const handleUpdate = async () => {
    const trimmedTitle = title.trim();
    const trimmed = text.trim();
    if (!trimmedTitle) {
      setError('Title cannot be empty');
      return;
    }
    if (!trimmed) {
      setError('Entry cannot be saved without text');
      return;
    }

    if (!entry) {
      return;
    }

    const result = await updateEntry(entry.id, {
      title: trimmedTitle,
      content: trimmed,
      emotion,
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Edit Entry</Text>

        <TextInput
          style={styles.titleInput}
          value={title}
          placeholder="Edit title"
          placeholderTextColor={colors.textMutedSoft}
          onChangeText={(value) => {
            setTitle(value);
            if (error) {
              setError('');
            }
          }}
        />

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

        <View style={styles.moodsRow}>
          {MOOD_OPTIONS.map((mood) => {
            const selected = emotion === mood.label;
            return (
              <TouchableOpacity
                key={mood.label}
                style={[
                  styles.moodChip,
                  { backgroundColor: mood.color },
                  selected && styles.moodChipSelected,
                ]}
                activeOpacity={0.9}
                onPress={() => setEmotion(mood.label)}
              >
                <Text
                  style={selected ? styles.moodChipTextSelected : styles.moodChipText}
                >
                  {mood.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

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
    </KeyboardAvoidingView>
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
  contentContainer: {
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
  titleInput: {
    fontFamily: typography.fontFamilyPrimary,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.primaryLight,
    fontSize: typography.sizes.body,
    color: colors.text,
    marginBottom: spacing.md,
    ...shadows.softer,
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
  moodsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  moodChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 999,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
    opacity: 0.9,
  },
  moodChipSelected: {
    borderWidth: 1,
    borderColor: colors.primaryDark,
  },
  moodChipText: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.caption,
    color: colors.text,
  },
  moodChipTextSelected: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.caption,
    color: colors.text,
    fontWeight: '600',
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
