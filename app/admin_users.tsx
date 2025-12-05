import React, { useEffect, useState } from "react";
import { StyleSheet, View, Pressable, ScrollView, Text, Alert, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import {
  getAllUsers,
  deleteUser,
  User,
} from "@/services/userService";

const BG = "#0B1313";
const PANEL = "#0E1717";
const PEACH = "#E7C4A3";
const TEXT = "rgba(255,255,255,0.92)";
const MUTED = "rgba(255,255,255,0.72)";
const BORDER = "rgba(255,255,255,0.08)";

export default function UserManagementScreen() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);
    } catch (e: any) {
      console.error("Failed to load users", e);
      Alert.alert("Error", e.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this user?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteUser(userId);
              Alert.alert("Success", "User deleted");
              loadUsers();
            } catch (e: any) {
              Alert.alert("Error", e.message || "Failed to delete user");
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color={TEXT} />
        </Pressable>
        <Text style={styles.title}>User Management</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        {loading && <Text style={styles.loadingText}>Loading...</Text>}

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{users.length}</Text>
            <Text style={styles.statLabel}>Total Users</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>
              {users.filter(u => u.roles?.includes("ADMIN")).length}
            </Text>
            <Text style={styles.statLabel}>Admin Users</Text>
          </View>
        </View>

        {users.map((user) => (
          <View key={user.userId} style={styles.userCard}>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>
                {user.firstName} {user.lastName}
              </Text>
              <Text style={styles.userEmail}>{user.email}</Text>
              {user.roles && user.roles.length > 0 && (
                <View style={styles.rolesContainer}>
                  {user.roles.map((role, idx) => (
                    <View key={idx} style={styles.roleBadge}>
                      <Text style={styles.roleText}>{role}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
            <Pressable
              onPress={() => handleDeleteUser(user.userId!)}
              style={styles.deleteButton}
            >
              <IconSymbol name="trash" size={20} color="#ff6b6b" />
            </Pressable>
          </View>
        ))}
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
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: TEXT,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loadingText: {
    color: MUTED,
    textAlign: "center",
    marginTop: 20,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: PANEL,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: "center",
  },
  statValue: {
    fontSize: 28,
    fontWeight: "700",
    color: PEACH,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: MUTED,
  },
  userCard: {
    flexDirection: "row",
    backgroundColor: PANEL,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: "center",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: TEXT,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: MUTED,
    marginBottom: 8,
  },
  rolesContainer: {
    flexDirection: "row",
    gap: 6,
  },
  roleBadge: {
    backgroundColor: PEACH,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  roleText: {
    fontSize: 11,
    fontWeight: "600",
    color: BG,
  },
  deleteButton: {
    padding: 8,
  },
});
