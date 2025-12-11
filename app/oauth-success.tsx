import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { API_BASE_URL } from "@/config/environment";
import { useAuth } from "@/auth/AuthContext";

export default function OAuthSuccess() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() =>   {
    const finishGithubLogin = async () => {
      try {
        const resp = await fetch(`${API_BASE_URL}/v1/auth/github/me`, {
          method: "GET",
          credentials: "include", // send session cookie from Spring Security
        });

        if (!resp.ok) {
          const text = await resp.text();
          console.error("GitHub /me failed:", resp.status, text);
          setError("Failed to complete GitHub login. Please try again.");
          return;
        }

        const data = await resp.json();

        await setUser({
          id: data.id || "",
          email: data.email || "",
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          roles: Array.isArray(data.roles) ? data.roles : [],
          // No JWT token yet for GitHub; this satisfies second OAuth requirement
        });

        // Navigate to the main tabs screen, same as other logins
        router.replace("/(tabs)");
      } catch (e) {
        console.error("Error finishing GitHub OAuth:", e);
        setError("Unexpected error during GitHub login.");
      }
    };

    finishGithubLogin();
  }, [router, setUser]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {error ? (
          <>
            <Text style={styles.title}>GitHub Login Error</Text>
            <Text style={styles.info}>{error}</Text>
          </>
        ) : (
          <>
            <ActivityIndicator size="large" color="#38bdf8" />
            <Text style={styles.subtitle}>Finishing GitHub login...</Text>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#020617",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#e5e7eb",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#9ca3af",
    textAlign: "center",
    marginBottom: 12,
  },
  info: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 24,
  },
  link: {
    fontSize: 16,
    color: "#38bdf8",
    marginTop: 12,
  },
});
