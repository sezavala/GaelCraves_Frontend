import { API_BASE_URL } from "@/config/environment";

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

async function authFetch(path: string, options: RequestInit = {}): Promise<Response> {
  let token: string | null = null;
  
  // Try to get token from SecureStore (React Native) or localStorage (web)
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      token = window.localStorage.getItem("@token");
    }
  } catch (e) {
    console.warn("Could not access token from storage:", e);
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    (headers as any).Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

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

// ADMIN: fetch all orders (for full admin view)
export async function getAllOrders(status?: string): Promise<Order[]> {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  const res = await authFetch(`/orders/admin/all${query}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Failed to fetch orders (${res.status})`);
  }
  return res.json();
}

// ADMIN: fetch dashboard stats from backend
export async function getAdminStats(): Promise<AdminStats> {
  const res = await authFetch(`/orders/admin/stats`);
  if (!res.ok) {
    const text = await res.text();
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
}
