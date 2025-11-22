import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import theme from '../theme';

const { colors, spacing, radii, typography, shadows } = theme;

export default function AudioToTextScreen({ navigation }) {
  const [phase, setPhase] = useState('idle'); // 'idle' | 'loading' | 'done'

  useEffect(() => {
    let timer;
    if (phase === 'loading') {
      timer = setTimeout(() => {
        setPhase('done');
      }, 1200);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [phase]);

  const startTranscription = () => {
    setPhase('loading');
  };

  const handleUseTranscription = () => {
    navigation.goBack();
  };

  const handleTryAgain = () => {
    setPhase('idle');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Audio to Text</Text>

      <View style={styles.card}>
        {phase === 'idle' && (
          <>
            <View style={styles.micCircle}>
              <Text style={styles.micIcon}>🎙️</Text>
            </View>
            <Text style={styles.cardHint}>
              Upload or record an audio note to turn it into a journal entry.
            </Text>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={startTranscription}
              >
                <Text style={styles.secondaryButtonText}>Upload audio</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={startTranscription}
              >
                <Text style={styles.primaryButtonText}>Record audio</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {phase === 'loading' && (
          <View style={styles.loadingBox}>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.loadingText}>Transcribing your audio...</Text>
          </View>
        )}

        {phase === 'done' && (
          <>
            <View style={styles.previewBox}>
              <Text style={styles.previewLabel}>Transcription preview</Text>
              <Text style={styles.previewText}>
                "Today I felt calmer after my walk. I noticed my breathing slowing
                down and my mind felt less busy. I would like to remember this
                feeling next time I am stressed."
              </Text>
            </View>

            <TouchableOpacity
              style={styles.useButton}
              onPress={handleUseTranscription}
            >
              <Text style={styles.useButtonText}>Use Transcription</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.tryAgainButton} onPress={handleTryAgain}>
              <Text style={styles.tryAgainText}>Try Again</Text>
            </TouchableOpacity>
          </>
        )}
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
  title: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.title,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.xl,
    ...shadows.soft,
  },
  micCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.secondaryLight,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  micIcon: {
    fontSize: 40,
  },
  cardHint: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 25,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontFamily: typography.fontFamilyPrimary,
    color: colors.textOnPrimary,
    fontWeight: '600',
    fontSize: typography.sizes.subtitle,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 25,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  secondaryButtonText: {
    fontFamily: typography.fontFamilyPrimary,
    color: colors.primary,
    fontSize: typography.sizes.subtitle,
  },
  loadingBox: {
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.body,
    color: colors.textMuted,
  },
  previewBox: {
    backgroundColor: colors.surfaceSoft,
    borderRadius: radii.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.primaryLight,
    marginBottom: spacing.lg,
  },
  previewLabel: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.caption,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  previewText: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.body,
    color: colors.text,
  },
  useButton: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  useButtonText: {
    fontFamily: typography.fontFamilyPrimary,
    color: colors.textOnPrimary,
    fontWeight: '600',
    fontSize: typography.sizes.subtitle,
  },
  tryAgainButton: {
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  tryAgainText: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.body,
    color: colors.primary,
  },
});
