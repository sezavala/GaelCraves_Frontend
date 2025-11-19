import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAdminContext } from "@/auth/AdminContext";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { isAdmin } = useAdminContext();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: colorScheme === 'dark' ? '#0E1717' : '#fff',
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          borderTopWidth: 1,
          borderTopColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.08)' : '#e0e0e0',
          paddingBottom: Platform.OS === 'android' ? 10 : 0,
          paddingTop: Platform.OS === 'android' ? 10 : 5,
          height: Platform.OS === 'android' ? 70 : 50,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginBottom: Platform.OS === 'android' ? 5 : 0,
        },
        tabBarIconStyle: {
          marginTop: Platform.OS === 'android' ? 5 : 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="paperplane.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="admin"
        options={{
          title: "Admin",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="shield.fill" color={color} />
          ),
          href: isAdmin ? '/(tabs)/admin' : null,
        }}
      />
    </Tabs>
  );
}
