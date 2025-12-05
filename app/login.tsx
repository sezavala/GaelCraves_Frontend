import React from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Stack, Link } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import GoogleSignIn from "@/components/GoogleSignIn";

// Color constants for the login screen theme
const BG = "#0B1313";
const PANEL = "#0E1717";
const PEACH = "#E7C4A3";
const TEXT = "rgba(255,255,255,0.92)";
const MUTED = "rgba(255,255,255,0.72)";
const INPUT_BG = "#151F1F";
const BORDER = "rgba(255,255,255,0.08)";
const ERROR_COLOR = "#ff6b6b";

export default function LoginScreen() {
  const {
    isSignUp,
    isAdmin,
    isLoading,
    email,
    password,
    confirmPassword,
    firstName,
    lastName,
    securityQuestion,
    securityAnswer,
    errors,
    touched,
    setEmail,
    setPassword,
    setConfirmPassword,
    setFirstName,
    setLastName,
    setSecurityQuestion,
    setSecurityAnswer,
    setIsAdmin,
    handleBlur,
    handleSubmit,
    handleGoogleLogin,
    handleInstagramLogin,
    toggleMode,
  } = useAuth();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.container}>
          {/* ==========================================
               HEADER SECTION
               ========================================== */}
          <View style={styles.header}>
            {/* Logo flame icon */}
            <View style={styles.logoFlame} />
            <Text style={styles.brand}>GAEL'S CRAVES</Text>
          </View>

          {/* ==========================================
               MAIN CARD CONTAINER
               ========================================== */}
          <View style={styles.card}>
            {/* ==========================================
                 TAB SELECTOR - Sign In / Sign Up Toggle
                 ========================================== */}
            <View style={styles.tabContainer}>
              {/* Pressable - Like a button but more flexible */}
              <Pressable
                style={[
                  styles.tab,
                  !isSignUp && styles.tabActive, // Conditional styling - applies tabActive when !isSignUp is true
                ]}
                onPress={toggleMode} // Use toggleMode from hook
                disabled={isLoading} // Disable during loading
              >
                <Text
                  style={[styles.tabText, !isSignUp && styles.tabTextActive]}
                >
                  Sign In
                </Text>
              </Pressable>

              <Pressable
                style={[styles.tab, isSignUp && styles.tabActive]}
                onPress={toggleMode}
                disabled={isLoading}
              >
                <Text
                  style={[styles.tabText, isSignUp && styles.tabTextActive]}
                >
                  Sign Up
                </Text>
              </Pressable>
            </View>

            {/* ==========================================
                 FORM FIELDS
                 ========================================== */}
            <View style={styles.form}>
              {/* EMAIL INPUT */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={[
                    styles.input,
                    touched.email && errors.email && styles.inputError,
                  ]}
                  placeholder="your@email.com"
                  placeholderTextColor={MUTED}
                  value={email}
                  onChangeText={setEmail}
                  onBlur={() => handleBlur("email")}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!isLoading}
                />
                {touched.email && errors.email ? (
                  <Text style={styles.errorText}>{errors.email}</Text>
                ) : null}
              </View>

              {/* FIRST NAME - Only show during sign up */}
              {isSignUp && (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>First Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="John"
                    placeholderTextColor={MUTED}
                    value={firstName}
                    onChangeText={setFirstName}
                    editable={!isLoading}
                  />
                </View>
              )}

              {/* LAST NAME - Only show during sign up */}
              {isSignUp && (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Last Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Doe"
                    placeholderTextColor={MUTED}
                    value={lastName}
                    onChangeText={setLastName}
                    editable={!isLoading}
                  />
                </View>
              )}

              {/* PASSWORD INPUT */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={[
                    styles.input,
                    touched.password && errors.password && styles.inputError,
                  ]}
                  placeholder="••••••••"
                  placeholderTextColor={MUTED}
                  value={password}
                  onChangeText={setPassword}
                  onBlur={() => handleBlur("password")}
                  secureTextEntry
                  editable={!isLoading}
                />
                {touched.password && errors.password ? (
                  <Text style={styles.errorText}>{errors.password}</Text>
                ) : null}
              </View>

              {/* ==========================================
                   CONDITIONAL RENDERING - Only shows these fields during sign up
                   ========================================== */}
              {isSignUp && (
                <>
                  {/* CONFIRM PASSWORD */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Confirm Password</Text>
                    <TextInput
                      style={[
                        styles.input,
                        touched.confirmPassword &&
                          errors.confirmPassword &&
                          styles.inputError,
                      ]}
                      placeholder="••••••••"
                      placeholderTextColor={MUTED}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      onBlur={() => handleBlur("confirmPassword")}
                      secureTextEntry
                      editable={!isLoading}
                    />
                    {touched.confirmPassword && errors.confirmPassword ? (
                      <Text style={styles.errorText}>
                        {errors.confirmPassword}
                      </Text>
                    ) : null}
                  </View>

                  {/* SECURITY QUESTION */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Security Question</Text>
                    <TextInput
                      style={[
                        styles.input,
                        touched.securityQuestion &&
                          errors.securityQuestion &&
                          styles.inputError,
                      ]}
                      placeholder="What was your first pet's name?"
                      placeholderTextColor={MUTED}
                      value={securityQuestion}
                      onChangeText={setSecurityQuestion}
                      onBlur={() => handleBlur("securityQuestion")}
                      editable={!isLoading}
                    />
                    {touched.securityQuestion && errors.securityQuestion ? (
                      <Text style={styles.errorText}>
                        {errors.securityQuestion}
                      </Text>
                    ) : null}
                  </View>

                  {/* SECURITY ANSWER */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Security Answer</Text>
                    <TextInput
                      style={[
                        styles.input,
                        touched.securityAnswer &&
                          errors.securityAnswer &&
                          styles.inputError,
                      ]}
                      placeholder="Your answer"
                      placeholderTextColor={MUTED}
                      value={securityAnswer}
                      onChangeText={setSecurityAnswer}
                      onBlur={() => handleBlur("securityAnswer")}
                      editable={!isLoading}
                    />
                    {touched.securityAnswer && errors.securityAnswer ? (
                      <Text style={styles.errorText}>
                        {errors.securityAnswer}
                      </Text>
                    ) : null}
                  </View>
                </>
              )}

              {/* ==========================================
                   SUBMIT BUTTON - Changes text based on state
                   ========================================== */}
              <Pressable
                style={[
                  styles.submitBtn,
                  isLoading && styles.submitBtnDisabled,
                ]}
                onPress={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#1b1b1b" />
                ) : (
                  <Text style={styles.submitText}>
                    {isSignUp ? "CREATE ACCOUNT" : "SIGN IN"}
                  </Text>
                )}
              </Pressable>

              {/* ==========================================
                   DIVIDER - Visual separator
                   ========================================== */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* ==========================================
                   SOCIAL LOGIN BUTTONS
                   ========================================== */}
              <View style={styles.socialRow}>
                {/* GOOGLE BUTTON */}
                {/* GOOGLE BUTTON (component uses expo-auth-session hook) */}
                <GoogleSignIn
                  style={styles.socialBtn}
                  iconStyle={styles.socialIcon}
                  textStyle={styles.socialText}
                />

                {/* INSTAGRAM BUTTON */}
                <Pressable
                  style={styles.socialBtn}
                  onPress={handleInstagramLogin}
                >
                  <Text style={styles.socialIcon}>📷</Text>
                  <Text style={styles.socialText}>Instagram</Text>
                </Pressable>
              </View>

              {/* ==========================================
                   FORGOT PASSWORD - Only shows during login
                   ========================================== */}
              {!isSignUp && (
                <Pressable style={styles.forgotBtn}>
                  <Text style={styles.forgotText}>Forgot password?</Text>
                </Pressable>
              )}
            </View>
          </View>

          {/* ==========================================
               BACK TO HOME LINK - Uses Expo Router navigation
               ========================================== */}
          <Link href="/" asChild>
            <Pressable style={styles.backBtn}>
              <Text style={styles.backText}>← Back to Home</Text>
            </Pressable>
          </Link>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG,
  },
  container: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: "center",
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 40,
  },
  logoFlame: {
    width: 18,
    height: 24,
    borderRadius: 4,
    backgroundColor: PEACH,
    transform: [{ rotate: "8deg" }],
  },
  brand: {
    color: TEXT,
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 1,
  },

  // Card
  card: {
    width: "100%",
    maxWidth: 440,
    backgroundColor: PANEL,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 18,
    padding: 32,
  },

  // Tabs
  tabContainer: {
    flexDirection: "row",
    backgroundColor: INPUT_BG,
    borderRadius: 10,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: PEACH,
  },
  tabText: {
    color: MUTED,
    fontWeight: "600",
    fontSize: 14,
  },
  tabTextActive: {
    color: "#1b1b1b",
  },

  // Form
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    color: TEXT,
    fontSize: 14,
    fontWeight: "600",
  },
  input: {
    backgroundColor: INPUT_BG,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    padding: 14,
    color: TEXT,
    fontSize: 15,
  },
  inputError: {
    borderColor: ERROR_COLOR,
    borderWidth: 1.5,
  },
  errorText: {
    color: ERROR_COLOR,
    fontSize: 12,
    marginTop: 4,
  },

  // Submit Button
  submitBtn: {
    backgroundColor: PEACH,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitText: {
    color: "#1b1b1b",
    fontWeight: "800",
    fontSize: 15,
    letterSpacing: 0.5,
  },

  // Divider
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: BORDER,
  },
  dividerText: {
    color: MUTED,
    fontSize: 12,
    fontWeight: "600",
  },

  // Social Buttons
  socialRow: {
    flexDirection: "row",
    gap: 12,
  },
  socialBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: INPUT_BG,
    borderWidth: 1,
    borderColor: BORDER,
    paddingVertical: 12,
    borderRadius: 10,
  },
  socialIcon: {
    fontSize: 18,
  },
  socialText: {
    color: TEXT,
    fontWeight: "600",
    fontSize: 14,
  },

  // Forgot Password
  forgotBtn: {
    alignItems: "center",
    marginTop: 12,
  },
  forgotText: {
    color: PEACH,
    fontSize: 14,
    fontWeight: "600",
  },

  // Back Button
  backBtn: {
    marginTop: 24,
  },
  backText: {
    color: MUTED,
    fontSize: 14,
  },
});
