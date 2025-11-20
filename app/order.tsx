import * as React from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { Link } from "expo-router";

const BG = "#0B1313";
const PANEL = "#0E1717";
const PEACH = "#E7C4A3";
const TEXT = "rgba(255,255,255,0.92)";
const MUTED = "rgba(255,255,255,0.72)";

export default function OrderScreen() {
  const { width } = useWindowDimensions();
  const isWide = width >= 900;
  const isMobile = width < 600;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          isMobile && styles.containerMobile,
        ]}
      >
        {/* NAVBAR */}
        <View style={styles.nav}>
          <View style={styles.brandRow}>
            <View style={styles.logoFlame} />
            <Text style={styles.brand}>GAEL&apos;S CRAVES</Text>
          </View>
          <View style={[styles.navRight, isMobile && styles.navRightMobile]}>
            <Link href="/" asChild>
              <Pressable>
                <Text style={[styles.navLink, isMobile && styles.navLinkMobile]}>
                  Home
                </Text>
              </Pressable>
            </Link>

            <Link href="/about" asChild>
              <Pressable>
                <Text style={[styles.navLink, isMobile && styles.navLinkMobile]}>
                  About
                </Text>
              </Pressable>
            </Link>

            {/* <Link href="/basket" asChild>
              <Pressable>
                <Text style={[styles.navLink, isMobile && styles.navLinkMobile]}>
                  Basket
                </Text>
              </Pressable>
            </Link> */}

            <Link href="/contact" asChild>
              <Pressable>
                <Text style={[styles.navLink, isMobile && styles.navLinkMobile]}>
                  Contact us
                </Text>
              </Pressable>
            </Link>

            <Link href="/login" asChild>
              <Pressable
                style={isMobile ? styles.loginBtnMobile : styles.loginBtn}
              >
                <Text style={styles.loginText}>LOGIN</Text>
              </Pressable>
            </Link>
          </View>
        </View>

        {/* ORDER PANEL */}
        <View
          style={[
            styles.panel,
            isMobile && styles.panelMobile,
            { flexDirection: isWide ? "row" : "column" },
          ]}
        >
          {/* Left: photo placeholder */}
          <View
            style={[
              styles.photoCol,
              { flex: isWide ? 1 : undefined },
              isMobile && styles.photoColMobile,
            ]}
          >
            <View style={styles.photoPlaceholder}>
              <Text style={styles.photoTextTitle}>Food Photo Placeholder</Text>
            </View>
          </View>

          {/* Right: order form */}
          <View
            style={[
              styles.formCol,
              { flex: isWide ? 1 : undefined },
              isMobile && styles.formColMobile,
            ]}
          >
            <Text style={styles.h1}>Customize Your Order</Text>
            <Text style={styles.sub}>
              Set the details for this food item before adding it to your
              basket.
            </Text>

            <View style={styles.form}>
              {/* Name */}
              <View style={styles.field}>
                <Text style={styles.label}>Food Name*</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Grilled Chicken Bowl"
                  placeholderTextColor={MUTED}
                />
              </View>

              {/* Price */}
              <View style={styles.fieldRow}>
                <View style={styles.fieldHalf}>
                  <Text style={styles.label}>Price ($)*</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="12.99"
                    keyboardType="decimal-pad"
                    placeholderTextColor={MUTED}
                  />
                </View>

                {/* Calories */}
                <View style={styles.fieldHalf}>
                  <Text style={styles.label}>Calories*</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="650"
                    keyboardType="numeric"
                    placeholderTextColor={MUTED}
                  />
                </View>
              </View>

              {/* Quantity */}
              <View style={styles.field}>
                <Text style={styles.label}>Quantity*</Text>
                <TextInput
                  style={styles.input}
                  placeholder="1"
                  keyboardType="numeric"
                  placeholderTextColor={MUTED}
                />
              </View>
            </View>

            <Pressable style={styles.addBtn}>
              <Text style={styles.addBtnText}>ADD TO BASKET</Text>
            </Pressable>
          </View>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerBrand}>GAEL&apos;S CRAVES</Text>
          <Text style={styles.copy}>
            © {new Date().getFullYear()} Gael&apos;s Craves — All rights
            reserved.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
  container: { paddingHorizontal: 20, paddingBottom: 40 },
  containerMobile: { paddingHorizontal: 12 },

  // NAV
  nav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  logoFlame: {
    width: 18,
    height: 24,
    borderRadius: 4,
    backgroundColor: PEACH,
    transform: [{ rotate: "8deg" }],
    opacity: 0.9,
  },
  brand: { color: TEXT, fontSize: 16, fontWeight: "800", letterSpacing: 1 },
  navRight: { flexDirection: "row", alignItems: "center", gap: 18 },
  navRightMobile: { gap: 10 },
  navLink: { color: TEXT, opacity: 0.85, fontSize: 14 },
  navLinkMobile: { fontSize: 12 },
  loginBtn: {
    backgroundColor: PEACH,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  loginBtnMobile: {
    backgroundColor: PEACH,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  loginText: { color: "#1b1b1b", fontWeight: "800" },

  // Panel
  panel: {
    marginTop: 10,
    backgroundColor: PANEL,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    padding: 24,
    borderRadius: 18,
  },
  panelMobile: { padding: 18 },

  // Left: photo
  photoCol: { paddingRight: 16, justifyContent: "center" },
  photoColMobile: { paddingRight: 0, marginBottom: 20 },
  photoPlaceholder: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "rgba(255,255,255,0.25)",
    borderRadius: 16,
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0F1919",
  },
  photoTextTitle: {
    color: TEXT,
    fontWeight: "800",
    marginBottom: 6,
  },
  photoTextSub: {
    color: MUTED,
    fontSize: 13,
    textAlign: "center",
  },

  // Right: form
  formCol: { paddingLeft: 16 },
  formColMobile: { paddingLeft: 0 },
  h1: {
    color: TEXT,
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 8,
    fontFamily: "Georgia, Times New Roman, serif",
  },
  sub: {
    color: MUTED,
    fontSize: 14,
    marginBottom: 18,
  },
  form: { gap: 14 },
  field: { marginBottom: 10 },
  fieldRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  fieldHalf: { flex: 1 },
  label: { color: MUTED, fontSize: 12, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 10,
    color: TEXT,
    fontSize: 14,
    backgroundColor: "#0B1414",
  },

  addBtn: {
    marginTop: 18,
    borderWidth: 1,
    borderColor: PEACH,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  addBtnText: {
    color: PEACH,
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  // Footer
  footer: {
    marginTop: 36,
    paddingTop: 18,
    borderTopColor: "rgba(255,255,255,0.08)",
    borderTopWidth: 1,
    gap: 6,
  },
  footerBrand: { color: TEXT, fontWeight: "800" },
  copy: { color: "rgba(255,255,255,0.6)", fontSize: 12 },
});
