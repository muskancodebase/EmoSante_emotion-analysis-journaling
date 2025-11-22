import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import theme from '../theme';
import { useJournal } from '../context/JournalContext';
import { useFeedback } from '../context/FeedbackContext';

const { colors, spacing, radii, typography, shadows } = theme;

const MOODS = [
  { label: 'Happy', color: '#FFE6B3' },
  { label: 'Calm', color: '#D9F3FF' },
  { label: 'Neutral', color: '#E6E0D8' },
  { label: 'Tired', color: '#F5D9FF' },
  { label: 'Sad', color: '#F7C6C6' },
];

export default function AddJournalScreen({ navigation }) {
  const { addEntry } = useJournal();
  const { showToast } = useFeedback();
  const [text, setText] = useState('');
  const [emotion, setEmotion] = useState('Neutral');
  const [error, setError] = useState('');

  const handleSave = async () => {
    const trimmed = text.trim();
    if (!trimmed) {
      setError('Entry cannot be saved without text');
      return;
    }

    const result = await addEntry({
      content: trimmed,
      emotion,
    });

    if (!result) {
      return;
    }

    setError('');
    showToast('success', 'Entry saved');
    setText('');
    setEmotion('Neutral');

    setTimeout(() => {
      navigation.navigate('JournalList');
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>New Entry</Text>

        <TextInput
          style={styles.textArea}
          placeholder="Freely write what you are feeling today."
          placeholderTextColor={colors.textMutedSoft}
          multiline
          textAlignVertical="top"
          value={text}
          onChangeText={(value) => {
            setText(value);
            if (error) {
              setError('');
            }
          }}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.moodsRow}>
          {MOODS.map((mood) => {
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

        <TouchableOpacity
          style={styles.audioButton}
          onPress={() => navigation.navigate('AudioToText')}
        >
          <Text style={styles.audioButtonText}>🎙️ Audio to text</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleSave}
        >
          <Text style={styles.primaryButtonText}>Save</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('JournalList')}
        >
          <Text style={styles.secondaryButtonText}>Cancel</Text>
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
  content: {
    flex: 1,
  },
  title: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.title,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
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
  audioButton: {
    alignSelf: 'flex-end',
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 999,
    backgroundColor: colors.surfaceSoft,
    ...shadows.soft,
  },
  audioButtonText: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.caption,
    color: colors.primary,
    fontWeight: '500',
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
  },
  primaryButton: {
    flex: 1,
    maxWidth: 160,
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
  secondaryButton: {
    flex: 1,
    maxWidth: 160,
    backgroundColor: colors.surface,
    borderRadius: 25,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
    marginLeft: spacing.sm,
  },
  secondaryButtonText: {
    fontFamily: typography.fontFamilyPrimary,
    color: colors.primary,
    fontSize: typography.sizes.subtitle,
  },
});
