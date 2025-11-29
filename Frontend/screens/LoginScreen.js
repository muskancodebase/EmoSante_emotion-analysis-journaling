<<<<<<< HEAD
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import theme from '../theme';
import { useFeedback } from '../context/FeedbackContext';
import { API_BASE_URL } from '../config';
import { useAuth } from '../context/AuthContext';

const { colors, spacing, radii, typography, shadows } = theme;

export default function LoginScreen({ navigation }) {
  const { showToast } = useFeedback();
  const { login: setAuth } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({ email: '', password: '' });
  const [formError, setFormError] = useState('');

  const handleLogin = async () => {
    setFormError('');

    if (!email.trim()) {
      setFieldErrors({ email: 'Email cannot be empty', password: '' });
      showToast('error', 'Email cannot be empty');
      return;
    }

    if (!password || password.length < 6) {
      setFieldErrors({ email: '', password: 'Password must be at least 6 characters' });
      showToast('error', 'Password must be at least 6 characters');
      return;
    }

    if (!email.endsWith("@gmail.com")) {
      setFieldErrors({ email: "Email must end with @gmail.com", password: "" });
      showToast('error', 'Email must end with @gmail.com');
      return;
    }




    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.status !== 200) {
        const message = data.message || "Login failed";
        setFormError(message);
        showToast('error', message);
        return;
      }

      // Store auth state (user + token) for use in Settings and journal APIs
      if (data.user && data.token) {
        setAuth({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
        }, data.token);
      }

      // LOGIN SUCCESS
      showToast('success', 'Login successful');

      setTimeout(() => {
        navigation.navigate("JournalList");
      }, 1500);

    } catch (err) {
      setFormError("Cannot connect to server");
      showToast('error', 'Cannot connect to server');
    }
  };


  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Login</Text>

        <View style={styles.form}>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              placeholderTextColor={colors.textMutedSoft}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
            {fieldErrors.email ? (
              <Text style={styles.errorText}>{fieldErrors.email}</Text>
            ) : null}
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={colors.textMutedSoft}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            {fieldErrors.password ? (
              <Text style={styles.errorText}>{fieldErrors.password}</Text>
            ) : null}
          </View>

          {formError ? <Text style={styles.formErrorText}>{formError}</Text> : null}
        </View>

        <TouchableOpacity
          style={styles.forgotPasswordButton}
          onPress={() => navigation.navigate("ForgotPassword")}
        >
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>


        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleLogin}
        >
          <Text style={styles.primaryButtonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => navigation.navigate('SignUp')}
        >
          <Text style={styles.linkText}>Don't have an account? Sign up</Text>
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
    alignItems: 'stretch',
    ...shadows.soft,
  },
  title: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.title,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  form: {
    width: '100%',
    marginBottom: spacing.lg,
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
  errorText: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.caption,
    color: colors.dangerText,
    marginTop: spacing.xs,
  },
  formErrorText: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.body,
    color: colors.dangerText,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  forgotPasswordButton: {
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  forgotPasswordText: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.body,
    color: colors.primary,
  },
  primaryButton: {
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
  linkButton: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  linkText: {
    fontFamily: typography.fontFamilyPrimary,
    color: colors.primary,
    fontSize: typography.sizes.body,
  },
});
=======
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import theme from '../theme';
import { useFeedback } from '../context/FeedbackContext';
import { API_BASE_URL } from '../config';
import { useAuth } from '../context/AuthContext';

const { colors, spacing, radii, typography, shadows } = theme;

export default function LoginScreen({ navigation }) {
  const { showToast } = useFeedback();
  const { login: setAuth } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({ email: '', password: '' });
  const [formError, setFormError] = useState('');

  const handleLogin = async () => {
    setFormError('');

    if (!email.trim()) {
      setFieldErrors({ email: 'Email cannot be empty', password: '' });
      showToast('error', 'Email cannot be empty');
      return;
    }

    if (!password || password.length < 6) {
      setFieldErrors({ email: '', password: 'Password must be at least 6 characters' });
      showToast('error', 'Password must be at least 6 characters');
      return;
    }

    if (!email.endsWith("@gmail.com")) {
      setFieldErrors({ email: "Email must end with @gmail.com", password: "" });
      showToast('error', 'Email must end with @gmail.com');
      return;
    }




    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.status !== 200) {
        const message = data.message || "Login failed";
        setFormError(message);
        showToast('error', message);
        return;
      }

      // Store auth state (user + token) for use in Settings and journal APIs
      if (data.user && data.token) {
        setAuth({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
        }, data.token);
      }

      // LOGIN SUCCESS
      showToast('success', 'Login successful');

      setTimeout(() => {
        navigation.navigate("JournalList");
      }, 1500);

    } catch (err) {
      setFormError("Cannot connect to server");
      showToast('error', 'Cannot connect to server');
    }
  };


  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Login</Text>

        <View style={styles.form}>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              placeholderTextColor={colors.textMutedSoft}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
            {fieldErrors.email ? (
              <Text style={styles.errorText}>{fieldErrors.email}</Text>
            ) : null}
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={colors.textMutedSoft}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            {fieldErrors.password ? (
              <Text style={styles.errorText}>{fieldErrors.password}</Text>
            ) : null}
          </View>

          {formError ? <Text style={styles.formErrorText}>{formError}</Text> : null}
        </View>

        <TouchableOpacity
          style={styles.forgotPasswordButton}
          onPress={() => navigation.navigate("ForgotPassword")}
        >
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>


        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleLogin}
        >
          <Text style={styles.primaryButtonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => navigation.navigate('SignUp')}
        >
          <Text style={styles.linkText}>Don't have an account? Sign up</Text>
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
    alignItems: 'stretch',
    ...shadows.soft,
  },
  title: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.title,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  form: {
    width: '100%',
    marginBottom: spacing.lg,
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
  errorText: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.caption,
    color: colors.dangerText,
    marginTop: spacing.xs,
  },
  formErrorText: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.body,
    color: colors.dangerText,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  forgotPasswordButton: {
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  forgotPasswordText: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.body,
    color: colors.primary,
  },
  primaryButton: {
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
  linkButton: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  linkText: {
    fontFamily: typography.fontFamilyPrimary,
    color: colors.primary,
    fontSize: typography.sizes.body,
  },
});
>>>>>>> 7a2e35221d0f276e0a91014c905b43ddbc96f46b
