import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import theme from '../theme';

const { colors, spacing, radii, typography, shadows } = theme;

export default function EmotionTagScreen({ navigation, route }) {
  const emotion = route?.params?.emotion || 'Calm';
  const description =
    route?.params?.description ||
    'This entry reflects a calm and grounded emotional state, with low intensity and steady mood.';

  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        <View style={styles.badge}>
          <Text style={styles.badgeEmoji}>💜</Text>
          <Text style={styles.badgeLabel}>{emotion}</Text>
        </View>

        <Text style={styles.title}>Emotion: {emotion}</Text>

        <Text style={styles.description}>{description}</Text>

        <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.xl,
    alignItems: 'center',
    ...shadows.soft,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 999,
    backgroundColor: colors.secondaryLight,
    marginBottom: spacing.lg,
  },
  badgeEmoji: {
    fontSize: 20,
    marginRight: spacing.xs,
  },
  badgeLabel: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.subtitle,
    fontWeight: '600',
    color: colors.text,
  },
  title: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.subtitle,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  description: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  closeButton: {
    marginTop: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 999,
    backgroundColor: colors.primary,
  },
  closeButtonText: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.body,
    color: colors.textOnPrimary,
    fontWeight: '600',
  },
});
