<<<<<<< HEAD
// Frontend/screens/ResetPasswordScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import theme from '../theme';
import { useFeedback } from '../context/FeedbackContext';
import { API_BASE_URL } from '../config';

const { colors, spacing, radii, typography, shadows } = theme;

export default function ResetPasswordScreen({ route, navigation }) {
  const { showToast } = useFeedback();

  // token passed from EnterOtpScreen
  const initialToken = route.params?.token || '';

  const [token, setToken] = useState(initialToken);
  const [showTokenInput, setShowTokenInput] = useState(!initialToken);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    // VALIDATION
    if (!token.trim()) {
      showToast('error', 'Please enter the reset token');
      return;
    }

    if (!newPassword) {
      showToast('error', 'Please enter a new password');
      return;
    }

    if (newPassword.length < 6) {
      showToast('error', 'Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast('error', 'Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/reset/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: token.trim(),
          password: newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        showToast('success', data.message || 'Password reset successful!');
        setTimeout(() => {
          navigation.navigate('Login');
        }, 1500);
      } else {
        showToast('error', data.message || 'Reset failed');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      showToast('error', 'Cannot connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>
          {showTokenInput ? 'Enter the token sent to your email' : 'Enter your new password'}
        </Text>

        {/* TOKEN FIELD (only shown if token was NOT passed from OTP screen) */}
        {showTokenInput && (
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Reset Token</Text>
            <TextInput
              style={styles.input}
              placeholder="Paste the reset token"
              placeholderTextColor={colors.textMutedSoft}
              value={token}
              onChangeText={setToken}
              autoCapitalize="none"
              editable={!loading}
            />
            <Text style={styles.hint}>Check your email for the reset code</Text>
          </View>
        )}

        {/* NEW PASSWORD */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>New Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter new password"
            placeholderTextColor={colors.textMutedSoft}
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
            editable={!loading}
          />
        </View>

        {/* CONFIRM PASSWORD */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Re-enter password"
            placeholderTextColor={colors.textMutedSoft}
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            editable={!loading}
          />
        </View>

        {/* RESET BUTTON */}
        <TouchableOpacity
          style={[styles.primaryButton, loading && styles.buttonDisabled]}
          onPress={handleResetPassword}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.textOnPrimary} />
          ) : (
            <Text style={styles.primaryButtonText}>Reset Password</Text>
          )}
        </TouchableOpacity>

        {/* BACK TO LOGIN */}
        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => navigation.navigate('Login')}
          disabled={loading}
        >
          <Text style={styles.linkText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.xl,
    ...shadows.soft,
  },
  title: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.title,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  fieldGroup: {
    marginBottom: spacing.md,
  },
  label: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.body,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  input: {
    fontFamily: typography.fontFamilyPrimary,
    backgroundColor: colors.surfaceSoft,
    borderRadius: radii.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.primaryLight,
    fontSize: typography.sizes.body,
    color: colors.text,
  },
  hint: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    fontFamily: typography.fontFamilyPrimary,
    color: colors.textOnPrimary,
    fontWeight: '600',
    fontSize: typography.sizes.subtitle,
  },
  linkButton: {
    marginTop: spacing.sm,
    alignItems: 'center',
  },
  linkText: {
    fontFamily: typography.fontFamilyPrimary,
    color: colors.primary,
    fontSize: typography.sizes.body,
  },
});
=======
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

import { API_BASE_URL } from '../config';

export default function ResetPasswordScreen() {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async () => {
    const res = await fetch(`${API_BASE_URL}/reset/confirm`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold" }}>Reset Password</Text>

      <TextInput
        placeholder="Paste Token"
        value={token}
        onChangeText={setToken}
        style={{
          borderWidth: 1,
          padding: 10,
          borderRadius: 6,
          marginTop: 20,
        }}
      />

      <TextInput
        placeholder="New password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{
          borderWidth: 1,
          padding: 10,
          borderRadius: 6,
          marginTop: 20,
        }}
      />

      <TouchableOpacity
        onPress={handleReset}
        style={{
          backgroundColor: "green",
          padding: 15,
          borderRadius: 8,
          marginTop: 20,
        }}
      >
        <Text style={{ color: "white" }}>Update Password</Text>
      </TouchableOpacity>

      {message ? <Text style={{ marginTop: 20 }}>{message}</Text> : null}
    </View>
  );
}
>>>>>>> 7a2e35221d0f276e0a91014c905b43ddbc96f46b
