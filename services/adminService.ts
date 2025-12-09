import { API_BASE_URL } from "@/config/environment";
import { getAuthToken } from "./authToken";

export type OrderStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "DELIVERED" | string;

export interface OrderItem {
  foodItemId: number;
  name?: string;
  quantity: number;
  price?: number;
  specialInstructions?: string;
}

export interface Order {
  orderId: number;
  userId?: number;
  orderDate: string;
  status: OrderStatus;
  totalAmount: number;
  orderItems: OrderItem[];
}

export interface AdminStats {
  pendingOrders: number;
  todayRevenue: number;
  totalUsers: number;
  totalAdmins: number;
  menuItems: number;
}

/**
 * Authenticated fetch helper
 */
async function authFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const token = await getAuthToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    (headers as any).Authorization = `Bearer ${token}`;
    console.log("🔐 Admin request WITH token to:", path);
  } else {
    console.error("❌ Admin request WITHOUT token to:", path);
  }

  const url = `${API_BASE_URL}${path}`;
  console.log("📡 Fetching:", url);

  const res = await fetch(url, {
    ...options,
    headers,
  });

  console.log(`📥 Response: ${res.status} ${res.statusText}`);
  return res;
}

// NOTE: Backend currently exposes /api/orders/user/{userId} not admin-wide listing,
// so for now this helper expects you to pass a userId (e.g. owner account) and
// treats that user's orders as the "admin" view. Can be expanded when a
// dedicated admin endpoint exists.
export async function getOrdersForUser(userId: number): Promise<Order[]> {
  const res = await authFetch(`/orders/user/${userId}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Failed to fetch orders (${res.status})`);
  }
  return res.json();
}

export async function updateOrderStatus(
  orderId: number,
  action: "CONFIRMED" | "CANCELLED"
): Promise<Order> {
  const res = await authFetch(`/orders/${orderId}/status`, {
    method: "PUT",
    body: JSON.stringify({ action }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Failed to update order status (${res.status})`);
  }
  return res.json();
}

// Simple derived stats on the client side from a list of orders.
export function computeAdminStats(orders: Order[]): AdminStats {
  const pendingOrders = orders.filter((o) => o.status === "PENDING").length;

  const today = new Date();
  const isToday = (d: Date) =>
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate();

  const todayRevenue = orders
    .filter((o) => o.status === "CONFIRMED" && isToday(new Date(o.orderDate)))
    .reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);

  // These two require dedicated backend endpoints to be accurate; for now keep
  // them as 0 and let the UI still render without breaking.
  return {
    pendingOrders,
    todayRevenue,
    totalUsers: 0,
    menuItems: 0,
  };
}

/**
 * ADMIN: Get all orders
 */
export async function getAllOrders(status?: string): Promise<Order[]> {
  try {
    const query = status ? `?status=${encodeURIComponent(status)}` : "";
    const res = await authFetch(`/orders/admin/all${query}`);
    
    if (!res.ok) {
      const text = await res.text();
      console.error("❌ Failed to fetch orders:", text);
      throw new Error(text || `Failed to fetch orders (${res.status})`);
    }
    
    return await res.json();
  } catch (error) {
    console.error("❌ Error in getAllOrders:", error);
    throw error;
  }
}

/**
 * ADMIN: Get dashboard statistics
 */
export async function getAdminStats(): Promise<AdminStats> {
  try {
    const res = await authFetch(`/orders/admin/stats`);
    
    if (!res.ok) {
      const text = await res.text();
      console.error("❌ Failed to fetch admin stats:", text);
      throw new Error(text || `Failed to fetch admin stats (${res.status})`);
    }
    
    const data = await res.json();
    return {
      pendingOrders: data.pendingOrders ?? 0,
      todayRevenue: Number(data.todayRevenue ?? 0),
      totalUsers: data.totalUsers ?? 0,
      totalAdmins: data.totalAdmins ?? 0,
      menuItems: data.menuItems ?? 0,
    };
  } catch (error) {
    console.error("❌ Error in getAdminStats:", error);
    throw error;
  }
}
