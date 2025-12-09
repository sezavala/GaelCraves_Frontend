import * as React from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  Platform,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { useAuth } from "@/auth/AuthContext";

const BG = "#0B1313";
const PANEL = "#0E1717";
const PEACH = "#E7C4A3";
const TEXT = "rgba(255,255,255,0.92)";
const MUTED = "rgba(255,255,255,0.72)";

// Simple data model for your menu tiles
const MENU_ITEMS = [
  {
    id: "protein-mac-bowl",
    title: "Protein Mac Bowl",
    subtitle: "Fries + Protein Mac & Cheese",
    description: "Crispy Chicken Breast + Low-Cal Sauce",
    price: "$15",
    calories: "850 cal",
    protein: "65g protein",
    spicy: "spicy option also available!",
  },
  {
    id: "chicken-sandwich-fries",
    title: "Chicken Sandwich + Fries",
    subtitle: "Crispy Chicken Breast Sandwich & Fries",
    description: "Classic combo with a healthy twist.",
    price: "$12",
    calories: "800 cal",
    protein: "60g protein",
  },
  {
    id: "two-chicken-sandwiches",
    title: "Two Chicken Sandwiches",
    subtitle: "2 Crispy Chicken Breast Sandwiches",
    description: "Double the protein, double the flavor.",
    price: "$16",
    calories: "1100 cal",
    protein: "113g protein",
  },
  {
    id: "two-chicken-sandwiches-fries",
    title: "Two Chicken Sandwiches + Large Fries",
    subtitle: "2 Crispy Chicken Breast Sandwiches & Large Fries",
    description: "Perfect for sharing or a hearty meal.",
    price: "$20",
    calories: "1400 cal",
    protein: "118g protein",
  },
];

export default function ExploreScreen() {
  const { width } = useWindowDimensions();
  const isWide = width >= 1100; // 3 columns
  const isTablet = width >= 700 && width < 1100; // 2 columns
  const isMobile = width < 600;
  const { user, logout, isHydrated } = useAuth();
  const router = useRouter();

  const [selectedMeal, setSelectedMeal] = React.useState<string | null>(null);
  const [orderTime, setOrderTime] = React.useState("");
  const [specialNotes, setSpecialNotes] = React.useState("");
  const [showConfirmation, setShowConfirmation] = React.useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      Alert.alert("Success", "You have been logged out");
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleStartOrder = (mealId: string) => {
    setSelectedMeal(mealId);
    setOrderTime("");
    setSpecialNotes("");
  };

  const handleCloseModal = () => {
    setSelectedMeal(null);
    setShowConfirmation(false);
  };

  const handleConfirmOrder = () => {
    setShowConfirmation(true);
  };

  const currentMeal = MENU_ITEMS.find((item) => item.id === selectedMeal);

  const tileBasis = isWide ? "48%" : isTablet ? "47%" : "100%";

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

            {user ? (
              <Pressable
                style={isMobile ? styles.loginBtnMobile : styles.loginBtn}
                onPress={handleLogout}
              >
                <Text style={styles.loginText}>LOGOUT</Text>
              </Pressable>
            ) : (
              <Link href="/login" asChild>
                <Pressable
                  style={isMobile ? styles.loginBtnMobile : styles.loginBtn}
                >
                  <Text style={styles.loginText}>LOGIN</Text>
                </Pressable>
              </Link>
            )}
          </View>
        </View>

        {/* HEADER TEXT */}
        <View style={styles.headerBlock}>
          <Text style={styles.headerEyebrow}>We Cook For Your Goals</Text>
          <Text style={styles.headerTitle}>
            Choose Your Meal Type to Start Your Order
          </Text>
          <Text style={styles.headerSub}>
            Pick a base that matches your appetite and protein needs.
          </Text>
        </View>

        {/* GRID OF MENU CARDS */}
        <View style={styles.gridWrapper}>
          {MENU_ITEMS.map((item) => (
            <View
              key={item.id}
              style={[styles.menuCard, { flexBasis: tileBasis }]}
            >
              {/* Placeholder for future food image */}
              <View style={styles.cardImagePlaceholder}>
                <Text style={styles.cardImageText}>Food Image</Text>
              </View>

              <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
                <Text style={styles.cardDescription}>{item.description}</Text>

                <Pressable
                  style={styles.cardButton}
                  onPress={() => handleStartOrder(item.id)}
                >
                  <Text style={styles.cardButtonText}>START ORDER</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerBrand}>GAEL&apos;S CRAVES</Text>
          <Text style={styles.copy}>
            © {new Date().getFullYear()} Gael&apos;s Craves — All rights
            reserved.
          </Text>
        </View>

        {/* ORDER MODAL */}
        <Modal
          visible={selectedMeal !== null && !showConfirmation}
          transparent
          animationType="fade"
          onRequestClose={handleCloseModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{currentMeal?.title}</Text>
              
              <View style={styles.modalSection}>
                <Text style={styles.modalLabel}>Price</Text>
                <Text style={styles.modalValue}>{currentMeal?.price}</Text>
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalLabel}>Nutrition</Text>
                <Text style={styles.modalValue}>
                  {currentMeal?.calories} • {currentMeal?.protein}
                </Text>
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalLabel}>What&apos;s Included</Text>
                <Text style={styles.modalValue}>{currentMeal?.description}</Text>
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalLabel}>Preferred Time</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="e.g., 12:30 PM"
                  placeholderTextColor={MUTED}
                  value={orderTime}
                  onChangeText={setOrderTime}
                />
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalLabel}>Special Notes</Text>
                <TextInput
                  style={[styles.modalInput, styles.modalTextArea]}
                  placeholder="Any allergies or customizations?"
                  placeholderTextColor={MUTED}
                  value={specialNotes}
                  onChangeText={setSpecialNotes}
                  multiline
                />
              </View>

              <View style={styles.modalButtons}>
                <Pressable
                  style={[styles.modalButton, styles.modalButtonCancel]}
                  onPress={handleCloseModal}
                >
                  <Text style={styles.modalButtonText}>CANCEL</Text>
                </Pressable>
                <Pressable
                  style={[styles.modalButton, styles.modalButtonConfirm]}
                  onPress={handleConfirmOrder}
                >
                  <Text style={[styles.modalButtonText, styles.modalButtonConfirmText]}>
                    CONFIRM ORDER
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        {/* CONFIRMATION SCREEN MODAL */}
        <Modal
          visible={showConfirmation}
          transparent
          animationType="fade"
          onRequestClose={handleCloseModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.confirmationContent}>
              <Text style={styles.confirmationTitle}>✓ Order Confirmed!</Text>
              
              <View style={styles.confirmationSection}>
                <Text style={styles.confirmationLabel}>Meal</Text>
                <Text style={styles.confirmationValue}>{currentMeal?.title}</Text>
              </View>

              <View style={styles.confirmationSection}>
                <Text style={styles.confirmationLabel}>Price</Text>
                <Text style={styles.confirmationValue}>{currentMeal?.price}</Text>
              </View>

              <View style={styles.confirmationSection}>
                <Text style={styles.confirmationLabel}>Preferred Time</Text>
                <Text style={styles.confirmationValue}>{orderTime || "ASAP"}</Text>
              </View>

              <View style={styles.confirmationSection}>
                <Text style={styles.confirmationLabel}>Special Notes</Text>
                <Text style={styles.confirmationValue}>
                  {specialNotes || "None"}
                </Text>
              </View>

              <View style={styles.confirmationSection}>
                <Text style={styles.confirmationLabel}>Order Number</Text>
                <Text style={[styles.confirmationValue, styles.orderNumber]}>
                  #GC{Math.floor(Math.random() * 10000).toString().padStart(5, "0")}
                </Text>
              </View>

              <View style={styles.confirmationButtons}>
                <Pressable
                  style={[styles.confirmationButton, styles.confirmationButtonPrimary]}
                  onPress={handleCloseModal}
                >
                  <Text style={styles.confirmationButtonText}>DONE</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
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

  // HEADER
  headerBlock: {
    marginTop: 10,
    marginBottom: 18,
    backgroundColor: PANEL,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    padding: 24,
  },
  headerEyebrow: {
    color: PEACH,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 6,
  },
  headerTitle: {
    color: TEXT,
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 6,
    fontFamily: "Georgia, Times New Roman, serif",
  },
  headerSub: {
    color: MUTED,
    fontSize: 14,
    lineHeight: 20,
    maxWidth: 680,
  },

  // GRID
  gridWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 18,
  },
  menuCard: {
    backgroundColor: PANEL,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    padding: 16,
  },
  cardImagePlaceholder: {
    borderRadius: 14,
    backgroundColor: "#0F1919",
    height: 150,
    marginBottom: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  cardImageText: {
    color: MUTED,
    fontSize: 12,
  },
  cardBody: {},
  cardTitle: {
    color: TEXT,
    fontWeight: "800",
    fontSize: 16,
    marginBottom: 2,
  },
  cardSubtitle: {
    color: PEACH,
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 6,
  },
  cardDescription: {
    color: MUTED,
    fontSize: 13,
    marginBottom: 10,
  },
  cardButton: {
    borderWidth: 1,
    borderColor: PEACH,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  cardButtonText: {
    color: PEACH,
    fontWeight: "800",
    fontSize: 12,
    letterSpacing: 0.5,
  },

  // FOOTER
  footer: {
    marginTop: 32,
    paddingTop: 18,
    borderTopColor: "rgba(255,255,255,0.08)",
    borderTopWidth: 1,
    gap: 6,
  },
  footerBrand: { color: TEXT, fontWeight: "800" },
  copy: { color: "rgba(255,255,255,0.6)", fontSize: 12 },

  // MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: PANEL,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    padding: 24,
    maxWidth: 500,
    width: "100%",
    maxHeight: "80%",
  },
  modalTitle: {
    color: TEXT,
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 20,
  },
  modalSection: {
    marginBottom: 16,
  },
  modalLabel: {
    color: MUTED,
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6,
  },
  modalValue: {
    color: TEXT,
    fontSize: 16,
    fontWeight: "600",
  },
  modalInput: {
    backgroundColor: "#0F1919",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: TEXT,
    fontSize: 14,
  },
  modalTextArea: {
    height: 80,
    textAlignVertical: "top",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  modalButtonCancel: {
    borderWidth: 1,
    borderColor: PEACH,
  },
  modalButtonConfirm: {
    backgroundColor: PEACH,
  },
  modalButtonText: {
    color: PEACH,
    fontWeight: "800",
    fontSize: 14,
  },
  modalButtonConfirmText: {
    color: "#1b1b1b",
  },

  // CONFIRMATION SCREEN
  confirmationContent: {
    backgroundColor: PANEL,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    padding: 24,
    maxWidth: 500,
    width: "100%",
  },
  confirmationTitle: {
    color: PEACH,
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 24,
    textAlign: "center",
  },
  confirmationSection: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },
  confirmationLabel: {
    color: MUTED,
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6,
  },
  confirmationValue: {
    color: TEXT,
    fontSize: 16,
    fontWeight: "600",
  },
  orderNumber: {
    fontSize: 20,
    fontWeight: "800",
    color: PEACH,
  },
  confirmationButtons: {
    marginTop: 20,
  },
  confirmationButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  confirmationButtonPrimary: {
    backgroundColor: PEACH,
  },
  confirmationButtonText: {
    color: "#1b1b1b",
    fontWeight: "800",
    fontSize: 14,
  },
});
