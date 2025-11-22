import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import theme from '../theme';

const { colors, spacing, typography, shadows } = theme;

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Soft abstract background shapes */}
      <View style={styles.bgShapeTop} />
      <View style={styles.bgShapeBottom} />

      <View style={styles.centerContent}>
        <Text style={styles.appName}>ÉmoSanté</Text>

        <View style={styles.textBlock}>
          <Text style={styles.headline}>Welcome to your safe space</Text>
          <Text style={styles.subheading}>
            Understand your feelings with the help of AI-powered journaling.
          </Text>
        </View>
      </View>

      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('SignUp')}
        >
          <Text style={styles.primaryButtonText}>Get Started</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.secondaryText}>
            Already have an account? Sign in
          </Text>
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
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bgShapeTop: {
    position: 'absolute',
    top: -120,
    left: -160,
    width: 320,
    height: 200,
    borderRadius: 200,
    backgroundColor: colors.primaryLight,
    opacity: 0.4,
    transform: [{ scaleX: 1.5 }],
  },
  bgShapeBottom: {
    position: 'absolute',
    bottom: -140,
    right: -200,
    width: 360,
    height: 220,
    borderRadius: 240,
    backgroundColor: colors.secondaryLight,
    opacity: 0.5,
    transform: [{ scaleX: 1.6 }],
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.largeTitle,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
  },
  textBlock: {
    marginTop: spacing.xxl,
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  headline: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subheading: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.body,
    color: colors.textMuted,
    textAlign: 'center',
  },
  bottomActions: {
    width: '100%',
    maxWidth: 400,
    paddingBottom: spacing.md,
    alignItems: 'center',
  },
  primaryButton: {
    width: '100%',
    paddingVertical: spacing.lg,
    borderRadius: 999,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.soft,
  },
  primaryButtonText: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.subtitle,
    fontWeight: '700',
    color: colors.textOnPrimary,
  },
  secondaryText: {
    marginTop: spacing.sm,
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.caption,
    color: colors.textMuted,
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
});
