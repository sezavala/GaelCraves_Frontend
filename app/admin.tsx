import React, { useEffect, useState } from "react";
<<<<<<< HEAD
import {
  StyleSheet,
  View,
  Pressable,
  ScrollView,
  SafeAreaView,
  Text,
  ActivityIndicator,
} from "react-native";
=======
import { StyleSheet, View, Pressable, ScrollView, Platform, SafeAreaView, Text } from "react-native";
>>>>>>> aba2a40f939d9e6eab6c7f9d66bfc500b5763c62
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
<<<<<<< HEAD
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
=======
>>>>>>> aba2a40f939d9e6eab6c7f9d66bfc500b5763c62

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
<<<<<<< HEAD
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoFlame} />
          <Text style={styles.brand}>ADMIN PANEL</Text>
=======
      {/* Mobile Hamburger Menu for Android */}
      {Platform.OS === 'android' && (
        <View style={styles.mobileHeader}>
          <Pressable 
            onPress={() => setMenuOpen(!menuOpen)}
            style={styles.hamburger}
          >
            <IconSymbol name="line.3.horizontal" size={24} color={TEXT} />
          </Pressable>
          <View style={styles.logoRow}>
            <View style={styles.logoFlame} />
            <Text style={styles.mobileTitle}>ADMIN PANEL</Text>
          </View>
>>>>>>> aba2a40f939d9e6eab6c7f9d66bfc500b5763c62
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
<<<<<<< HEAD

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
                <Text style={styles.menuItemText}>
                  Contact
                </Text>
=======
              
              <Pressable 
                style={styles.menuItem} 
                onPress={() => {
                  setMenuOpen(false);
                  router.push("/admin_new");
                }}
              >
                <IconSymbol name="bag.fill" size={20} color={PEACH} />
                <Text style={styles.menuItemText}>Orders ({stats.pendingOrders})</Text>
              </Pressable>
              
              <Pressable 
                style={styles.menuItem} 
                onPress={() => {
                  setMenuOpen(false);
                  router.push("/admin_menu");
                }}
              >
                <IconSymbol name="book.fill" size={20} color={PEACH} />
                <Text style={styles.menuItemText}>Menu ({stats.menuItems})</Text>
              </Pressable>
              
              <Pressable 
                style={styles.menuItem} 
                onPress={() => {
                  setMenuOpen(false);
                  router.push("/admin_users");
                }}
              >
                <IconSymbol name="person.2.fill" size={20} color={PEACH} />
                <Text style={styles.menuItemText}>Users ({stats.totalUsers})</Text>
              </Pressable>
              
              <Pressable 
                style={styles.menuItem} 
                onPress={() => {
                  setMenuOpen(false);
                  router.push("/admin_analytics");
                }}
              >
                <IconSymbol name="chart.bar.fill" size={20} color={PEACH} />
                <Text style={styles.menuItemText}>Analytics</Text>
              </Pressable>
              
              <Pressable 
                style={styles.menuItem} 
                onPress={() => {
                  setMenuOpen(false);
                  router.push("/admin_settings");
                }}
              >
                <IconSymbol name="gearshape.fill" size={20} color={PEACH} />
                <Text style={styles.menuItemText}>Settings</Text>
>>>>>>> aba2a40f939d9e6eab6c7f9d66bfc500b5763c62
              </Pressable>
            </View>
          </View>
        </Pressable>
      )}

<<<<<<< HEAD
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: "#1a2f2f" }]}>
            <IconSymbol name="bag.fill" size={24} color={PEACH} />
=======
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Welcome back, Owner! 👋</Text>
              <Text style={styles.subtitle}>
                Here's what's happening today
              </Text>
            </View>
            <View style={styles.badge}>
              <IconSymbol name="shield.fill" size={16} color={PEACH} />
              <Text style={styles.badgeText}>Admin</Text>
            </View>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: PEACH }]}>
              <IconSymbol name="clock.fill" size={20} color={BG} />
            </View>
>>>>>>> aba2a40f939d9e6eab6c7f9d66bfc500b5763c62
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

<<<<<<< HEAD
=======
        <View style={styles.cardsContainer}>
          {/* Orders Management - Primary Focus */}
          <Pressable
            style={({ pressed }) => [
              styles.primaryCard,
              pressed && styles.cardPressed,
            ]}
            onPress={() => {
              router.push("/admin_new");
            }}
          >
            <View style={styles.primaryCardHeader}>
              <View style={[styles.cardIconLarge, { backgroundColor: PEACH }]}>
                <IconSymbol name="bag.fill" size={28} color={BG} />
              </View>
              <View style={styles.cardBadge}>
                <Text style={styles.cardBadgeText}>{stats.pendingOrders} New</Text>
              </View>
            </View>
            <View style={styles.primaryCardContent}>
              <Text style={styles.primaryCardTitle}>Order Management</Text>
              <Text style={styles.primaryCardDescription}>
                View, process, and track all customer orders in real-time
              </Text>
              <View style={styles.cardFeatures}>
                <View style={styles.featureItem}>
                  <IconSymbol name="checkmark.circle.fill" size={16} color={PEACH} />
                  <Text style={styles.featureText}>Real-time tracking</Text>
                </View>
                <View style={styles.featureItem}>
                  <IconSymbol name="checkmark.circle.fill" size={16} color={PEACH} />
                  <Text style={styles.featureText}>Order history</Text>
                </View>
              </View>
            </View>
            <View style={styles.cardFooter}>
              <Text style={styles.cardAction}>Manage Orders</Text>
              <IconSymbol name="arrow.right" size={18} color={PEACH} />
            </View>
          </Pressable>

          {/* Menu Management */}
>>>>>>> aba2a40f939d9e6eab6c7f9d66bfc500b5763c62
          <Pressable
            style={({ pressed }) => [
              styles.card,
              pressed && styles.cardPressed,
            ]}
<<<<<<< HEAD
            onPress={() => handleNavigate("/order")}
          >
            <View style={styles.cardRow}>
              <View style={[styles.cardIcon, { backgroundColor: PEACH }]}>
                <IconSymbol name="bag.fill" size={24} color={BG} />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Order Management</Text>
                <Text style={styles.cardDescription}>
                  View, process, and track all customer orders in real-time
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
            onPress={() => handleNavigate("/(tabs)/explore")}
=======
            onPress={() => {
              router.push("/admin_menu");
            }}
>>>>>>> aba2a40f939d9e6eab6c7f9d66bfc500b5763c62
          >
            <View style={styles.cardRow}>
              <View style={[styles.cardIcon, { backgroundColor: PEACH }]}>
                <IconSymbol name="book.fill" size={24} color={BG} />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Menu Management</Text>
                <Text style={styles.cardDescription}>
                  Browse and manage menu items
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
<<<<<<< HEAD
            onPress={() => handleNavigate("/(tabs)/about")}
=======
            onPress={() => {
              router.push("/admin_users");
            }}
>>>>>>> aba2a40f939d9e6eab6c7f9d66bfc500b5763c62
          >
            <View style={styles.cardRow}>
              <View style={[styles.cardIcon, { backgroundColor: PEACH }]}>
                <IconSymbol name="person.2.fill" size={24} color={BG} />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>About & Info</Text>
                <Text style={styles.cardDescription}>
<<<<<<< HEAD
                  View restaurant information and details
=======
                  {stats.totalUsers} users • Manage accounts and permissions
                </Text>
              </View>
              <IconSymbol name="chevron.right" size={20} color={MUTED} />
            </View>
          </Pressable>

          {/* Analytics */}
          <Pressable
            style={({ pressed }) => [
              styles.card,
              pressed && styles.cardPressed,
            ]}
            onPress={() => {
              router.push("/admin_analytics");
            }}
          >
            <View style={styles.cardRow}>
              <View style={[styles.cardIcon, { backgroundColor: PEACH }]}>
                <IconSymbol name="chart.bar.fill" size={24} color={BG} />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Analytics & Reports</Text>
                <Text style={styles.cardDescription}>
                  View sales trends and performance metrics
                </Text>
              </View>
              <IconSymbol name="chevron.right" size={20} color={MUTED} />
            </View>
          </Pressable>

          {/* Settings */}
          <Pressable
            style={({ pressed }) => [
              styles.card,
              pressed && styles.cardPressed,
            ]}
            onPress={() => {
              router.push("/admin_settings");
            }}
          >
            <View style={styles.cardRow}>
              <View style={[styles.cardIcon, { backgroundColor: PEACH }]}>
                <IconSymbol name="gearshape.fill" size={24} color={BG} />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Settings</Text>
                <Text style={styles.cardDescription}>
                  Configure app settings and preferences
>>>>>>> aba2a40f939d9e6eab6c7f9d66bfc500b5763c62
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
            <Text style={styles.sectionTitle}>Recent Orders</Text>
            {orders.slice(0, 5).map((order: any) => (
              <View key={order.orderId} style={styles.orderCard}>
                <View style={styles.orderHeader}>
                  <Text style={styles.orderNumber}>Order #{order.orderId}</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(order.status) },
                    ]}
                  >
                    <Text style={styles.statusText}>{order.status}</Text>
                  </View>
                </View>
                <Text style={styles.orderDate}>
                  {new Date(order.orderDate).toLocaleString()}
                </Text>
                <Text style={styles.orderTotal}>
                  ${order.totalPrice?.toFixed(2)}
                </Text>
                {order.status === "PENDING" && (
                  <View style={styles.orderActions}>
                    <Pressable
                      style={[styles.orderBtn, { backgroundColor: "#4CAF50" }]}
                      onPress={() =>
                        handleUpdateStatus(order.orderId, "CONFIRMED")
                      }
                    >
                      <Text style={styles.orderBtnText}>Accept</Text>
                    </Pressable>
                    <Pressable
                      style={[styles.orderBtn, { backgroundColor: "#f44336" }]}
                      onPress={() =>
                        handleUpdateStatus(order.orderId, "CANCELLED")
                      }
                    >
                      <Text style={styles.orderBtnText}>Decline</Text>
                    </Pressable>
                  </View>
                )}
              </View>
            ))}
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
<<<<<<< HEAD
  orderCard: {
    backgroundColor: PANEL,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: BORDER,
    gap: 8,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: "600",
    color: TEXT,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },
  orderDate: {
    fontSize: 14,
    color: MUTED,
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: "700",
    color: PEACH,
  },
  orderActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  orderBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  orderBtnText: {
    color: "#fff",
    fontWeight: "600",
  },
=======
  
  // Back Button
>>>>>>> aba2a40f939d9e6eab6c7f9d66bfc500b5763c62
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
