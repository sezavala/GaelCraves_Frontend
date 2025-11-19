/**
 * Authentication Service
 * Handles all API calls related to user authentication
 */

// TODO: Move this to environment config
const API_BASE_URL = "http://localhost:8080/api";

export interface SignUpData {
  email: string;
  password: string;
  securityQuestion: string;
  securityAnswer: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  // Add other user properties as needed
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
}

/**
 * Creates a new user account
 * @param data - User registration data
 * @returns AuthResponse with success status and message
 */
export async function signUp(data: SignUpData): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: "Account created successfully!",
        user: result,
      };
    } else {
      return {
        success: false,
        message: result.message || "Failed to create account",
      };
    }
  } catch (error) {
    console.error("Sign up error:", error);
    return {
      success: false,
      message: "Network error. Please check your connection and try again.",
    };
  }
}

/**
 * Logs in an existing user
 * @param data - User login credentials
 * @returns AuthResponse with success status and user data
 */
export async function login(data: LoginData): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const user = await response.json();
      return {
        success: true,
        message: `Welcome back, ${user.email}!`,
        user,
      };
    } else {
      const error = await response.json();
      return {
        success: false,
        message: error.message || "Invalid credentials",
      };
    }
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message: "Network error. Please check your connection and try again.",
    };
  }
}

/**
 * Handles Google OAuth login
 * @returns AuthResponse with success status
 * TODO: Implement actual Google OAuth flow
 */
export async function loginWithGoogle(): Promise<AuthResponse> {
  // TODO: Implement Google OAuth
  return {
    success: false,
    message: "Google OAuth integration coming soon!",
  };
}

/**
 * Handles Instagram OAuth login
 * @returns AuthResponse with success status
 * TODO: Implement actual Instagram OAuth flow
 */
export async function loginWithInstagram(): Promise<AuthResponse> {
  // TODO: Implement Instagram OAuth
  return {
    success: false,
    message: "Instagram OAuth integration coming soon!",
  };
}

/**
 * Logs out the current user
 * @returns Promise that resolves when logout is complete
 * TODO: Implement actual logout logic (clear tokens, etc.)
 */
export async function logout(): Promise<void> {
  // TODO: Clear authentication tokens
  // TODO: Clear user session
  console.log("User logged out");
}
