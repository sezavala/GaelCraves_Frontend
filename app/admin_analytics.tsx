import React, { useEffect, useState } from "react";
import { StyleSheet, View, Pressable, ScrollView, Text, Alert, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import {
  getAnalyticsSummary,
  AnalyticsSummary,
} from "@/services/analyticsService";

const BG = "#0B1313";
const PANEL = "#0E1717";
const PEACH = "#E7C4A3";
const TEXT = "rgba(255,255,255,0.92)";
const MUTED = "rgba(255,255,255,0.72)";
const BORDER = "rgba(255,255,255,0.08)";

export default function AnalyticsScreen() {
  const router = useRouter();
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState(30);

  useEffect(() => {
    loadAnalytics();
  }, [period]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await getAnalyticsSummary(period);
      setAnalytics(data);
    } catch (e: any) {
      console.error("Failed to load analytics", e);
      Alert.alert("Error", e.message || "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color={TEXT} />
        </Pressable>
        <Text style={styles.title}>Analytics & Reports</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.periodSelector}>
        {[7, 30, 90].map((days) => (
          <Pressable
            key={days}
            onPress={() => setPeriod(days)}
            style={[styles.periodButton, period === days && styles.periodButtonActive]}
          >
            <Text
              style={[
                styles.periodButtonText,
                period === days && styles.periodButtonTextActive,
              ]}
            >
              {days} Days
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView style={styles.content}>
        {loading && <Text style={styles.loadingText}>Loading...</Text>}

        {analytics && (
          <>
            {/* Overview Stats */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Overview</Text>
              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <IconSymbol name="dollarsign.circle.fill" size={24} color={PEACH} />
                  <Text style={styles.statValue}>
                    ${analytics.totalRevenue.toFixed(2)}
                  </Text>
                  <Text style={styles.statLabel}>Total Revenue</Text>
                </View>

                <View style={styles.statCard}>
                  <IconSymbol name="bag.fill" size={24} color={PEACH} />
                  <Text style={styles.statValue}>{analytics.totalOrders}</Text>
                  <Text style={styles.statLabel}>Total Orders</Text>
                </View>

                <View style={styles.statCard}>
                  <IconSymbol name="chart.bar.fill" size={24} color={PEACH} />
                  <Text style={styles.statValue}>
                    ${analytics.averageOrderValue.toFixed(2)}
                  </Text>
                  <Text style={styles.statLabel}>Avg Order Value</Text>
                </View>

                <View style={styles.statCard}>
                  <IconSymbol
                    name={analytics.growthRate >= 0 ? "arrow.up" : "arrow.down"}
                    size={24}
                    color={analytics.growthRate >= 0 ? "#4ade80" : "#ff6b6b"}
                  />
                  <Text
                    style={[
                      styles.statValue,
                      { color: analytics.growthRate >= 0 ? "#4ade80" : "#ff6b6b" },
                    ]}
                  >
                    {analytics.growthRate.toFixed(1)}%
                  </Text>
                  <Text style={styles.statLabel}>Growth Rate</Text>
                </View>
              </View>
            </View>

            {/* Top Selling Items */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Top Selling Items</Text>
              {analytics.topSellingItems.slice(0, 5).map((item, idx) => (
                <View key={idx} style={styles.topItemCard}>
                  <View style={styles.rankBadge}>
                    <Text style={styles.rankText}>{idx + 1}</Text>
                  </View>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemStats}>
                      {item.quantity} sold • ${item.revenue.toFixed(2)} revenue
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Orders by Status */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Orders by Status</Text>
              {analytics.ordersByStatus.map((status, idx) => (
                <View key={idx} style={styles.statusRow}>
                  <Text style={styles.statusLabel}>{status.status}</Text>
                  <Text style={styles.statusValue}>{status.count}</Text>
                </View>
              ))}
            </View>

            {/* Revenue Trend */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Revenue Trend</Text>
              {analytics.revenueByDay.slice(-7).map((day, idx) => (
                <View key={idx} style={styles.trendRow}>
                  <Text style={styles.trendDate}>
                    {new Date(day.date).toLocaleDateString()}
                  </Text>
                  <View style={styles.trendBar}>
                    <View
                      style={[
                        styles.trendBarFill,
                        {
                          width: `${(day.revenue / Math.max(...analytics.revenueByDay.map(d => d.revenue))) * 100}%`,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.trendValue}>${day.revenue.toFixed(0)}</Text>
                </View>
              ))}
            </View>
          </>
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
  periodSelector: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
  },
  periodButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: PANEL,
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: "center",
  },
  periodButtonActive: {
    backgroundColor: PEACH,
    borderColor: PEACH,
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: MUTED,
  },
  periodButtonTextActive: {
    color: BG,
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: TEXT,
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statCard: {
    width: "48%",
    backgroundColor: PANEL,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: TEXT,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: MUTED,
  },
  topItemCard: {
    flexDirection: "row",
    backgroundColor: PANEL,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: "center",
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: PEACH,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  rankText: {
    fontSize: 14,
    fontWeight: "700",
    color: BG,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: "600",
    color: TEXT,
    marginBottom: 2,
  },
  itemStats: {
    fontSize: 13,
    color: MUTED,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: PANEL,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: BORDER,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: TEXT,
  },
  statusValue: {
    fontSize: 14,
    fontWeight: "700",
    color: PEACH,
  },
  trendRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  trendDate: {
    fontSize: 12,
    color: MUTED,
    width: 80,
  },
  trendBar: {
    flex: 1,
    height: 24,
    backgroundColor: PANEL,
    borderRadius: 4,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: BORDER,
  },
  trendBarFill: {
    height: "100%",
    backgroundColor: PEACH,
  },
  trendValue: {
    fontSize: 13,
    fontWeight: "600",
    color: TEXT,
    width: 60,
    textAlign: "right",
  },
});
