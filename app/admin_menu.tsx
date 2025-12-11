import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  Alert,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { useAdminContext } from "@/auth/AdminContext";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { getMenus, getFoodItems, FoodItem, Menu } from "@/services/menuService";

const BG = "#0B1313";
const PANEL = "#0E1717";
const PEACH = "#E7C4A3";
const TEXT = "rgba(255,255,255,0.92)";
const MUTED = "rgba(255,255,255,0.72)";
const BORDER = "rgba(255,255,255,0.08)";

export default function AdminMenuScreen() {
  const { isAdmin } = useAdminContext();
  const router = useRouter();
  const [menus, setMenus] = useState<Menu[]>([]);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"menus" | "items">("items");

  useEffect(() => {
    if (!isAdmin) {
      router.replace("/(tabs)");
      return;
    }
    fetchData();
  }, [isAdmin]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [menusData, itemsData] = await Promise.all([
        getMenus(),
        getFoodItems(),
      ]);
      
      setMenus(menusData);
      setFoodItems(itemsData);

      if (menusData.length === 0 && itemsData.length === 0) {
        setError(
          "Backend returned no menu data (or an error). Please try again later or contact support."
        );
      }
    } catch (err) {
      console.error("Error fetching menu data:", err);
      setError(err instanceof Error ? err.message : "Failed to load menu data");
      Alert.alert("Error", "Failed to load menu data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color={TEXT} />
        </Pressable>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Menu Management</Text>
          <Text style={styles.subtitle}>
            {viewMode === "menus" 
              ? `${menus.length} menus` 
              : `${foodItems.length} food items`}
          </Text>
        </View>
        <Pressable onPress={fetchData} style={styles.refreshButton}>
          <IconSymbol name="arrow.clockwise" size={24} color={PEACH} />
        </Pressable>
      </View>

      {/* View Toggle */}
      <View style={styles.toggleContainer}>
        <Pressable
          onPress={() => setViewMode("items")}
          style={[
            styles.toggleButton,
            viewMode === "items" && styles.toggleButtonActive,
          ]}
        >
          <Text
            style={[
              styles.toggleButtonText,
              viewMode === "items" && styles.toggleButtonTextActive,
            ]}
          >
            Food Items
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setViewMode("menus")}
          style={[
            styles.toggleButton,
            viewMode === "menus" && styles.toggleButtonActive,
          ]}
        >
          <Text
            style={[
              styles.toggleButtonText,
              viewMode === "menus" && styles.toggleButtonTextActive,
            ]}
          >
            Menus
          </Text>
        </Pressable>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={PEACH} />
            <Text style={styles.loadingText}>Loading menu data...</Text>
          </View>
        ) : error ? (
          <View style={styles.centerContainer}>
            <IconSymbol name="exclamationmark.triangle.fill" size={48} color={PEACH} />
            <Text style={styles.errorText}>{error}</Text>
            <Pressable onPress={fetchData} style={styles.retryButton}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </Pressable>
          </View>
        ) : viewMode === "items" ? (
          foodItems.length === 0 ? (
            <View style={styles.centerContainer}>
              <IconSymbol name="fork.knife" size={48} color={MUTED} />
              <Text style={styles.emptyText}>No food items found</Text>
            </View>
          ) : (
            <View style={styles.itemsContainer}>
              {foodItems.map((item) => (
                <View key={item.foodItemId} style={styles.foodCard}>
                  {item.imageUrl ? (
                    <Image
                      source={{ uri: item.imageUrl }}
                      style={styles.foodImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.foodImagePlaceholder}>
                      <IconSymbol name="photo" size={32} color={MUTED} />
                    </View>
                  )}
                  <View style={styles.foodInfo}>
                    <View style={styles.foodHeader}>
                      <Text style={styles.foodName}>{item.itemName}</Text>
                      <View
                        style={[
                          styles.availableBadge,
                          !item.available && styles.unavailableBadge,
                        ]}
                      >
                        <Text
                          style={[
                            styles.availableText,
                            !item.available && styles.unavailableText,
                          ]}
                        >
                          {item.available ? "Available" : "Unavailable"}
                        </Text>
                      </View>
                    </View>
                    {item.description && (
                      <Text style={styles.foodDescription} numberOfLines={2}>
                        {item.description}
                      </Text>
                    )}
                    <View style={styles.foodFooter}>
                      <Text style={styles.foodPrice}>
                        ${item.price.toFixed(2)}
                      </Text>
                      {item.category && (
                        <View style={styles.categoryBadge}>
                          <Text style={styles.categoryText}>{item.category}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )
        ) : (
          menus.length === 0 ? (
            <View style={styles.centerContainer}>
              <IconSymbol name="book" size={48} color={MUTED} />
              <Text style={styles.emptyText}>No menus found</Text>
            </View>
          ) : (
            <View style={styles.menusContainer}>
              {menus.map((menu) => (
                <View key={menu.menuId} style={styles.menuCard}>
                  <View style={styles.menuIcon}>
                    <IconSymbol name="book.fill" size={24} color={PEACH} />
                  </View>
                  <View style={styles.menuInfo}>
                    <Text style={styles.menuName}>{menu.menuName}</Text>
                    {menu.description && (
                      <Text style={styles.menuDescription}>{menu.description}</Text>
                    )}
                    {menu.foodItems && menu.foodItems.length > 0 && (
                      <Text style={styles.menuItemCount}>
                        {menu.foodItems.length} items
                      </Text>
                    )}
                  </View>
                  <IconSymbol name="chevron.right" size={20} color={MUTED} />
                </View>
              ))}
            </View>
          )
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    gap: 12,
  },
  backButton: {
    padding: 8,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: TEXT,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 14,
    color: MUTED,
    marginTop: 4,
  },
  refreshButton: {
    padding: 8,
  },
  toggleContainer: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: PANEL,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: "center",
  },
  toggleButtonActive: {
    backgroundColor: PEACH,
    borderColor: PEACH,
  },
  toggleButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: MUTED,
  },
  toggleButtonTextActive: {
    color: BG,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: MUTED,
  },
  errorText: {
    fontSize: 16,
    color: MUTED,
    textAlign: "center",
    marginTop: 12,
  },
  retryButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: PEACH,
    borderRadius: 8,
  },
  retryButtonText: {
    color: BG,
    fontSize: 16,
    fontWeight: "600",
  },
  emptyText: {
    fontSize: 16,
    color: MUTED,
    marginTop: 12,
  },
  itemsContainer: {
    gap: 16,
  },
  foodCard: {
    backgroundColor: PANEL,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    overflow: "hidden",
  },
  foodImage: {
    width: "100%",
    height: 180,
    backgroundColor: `${BORDER}`,
  },
  foodImagePlaceholder: {
    width: "100%",
    height: 180,
    backgroundColor: `${BORDER}`,
    alignItems: "center",
    justifyContent: "center",
  },
  foodInfo: {
    padding: 16,
    gap: 8,
  },
  foodHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  foodName: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    color: TEXT,
  },
  availableBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: `#4CAF5020`,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: `#4CAF5040`,
  },
  unavailableBadge: {
    backgroundColor: `#FF525220`,
    borderColor: `#FF525240`,
  },
  availableText: {
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "600",
  },
  unavailableText: {
    color: "#FF5252",
  },
  foodDescription: {
    fontSize: 14,
    color: MUTED,
    lineHeight: 20,
  },
  foodFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  foodPrice: {
    fontSize: 20,
    fontWeight: "700",
    color: PEACH,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: `${PEACH}20`,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 12,
    color: PEACH,
    fontWeight: "600",
  },
  menusContainer: {
    gap: 12,
  },
  menuCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: PANEL,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    gap: 12,
  },
  menuIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${PEACH}20`,
    alignItems: "center",
    justifyContent: "center",
  },
  menuInfo: {
    flex: 1,
    gap: 4,
  },
  menuName: {
    fontSize: 16,
    fontWeight: "600",
    color: TEXT,
  },
  menuDescription: {
    fontSize: 14,
    color: MUTED,
  },
  menuItemCount: {
    fontSize: 12,
    color: PEACH,
    fontWeight: "600",
  },
});
