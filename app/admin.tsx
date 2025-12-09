import React, { useEffect, useState } from "react";
import { StyleSheet, View, Pressable, ScrollView, Platform, SafeAreaView, Text, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useAdminContext } from "@/auth/AdminContext";
import { useAuth } from "@/auth/AuthContext";
import { IconSymbol } from "@/components/ui/icon-symbol";

// Colors matching home page
const BG = "#0B1313";
const PANEL = "#0E1717";
const PEACH = "#E7C4A3";
const TEXT = "rgba(255,255,255,0.92)";
const MUTED = "rgba(255,255,255,0.72)";
const BORDER = "rgba(255,255,255,0.08)";

export default function AdminScreen() {
  const { isAdmin } = useAdminContext();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  // Mock stats - replace with real data from your backend
  const [stats, setStats] = useState({
    pendingOrders: 12,
    todayRevenue: 1247.50,
    totalUsers: 348,
    menuItems: 67,
  });

  const handleLogout = async () => {
    try {
      await logout();
      Alert.alert("Success", "Logged out successfully");
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Logout error:", error);
      Alert.alert("Error", "Failed to logout");
    }
  };

  useEffect(() => {
    if (!isAdmin) {
      const timer = setTimeout(() => {
        router.replace("/(tabs)");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isAdmin, router]);

  if (!isAdmin) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.accessDeniedContainer}>
          <IconSymbol name="exclamationmark.triangle.fill" size={64} color={PEACH} />
          <Text style={styles.accessDeniedTitle}>Access Denied</Text>
          <Text style={styles.accessDeniedText}>
            You don't have permission to access this page.
          </Text>
          <Text style={styles.redirectText}>
            Redirecting to home...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
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
          <Pressable onPress={handleLogout} style={styles.logoutIconBtn}>
            <IconSymbol name="arrow.right.square" size={24} color={PEACH} />
          </Pressable>
        </View>
      )}

      {/* Mobile Menu Overlay */}
      {Platform.OS === 'android' && menuOpen && (
        <Pressable 
          style={styles.menuOverlay}
          onPress={() => setMenuOpen(false)}
        >
          <View style={styles.menuDrawer}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Admin Menu</Text>
              <Pressable onPress={() => setMenuOpen(false)}>
                <IconSymbol name="xmark" size={24} color={TEXT} />
              </Pressable>
            </View>
            
            <View style={styles.menuItems}>
              <Pressable 
                style={styles.menuItem}
                onPress={() => {
                  setMenuOpen(false);
                  router.push("/(tabs)");
                }}
              >
                <IconSymbol name="house.fill" size={20} color={PEACH} />
                <Text style={styles.menuItemText}>Home</Text>
              </Pressable>
              
              <Pressable 
                style={styles.menuItem} 
                onPress={() => {
                  console.log("📦 Mobile Menu: Orders clicked");
                  setMenuOpen(false);
                  Alert.alert("Order Management", "Navigating to orders...", [
                    { text: "OK", onPress: () => router.push("/admin_new" as any) }
                  ]);
                }}
              >
                <IconSymbol name="bag.fill" size={20} color={PEACH} />
                <Text style={styles.menuItemText}>Orders ({stats.pendingOrders})</Text>
              </Pressable>
              
              <Pressable 
                style={styles.menuItem} 
                onPress={() => {
                  console.log("📖 Mobile Menu: Menu clicked");
                  setMenuOpen(false);
                  Alert.alert("Menu Management", "Navigating to menu...", [
                    { text: "OK", onPress: () => router.push("/admin_menu" as any) }
                  ]);
                }}
              >
                <IconSymbol name="book.fill" size={20} color={PEACH} />
                <Text style={styles.menuItemText}>Menu ({stats.menuItems})</Text>
              </Pressable>
              
              <Pressable 
                style={styles.menuItem} 
                onPress={() => {
                  console.log("👥 Mobile Menu: Users clicked");
                  setMenuOpen(false);
                  Alert.alert("User Management", "Navigating to users...", [
                    { text: "OK", onPress: () => router.push("/admin_users" as any) }
                  ]);
                }}
              >
                <IconSymbol name="person.2.fill" size={20} color={PEACH} />
                <Text style={styles.menuItemText}>Users ({stats.totalUsers})</Text>
              </Pressable>
              
              <Pressable 
                style={styles.menuItem} 
                onPress={() => {
                  console.log("📊 Mobile Menu: Analytics clicked");
                  setMenuOpen(false);
                  Alert.alert("Analytics", "Navigating to analytics...", [
                    { text: "OK", onPress: () => router.push("/admin_analytics" as any) }
                  ]);
                }}
              >
                <IconSymbol name="chart.bar.fill" size={20} color={PEACH} />
                <Text style={styles.menuItemText}>Analytics</Text>
              </Pressable>
              
              <Pressable 
                style={styles.menuItem} 
                onPress={() => {
                  console.log("⚙️ Mobile Menu: Settings clicked");
                  setMenuOpen(false);
                  Alert.alert("Settings", "Navigating to settings...", [
                    { text: "OK", onPress: () => router.push("/admin_settings" as any) }
                  ]);
                }}
              >
                <IconSymbol name="gearshape.fill" size={20} color={PEACH} />
                <Text style={styles.menuItemText}>Settings</Text>
              </Pressable>

              <Pressable 
                style={[styles.menuItem, { marginTop: 20, backgroundColor: 'rgba(231, 196, 163, 0.1)' }]} 
                onPress={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
              >
                <IconSymbol name="arrow.right.square" size={20} color={PEACH} />
                <Text style={styles.menuItemText}>Logout</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      )}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Welcome back, {user?.firstName || 'Owner'}! 👋</Text>
              <Text style={styles.subtitle}>
                Here's what's happening today
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={styles.badge}>
                <IconSymbol name="shield.fill" size={16} color={PEACH} />
                <Text style={styles.badgeText}>Admin</Text>
              </View>
              {Platform.OS !== 'android' && (
                <Pressable 
                  onPress={handleLogout}
                  style={styles.logoutBtn}
                >
                  <IconSymbol name="arrow.right.square" size={18} color={BG} />
                  <Text style={styles.logoutText}>LOGOUT</Text>
                </Pressable>
              )}
            </View>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: PEACH }]}>
              <IconSymbol name="clock.fill" size={20} color={BG} />
            </View>
            <Text style={styles.statValue}>{stats.pendingOrders}</Text>
            <Text style={styles.statLabel}>Pending Orders</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: PEACH }]}>
              <IconSymbol name="dollarsign.circle.fill" size={20} color={BG} />
            </View>
            <Text style={styles.statValue}>${stats.todayRevenue}</Text>
            <Text style={styles.statLabel}>Today's Revenue</Text>
          </View>
        </View>

        {/* Main Management Cards */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Management</Text>
        </View>

        <View style={styles.cardsContainer}>
          {/* Orders Management - Primary Focus */}
          <Pressable
            style={({ pressed }) => [
              styles.primaryCard,
              pressed && styles.cardPressed,
            ]}
            onPress={() => {
              console.log("📦 Order Management button clicked");
              Alert.alert("Order Management", "Navigating to order management...", [
                { text: "OK", onPress: () => router.push("/admin_new" as any) }
              ]);
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
          <Pressable
            style={({ pressed }) => [
              styles.card,
              pressed && styles.cardPressed,
            ]}
            onPress={() => {
              console.log("📖 Menu Management button clicked");
              Alert.alert("Menu Management", "Navigating to menu management...", [
                { text: "OK", onPress: () => router.push("/admin_menu" as any) }
              ]);
            }}
          >
            <View style={styles.cardRow}>
              <View style={[styles.cardIcon, { backgroundColor: PEACH }]}>
                <IconSymbol name="book.fill" size={24} color={BG} />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Menu Management</Text>
                <Text style={styles.cardDescription}>
                  {stats.menuItems} items • Add, edit, or remove menu items
                </Text>
              </View>
              <IconSymbol name="chevron.right" size={20} color={MUTED} />
            </View>
          </Pressable>

          {/* User Management */}
          <Pressable
            style={({ pressed }) => [
              styles.card,
              pressed && styles.cardPressed,
            ]}
            onPress={() => {
              console.log("👥 User Management button clicked");
              Alert.alert("User Management", "Navigating to user management...", [
                { text: "OK", onPress: () => router.push("/admin_users" as any) }
              ]);
            }}
          >
            <View style={styles.cardRow}>
              <View style={[styles.cardIcon, { backgroundColor: PEACH }]}>
                <IconSymbol name="person.2.fill" size={24} color={BG} />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>User Management</Text>
                <Text style={styles.cardDescription}>
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
              console.log("📊 Analytics button clicked");
              Alert.alert("Analytics", "Navigating to analytics...", [
                { text: "OK", onPress: () => router.push("/admin_analytics" as any) }
              ]);
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
              console.log("⚙️ Settings button clicked");
              Alert.alert("Settings", "Navigating to settings...", [
                { text: "OK", onPress: () => router.push("/admin_settings" as any) }
              ]);
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
                </Text>
              </View>
              <IconSymbol name="chevron.right" size={20} color={MUTED} />
            </View>
          </Pressable>
        </View>

        {/* Back to Home Button */}
        <Pressable
          style={({ pressed }) => [
            styles.backButton,
            pressed && { opacity: 0.6 },
          ]}
          onPress={() => router.push("/(tabs)")}
        >
          <IconSymbol name="house.fill" size={18} color={TEXT} />
          <Text style={styles.backButtonText}>Back to Home</Text>
        </Pressable>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            GaelCraves Admin Panel v1.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  
  // Mobile Header
  mobileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    gap: 16,
  },
  hamburger: {
    padding: 8,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoFlame: {
    width: 18,
    height: 24,
    borderRadius: 4,
    backgroundColor: PEACH,
    transform: [{ rotate: "8deg" }],
    opacity: 0.9,
  },
  mobileTitle: {
    color: TEXT,
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 1,
  },
  
  // Mobile Menu
  menuOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1000,
  },
  menuDrawer: {
    width: '80%',
    maxWidth: 300,
    height: '100%',
    backgroundColor: PANEL,
    borderRightWidth: 1,
    borderRightColor: BORDER,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  menuTitle: {
    color: TEXT,
    fontSize: 18,
    fontWeight: "800",
  },
  menuItems: {
    padding: 16,
    gap: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: BG,
    gap: 12,
  },
  menuItemText: {
    color: TEXT,
    fontSize: 16,
    fontWeight: "600",
  },
  
  // Header
  header: {
    marginBottom: 24,
    marginTop: Platform.OS === 'android' ? 0 : 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 16,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 4,
    color: TEXT,
  },
  subtitle: {
    fontSize: 16,
    color: MUTED,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    backgroundColor: PANEL,
    borderWidth: 1,
    borderColor: BORDER,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: PEACH,
  },
  
  // Stats Cards
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    backgroundColor: PANEL,
    borderWidth: 1,
    borderColor: BORDER,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
    color: TEXT,
  },
  statLabel: {
    fontSize: 12,
    color: MUTED,
    textAlign: 'center',
  },
  
  // Section Header
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: TEXT,
  },
  
  // Cards Container
  cardsContainer: {
    gap: 16,
    marginBottom: 24,
  },
  
  // Primary Card (Featured)
  primaryCard: {
    borderRadius: 20,
    padding: 20,
    backgroundColor: PANEL,
    borderWidth: 1,
    borderColor: BORDER,
    marginBottom: 8,
  },
  primaryCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardIconLarge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBadge: {
    backgroundColor: BG,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDER,
  },
  cardBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: PEACH,
  },
  primaryCardContent: {
    marginBottom: 16,
  },
  primaryCardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
    color: TEXT,
  },
  primaryCardDescription: {
    fontSize: 15,
    color: MUTED,
    lineHeight: 22,
    marginBottom: 12,
  },
  cardFeatures: {
    gap: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 14,
    color: MUTED,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  cardAction: {
    fontSize: 16,
    fontWeight: "600",
    color: PEACH,
  },
  
  // Regular Cards
  card: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: PANEL,
    borderWidth: 1,
    borderColor: BORDER,
  },
  cardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 4,
    color: TEXT,
  },
  cardDescription: {
    fontSize: 14,
    color: MUTED,
    lineHeight: 20,
  },
  
  // Logout Buttons
  logoutIconBtn: {
    padding: 8,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: PEACH,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutText: {
    color: BG,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  
  // Back Button
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
    marginTop: 8,
    backgroundColor: PANEL,
    borderWidth: 1,
    borderColor: BORDER,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: TEXT,
  },
  
  // Footer
  footer: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 12,
    color: MUTED,
    opacity: 0.5,
  },
  
  // Access Denied
  accessDeniedContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  accessDeniedTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 24,
    marginBottom: 12,
    color: TEXT,
  },
  accessDeniedText: {
    fontSize: 16,
    color: MUTED,
    textAlign: "center",
    marginBottom: 24,
  },
  redirectText: {
    fontSize: 14,
    color: MUTED,
    opacity: 0.6,
    fontStyle: "italic",
  },
});
