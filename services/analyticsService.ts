import { API_BASE_URL } from "@/config/environment";
import { Order, OrderStatus } from "./adminService";

async function authFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const token =
    typeof window !== "undefined" ? window.localStorage.getItem("@token") : null;

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

export interface SalesData {
  date: string;
  revenue: number;
  orderCount: number;
}

export interface TopItem {
  name: string;
  quantity: number;
  revenue: number;
}

export interface AnalyticsSummary {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  growthRate: number;
  topSellingItems: TopItem[];
  revenueByDay: SalesData[];
  ordersByStatus: { status: string; count: number }[];
}

/**
 * Get analytics summary
 */
export async function getAnalyticsSummary(
  days: number = 30
): Promise<AnalyticsSummary> {
  // Fetch all orders
  const res = await authFetch(`/orders`);
  
  if (!res.ok) {
    throw new Error(`Failed to fetch analytics data: ${res.status}`);
  }
  
  const allOrders: Order[] = await res.json();
  
  // Filter orders for the specified period
  const now = new Date();
  const periodStart = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  
  const orders = allOrders.filter(o => new Date(o.orderDate) >= periodStart);
  
  // Calculate total revenue
  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);
  const totalOrders = orders.length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  
  // Calculate growth rate (compare to previous period)
  const previousPeriodStart = new Date(periodStart.getTime() - days * 24 * 60 * 60 * 1000);
  const previousOrders = allOrders.filter(o => {
    const orderDate = new Date(o.orderDate);
    return orderDate >= previousPeriodStart && orderDate < periodStart;
  });
  
  const previousRevenue = previousOrders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);
  const growthRate = previousRevenue > 0 
    ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 
    : 0;
  
  // Calculate top selling items
  const itemSales = new Map<string, { quantity: number; revenue: number }>();
  
  orders.forEach(order => {
    order.orderItems?.forEach(item => {
      const name = item.name || `Item #${item.foodItemId}`;
      const existing = itemSales.get(name) || { quantity: 0, revenue: 0 };
      itemSales.set(name, {
        quantity: existing.quantity + item.quantity,
        revenue: existing.revenue + (item.price ? item.price * item.quantity : 0),
      });
    });
  });
  
  const topSellingItems: TopItem[] = Array.from(itemSales.entries())
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);
  
  // Calculate revenue by day
  const revenueByDayMap = new Map<string, { revenue: number; count: number }>();
  
  orders.forEach(order => {
    const date = new Date(order.orderDate).toISOString().split('T')[0];
    const existing = revenueByDayMap.get(date) || { revenue: 0, count: 0 };
    revenueByDayMap.set(date, {
      revenue: existing.revenue + Number(order.totalAmount || 0),
      count: existing.count + 1,
    });
  });
  
  const revenueByDay: SalesData[] = Array.from(revenueByDayMap.entries())
    .map(([date, data]) => ({
      date,
      revenue: data.revenue,
      orderCount: data.count,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
  
  // Calculate orders by status
  const statusMap = new Map<string, number>();
  orders.forEach(order => {
    const count = statusMap.get(order.status) || 0;
    statusMap.set(order.status, count + 1);
  });
  
  const ordersByStatus = Array.from(statusMap.entries())
    .map(([status, count]) => ({ status, count }));

  return {
    totalRevenue,
    totalOrders,
    averageOrderValue,
    growthRate,
    topSellingItems,
    revenueByDay,
    ordersByStatus,
  };
}

/**
 * Get revenue trends for chart
 */
export async function getRevenueTrends(days: number = 30): Promise<SalesData[]> {
  const summary = await getAnalyticsSummary(days);
  return summary.revenueByDay;
}
