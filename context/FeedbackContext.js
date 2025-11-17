import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import theme from '../theme';

const { colors, spacing, radii, typography, shadows } = theme;

const FeedbackContext = createContext(null);

export function FeedbackProvider({ children }) {
  const [toast, setToast] = useState(null); // { type, message }
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

  const value = {
    showToast,
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
});
