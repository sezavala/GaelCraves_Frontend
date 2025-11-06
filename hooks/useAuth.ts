/**
 * Custom hook for authentication logic
 * Manages form state, validation, and API calls for login/signup
 */

import { useState, useEffect } from "react";
import { Alert } from "react-native";
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateSecurityQuestion,
  validateSecurityAnswer,
} from "@/utils/validation";
import { signUp, login, loginWithGoogle, loginWithInstagram } from "@/services/authService";

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
  // REAL-TIME VALIDATION EFFECTS
  // ==========================================

  // Validate email when it changes (only if touched)
  useEffect(() => {
    if (touched.email) {
      const result = validateEmail(email);
      setErrors((prev) => ({ ...prev, email: result.error }));
    }
  }, [email, touched.email]);

  // Validate password when it changes (only if touched)
  useEffect(() => {
    if (touched.password) {
      const result = validatePassword(password);
      setErrors((prev) => ({ ...prev, password: result.error }));
    }
  }, [password, touched.password]);

  // Validate confirm password (only if touched)
  useEffect(() => {
    if (touched.confirmPassword && isSignUp) {
      const result = validateConfirmPassword(password, confirmPassword);
      setErrors((prev) => ({ ...prev, confirmPassword: result.error }));
    }
  }, [confirmPassword, password, touched.confirmPassword, isSignUp]);

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

  /**
   * Validates all fields before form submission
   * @returns true if form is valid, false otherwise
   */
  const validateForm = (): boolean => {
    const emailResult = validateEmail(email);
    const passwordResult = validatePassword(password);

    const newErrors: FormErrors = {
      email: emailResult.error,
      password: passwordResult.error,
      confirmPassword: "",
      securityQuestion: "",
      securityAnswer: "",
    };

    // Additional validation for sign up
    if (isSignUp) {
      const confirmResult = validateConfirmPassword(password, confirmPassword);
      const questionResult = validateSecurityQuestion(securityQuestion);
      const answerResult = validateSecurityAnswer(securityAnswer);

      newErrors.confirmPassword = confirmResult.error;
      newErrors.securityQuestion = questionResult.error;
      newErrors.securityAnswer = answerResult.error;
    }

    setErrors(newErrors);

    // Mark all relevant fields as touched
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
          securityQuestion,
          securityAnswer,
        });

        if (result.success) {
          Alert.alert("Success", result.message);
          // Reset form after successful signup
          resetForm();
        } else {
          Alert.alert("Error", result.message);
        }
      } else {
        // Login flow
        const result = await login({ email, password });

        if (result.success) {
          Alert.alert("Success", result.message);
          // TODO: Navigate to home screen or dashboard
        } else {
          Alert.alert("Error", result.message);
        }
      }
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
      Alert.alert(
        result.success ? "Success" : "Info",
        result.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles Instagram OAuth login
   */
  const handleInstagramLogin = async () => {
    setIsLoading(true);
    try {
      const result = await loginWithInstagram();
      Alert.alert(
        result.success ? "Success" : "Info",
        result.message
      );
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
    securityQuestion,
    securityAnswer,
    errors,
    touched,

    // Setters
    setEmail,
    setPassword,
    setConfirmPassword,
    setSecurityQuestion,
    setSecurityAnswer,
    setIsAdmin,

    // Handlers
    handleBlur,
    handleSubmit,
    handleGoogleLogin,
    handleInstagramLogin,
    toggleMode,
    resetForm,
  };
}
