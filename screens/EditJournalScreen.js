import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import theme from '../theme';

const { colors, spacing, radii, typography, shadows } = theme;

export default function EditJournalScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Edit Entry</Text>

        <TextInput
          style={styles.textArea}
          defaultValue="This is a sample journal text that you will be able to edit based on how you feel."
          multiline
          textAlignVertical="top"
        />
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('JournalList')}
        >
          <Text style={styles.primaryButtonText}>Update</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dangerButton}
          onPress={() => navigation.navigate('JournalList')}
        >
          <Text style={styles.dangerButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.cancelLink}
        onPress={() => navigation.navigate('JournalList')}
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
