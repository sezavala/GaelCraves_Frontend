/**
 * Order Service
 * Handles all API calls related to orders
 */

import { API_BASE_URL } from "@/config/environment";
import * as SecureStore from "expo-secure-store";

export interface OrderItem {
  foodItemId: number;
  quantity: number;
  specialInstructions?: string;
}

export interface Order {
  orderId: number;
  userId: number;
  status: string;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export interface CreateOrderRequest {
  userId: number;
  items: OrderItem[];
}

/**
 * Get auth token
 */
async function getAuthToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync("userToken");
  } catch (error) {
    console.error("Error getting auth token:", error);
    return null;
  }
}

/**
 * Create headers with auth token
 */
async function createHeaders(): Promise<HeadersInit> {
  const token = await getAuthToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

/**
 * Create a new order
 */
export async function createOrder(orderData: CreateOrderRequest): Promise<Order> {
  try {
    const headers = await createHeaders();
    
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: "POST",
      headers,
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `Failed to create order: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
}

/**
 * Get user orders
 */
export async function getUserOrders(userId: number): Promise<Order[]> {
  try {
    const headers = await createHeaders();
    
    const response = await fetch(`${API_BASE_URL}/orders/user/${userId}`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch orders: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching user orders:", error);
    throw error;
  }
}

/**
 * Get order by ID
 */
export async function getOrderById(orderId: number): Promise<Order> {
  try {
    const headers = await createHeaders();
    
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch order: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
}

/**
 * Cancel an order
 */
export async function cancelOrder(orderId: number): Promise<Order> {
  try {
    const headers = await createHeaders();
    
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
      method: "PUT",
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `Failed to cancel order: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error canceling order:", error);
    throw error;
  }
}

/**
 * Update order status (Admin only)
 */
export async function updateOrderStatus(
  orderId: number,
  action: string
): Promise<Order> {
  try {
    const headers = await createHeaders();
    
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ action }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `Failed to update order status: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
}

/**
 * Get all orders (Admin only)
 */
export async function getAllOrders(status?: string): Promise<Order[]> {
  try {
    const headers = await createHeaders();
    const url = status 
      ? `${API_BASE_URL}/orders?status=${status}` 
      : `${API_BASE_URL}/orders`;
    
    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch all orders: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching all orders:", error);
    throw error;
  }
}
