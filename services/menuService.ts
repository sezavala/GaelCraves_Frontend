/**
 * Menu Service
 * Handles all API calls related to menu and food items
 */

import { API_BASE_URL } from "@/config/environment";
import { getAuthToken } from "./authToken";

// Backend response interface
interface FoodItemBackend {
  foodItemId: number;
  name: string;
  description: string | null;
  price: number;
  imageUrl?: string | null;
  category?: string | null;
  isAvailable?: boolean | null;
  calories?: number | null;
  protein?: number | null;
  carbohydrates?: number | null;
  fat?: number | null;
}

// Frontend interface (what we use in the app)
export interface FoodItem {
  foodItemId: number;
  itemName: string;
  description: string;
  price: number;
  imageUrl?: string;
  category?: string;
  available: boolean;
  calories?: number;
  protein?: number;
  carbohydrates?: number;
  fat?: number;
}

/**
 * Map backend food item to frontend format
 */
function mapFoodItem(item: FoodItemBackend): FoodItem {
  return {
    foodItemId: item.foodItemId,
    itemName: item.name, // Backend uses 'name', we use 'itemName'
    description: item.description || "Delicious meal",
    price: item.price,
    imageUrl: item.imageUrl || undefined,
    category: item.category || "Specialty",
    available: item.isAvailable ?? true, // Backend uses 'isAvailable', we use 'available'
    calories: item.calories || undefined,
    protein: item.protein || undefined,
    carbohydrates: item.carbohydrates || undefined,
    fat: item.fat || undefined,
  };
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
    console.log("🍽️ Fetching food items from:", `${API_BASE_URL}/food-items`);
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

    const backendItems: FoodItemBackend[] = await response.json();
    console.log("✅ Fetched", backendItems.length, "food items from backend");
    
    // Map backend format to frontend format
    const mappedItems = backendItems.map(mapFoodItem);
    console.log("✅ Mapped food items:", mappedItems);
    
    return mappedItems;
  } catch (error) {
    console.error("❌ Error fetching food items:", error);
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
