/**
 * Custom hook for authentication logic
 * Manages form state, validation, and API calls for login/signup
 */

import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { useAuth as useAuthContext } from "@/auth/AuthContext";
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateSecurityQuestion,
  validateSecurityAnswer,
} from "@/utils/validation";
import {
  signUp,
  login,
  loginWithGoogle,
  loginWithGithub,
} from "@/services/authService";

interface FormErrors {
  email: string;
  password: string;
  confirmPassword: string;
  securityQuestion: string;
  securityAnswer: string;
}

interface TouchedFields {
  email: boolean;
  password: boolean;
  confirmPassword: boolean;
  securityQuestion: boolean;
  securityAnswer: boolean;
}

export function useAuth() {
  const router = useRouter();
  const { setUser, logout: contextLogout } = useAuthContext();

  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  const [isSignUp, setIsSignUp] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form field values
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");

  // Validation state
  const [errors, setErrors] = useState<FormErrors>({
    email: "",
    password: "",
    confirmPassword: "",
    securityQuestion: "",
    securityAnswer: "",
  });

  // Track which fields user has interacted with
  const [touched, setTouched] = useState<TouchedFields>({
    email: false,
    password: false,
    confirmPassword: false,
    securityQuestion: false,
    securityAnswer: false,
  });

  // ==========================================
  // VALIDATION EFFECTS
  // ==========================================

  // Validate email (only if touched)
  useEffect(() => {
    if (touched.email) {
      const result = validateEmail(email);
      setErrors((prev) => ({ ...prev, email: result.error }));
    }
  }, [email, touched.email]);

  // Validate password (only if touched)
  useEffect(() => {
    if (touched.password) {
      const result = validatePassword(password);
      setErrors((prev) => ({ ...prev, password: result.error }));
    }
  }, [password, touched.password]);

  // Validate confirm password (only if touched and in signup mode)
  useEffect(() => {
    if (touched.confirmPassword && isSignUp) {
      const result = validateConfirmPassword(password, confirmPassword);
      setErrors((prev) => ({ ...prev, confirmPassword: result.error }));
    }
  }, [password, confirmPassword, touched.confirmPassword, isSignUp]);

  // Validate security question (only if touched)
  useEffect(() => {
    if (touched.securityQuestion && isSignUp) {
      const result = validateSecurityQuestion(securityQuestion);
      setErrors((prev) => ({ ...prev, securityQuestion: result.error }));
    }
  }, [securityQuestion, touched.securityQuestion, isSignUp]);

  // Validate security answer (only if touched)
  useEffect(() => {
    if (touched.securityAnswer && isSignUp) {
      const result = validateSecurityAnswer(securityAnswer);
      setErrors((prev) => ({ ...prev, securityAnswer: result.error }));
    }
  }, [securityAnswer, touched.securityAnswer, isSignUp]);

  // ==========================================
  // HANDLERS
  // ==========================================

  /**
   * Marks a field as touched (user interacted with it)
   */
  const handleBlur = (field: keyof TouchedFields) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleLogout = async () => {
    try {
      await logoutService();
      contextLogout();
      router.replace("/(tabs)");
      Alert.alert("Success", "You have been logged out");
    } catch (error) {
      console.error("Logout error:", error);
      Alert.alert("Error", "Failed to logout. Please try again.");
    }
  };

  /**
   * Validates all form fields before submission
   */
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      email: validateEmail(email).error,
      password: validatePassword(password).error,
      confirmPassword: isSignUp
        ? validateConfirmPassword(password, confirmPassword).error
        : "",
      securityQuestion: isSignUp
        ? validateSecurityQuestion(securityQuestion).error
        : "",
      securityAnswer: isSignUp
        ? validateSecurityAnswer(securityAnswer).error
        : "",
    };

    setErrors(newErrors);
    setTouched({
      email: true,
      password: true,
      confirmPassword: isSignUp,
      securityQuestion: isSignUp,
      securityAnswer: isSignUp,
    });

    // Check if any errors exist
    return !Object.values(newErrors).some((error) => error !== "");
  };

  /**
   * Handles form submission for login or signup
   */
  const handleSubmit = async () => {
    // Validate form first
    if (!validateForm()) {
      Alert.alert(
        "Validation Error",
        "Please fix the errors before submitting"
      );
      return;
    }

    setIsLoading(true);

    try {
      if (isSignUp) {
        // Sign up flow
        const result = await signUp({
          email,
          password,
          firstName,
          lastName,
          securityQuestion,
          securityAnswer,
        });

        if (result.success && result.user) {
          // Store user data in AuthContext
          await setUser(result.user);

          // Reset form
          resetForm();
          const roles = result.user.roles || [];
          const isAdminUser =
            roles.includes("ADMIN") || roles.includes("GAEL_HIMSELF");

          // Navigate immediately based on role
          if (isAdminUser) {
            router.replace("/(tabs)/admin");
          } else {
            router.replace("/(tabs)");
          }

          // Show success message after navigation starts
          setTimeout(() => {
            Alert.alert("Success", result.message);
          }, 100);
        } else {
          Alert.alert("Error", result.message);
        }
      } else {
        // Login flow
        const result = await login({ email, password });

        if (result.success && result.user) {
          // Store user data in AuthContext
          await setUser(result.user);

          const roles = result.user.roles || [];
          const isAdminUser =
            roles.includes("ADMIN") || roles.includes("GAEL_HIMSELF");

          // Navigate immediately based on role
          if (isAdminUser) {
            router.replace("/(tabs)/admin");
          } else {
            router.replace("/(tabs)");
          }

          // Show success message after navigation starts
          setTimeout(() => {
            Alert.alert("Success", result.message);
          }, 100);
        } else {
          Alert.alert("Error", result.message);
        }
      }
    } catch (error) {
      console.error("Submit error:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles Google OAuth login
   */
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await loginWithGoogle();
      Alert.alert(result.success ? "Success" : "Info", result.message);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles GitHub OAuth login (web-only)
   */
  const handleGithubLogin = async () => {
    setIsLoading(true);
    try {
      const result = await loginWithGithub();
      Alert.alert(result.success ? "Success" : "Info", result.message);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Resets all form fields and validation state
   */
  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setFirstName("");
    setLastName("");
    setSecurityQuestion("");
    setSecurityAnswer("");
    setErrors({
      email: "",
      password: "",
      confirmPassword: "",
      securityQuestion: "",
      securityAnswer: "",
    });
    setTouched({
      email: false,
      password: false,
      confirmPassword: false,
      securityQuestion: false,
      securityAnswer: false,
    });
  };

  /**
   * Switches between login and signup modes
   */
  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    // Clear validation errors when switching modes
    setErrors({
      email: "",
      password: "",
      confirmPassword: "",
      securityQuestion: "",
      securityAnswer: "",
    });
  };

  // ==========================================
  // RETURN HOOK INTERFACE
  // ==========================================
  return {
    // State
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

    // Setters
    setEmail,
    setPassword,
    setConfirmPassword,
    setFirstName,
    setLastName,
    setSecurityQuestion,
    setSecurityAnswer,
    setIsAdmin,

    // Handlers
    handleBlur,
    handleSubmit,
    handleGoogleLogin,
    handleGithubLogin,
    handleLogout,
    toggleMode,
    resetForm,
  };
}
