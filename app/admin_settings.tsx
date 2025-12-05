import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  Alert,
  Switch,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";

const BG = "#0B1313";
const PANEL = "#0E1717";
const PEACH = "#E7C4A3";
const TEXT = "rgba(255,255,255,0.92)";
const MUTED = "rgba(255,255,255,0.72)";
const BORDER = "rgba(255,255,255,0.08)";

export default function SettingsScreen() {
  const router = useRouter();

  // Business Information
  const [businessName, setBusinessName] = useState("Gael Craves");
  const [contactEmail, setContactEmail] = useState("gaelcraves@admin.com");
  const [contactPhone, setContactPhone] = useState("(555) 123-4567");

  // Operating Hours
  const [openTime, setOpenTime] = useState("10:00 AM");
  const [closeTime, setCloseTime] = useState("10:00 PM");

  // Notification Settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [orderAlerts, setOrderAlerts] = useState(true);

  // App Settings
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [autoAcceptOrders, setAutoAcceptOrders] = useState(false);

  const handleSaveSettings = () => {
    Alert.alert(
      "Save Settings",
      "Are you sure you want to save these settings?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Save",
          onPress: () => {
            // TODO: Implement API call to save settings
            console.log("Saving settings...", {
              businessName,
              contactEmail,
              contactPhone,
              openTime,
              closeTime,
              emailNotifications,
              pushNotifications,
              orderAlerts,
              maintenanceMode,
              autoAcceptOrders,
            });
            Alert.alert("Success", "Settings saved successfully!");
          },
        },
      ]
    );
  };

  const handleClearCache = () => {
    Alert.alert(
      "Clear Cache",
      "This will clear all cached data. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => {
            // TODO: Implement cache clearing
            Alert.alert("Success", "Cache cleared successfully!");
          },
        },
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      "Export Data",
      "This will export all data to a CSV file.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Export",
          onPress: () => {
            // TODO: Implement data export
            Alert.alert("Success", "Data exported successfully!");
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
        <Text style={styles.title}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Business Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Business Information</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Business Name</Text>
            <TextInput
              style={styles.input}
              value={businessName}
              onChangeText={setBusinessName}
              placeholder="Enter business name"
              placeholderTextColor={MUTED}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contact Email</Text>
            <TextInput
              style={styles.input}
              value={contactEmail}
              onChangeText={setContactEmail}
              placeholder="Enter contact email"
              placeholderTextColor={MUTED}
              keyboardType="email-address"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contact Phone</Text>
            <TextInput
              style={styles.input}
              value={contactPhone}
              onChangeText={setContactPhone}
              placeholder="Enter contact phone"
              placeholderTextColor={MUTED}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* Operating Hours */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Operating Hours</Text>
          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Open Time</Text>
              <TextInput
                style={styles.input}
                value={openTime}
                onChangeText={setOpenTime}
                placeholder="10:00 AM"
                placeholderTextColor={MUTED}
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Close Time</Text>
              <TextInput
                style={styles.input}
                value={closeTime}
                onChangeText={setCloseTime}
                placeholder="10:00 PM"
                placeholderTextColor={MUTED}
              />
            </View>
          </View>
        </View>

        {/* Notification Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.switchRow}>
            <View style={styles.switchLabel}>
              <IconSymbol name="envelope.fill" size={20} color={TEXT} />
              <Text style={styles.switchText}>Email Notifications</Text>
            </View>
            <Switch
              value={emailNotifications}
              onValueChange={setEmailNotifications}
              trackColor={{ false: BORDER, true: PEACH }}
              thumbColor={emailNotifications ? "#fff" : "#ccc"}
            />
          </View>
          <View style={styles.switchRow}>
            <View style={styles.switchLabel}>
              <IconSymbol name="bell.fill" size={20} color={TEXT} />
              <Text style={styles.switchText}>Push Notifications</Text>
            </View>
            <Switch
              value={pushNotifications}
              onValueChange={setPushNotifications}
              trackColor={{ false: BORDER, true: PEACH }}
              thumbColor={pushNotifications ? "#fff" : "#ccc"}
            />
          </View>
          <View style={styles.switchRow}>
            <View style={styles.switchLabel}>
              <IconSymbol name="bag.fill" size={20} color={TEXT} />
              <Text style={styles.switchText}>Order Alerts</Text>
            </View>
            <Switch
              value={orderAlerts}
              onValueChange={setOrderAlerts}
              trackColor={{ false: BORDER, true: PEACH }}
              thumbColor={orderAlerts ? "#fff" : "#ccc"}
            />
          </View>
        </View>

        {/* App Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          <View style={styles.switchRow}>
            <View style={styles.switchLabel}>
              <IconSymbol name="wrench.fill" size={20} color={TEXT} />
              <Text style={styles.switchText}>Maintenance Mode</Text>
            </View>
            <Switch
              value={maintenanceMode}
              onValueChange={setMaintenanceMode}
              trackColor={{ false: BORDER, true: PEACH }}
              thumbColor={maintenanceMode ? "#fff" : "#ccc"}
            />
          </View>
          <View style={styles.switchRow}>
            <View style={styles.switchLabel}>
              <IconSymbol name="checkmark.circle.fill" size={20} color={TEXT} />
              <Text style={styles.switchText}>Auto-Accept Orders</Text>
            </View>
            <Switch
              value={autoAcceptOrders}
              onValueChange={setAutoAcceptOrders}
              trackColor={{ false: BORDER, true: PEACH }}
              thumbColor={autoAcceptOrders ? "#fff" : "#ccc"}
            />
          </View>
        </View>

        {/* Data Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          <Pressable style={styles.actionButton} onPress={handleClearCache}>
            <IconSymbol name="trash.fill" size={20} color={TEXT} />
            <Text style={styles.actionButtonText}>Clear Cache</Text>
          </Pressable>
          <Pressable style={styles.actionButton} onPress={handleExportData}>
            <IconSymbol name="square.and.arrow.up" size={20} color={TEXT} />
            <Text style={styles.actionButtonText}>Export Data</Text>
          </Pressable>
        </View>

        {/* Save Button */}
        <Pressable style={styles.saveButton} onPress={handleSaveSettings}>
          <Text style={styles.saveButtonText}>Save Settings</Text>
        </Pressable>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
          <Text style={styles.versionText}>© 2025 Gael Craves</Text>
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: TEXT,
    marginBottom: 12,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: MUTED,
    marginBottom: 8,
  },
  input: {
    backgroundColor: PANEL,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: TEXT,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: PANEL,
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: BORDER,
  },
  switchLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  switchText: {
    fontSize: 15,
    fontWeight: "600",
    color: TEXT,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: PANEL,
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: BORDER,
    gap: 12,
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: TEXT,
  },
  saveButton: {
    backgroundColor: PEACH,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 24,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: BG,
  },
  versionContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  versionText: {
    fontSize: 12,
    color: MUTED,
    marginBottom: 4,
  },
});
