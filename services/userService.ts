import { API_BASE_URL } from "@/config/environment";

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

export interface User {
  userId?: number;
  email: string;
  firstName?: string;
  lastName?: string;
  roles?: string[];
  createdAt?: string;
  lastLogin?: string;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  adminUsers: number;
}

/**
 * Get all users
 */
export async function getAllUsers(): Promise<User[]> {
  const res = await authFetch("/users");
  if (!res.ok) {
    throw new Error(`Failed to fetch users: ${res.status}`);
  }
  return res.json();
}

/**
 * Get user by ID
 */
export async function getUserById(userId: number): Promise<User> {
  const res = await authFetch(`/users/${userId}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch user: ${res.status}`);
  }
  return res.json();
}

/**
 * Update user
 */
export async function updateUser(userId: number, user: Partial<User>): Promise<User> {
  const res = await authFetch(`/users/${userId}`, {
    method: "PUT",
    body: JSON.stringify(user),
  });
  
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Failed to update user: ${res.status}`);
  }
  
  return res.json();
}

/**
 * Delete user
 */
export async function deleteUser(userId: number): Promise<void> {
  const res = await authFetch(`/users/${userId}`, {
    method: "DELETE",
  });
  
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Failed to delete user: ${res.status}`);
  }
}

/**
 * Get user statistics
 */
export async function getUserStats(): Promise<UserStats> {
  const users = await getAllUsers();
  
  const totalUsers = users.length;
  const activeUsers = users.length; // All users are active by default
  
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  
  const newUsersThisMonth = users.filter(u => 
    u.createdAt && new Date(u.createdAt) >= oneMonthAgo
  ).length;
  
  const adminUsers = users.filter(u => 
    u.roles && (u.roles.includes("ADMIN") || u.roles.includes("GAEL_HIMSELF"))
  ).length;

  return {
    totalUsers,
    activeUsers,
    newUsersThisMonth,
    adminUsers,
  };
}
