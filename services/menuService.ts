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

export interface FoodItem {
  foodItemId?: number;
  name: string;
  price: number;
  calories: number;
  description?: string;
  category?: string;
  available?: boolean;
}

export interface Menu {
  menuId?: number;
  name: string;
  foodItems?: FoodItem[];
}

/**
 * Get all food items
 */
export async function getAllFoodItems(): Promise<FoodItem[]> {
  const res = await authFetch("/food-items");
  if (!res.ok) {
    throw new Error(`Failed to fetch food items: ${res.status}`);
  }
  return res.json();
}

/**
 * Get all menus
 */
export async function getAllMenus(): Promise<Menu[]> {
  const res = await authFetch("/menus");
  if (!res.ok) {
    throw new Error(`Failed to fetch menus: ${res.status}`);
  }
  return res.json();
}

/**
 * Create new food item
 */
export async function createFoodItem(item: FoodItem): Promise<FoodItem> {
  const res = await authFetch("/food-items", {
    method: "POST",
    body: JSON.stringify(item),
  });
  
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Failed to create food item: ${res.status}`);
  }
  
  return res.json();
}

/**
 * Update existing food item
 */
export async function updateFoodItem(itemId: number, item: Partial<FoodItem>): Promise<FoodItem> {
  const res = await authFetch(`/food-items/${itemId}`, {
    method: "PUT",
    body: JSON.stringify(item),
  });
  
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Failed to update food item: ${res.status}`);
  }
  
  return res.json();
}

/**
 * Delete food item
 */
export async function deleteFoodItem(itemId: number): Promise<void> {
  const res = await authFetch(`/food-items/${itemId}`, {
    method: "DELETE",
  });
  
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Failed to delete food item: ${res.status}`);
  }
}
