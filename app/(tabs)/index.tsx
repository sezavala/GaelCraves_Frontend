import * as React from "react";
import { Link, useRouter } from "expo-router";
import { Alert } from "react-native";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
  useWindowDimensions,
  Platform,
  Modal,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "@/auth/AuthContext";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const isWide = width >= 900; // simple responsive tweak for web
  const isMobile = width < 600;
  const router = useRouter();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const handleNavLogin = (which = "primary") => {
    console.log("[nav] handleNavLogin called from", which);
    // Show a native alert so the user sees something even if Metro logs aren't visible
    try {
      Alert.alert("Debug", `Login pressed (${which})`, [{ text: "OK" }]);
    } catch (e) {
      console.log("[nav] Alert failed", e);
    }
    // Attempt navigation as well
    try {
      router.push("/login");
    } catch (e) {
      console.log("[nav] router.push failed", e);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      Alert.alert("Success", "You have been logged out");
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleNavigate = (path: any) => {
    setMenuOpen(false);
    router.push(path);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        contentInsetAdjustmentBehavior="automatic"
      >
        {/* NAVBAR */}
        <View style={styles.nav}>
          <View style={styles.brandRow}>
            <View style={styles.logoFlame} />
            <Text style={styles.brand}>GAEL'S CRAVES</Text>
          </View>

          {isMobile ? (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                console.log("🍔 Home Hamburger clicked!");
                setMenuOpen(true);
              }}
              style={styles.menuButton}
            >
              <IconSymbol name="line.3.horizontal" size={32} color={TEXT} />
            </TouchableOpacity>
          ) : (
            <View style={styles.navRight}>
              <Text style={styles.navLink}>Home</Text>
              <Link href="/about" asChild>
                <Pressable>
                  <Text style={styles.navLink}>About</Text>
                </Pressable>
              </Link>
              <Link href="/order" asChild>
                <Pressable>
                  <Text style={styles.navLink}>Menu</Text>
                </Pressable>
              </Link>
              <Link href="/contact" asChild>
                <Pressable>
                  <Text style={styles.navLink}>Contact us</Text>
                </Pressable>
              </Link>

              {user ? (
                <Pressable style={styles.logoutBtn} onPress={handleLogout}>
                  <Text style={styles.logoutText}>LOGOUT</Text>
                </Pressable>
              ) : (
                <Link href="/login" asChild>
                  <Pressable style={styles.viewMenuBtn}>
                    <Text style={styles.viewMenuText}>LOGIN</Text>
                  </Pressable>
                </Link>
              )}
            </View>
          )}
        </View>

        {/* Mobile Menu Modal */}
        <Modal
          visible={menuOpen}
          transparent
          animationType="slide"
          onRequestClose={() => setMenuOpen(false)}
          statusBarTranslucent
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => {
              console.log("🚪 Home backdrop pressed");
              setMenuOpen(false);
            }}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPress={(e) => e.stopPropagation()}
              style={styles.menuDrawer}
            >
              <View style={styles.menuHeader}>
                <Text style={styles.menuTitle}>Menu</Text>
                <TouchableOpacity onPress={() => setMenuOpen(false)}>
                  <IconSymbol name="xmark" size={24} color={TEXT} />
                </TouchableOpacity>
              </View>

              <View style={styles.menuItems}>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleNavigate("/(tabs)")}
                >
                  <IconSymbol name="house.fill" size={20} color={PEACH} />
                  <Text style={styles.menuItemText}>Home</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleNavigate("/about")}
                >
                  <IconSymbol name="info.circle.fill" size={20} color={PEACH} />
                  <Text style={styles.menuItemText}>About</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleNavigate("/order")}
                >
                  <IconSymbol name="book.fill" size={20} color={PEACH} />
                  <Text style={styles.menuItemText}>Menu</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleNavigate("/contact")}
                >
                  <IconSymbol name="envelope.fill" size={20} color={PEACH} />
                  <Text style={styles.menuItemText}>Contact</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleNavigate("/(tabs)/faq")}
                >
                  <IconSymbol
                    name="questionmark.circle.fill"
                    size={20}
                    color={PEACH}
                  />
                  <Text style={styles.menuItemText}>FAQ</Text>
                </TouchableOpacity>

                {user ? (
                  <TouchableOpacity
                    style={[styles.menuItem, styles.logoutMenuItem]}
                    onPress={() => {
                      setMenuOpen(false);
                      handleLogout();
                    }}
                  >
                    <IconSymbol
                      name="arrow.right.square.fill"
                      size={20}
                      color={PEACH}
                    />
                    <Text style={styles.menuItemText}>Logout</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[styles.menuItem, styles.loginMenuItem]}
                    onPress={() => handleNavigate("/login")}
                  >
                    <IconSymbol name="person.fill" size={20} color={PEACH} />
                    <Text style={styles.menuItemText}>Login</Text>
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>

        {/* HERO */}
        <View
          style={[
            styles.heroCard,
            { flexDirection: isWide ? "row" : "column" },
          ]}
        >
          {/* Left copy */}
          <View style={[styles.heroLeft, { flex: isWide ? 1 : undefined }]}>
            <Text style={styles.eyebrow}>Crafted with passion</Text>
            <Text style={[styles.h1, isMobile && styles.h1Mobile]}>
              Where <Text style={styles.accent}>Cravings</Text> Meet Their
              Perfect Match
            </Text>
            <Text style={[styles.sub, isMobile && styles.subMobile]}>
              Discover bold flavors and unforgettable dishes in a place where
              every craving is satisfied with the perfect bite, crafted just for
              you.
            </Text>
            <View style={styles.ctaRow}>
              <Link href="/order" asChild>
                <Pressable style={styles.primaryOutline}>
                  <Text style={styles.primaryOutlineText}>
                    PLACE YOUR ORDER
                  </Text>
                </Pressable>
              </Link>
            </View>
          </View>

          {/* Right imagery */}
          <View style={[styles.heroRight, { flex: isWide ? 1 : undefined }]}>
            <View style={styles.dishStage}>
              <Image style={[styles.dish, styles.dishTop]} resizeMode="cover" />
              <Image
                style={[styles.dish, styles.dishBottomLeft]}
                resizeMode="cover"
              />
              <Image
                style={[styles.dish, styles.dishBottomRight]}
                resizeMode="cover"
              />
            </View>
          </View>
        </View>

        {/* FOOTER (simple) */}
        <View style={styles.footer}>
          <Text style={styles.footerBrand}>GAEL'S CRAVES</Text>
          <Text style={styles.copy}>
            © {new Date().getFullYear()} Gael's Craves — All rights reserved.
          </Text>
        </View>

        {/* Extra padding for tab bar on Android */}
        {Platform.OS === "android" && <View style={{ height: 80 }} />}
      </ScrollView>
    </SafeAreaView>
  );
}

const BG = "#0B1313";
const PANEL = "#0E1717";
const PEACH = "#E7C4A3";
const TEXT = "rgba(255,255,255,0.92)";
const MUTED = "rgba(255,255,255,0.72)";

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
  container: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === "android" ? 100 : 40,
  },

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
  navLink: { color: TEXT, opacity: 0.85 },
  viewMenuBtn: {
    backgroundColor: PEACH,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  viewMenuText: { color: "#1b1b1b", fontWeight: "800" },

  // User section
  userSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logoutBtn: {
    backgroundColor: PEACH,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  logoutText: {
    color: "#1b1b1b",
    fontSize: 12,
    fontWeight: "800",
  },
  menuButton: {
    padding: 16,
    marginRight: -12,
    zIndex: 1000,
    elevation: 1000,
  },

  // Mobile Menu
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  menuDrawer: {
    backgroundColor: PANEL,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === "android" ? 60 : 40,
    maxHeight: "85%",
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  menuHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },
  menuTitle: {
    color: TEXT,
    fontSize: 20,
    fontWeight: "800",
  },
  menuItems: {
    padding: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  menuItemText: {
    color: TEXT,
    fontSize: 16,
    fontWeight: "600",
  },
  logoutMenuItem: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
    paddingTop: 24,
  },
  loginMenuItem: {
    marginTop: 16,
    backgroundColor: PEACH + "20",
  },

  // HERO
  heroCard: {
    marginTop: 8,
    backgroundColor: PANEL,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    padding: 24,
    borderRadius: 18,
  },
  heroLeft: { paddingRight: 16 },
  eyebrow: {
    color: PEACH,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 10,
  },
  h1: {
    color: TEXT,
    fontSize: 56,
    lineHeight: 62,
    fontWeight: "800",
    marginBottom: 14,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "Georgia, Times New Roman, serif",
    }),
  },
  h1Mobile: {
    fontSize: 32,
    lineHeight: 38,
  },
  accent: { color: PEACH },
  sub: {
    color: MUTED,
    fontSize: 16,
    lineHeight: 22,
    marginTop: 6,
    maxWidth: 680,
  },
  subMobile: {
    fontSize: 14,
    lineHeight: 20,
  },
  ctaRow: { flexDirection: "row", gap: 12, marginTop: 18 },
  primaryOutline: {
    borderWidth: 1,
    borderColor: PEACH,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  primaryOutlineText: { color: PEACH, fontWeight: "800" },

  // Right imagery
  heroRight: { marginTop: 24 },
  dishStage: {
    height: 360,
    borderRadius: 16,
    overflow: "visible",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  dish: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 6,
    borderColor: "#1f2a2a",
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
  },
  dishTop: { position: "absolute", top: 0, right: 40 },
  dishBottomLeft: { position: "absolute", bottom: 0, left: 20 },
  dishBottomRight: { position: "absolute", bottom: -10, right: -10 },

  // FOOTER
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
