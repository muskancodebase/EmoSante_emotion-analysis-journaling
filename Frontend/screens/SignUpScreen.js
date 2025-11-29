<<<<<<< HEAD
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import theme from "../theme";
import { useFeedback } from "../context/FeedbackContext";
import { API_BASE_URL } from "../config";

const { colors, spacing, radii, typography, shadows } = theme;

export default function SignUpScreen({ navigation }) {
  const { showToast } = useFeedback();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSignUp = async () => {
  let errors = {};
  let hasError = false;

  // VALIDATIONS
  if (!name.trim()) {
    errors.name = "Name cannot be empty";
    hasError = true;
  }

  if (!email.trim()) {
    errors.email = "Email cannot be empty";
    hasError = true;
  } else if (!email.toLowerCase().endsWith("@gmail.com")) {
    errors.email = "Email must end with @gmail.com";
    hasError = true;
  }

  if (!password || password.length < 6) {
    errors.password = "Password must be at least 6 characters";
    hasError = true;
  }

  if (confirmPassword !== password) {
    errors.confirmPassword = "Passwords do not match";
    hasError = true;
  }

  setFieldErrors(errors);

  if (hasError) {
    showToast("error", "Fix the highlighted errors");
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      }),
    });

    const data = await res.json();
    console.log("STATUS:", res.status);
    console.log("DATA:", data);
    // SUCCESS
    if (res.status === 201) {
      showToast("success", "Account created successfully!");

      setTimeout(() => {
        navigation.replace("Login");
      }, 1200);

      return;
    }

    // BACKEND ERROR
    showToast("error", data.message || "Signup failed");
  } catch (error) {
    showToast("error", "Cannot connect to server");
  }
};


  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Create Account</Text>

        <View style={styles.form}>
          {/* Full Name */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Your name"
              placeholderTextColor={colors.textMutedSoft}
              value={name}
              onChangeText={setName}
            />
            {fieldErrors.name ? (
              <Text style={styles.errorText}>{fieldErrors.name}</Text>
            ) : null}
          </View>

          {/* Email */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="you@gmail.com"
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

          {/* Password */}
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

          {/* Confirm Password */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={colors.textMutedSoft}
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            {fieldErrors.confirmPassword ? (
              <Text style={styles.errorText}>{fieldErrors.confirmPassword}</Text>
            ) : null}
          </View>
        </View>

        {/* SIGN UP BUTTON */}
        <TouchableOpacity style={styles.primaryButton} onPress={handleSignUp}>
          <Text style={styles.primaryButtonText}>Sign Up</Text>
        </TouchableOpacity>

        {/* GO TO LOGIN */}
        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.linkText}>
            Already have an account? Login
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
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  card: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.xl,
    ...shadows.soft,
  },
  title: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.title,
    fontWeight: "700",
    color: colors.text,
    textAlign: "center",
    marginBottom: spacing.xl,
  },
  form: {
    width: "100%",
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
  errorText: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.caption,
    color: colors.dangerText,
    marginTop: spacing.xs,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    paddingVertical: spacing.lg,
    alignItems: "center",
  },
  primaryButtonText: {
    fontFamily: typography.fontFamilyPrimary,
    color: colors.textOnPrimary,
    fontWeight: "600",
    fontSize: typography.sizes.subtitle,
  },
  linkButton: {
    marginTop: spacing.lg,
    alignItems: "center",
  },
  linkText: {
    fontFamily: typography.fontFamilyPrimary,
    color: colors.primary,
    fontSize: typography.sizes.body,
  },
});
=======
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import theme from "../theme";
import { useFeedback } from "../context/FeedbackContext";
import { API_BASE_URL } from "../config";

const { colors, spacing, radii, typography, shadows } = theme;

export default function SignUpScreen({ navigation }) {
  const { showToast } = useFeedback();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSignUp = async () => {
  let errors = {};
  let hasError = false;

  // VALIDATIONS
  if (!name.trim()) {
    errors.name = "Name cannot be empty";
    hasError = true;
  }

  if (!email.trim()) {
    errors.email = "Email cannot be empty";
    hasError = true;
  } else if (!email.toLowerCase().endsWith("@gmail.com")) {
    errors.email = "Email must end with @gmail.com";
    hasError = true;
  }

  if (!password || password.length < 6) {
    errors.password = "Password must be at least 6 characters";
    hasError = true;
  }

  if (confirmPassword !== password) {
    errors.confirmPassword = "Passwords do not match";
    hasError = true;
  }

  setFieldErrors(errors);

  if (hasError) {
    showToast("error", "Fix the highlighted errors");
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      }),
    });

    const data = await res.json();

    // SUCCESS
    if (res.status === 201) {
      showToast("success", "Account created successfully!");

      setTimeout(() => {
        navigation.replace("Login");
      }, 1200);

      return;
    }

    // BACKEND ERROR
    showToast("error", data.message || "Signup failed");
  } catch (error) {
    showToast("error", "Cannot connect to server");
  }
};


  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Create Account</Text>

        <View style={styles.form}>
          {/* Full Name */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Your name"
              placeholderTextColor={colors.textMutedSoft}
              value={name}
              onChangeText={setName}
            />
            {fieldErrors.name ? (
              <Text style={styles.errorText}>{fieldErrors.name}</Text>
            ) : null}
          </View>

          {/* Email */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="you@gmail.com"
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

          {/* Password */}
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

          {/* Confirm Password */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={colors.textMutedSoft}
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            {fieldErrors.confirmPassword ? (
              <Text style={styles.errorText}>{fieldErrors.confirmPassword}</Text>
            ) : null}
          </View>
        </View>

        {/* SIGN UP BUTTON */}
        <TouchableOpacity style={styles.primaryButton} onPress={handleSignUp}>
          <Text style={styles.primaryButtonText}>Sign Up</Text>
        </TouchableOpacity>

        {/* GO TO LOGIN */}
        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.linkText}>
            Already have an account? Login
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
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  card: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.xl,
    ...shadows.soft,
  },
  title: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.title,
    fontWeight: "700",
    color: colors.text,
    textAlign: "center",
    marginBottom: spacing.xl,
  },
  form: {
    width: "100%",
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
  errorText: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.caption,
    color: colors.dangerText,
    marginTop: spacing.xs,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    paddingVertical: spacing.lg,
    alignItems: "center",
  },
  primaryButtonText: {
    fontFamily: typography.fontFamilyPrimary,
    color: colors.textOnPrimary,
    fontWeight: "600",
    fontSize: typography.sizes.subtitle,
  },
  linkButton: {
    marginTop: spacing.lg,
    alignItems: "center",
  },
  linkText: {
    fontFamily: typography.fontFamilyPrimary,
    color: colors.primary,
    fontSize: typography.sizes.body,
  },
});
>>>>>>> 7a2e35221d0f276e0a91014c905b43ddbc96f46b
