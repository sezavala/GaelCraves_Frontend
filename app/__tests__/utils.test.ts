/**
 * Utility Functions Tests
 * Tests for validation and helper functions
 */

describe("Validation Utils", () => {
  describe("Email Validation", () => {
    const validateEmail = (email: string): boolean => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    test("should validate correct email formats", () => {
      expect(validateEmail("user@example.com")).toBe(true);
      expect(validateEmail("gaelcraves@admin.com")).toBe(true);
      expect(validateEmail("test.user@domain.co.uk")).toBe(true);
    });

    test("should reject invalid email formats", () => {
      expect(validateEmail("invalid")).toBe(false);
      expect(validateEmail("@example.com")).toBe(false);
      expect(validateEmail("user@")).toBe(false);
      expect(validateEmail("user @example.com")).toBe(false);
    });

    test("should validate admin email", () => {
      const adminEmail = "gaelcraves@admin.com";
      expect(validateEmail(adminEmail)).toBe(true);
      expect(adminEmail).toContain("@admin.com");
    });
  });

  describe("Password Validation", () => {
    const validatePassword = (password: string): {
      valid: boolean;
      errors: string[];
    } => {
      const errors: string[] = [];

      if (password.length < 8) {
        errors.push("Password must be at least 8 characters");
      }
      if (!/[A-Z]/.test(password)) {
        errors.push("Password must contain uppercase letter");
      }
      if (!/[a-z]/.test(password)) {
        errors.push("Password must contain lowercase letter");
      }
      if (!/[0-9]/.test(password)) {
        errors.push("Password must contain number");
      }
      if (!/[!@#$%^&*]/.test(password)) {
        errors.push("Password must contain special character");
      }

      return {
        valid: errors.length === 0,
        errors,
      };
    };

    test("should validate strong passwords", () => {
      const result = validatePassword("ILuvSergio04!");
      expect(result.valid).toBe(true);
      expect(result.errors.length).toBe(0);
    });

    test("should reject weak passwords", () => {
      const result = validatePassword("weak");
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    test("should require minimum length", () => {
      const result = validatePassword("Short1!");
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Password must be at least 8 characters");
    });

    test("should require uppercase letter", () => {
      const result = validatePassword("lowercase123!");
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Password must contain uppercase letter");
    });

    test("should require lowercase letter", () => {
      const result = validatePassword("UPPERCASE123!");
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Password must contain lowercase letter");
    });

    test("should require number", () => {
      const result = validatePassword("NoNumbers!");
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Password must contain number");
    });

    test("should require special character", () => {
      const result = validatePassword("NoSpecial123");
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Password must contain special character");
    });
  });

  describe("Price Formatting", () => {
    const formatPrice = (price: number): string => {
      return `$${price.toFixed(2)}`;
    };

    test("should format prices correctly", () => {
      expect(formatPrice(12.99)).toBe("$12.99");
      expect(formatPrice(9.5)).toBe("$9.50");
      expect(formatPrice(100)).toBe("$100.00");
    });

    test("should handle decimal places", () => {
      expect(formatPrice(12.999)).toBe("$13.00");
      expect(formatPrice(12.994)).toBe("$12.99");
    });
  });

  describe("Order Calculations", () => {
    test("should calculate subtotal correctly", () => {
      const items = [
        { price: 12.99, quantity: 2 },
        { price: 9.99, quantity: 1 },
      ];

      const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      expect(subtotal).toBe(35.97);
    });

    test("should calculate tax", () => {
      const subtotal = 100;
      const taxRate = 0.08; // 8%
      const tax = subtotal * taxRate;

      expect(tax).toBe(8);
    });

    test("should calculate total with tax", () => {
      const subtotal = 100;
      const taxRate = 0.08;
      const tax = subtotal * taxRate;
      const total = subtotal + tax;

      expect(total).toBe(108);
    });
  });

  describe("Date Formatting", () => {
    test("should format date correctly", () => {
      const date = new Date("2025-12-11T10:30:00");
      const formatted = date.toLocaleDateString("en-US");

      expect(formatted).toBeTruthy();
      expect(typeof formatted).toBe("string");
    });

    test("should handle ISO date strings", () => {
      const isoString = new Date().toISOString();

      expect(isoString).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });
  });

  describe("String Utils", () => {
    test("should capitalize first letter", () => {
      const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

      expect(capitalize("hello")).toBe("Hello");
      expect(capitalize("world")).toBe("World");
    });

    test("should truncate long strings", () => {
      const truncate = (str: string, maxLength: number) =>
        str.length > maxLength ? str.slice(0, maxLength) + "..." : str;

      expect(truncate("Short", 10)).toBe("Short");
      expect(truncate("This is a very long string", 10)).toBe("This is a ...");
    });
  });
});
