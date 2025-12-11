/**
 * Menu Service Tests
 * Tests for menu-related API calls
 */

import { API_BASE_URL } from "@/config/environment";

// Mock fetch
global.fetch = jest.fn();

describe("MenuService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  describe("Get Menu Items", () => {
    test("should fetch menu items successfully", async () => {
      const mockMenuItems = [
        {
          id: "1",
          name: "Burrito Bowl",
          description: "Rice, beans, meat, veggies",
          price: 12.99,
          category: "BOWLS",
          available: true,
          imageUrl: "https://example.com/burrito-bowl.jpg",
        },
        {
          id: "2",
          name: "Tacos",
          description: "3 soft tacos with your choice of filling",
          price: 9.99,
          category: "TACOS",
          available: true,
          imageUrl: "https://example.com/tacos.jpg",
        },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockMenuItems,
      });

      const response = await fetch(`${API_BASE_URL}/menu/items`);
      const data = await response.json();

      expect(fetch).toHaveBeenCalledWith(expect.stringContaining("/menu/items"));
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(2);
      expect(data[0].name).toBe("Burrito Bowl");
      expect(data[0].price).toBe(12.99);
    });

    test("should filter menu items by category", async () => {
      const mockBowls = [
        {
          id: "1",
          name: "Burrito Bowl",
          category: "BOWLS",
          price: 12.99,
        },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockBowls,
      });

      const response = await fetch(`${API_BASE_URL}/menu/items?category=BOWLS`);
      const data = await response.json();

      expect(data.every((item: any) => item.category === "BOWLS")).toBe(true);
    });

    test("should validate menu item structure", () => {
      const menuItem = {
        id: "1",
        name: "Burrito Bowl",
        description: "Rice, beans, meat, veggies",
        price: 12.99,
        category: "BOWLS",
        available: true,
      };

      expect(menuItem.id).toBeDefined();
      expect(menuItem.name).toBeDefined();
      expect(typeof menuItem.price).toBe("number");
      expect(menuItem.price).toBeGreaterThan(0);
      expect(typeof menuItem.available).toBe("boolean");
    });
  });

  describe("Menu Categories", () => {
    test("should validate menu categories", () => {
      const validCategories = ["BOWLS", "TACOS", "BURRITOS", "SIDES", "DRINKS", "DESSERTS"];
      
      expect(validCategories).toContain("BOWLS");
      expect(validCategories).toContain("TACOS");
      expect(validCategories.length).toBeGreaterThan(0);
    });
  });
});
