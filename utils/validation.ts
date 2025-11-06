/**
 * Validation utilities for form inputs
 * Provides reusable validation functions across the application
 */

export interface ValidationResult {
  isValid: boolean;
  error: string;
}

// ==========================================
// VALIDATION RULES CONSTANTS
// ==========================================

export const VALIDATION_RULES = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Please enter a valid email address",
  },
  password: {
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    messages: {
      minLength: "Password must be at least 8 characters",
      pattern: "Password must contain uppercase, lowercase, and a number",
      required: "Password is required",
    },
  },
  securityQuestion: {
    minLength: 10,
    maxLength: 200,
    message: "Security question must be between 10-200 characters",
  },
  securityAnswer: {
    minLength: 3,
    maxLength: 100,
    message: "Security answer must be between 3-100 characters",
  },
} as const;

// ==========================================
// VALIDATION FUNCTIONS
// ==========================================

export function validateEmail(email: string): ValidationResult {
  if (!email || email.trim() === "") {
    return { isValid: false, error: "Email is required" };
  }

  if (!VALIDATION_RULES.email.pattern.test(email.trim())) {
    return { isValid: false, error: VALIDATION_RULES.email.message };
  }

  return { isValid: true, error: "" };
}

export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return {
      isValid: false,
      error: VALIDATION_RULES.password.messages.required,
    };
  }

  if (password.length < VALIDATION_RULES.password.minLength) {
    return {
      isValid: false,
      error: VALIDATION_RULES.password.messages.minLength,
    };
  }

  if (!VALIDATION_RULES.password.pattern.test(password)) {
    return {
      isValid: false,
      error: VALIDATION_RULES.password.messages.pattern,
    };
  }

  return { isValid: true, error: "" };
}

export function validateConfirmPassword(
  password: string,
  confirmPassword: string
): ValidationResult {
  if (!confirmPassword) {
    return { isValid: false, error: "Please confirm your password" };
  }

  if (password !== confirmPassword) {
    return { isValid: false, error: "Passwords do not match" };
  }

  return { isValid: true, error: "" };
}

export function validateSecurityQuestion(question: string): ValidationResult {
  if (!question || question.trim() === "") {
    return { isValid: false, error: "Security question is required" };
  }

  const length = question.trim().length;

  if (
    length < VALIDATION_RULES.securityQuestion.minLength ||
    length > VALIDATION_RULES.securityQuestion.maxLength
  ) {
    return {
      isValid: false,
      error: VALIDATION_RULES.securityQuestion.message,
    };
  }

  return { isValid: true, error: "" };
}

export function validateSecurityAnswer(answer: string): ValidationResult {
  if (!answer || answer.trim() === "") {
    return { isValid: false, error: "Security answer is required" };
  }

  const length = answer.trim().length;

  if (
    length < VALIDATION_RULES.securityAnswer.minLength ||
    length > VALIDATION_RULES.securityAnswer.maxLength
  ) {
    return { isValid: false, error: VALIDATION_RULES.securityAnswer.message };
  }

  return { isValid: true, error: "" };
}

export function getPasswordStrength(password: string): {
  strength: "weak" | "medium" | "strong";
  label: string;
} {
  if (password.length < 8) {
    return { strength: "weak", label: "Weak" };
  }

  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const criteriaCount = [hasLower, hasUpper, hasNumber, hasSpecial].filter(
    Boolean
  ).length;

  if (criteriaCount >= 4 && password.length >= 12) {
    return { strength: "strong", label: "Strong" };
  }

  if (criteriaCount >= 3 && password.length >= 10) {
    return { strength: "medium", label: "Medium" };
  }

  return { strength: "weak", label: "Weak" };
}
