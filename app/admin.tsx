import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Pressable,
  ScrollView,
  SafeAreaView,
  Text,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useAdminContext } from "@/auth/AdminContext";
import { IconSymbol } from "@/components/ui/icon-symbol";
import {
  getAllOrders,
  updateOrderStatus,
  getAdminStats,
} from "@/services/adminService";

const BG = "#0B1313";
const PANEL = "#0E1717";
const PEACH = "#E7C4A3";
const TEXT = "rgba(255,255,255,0.92)";
const MUTED = "rgba(255,255,255,0.72)";
const BORDER = "rgba(255,255,255,0.08)";

export default function AdminScreen() {
  const { isAdmin } = useAdminContext();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [stats, setStats] = useState({
    pendingOrders: 0,
    todayRevenue: 0,
    totalUsers: 0,
    menuItems: 0,
  });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      router.replace("/(tabs)");
      return;
    }
    loadData();
  }, [isAdmin]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [ordersData, statsData] = await Promise.all([
        getAllOrders(),
        getAdminStats(),
      ]);
      setOrders(ordersData);
      setStats(statsData);
    } catch (error) {
      console.error("Failed to load admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: number, status: string) => {
    try {
      await updateOrderStatus(orderId, status);
      await loadData();
    } catch (error) {
      console.error("Failed to update order:", error);
    }
  };

  const handleNavigate = (path: string) => {
    setMenuOpen(false);
    router.push(path);
  };

  if (!isAdmin) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.accessDeniedContainer}>
          <IconSymbol
            name="exclamationmark.triangle.fill"
            size={64}
            color={PEACH}
          />
          <Text style={styles.accessDeniedTitle}>Access Denied</Text>
          <Text style={styles.accessDeniedText}>
            You need administrator privileges to access this page
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoFlame} />
          <Text style={styles.brand}>ADMIN PANEL</Text>
        </View>
        <Pressable
          onPress={() => setMenuOpen(!menuOpen)}
          style={styles.menuButton}
        >
          <IconSymbol name="line.3.horizontal" size={24} color={PEACH} />
        </Pressable>
      </View>

      {/* Dropdown Menu */}
      {menuOpen && (
        <Pressable
          style={styles.menuOverlay}
          onPress={() => setMenuOpen(false)}
        >
          <View style={styles.menuPanel}>
            <View style={styles.menuContent}>
              <Pressable
                style={styles.menuItem}
                onPress={() => handleNavigate("/(tabs)")}
              >
                <IconSymbol name="house.fill" size={20} color={PEACH} />
                <Text style={styles.menuItemText}>Home</Text>
              </Pressable>

              <Pressable
                style={styles.menuItem}
                onPress={() => handleNavigate("/admin")}
              >
                <IconSymbol name="bag.fill" size={20} color={PEACH} />
                <Text style={styles.menuItemText}>
                  Orders ({stats.pendingOrders})
                </Text>
              </Pressable>

              <Pressable
                style={styles.menuItem}
                onPress={() => handleNavigate("/(tabs)/explore")}
              >
                <IconSymbol name="book.fill" size={20} color={PEACH} />
                <Text style={styles.menuItemText}>
                  Menu ({stats.menuItems})
                </Text>
              </Pressable>

              <Pressable
                style={styles.menuItem}
                onPress={() => handleNavigate("/(tabs)/contact")}
              >
                <IconSymbol name="person.2.fill" size={20} color={PEACH} />
                <Text style={styles.menuItemText}>Contact</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      )}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: "#1a2f2f" }]}>
            <IconSymbol name="bag.fill" size={24} color={PEACH} />
            <Text style={styles.statValue}>{stats.pendingOrders}</Text>
            <Text style={styles.statLabel}>Pending Orders</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: "#1f2a1a" }]}>
            <IconSymbol name="dollarsign.circle.fill" size={24} color={PEACH} />
            <Text style={styles.statValue}>
              ${stats.todayRevenue.toFixed(2)}
            </Text>
            <Text style={styles.statLabel}>Today's Revenue</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: "#2a1a1f" }]}>
            <IconSymbol name="person.2.fill" size={24} color={PEACH} />
            <Text style={styles.statValue}>{stats.totalUsers}</Text>
            <Text style={styles.statLabel}>Total Users</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: "#1a1f2a" }]}>
            <IconSymbol name="book.fill" size={24} color={PEACH} />
            <Text style={styles.statValue}>{stats.menuItems}</Text>
            <Text style={styles.statLabel}>Menu Items</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>

          <Pressable
            style={({ pressed }) => [
              styles.card,
              pressed && styles.cardPressed,
            ]}
            onPress={() => {
              // Scroll to orders section or navigate to dedicated orders page
              if (orders.length > 0) {
                // Show alert to scroll down
                alert("Recent orders are displayed below. Scroll down to view and manage them.");
              } else {
                alert("No orders yet. Orders will appear here when customers place them.");
              }
            }}
          >
            <View style={styles.cardRow}>
              <View style={[styles.cardIcon, { backgroundColor: PEACH }]}>
                <IconSymbol name="bag.fill" size={24} color={BG} />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Order Management</Text>
                <Text style={styles.cardDescription}>
                  {stats.pendingOrders > 0 
                    ? `${stats.pendingOrders} pending orders - scroll down to manage`
                    : 'View, process, and track all customer orders in real-time'}
                </Text>
              </View>
              <IconSymbol name="chevron.right" size={20} color={MUTED} />
            </View>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.card,
              pressed && styles.cardPressed,
            ]}
            onPress={() => handleNavigate("/admin_menu")}
          >
            <View style={styles.cardRow}>
              <View style={[styles.cardIcon, { backgroundColor: PEACH }]}>
                <IconSymbol name="book.fill" size={24} color={BG} />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Menu Management</Text>
                <Text style={styles.cardDescription}>
                  Add, edit, and manage menu items with CRUD operations
                </Text>
              </View>
              <IconSymbol name="chevron.right" size={20} color={MUTED} />
            </View>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.card,
              pressed && styles.cardPressed,
            ]}
            onPress={() => handleNavigate("/admin_users")}
          >
            <View style={styles.cardRow}>
              <View style={[styles.cardIcon, { backgroundColor: PEACH }]}>
                <IconSymbol name="person.2.fill" size={24} color={BG} />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>User Management</Text>
                <Text style={styles.cardDescription}>
                  View and manage all registered users and their roles
                </Text>
              </View>
              <IconSymbol name="chevron.right" size={20} color={MUTED} />
            </View>
          </Pressable>
        </View>

        {/* Recent Orders */}
        {loading ? (
          <ActivityIndicator
            size="large"
            color={PEACH}
            style={{ marginTop: 40 }}
          />
        ) : (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Orders</Text>
              {orders.length > 0 && (
                <Text style={styles.orderCount}>
                  {orders.length} total
                </Text>
              )}
            </View>
            
            {orders.length === 0 ? (
              <View style={styles.emptyState}>
                <IconSymbol name="bag.badge.plus" size={48} color={MUTED} />
                <Text style={styles.emptyStateTitle}>No Orders Yet</Text>
                <Text style={styles.emptyStateText}>
                  Orders will appear here when customers place them
                </Text>
              </View>
            ) : (
              <>
                {orders.slice(0, 10).map((order: any) => (
                  <View key={order.orderId} style={styles.orderCard}>
                    <View style={styles.orderHeader}>
                      <View style={styles.orderHeaderLeft}>
                        <Text style={styles.orderNumber}>Order #{order.orderId}</Text>
                        {order.userId && (
                          <Text style={styles.orderUser}>User ID: {order.userId}</Text>
                        )}
                      </View>
                      <View
                        style={[
                          styles.statusBadge,
                          { backgroundColor: getStatusColor(order.status) },
                        ]}
                      >
                        <Text style={styles.statusText}>{order.status}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.orderDetails}>
                      <View style={styles.orderDetailRow}>
                        <IconSymbol name="calendar" size={14} color={MUTED} />
                        <Text style={styles.orderDate}>
                          {new Date(order.orderDate).toLocaleString()}
                        </Text>
                      </View>
                      
                      <View style={styles.orderDetailRow}>
                        <IconSymbol name="dollarsign.circle" size={14} color={PEACH} />
                        <Text style={styles.orderTotal}>
                          ${order.totalPrice?.toFixed(2) || '0.00'}
                        </Text>
                      </View>
                    </View>

                    {/* Order Actions Based on Status */}
                    {order.status === "PENDING" && (
                      <View style={styles.orderActions}>
                        <Pressable
                          style={[styles.orderBtn, { backgroundColor: "#4CAF50" }]}
                          onPress={() =>
                            handleUpdateStatus(order.orderId, "CONFIRMED")
                          }
                        >
                          <IconSymbol name="checkmark" size={16} color="#fff" />
                          <Text style={styles.orderBtnText}>Accept</Text>
                        </Pressable>
                        <Pressable
                          style={[styles.orderBtn, { backgroundColor: "#f44336" }]}
                          onPress={() =>
                            handleUpdateStatus(order.orderId, "CANCELLED")
                          }
                        >
                          <IconSymbol name="xmark" size={16} color="#fff" />
                          <Text style={styles.orderBtnText}>Decline</Text>
                        </Pressable>
                      </View>
                    )}

                    {order.status === "CONFIRMED" && (
                      <View style={styles.orderActions}>
                        <Pressable
                          style={[styles.orderBtn, { backgroundColor: "#42A5F5", flex: 1 }]}
                          onPress={() =>
                            handleUpdateStatus(order.orderId, "PREPARING")
                          }
                        >
                          <IconSymbol name="flame" size={16} color="#fff" />
                          <Text style={styles.orderBtnText}>Start Preparing</Text>
                        </Pressable>
                      </View>
                    )}

                    {order.status === "PREPARING" && (
                      <View style={styles.orderActions}>
                        <Pressable
                          style={[styles.orderBtn, { backgroundColor: "#9CCC65", flex: 1 }]}
                          onPress={() =>
                            handleUpdateStatus(order.orderId, "READY")
                          }
                        >
                          <IconSymbol name="checkmark.circle" size={16} color="#fff" />
                          <Text style={styles.orderBtnText}>Mark as Ready</Text>
                        </Pressable>
                      </View>
                    )}

                    {order.status === "READY" && (
                      <View style={styles.orderActions}>
                        <Pressable
                          style={[styles.orderBtn, { backgroundColor: "#26A69A", flex: 1 }]}
                          onPress={() =>
                            handleUpdateStatus(order.orderId, "DELIVERED")
                          }
                        >
                          <IconSymbol name="shippingbox" size={16} color="#fff" />
                          <Text style={styles.orderBtnText}>Mark as Delivered</Text>
                        </Pressable>
                      </View>
                    )}
                  </View>
                ))}
                
                {orders.length > 10 && (
                  <View style={styles.showMoreContainer}>
                    <Text style={styles.showMoreText}>
                      Showing 10 of {orders.length} orders
                    </Text>
                  </View>
                )}
              </>
            )}
          </View>
        )}

        {/* Back Button */}
        <Pressable
          style={({ pressed }) => [
            styles.backButton,
            pressed && { opacity: 0.6 },
          ]}
          onPress={() => handleNavigate("/(tabs)")}
        >
          <IconSymbol name="house.fill" size={18} color={TEXT} />
          <Text style={styles.backButtonText}>Back to Home</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case "PENDING":
      return "#FFA726";
    case "CONFIRMED":
      return "#66BB6A";
    case "PREPARING":
      return "#42A5F5";
    case "READY":
      return "#9CCC65";
    case "DELIVERED":
      return "#26A69A";
    case "CANCELLED":
      return "#EF5350";
    default:
      return MUTED;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logoFlame: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: PEACH,
  },
  brand: {
    fontSize: 20,
    fontWeight: "800",
    color: TEXT,
  },
  menuButton: {
    padding: 8,
  },
  menuOverlay: {
    position: "absolute",
    top: 80,
    right: 20,
    zIndex: 1000,
  },
  menuPanel: {
    backgroundColor: PANEL,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    minWidth: 200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  menuContent: {
    padding: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 12,
    borderRadius: 8,
  },
  menuItemText: {
    fontSize: 16,
    color: TEXT,
    fontWeight: "500",
  },
  scrollContent: {
    padding: 20,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: 150,
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    gap: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: "800",
    color: TEXT,
  },
  statLabel: {
    fontSize: 12,
    color: MUTED,
    textAlign: "center",
  },
  section: {
    marginBottom: 24,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: TEXT,
    marginBottom: 8,
  },
  card: {
    backgroundColor: PANEL,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: BORDER,
  },
  cardPressed: {
    opacity: 0.7,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: TEXT,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: MUTED,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  orderCount: {
    fontSize: 14,
    color: PEACH,
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    backgroundColor: PANEL,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    gap: 12,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: TEXT,
  },
  emptyStateText: {
    fontSize: 14,
    color: MUTED,
    textAlign: "center",
  },
  orderCard: {
    backgroundColor: PANEL,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: BORDER,
    gap: 12,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  orderHeaderLeft: {
    flex: 1,
    gap: 4,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: "600",
    color: TEXT,
  },
  orderUser: {
    fontSize: 12,
    color: MUTED,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },
  orderDetails: {
    gap: 8,
  },
  orderDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  orderDate: {
    fontSize: 14,
    color: MUTED,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: "700",
    color: PEACH,
  },
  orderActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },
  orderBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
  },
  orderBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  showMoreContainer: {
    alignItems: "center",
    padding: 16,
    marginTop: 8,
  },
  showMoreText: {
    fontSize: 14,
    color: MUTED,
    fontStyle: "italic",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    gap: 8,
    backgroundColor: PANEL,
    borderWidth: 1,
    borderColor: BORDER,
    marginTop: 12,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: TEXT,
  },
  accessDeniedContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  accessDeniedTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: TEXT,
    marginTop: 16,
  },
  accessDeniedText: {
    fontSize: 16,
    color: MUTED,
    textAlign: "center",
    marginTop: 8,
  },
});
