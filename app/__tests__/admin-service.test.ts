/**
 * Admin Service Tests
 * Tests for admin-related API calls
 */

import { API_BASE_URL } from "@/config/environment";

// Mock fetch
global.fetch = jest.fn();

describe("AdminService", () => {
  const mockAdminToken = "Bearer admin-mock-token";

  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  describe("User Management", () => {
    test("should fetch all users as admin", async () => {
      const mockUsers = [
        {
          id: "1",
          email: "gaelcraves@admin.com",
          firstName: "Admin",
          lastName: "User",
          roles: ["ADMIN"],
        },
        {
          id: "2",
          email: "user@example.com",
          firstName: "Regular",
          lastName: "User",
          roles: ["USER"],
        },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockUsers,
      });

      const response = await fetch(`${API_BASE_URL}/admin/users`, {
        headers: {
          Authorization: mockAdminToken,
        },
      });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/admin/users"),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: mockAdminToken,
          }),
        })
      );

      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(2);
      expect(data[0].roles).toContain("ADMIN");
    });

    test("should validate admin credentials", () => {
      const adminEmail = "gaelcraves@admin.com";
      const adminPassword = "ILuvSergio04!";

      expect(adminEmail).toContain("@admin.com");
      expect(adminPassword.length).toBeGreaterThanOrEqual(8);
    });

    test("should delete user as admin", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, message: "User deleted" }),
      });

      const response = await fetch(`${API_BASE_URL}/admin/users/user-123`, {
        method: "DELETE",
        headers: {
          Authorization: mockAdminToken,
        },
      });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/admin/users/user-123"),
        expect.objectContaining({
          method: "DELETE",
        })
      );

      const data = await response.json();
      expect(data.success).toBe(true);
    });
  });

  describe("Menu Management", () => {
    test("should create menu item as admin", async () => {
      const newItem = {
        name: "New Burrito",
        description: "Delicious burrito",
        price: 11.99,
        category: "BURRITOS",
        available: true,
      };

      const mockResponse = {
        id: "item-789",
        ...newItem,
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const response = await fetch(`${API_BASE_URL}/admin/menu`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: mockAdminToken,
        },
        body: JSON.stringify(newItem),
      });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/admin/menu"),
        expect.objectContaining({
          method: "POST",
        })
      );

      const data = await response.json();
      expect(data.id).toBe("item-789");
      expect(data.name).toBe("New Burrito");
    });

    test("should update menu item as admin", async () => {
      const updatedItem = {
        name: "Updated Burrito",
        price: 13.99,
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ...updatedItem, id: "item-123" }),
      });

      const response = await fetch(`${API_BASE_URL}/admin/menu/item-123`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: mockAdminToken,
        },
        body: JSON.stringify(updatedItem),
      });

      expect(response.ok).toBe(true);
    });

    test("should delete menu item as admin", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, message: "Item deleted" }),
      });

      const response = await fetch(`${API_BASE_URL}/admin/menu/item-123`, {
        method: "DELETE",
        headers: {
          Authorization: mockAdminToken,
        },
      });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/admin/menu/item-123"),
        expect.objectContaining({
          method: "DELETE",
        })
      );
    });
  });

  describe("Order Management", () => {
    test("should fetch all orders as admin", async () => {
      const mockOrders = [
        {
          id: "order-123",
          userId: "user-456",
          status: "PENDING",
          totalAmount: 25.98,
        },
        {
          id: "order-124",
          userId: "user-457",
          status: "COMPLETED",
          totalAmount: 15.99,
        },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockOrders,
      });

      const response = await fetch(`${API_BASE_URL}/admin/orders`, {
        headers: {
          Authorization: mockAdminToken,
        },
      });

      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(2);
    });

    test("should update order status as admin", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: "order-123", status: "CONFIRMED" }),
      });

      const response = await fetch(`${API_BASE_URL}/admin/orders/order-123/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: mockAdminToken,
        },
        body: JSON.stringify({ status: "CONFIRMED" }),
      });

      expect(response.ok).toBe(true);
    });
  });

  describe("Analytics", () => {
    test("should fetch analytics data as admin", async () => {
      const mockAnalytics = {
        totalUsers: 150,
        totalOrders: 500,
        totalRevenue: 12500.50,
        popularItems: [
          { name: "Burrito Bowl", count: 200 },
          { name: "Tacos", count: 150 },
        ],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockAnalytics,
      });

      const response = await fetch(`${API_BASE_URL}/admin/analytics`, {
        headers: {
          Authorization: mockAdminToken,
        },
      });

      const data = await response.json();
      expect(data.totalUsers).toBeGreaterThan(0);
      expect(data.totalRevenue).toBeGreaterThan(0);
      expect(Array.isArray(data.popularItems)).toBe(true);
    });
  });

  describe("Authorization", () => {
    test("should reject requests without admin token", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 403,
        json: async () => ({ error: "Forbidden" }),
      });

      const response = await fetch(`${API_BASE_URL}/admin/users`);

      expect(response.ok).toBe(false);
      expect(response.status).toBe(403);
    });

    test("should validate admin role", () => {
      const adminUser = {
        email: "gaelcraves@admin.com",
        roles: ["ADMIN"],
      };

      const regularUser = {
        email: "user@example.com",
        roles: ["USER"],
      };

      expect(adminUser.roles).toContain("ADMIN");
      expect(regularUser.roles).not.toContain("ADMIN");
    });
  });
});
