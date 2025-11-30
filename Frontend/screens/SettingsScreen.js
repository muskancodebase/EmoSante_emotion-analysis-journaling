import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import theme from '../theme';
import { useFeedback } from '../context/FeedbackContext';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config';

const { colors, spacing, typography } = theme;

export default function SettingsScreen({ navigation }) {
  const { showToast, showDialog } = useFeedback();
  const { user, token, logout } = useAuth();

  // --------------------------------------
  // LOGOUT
  // --------------------------------------
  const handleLogout = () => {
    showDialog({
      title: 'Log out?',
      message: 'You will need to sign in again to access your journal.',
      confirmLabel: 'Log out',
      cancelLabel: 'Cancel',
      variant: 'danger',
      onConfirm: async () => {
        logout();

        showToast('success', 'Logged out');
        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
      },
    });
  };

  // --------------------------------------
  // DELETE ACCOUNT
  // --------------------------------------
  const handleDeleteAccount = () => {
    showDialog({
      title: 'Delete account?',
      message: 'This will remove your account and journal data. This action cannot be undone.',
      confirmLabel: 'Delete account',
      cancelLabel: 'Cancel',
      variant: 'danger',
      onConfirm: async () => {
        try {
          const res = await fetch(`${API_BASE_URL}/auth/delete-account`, {
            method: "DELETE",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            }
          });

          const data = await res.json();

          if (res.ok) {
            showToast('success', 'Account deleted successfully');
            logout();
            navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
          } else {
            showToast('error', data.message || 'Failed to delete account');
          }
        } catch (error) {
          console.log("Delete error:", error);
          showToast('error', 'Cannot connect to server');
        }
      },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.userInfoName}>{user?.name || 'Guest'}</Text>
        {user?.email ? <Text style={styles.userInfoEmail}>{user.email}</Text> : null}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Account</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={handleLogout}>
          <Text style={styles.primaryButtonText}>Log out</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.dangerButton} onPress={handleDeleteAccount}>
          <Text style={styles.dangerButtonText}>Delete account</Text>
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
    marginTop: spacing.lg,
  },
  userInfoName: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.subtitle,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  userInfoEmail: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.body,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.subtitle,
    color: colors.text,
    marginBottom: spacing.md,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  primaryButtonText: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.subtitle,
    color: colors.textOnPrimary,
    fontWeight: '600',
  },
  dangerButton: {
    backgroundColor: colors.surface,
    borderRadius: 25,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.danger,
  },
  dangerButtonText: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.subtitle,
    color: colors.dangerText,
    fontWeight: '600',
  },
});
