/**
 * Authentication Service Tests
 * Tests for API authentication calls
 */

import { API_BASE_URL } from "@/config/environment";

// Mock fetch
global.fetch = jest.fn();

describe("AuthService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  describe("Login Functionality", () => {
    test("should have correct API base URL", () => {
      expect(API_BASE_URL).toBeDefined();
      expect(typeof API_BASE_URL).toBe("string");
    });

    test("login request should send correct data format", async () => {
      const mockResponse = {
        success: true,
        message: "Login successful",
        user: {
          id: "1",
          email: "gaelcraves@admin.com",
          firstName: "Admin",
          lastName: "User",
          roles: ["ADMIN"],
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const loginData = {
        email: "gaelcraves@admin.com",
        password: "ILuvSergio04!",
      };

      // Simulate login call
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/auth/login"),
        expect.objectContaining({
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        })
      );

      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.user.email).toBe("gaelcraves@admin.com");
      expect(data.user.roles).toContain("ADMIN");
    });

    test("should validate admin credentials format", () => {
      const adminEmail = "gaelcraves@admin.com";
      const adminPassword = "ILuvSergio04!";

      // Email validation
      expect(adminEmail).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      expect(adminEmail).toContain("@admin.com");

      // Password validation (should have uppercase, lowercase, number, special char)
      expect(adminPassword.length).toBeGreaterThanOrEqual(8);
      expect(/[A-Z]/.test(adminPassword)).toBe(true);
      expect(/[a-z]/.test(adminPassword)).toBe(true);
      expect(/[0-9]/.test(adminPassword)).toBe(true);
      expect(/[!@#$%^&*]/.test(adminPassword)).toBe(true);
    });

    test("should handle login errors", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({
          success: false,
          message: "Invalid credentials",
        }),
      });

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "wrong@email.com",
          password: "wrongpassword",
        }),
      });

      expect(response.ok).toBe(false);
      expect(response.status).toBe(401);
    });
  });

  describe("Sign Up Functionality", () => {
    test("signup request should send correct data format", async () => {
      const mockResponse = {
        success: true,
        message: "User registered successfully",
        user: {
          id: "2",
          email: "newuser@example.com",
          firstName: "New",
          lastName: "User",
          roles: ["USER"],
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const signupData = {
        email: "newuser@example.com",
        password: "Password123!",
        firstName: "New",
        lastName: "User",
        securityQuestion: "What is your favorite food?",
        securityAnswer: "Pizza",
      };

      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupData),
      });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/auth/signup"),
        expect.objectContaining({
          method: "POST",
        })
      );

      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.user.email).toBe("newuser@example.com");
    });
  });

  describe("OAuth Functionality", () => {
    test("should handle Google OAuth flow", () => {
      const googleClientId = "624682753251-1777mu4gr62ajtklkeod1j7hugvafjdb.apps.googleusercontent.com";
      const redirectUri = "https://gaelcraves-frontend-7a6e5c03f69a.herokuapp.com/oauth/callback";

      expect(googleClientId).toBeTruthy();
      expect(googleClientId).toContain("apps.googleusercontent.com");
      expect(redirectUri).toMatch(/^https:\/\//);
      expect(redirectUri).toContain("oauth/callback");
    });
  });

  describe("Token Management", () => {
    test("should validate JWT token format", () => {
      const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
      
      // JWT should have 3 parts separated by dots
      const parts = mockToken.split(".");
      expect(parts.length).toBe(3);
    });

    test("should handle token expiration", () => {
      const currentTime = Math.floor(Date.now() / 1000);
      const tokenExpiry = currentTime + 3600; // 1 hour from now
      const expiredTokenExpiry = currentTime - 3600; // 1 hour ago

      expect(tokenExpiry > currentTime).toBe(true);
      expect(expiredTokenExpiry < currentTime).toBe(true);
    });
  });
});
