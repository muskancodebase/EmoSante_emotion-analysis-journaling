import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import theme from '../theme';

const { colors, spacing, radii, typography, shadows } = theme;

const FeedbackContext = createContext(null);

export function FeedbackProvider({ children }) {
  const [toast, setToast] = useState(null); // { type, message }
  const [dialog, setDialog] = useState(null); // { title, message, ... }
  const hideTimeoutRef = useRef(null);
  const opacity = useRef(new Animated.Value(0)).current;

  const clearToast = useCallback(() => {
    setToast(null);
  }, []);

  const showToast = useCallback((type, message, options = {}) => {
    const duration = options.duration ?? 1500;

    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }

    setToast({ type, message });

    // Fade in
    Animated.timing(opacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    hideTimeoutRef.current = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        clearToast();
      });
    }, duration);
  }, [clearToast, opacity]);

  const showDialog = useCallback((config) => {
    setDialog({
      title: config.title || 'Are you sure?',
      message: config.message || '',
      confirmLabel: config.confirmLabel || 'Confirm',
      cancelLabel: config.cancelLabel || 'Cancel',
      variant: config.variant || 'default',
      onConfirm: config.onConfirm,
      onCancel: config.onCancel,
    });
  }, []);

  const value = {
    showToast,
    showDialog,
  };

  const getToastStyles = () => {
    if (!toast) return {};

    switch (toast.type) {
      case 'success':
        return {
          card: styles.toastCardSuccess,
          text: styles.toastTextLight,
        };
      case 'error':
        return {
          card: styles.toastCardError,
          text: styles.toastTextError,
        };
      default:
        return {
          card: styles.toastCardInfo,
          text: styles.toastTextDark,
        };
    }
  };

  const toastStyles = getToastStyles();

  return (
    <FeedbackContext.Provider value={value}>
      <View style={{ flex: 1 }}>
        {children}
        {toast && (
          <View pointerEvents="none" style={styles.toastOverlay}>
            <Animated.View style={[styles.toastCardBase, toastStyles.card, { opacity }] }>
              <Text style={toastStyles.text}>{toast.message}</Text>
            </Animated.View>
          </View>
        )}
        {dialog && (
          <View style={styles.dialogOverlay}>
            <View style={styles.dialogCard}>
              {dialog.title ? <Text style={styles.dialogTitle}>{dialog.title}</Text> : null}
              {dialog.message ? (
                <Text style={styles.dialogMessage}>{dialog.message}</Text>
              ) : null}
              <View style={styles.dialogActionsRow}>
                <TouchableOpacity
                  style={[styles.dialogButton, styles.dialogCancelButton]}
                  onPress={() => {
                    if (dialog.onCancel) {
                      dialog.onCancel();
                    }
                    setDialog(null);
                  }}
                >
                  <Text style={styles.dialogCancelText}>
                    {dialog.cancelLabel || 'Cancel'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.dialogButton,
                    dialog.variant === 'danger'
                      ? styles.dialogConfirmButtonDanger
                      : styles.dialogConfirmButton,
                  ]}
                  onPress={() => {
                    if (dialog.onConfirm) {
                      dialog.onConfirm();
                    }
                    setDialog(null);
                  }}
                >
                  <Text
                    style={
                      dialog.variant === 'danger'
                        ? styles.dialogConfirmTextDanger
                        : styles.dialogConfirmText
                    }
                  >
                    {dialog.confirmLabel || 'Confirm'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>
    </FeedbackContext.Provider>
  );
}

export function useFeedback() {
  const ctx = useContext(FeedbackContext);
  if (!ctx) {
    throw new Error('useFeedback must be used within a FeedbackProvider');
  }
  return ctx;
}

const styles = StyleSheet.create({
  toastOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toastCardBase: {
    maxWidth: '80%',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderRadius: radii.lg,
    ...shadows.soft,
  },
  toastCardSuccess: {
    backgroundColor: colors.primary,
  },
  toastCardError: {
    backgroundColor: colors.danger,
  },
  toastCardInfo: {
    backgroundColor: colors.surface,
  },
  toastTextLight: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.body,
    color: colors.textOnPrimary,
    textAlign: 'center',
  },
  toastTextDark: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.body,
    color: colors.text,
    textAlign: 'center',
  },
  toastTextError: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.body,
    color: colors.dangerText,
    textAlign: 'center',
  },
  dialogOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialogCard: {
    width: '80%',
    maxWidth: 340,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    ...shadows.soft,
  },
  dialogTitle: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.subtitle,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  dialogMessage: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.body,
    color: colors.textMuted,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  dialogActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  dialogButton: {
    flex: 1,
    borderRadius: 25,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialogCancelButton: {
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  dialogConfirmButton: {
    backgroundColor: colors.primary,
  },
  dialogConfirmButtonDanger: {
    backgroundColor: colors.danger,
  },
  dialogCancelText: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.body,
    color: colors.textMuted,
  },
  dialogConfirmText: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.body,
    color: colors.textOnPrimary,
    fontWeight: '600',
  },
  dialogConfirmTextDanger: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.body,
    color: colors.dangerText,
    fontWeight: '600',
  },
});
