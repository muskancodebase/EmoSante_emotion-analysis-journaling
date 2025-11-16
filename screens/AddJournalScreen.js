import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import theme from '../theme';
import { useJournal } from '../context/JournalContext';

const { colors, spacing, radii, typography, shadows } = theme;

export default function AddJournalScreen({ navigation }) {
  const { addEntry } = useJournal();
  const [text, setText] = useState('');

  const handleSave = () => {
    if (!text.trim()) {
      navigation.navigate('JournalList');
      return;
    }

    const now = new Date();
    const dateLabel =
      now.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      }) +
      ' · ' +
      now.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });

    addEntry({
      title: 'New entry',
      preview: text.trim(),
      dateLabel,
      emotion: 'Neutral',
    });

    navigation.navigate('JournalList');
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
          onChangeText={setText}
        />
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
