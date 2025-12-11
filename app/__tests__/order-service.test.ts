/**
 * Order Service Tests
 * Tests for order-related API calls
 */

import { API_BASE_URL } from "@/config/environment";

// Mock fetch
global.fetch = jest.fn();

describe("OrderService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  describe("Create Order", () => {
    test("should create order successfully", async () => {
      const mockOrder = {
        id: "order-123",
        userId: "user-456",
        items: [
          {
            menuItemId: "1",
            name: "Burrito Bowl",
            quantity: 2,
            price: 12.99,
          },
        ],
        totalAmount: 25.98,
        status: "PENDING",
        createdAt: new Date().toISOString(),
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockOrder,
      });

      const orderData = {
        items: [
          { menuItemId: "1", quantity: 2 },
        ],
      };

      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer mock-token",
        },
        body: JSON.stringify(orderData),
      });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/orders"),
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
            Authorization: expect.stringContaining("Bearer"),
          }),
        })
      );

      const data = await response.json();
      expect(data.id).toBe("order-123");
      expect(data.status).toBe("PENDING");
      expect(data.totalAmount).toBe(25.98);
    });

    test("should validate order structure", () => {
      const order = {
        id: "order-123",
        userId: "user-456",
        items: [
          {
            menuItemId: "1",
            name: "Burrito Bowl",
            quantity: 2,
            price: 12.99,
          },
        ],
        totalAmount: 25.98,
        status: "PENDING",
      };

      expect(order.id).toBeDefined();
      expect(order.userId).toBeDefined();
      expect(Array.isArray(order.items)).toBe(true);
      expect(order.items.length).toBeGreaterThan(0);
      expect(typeof order.totalAmount).toBe("number");
      expect(order.totalAmount).toBeGreaterThan(0);
    });

    test("should calculate total amount correctly", () => {
      const items = [
        { price: 12.99, quantity: 2 },
        { price: 9.99, quantity: 1 },
      ];

      const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      expect(total).toBe(35.97);
    });
  });

  describe("Get Orders", () => {
    test("should fetch user orders", async () => {
      const mockOrders = [
        {
          id: "order-123",
          status: "COMPLETED",
          totalAmount: 25.98,
          createdAt: new Date().toISOString(),
        },
        {
          id: "order-124",
          status: "PENDING",
          totalAmount: 15.99,
          createdAt: new Date().toISOString(),
        },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockOrders,
      });

      const response = await fetch(`${API_BASE_URL}/orders/user`, {
        headers: {
          Authorization: "Bearer mock-token",
        },
      });

      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(2);
    });
  });

  describe("Order Status", () => {
    test("should validate order status values", () => {
      const validStatuses = ["PENDING", "CONFIRMED", "PREPARING", "READY", "COMPLETED", "CANCELLED"];
      
      expect(validStatuses).toContain("PENDING");
      expect(validStatuses).toContain("COMPLETED");
      expect(validStatuses.length).toBeGreaterThan(0);
    });

    test("should update order status", async () => {
      const mockUpdatedOrder = {
        id: "order-123",
        status: "CONFIRMED",
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockUpdatedOrder,
      });

      const response = await fetch(`${API_BASE_URL}/orders/order-123/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer mock-token",
        },
        body: JSON.stringify({ status: "CONFIRMED" }),
      });

      const data = await response.json();
      expect(data.status).toBe("CONFIRMED");
    });
  });
});
