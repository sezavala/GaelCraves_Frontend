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
} from "react-native";
import { useRouter } from "expo-router";
import { useAdminContext } from "@/auth/AdminContext";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { API_BASE_URL } from "@/config/environment";
import * as SecureStore from "expo-secure-store";

const BG = "#0B1313";
const PANEL = "#0E1717";
const PEACH = "#E7C4A3";
const TEXT = "rgba(255,255,255,0.92)";
const MUTED = "rgba(255,255,255,0.72)";
const BORDER = "rgba(255,255,255,0.08)";

interface User {
  userId: number;
  email: string;
  firstName?: string;
  lastName?: string;
  roles?: string[];
}

export default function AdminUsersScreen() {
  const { isAdmin } = useAdminContext();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdmin) {
      router.replace("/(tabs)");
      return;
    }
    fetchUsers();
  }, [isAdmin]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = await SecureStore.getItemAsync("userToken");
      const response = await fetch(`${API_BASE_URL}/users`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.statusText}`);
      }

      const data = await response.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err instanceof Error ? err.message : "Failed to load users");
      Alert.alert("Error", "Failed to load users. Please try again.");
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
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <IconSymbol name="chevron.left" size={24} color={TEXT} />
        </Pressable>
        <View style={styles.headerContent}>
          <Text style={styles.title}>User Management</Text>
          <Text style={styles.subtitle}>{users.length} registered users</Text>
        </View>
        <Pressable onPress={fetchUsers} style={styles.refreshButton}>
          <IconSymbol name="arrow.clockwise" size={24} color={PEACH} />
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
            <Text style={styles.loadingText}>Loading users...</Text>
          </View>
        ) : error ? (
          <View style={styles.centerContainer}>
            <IconSymbol name="exclamationmark.triangle.fill" size={48} color={PEACH} />
            <Text style={styles.errorText}>{error}</Text>
            <Pressable onPress={fetchUsers} style={styles.retryButton}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </Pressable>
          </View>
        ) : users.length === 0 ? (
          <View style={styles.centerContainer}>
            <IconSymbol name="person.2" size={48} color={MUTED} />
            <Text style={styles.emptyText}>No users found</Text>
          </View>
        ) : (
          <View style={styles.usersContainer}>
            {users.map((user) => (
              <View key={user.userId} style={styles.userCard}>
                <View style={styles.userIcon}>
                  <IconSymbol name="person.fill" size={24} color={PEACH} />
                </View>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>
                    {user.firstName || user.lastName
                      ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
                      : "User"}
                  </Text>
                  <Text style={styles.userEmail}>{user.email}</Text>
                  {user.roles && user.roles.length > 0 && (
                    <View style={styles.rolesContainer}>
                      {user.roles.map((role, index) => (
                        <View key={index} style={styles.roleBadge}>
                          <Text style={styles.roleText}>{role}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
                <View style={styles.userIdBadge}>
                  <Text style={styles.userIdText}>#{user.userId}</Text>
                </View>
              </View>
            ))}
          </View>
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
  usersContainer: {
    gap: 12,
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: PANEL,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    gap: 12,
  },
  userIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${PEACH}20`,
    alignItems: "center",
    justifyContent: "center",
  },
  userInfo: {
    flex: 1,
    gap: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: TEXT,
  },
  userEmail: {
    fontSize: 14,
    color: MUTED,
  },
  rolesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 4,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: `${PEACH}20`,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: `${PEACH}40`,
  },
  roleText: {
    fontSize: 12,
    color: PEACH,
    fontWeight: "600",
  },
  userIdBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: `${BORDER}`,
    borderRadius: 6,
  },
  userIdText: {
    fontSize: 12,
    color: MUTED,
    fontWeight: "600",
  },
});
