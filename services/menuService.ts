/**
 * Menu Service
 * Handles all API calls related to menu and food items
 */

import { API_BASE_URL } from "@/config/environment";
import { getAuthToken } from "./authToken";

export interface FoodItem {
  foodItemId: number;
  name: string;
  description?: string;
  price: number;
  calories?: number;
  protein?: number;
  carbohydrates?: number;
  fat?: number;
  imageUrl?: string;
  category?: string;
  isAvailable: boolean;
}

export interface Menu {
  menuId: number;
  menuName: string;
  description?: string;
  foodItems?: FoodItem[];
}

/**
 * Get all menus
 */
export async function getMenus(): Promise<Menu[]> {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/menus`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("❌ Failed to fetch menus:", response.status, text);
      return [];
    }

    try {
      return await response.json();
    } catch (parseError) {
      console.error("❌ Failed to parse menus JSON:", parseError);
      return [];
    }
  } catch (error) {
    console.error("Error fetching menus:", error);
    return [];
  }
}

/**
 * Get all food items
 */
export async function getFoodItems(): Promise<FoodItem[]> {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/food-items`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("❌ Failed to fetch food items:", response.status, text);
      // Degrade gracefully: return empty list so UI can show an error without crashing
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching food items:", error);
    // Also degrade gracefully here
    return [];
  }
}

/**
 * Get food item by ID
 */
export async function getFoodItemById(id: number): Promise<FoodItem> {
  try {
    const response = await fetch(`${API_BASE_URL}/food-items/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
  const text = await response.text();
  throw new Error(text || `Failed to fetch food item: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching food item:", error);
    throw error;
  }
}
