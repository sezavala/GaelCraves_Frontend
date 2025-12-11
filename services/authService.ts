/**
 * Authentication Service
 * Handles all API calls related to user authentication
 */

import { Platform } from "react-native";
import { API_BASE_URL } from "@/config/environment";
import { loginWithGithubNative } from "@/auth/githubAuth";

// Base backend URL without the /api suffix (for OAuth redirects, etc.)
const BACKEND_BASE_URL = API_BASE_URL.replace(/\/api$/, "");

export interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
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
  firstName: string;
  lastName: string;
  roles: string[];
  token?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
}

/**
 * Create fetch with timeout
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeout = 10000
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

export async function login(data: LoginData): Promise<AuthResponse> {
  console.log("🔐 Attempting login...");
  console.log("📡 API URL:", `${API_BASE_URL}/users/login`);
  console.log("📤 Login data:", { email: data.email, password: "***" });
  console.log("📱 Platform:", Platform.OS);
  console.log("🔒 Password length:", data.password?.length || 0);

  try {
    const requestBody = JSON.stringify(data);
    console.log("📤 Request body (sanitized):", JSON.stringify({ ...data, password: "***" }));

    const response = await fetchWithTimeout(
      `${API_BASE_URL}/users/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: requestBody,
      },
      10000 // 10 second timeout
    );

    console.log("📥 Response status:", response.status);
    console.log("📥 Response ok:", response.ok);

    if (response.ok) {
      const result = await response.json();
      console.log("✅ Login successful - Full response:", JSON.stringify(result, null, 2));

      // Check if token is expired
      if (result.token && isTokenExpired(result.token)) {
        return {
          success: false,
          message: "Token expired. Please login again.",
        };
      }

      // Map backend response to User interface
      const user: User = {
        id: result.userId?.toString() || "",
        email: result.email || "",
        firstName: result.firstName || "",
        lastName: result.lastName || "",
        roles: Array.isArray(result.roles) ? result.roles : [],
        token: result.token || "",
      };

      console.log("✅ User object created:", JSON.stringify(user, null, 2));

      return {
        success: true,
        message: `Welcome back, ${user.firstName || user.email}!`,
        user,
      };
    } else {
      const errorText = await response.text();
      console.error("❌ Login failed - Status:", response.status);
      console.error("❌ Login failed - Error text:", errorText);

      let errorMessage = "Invalid credentials";
      try {
        const error = JSON.parse(errorText);
        errorMessage = error.error || error.message || errorMessage;
      } catch (e) {
        // If not JSON, use the text as error
        errorMessage = errorText || errorMessage;
      }

      console.error("❌ Final error message:", errorMessage);

      return {
        success: false,
        message: errorMessage,
      };
    }
  } catch (error: any) {
    console.error("❌ Network error during login:", error);
    console.error("❌ Error name:", error.name);
    console.error("❌ Error message:", error.message);
    console.error("❌ Error stack:", error.stack);

    if (error.name === "AbortError") {
      return {
        success: false,
        message: "Request timeout. Please check your connection and try again.",
      };
    }

    if (error.message?.includes("Network request failed")) {
      return {
        success: false,
        message:
          "Cannot connect to server. Please check if the backend is running.",
      };
    }

    return {
      success: false,
      message: `Network error: ${
        error.message || "Please check your connection"
      }`,
    };
  }
}

export async function signUp(data: SignUpData): Promise<AuthResponse> {
  console.log("📝 Attempting signup...");
  console.log("📡 API URL:", `${API_BASE_URL}/users`);

  try {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/users`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      },
      10000
    );

    console.log("📥 Signup response status:", response.status);

    if (response.ok) {
      const result = await response.json();
      console.log("✅ Signup successful:", result);

      const user: User = {
        id: result.userId?.toString() || "",
        email: result.email || data.email,
        firstName: result.firstName || data.firstName,
        lastName: result.lastName || data.lastName,
        roles: Array.isArray(result.roles) ? result.roles : ["USER"],
        token: result.token || "",
      };

      return {
        success: true,
        message: "Account created successfully!",
        user,
      };
    } else {
      const errorText = await response.text();
      console.error("❌ Signup failed:", response.status, errorText);

      let errorMessage = "Failed to create account";
      try {
        const error = JSON.parse(errorText);
        errorMessage = error.error || error.message || errorMessage;
      } catch (e) {
        errorMessage = errorText || errorMessage;
      }

      return {
        success: false,
        message: errorMessage,
      };
    }
  } catch (error: any) {
    console.error("❌ Network error during signup:", error);

    if (error.name === "AbortError") {
      return {
        success: false,
        message: "Request timeout. Please try again.",
      };
    }

    return {
      success: false,
      message: `Network error: ${
        error.message || "Please check your connection"
      }`,
    };
  }
}

export async function loginWithGoogle(): Promise<AuthResponse> {
  return {
    success: false,
    message: "Google OAuth integration coming soon!",
  };
}

export async function loginWithGithub(): Promise<AuthResponse> {
  // Web: redirect browser to Spring Boot GitHub OAuth entrypoint
  if (Platform.OS === "web" && typeof window !== "undefined") {
    window.location.href = `${BACKEND_BASE_URL}/oauth2/authorization/github`;
    return {
      success: true,
      message: "Redirecting to GitHub for login...",
    };
  }
  // Native apps: use Expo AuthSession-based flow
  return loginWithGithubNative();
}

export async function logout(): Promise<void> {
  console.log("🚪 User logged out");

  // Clear localStorage on web
  if (typeof window !== "undefined" && window.localStorage) {
    window.localStorage.removeItem("@user");
    window.localStorage.removeItem("@token");
  }
}

function isTokenExpired(token: string): boolean {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    const exp = decoded.exp * 1000; // Convert to milliseconds
    return Date.now() >= exp;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return true;
  }
}
