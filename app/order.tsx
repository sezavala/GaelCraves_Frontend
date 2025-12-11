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
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { useAuth } from "@/auth/AuthContext";
import Constants from 'expo-constants';
import { IconSymbol } from "@/components/ui/icon-symbol";
import { getFoodItems, FoodItem } from "@/services/menuService";

const BG = "#0B1313";
const PANEL = "#0E1717";
const PEACH = "#E7C4A3";
const TEXT = "rgba(255,255,255,0.92)";
const MUTED = "rgba(255,255,255,0.72)";

export default function ExploreScreen() {
  const { width } = useWindowDimensions();
  const isWide = width >= 1100;
  const isTablet = width >= 700 && width < 1100;
  const isMobile = width < 600;
  const { user, logout } = useAuth();
  const router = useRouter();

  const [selectedMeal, setSelectedMeal] = React.useState<number | null>(null);
  const [orderTime, setOrderTime] = React.useState("");
  const [specialNotes, setSpecialNotes] = React.useState("");
  const [showPayment, setShowPayment] = React.useState(false);
  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [menuItems, setMenuItems] = React.useState<FoodItem[]>([]);
  const [isLoadingMenu, setIsLoadingMenu] = React.useState(true);

  // Payment form fields
  const [cardNumber, setCardNumber] = React.useState("");
  const [cardExpiry, setCardExpiry] = React.useState("");
  const [cardCvc, setCardCvc] = React.useState("");
  const [cardholderName, setCardholderName] = React.useState("");

  // Load menu items from database
  React.useEffect(() => {
    const loadMenu = async () => {
      console.log('🍽️ Loading menu items from database...');
      setIsLoadingMenu(true);
      try {
        const items = await getFoodItems();
        console.log('✅ Menu items loaded:', items.length, 'items');
        setMenuItems(items);
      } catch (error) {
        console.error('❌ Failed to load menu items:', error);
        Alert.alert('Error', 'Failed to load menu. Please try again.');
      } finally {
        setIsLoadingMenu(false);
      }
    };

    loadMenu();
  }, []);

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

  const handleStartOrder = (mealId: number) => {
    console.log('🛒 Starting order for meal ID:', mealId);
    console.log('👤 Current user:', user);
    
    // Check if user is logged in
    if (!user) {
      Alert.alert(
        "Login Required",
        "Please login to place an order",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Login", onPress: () => router.push("/login") }
        ]
      );
      return;
    }
    
    setSelectedMeal(mealId);
    setOrderTime("");
    setSpecialNotes("");
    // Reset payment fields
    setCardNumber("");
    setCardExpiry("");
    setCardCvc("");
    setCardholderName("");
  };

  const formatCardNumber = (text: string) => {
    // Remove all non-digits
    const cleaned = text.replace(/\D/g, '');
    // Add space every 4 digits
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.substring(0, 19); // Max 16 digits + 3 spaces
  };

  const formatExpiry = (text: string) => {
    // Remove all non-digits
    const cleaned = text.replace(/\D/g, '');
    // Add slash after 2 digits
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const validatePaymentForm = (): boolean => {
    if (!cardholderName.trim()) {
      Alert.alert("Error", "Please enter cardholder name");
      return false;
    }
    if (cardNumber.replace(/\s/g, '').length !== 16) {
      Alert.alert("Error", "Please enter a valid 16-digit card number");
      return false;
    }
    if (cardExpiry.length !== 5) {
      Alert.alert("Error", "Please enter expiry in MM/YY format");
      return false;
    }
    if (cardCvc.length < 3) {
      Alert.alert("Error", "Please enter a valid CVC");
      return false;
    }
    return true;
  };

  const handleCloseModal = () => {
    setSelectedMeal(null);
    setShowConfirmation(false);
    setShowPayment(false);
  };

  const handleConfirmOrder = () => {
    if (!user) {
      Alert.alert("Error", "Please login to continue");
      router.push("/login");
      return;
    }
    setShowPayment(true);
  };

  const handlePayment = async () => {
    // Get current meal from menuItems
    const currentMeal = menuItems.find((item) => item.foodItemId === selectedMeal);
    
    console.log('💳 handlePayment called');
    console.log('🍽️ Current meal:', currentMeal);
    console.log('👤 User:', user);
    
    if (!currentMeal) {
      Alert.alert("Error", "Meal information not found");
      return;
    }
    
    if (!user) {
      Alert.alert("Error", "Please login to complete payment");
      router.push("/login");
      return;
    }

    if (!validatePaymentForm()) {
      return;
    }

    setIsProcessing(true);
    try {
      const API_BASE = Constants.expoConfig?.extra?.API_BASE || 'https://gaelcraves-backend-256f85b120e2.herokuapp.com';
      
      console.log('💳 Processing payment for:', currentMeal.itemName);
      console.log('💰 Amount:', currentMeal.price);
      
      // Create payment intent
      const paymentIntentResponse = await fetch(`${API_BASE}/api/orders/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mealPrice: currentMeal.price.toString(),
          mealTitle: currentMeal.itemName,
        }),
      });

      const paymentIntentData = await paymentIntentResponse.json();
      
      if (!paymentIntentResponse.ok) {
        throw new Error(paymentIntentData.error || 'Failed to create payment intent');
      }

      console.log('✅ Payment intent created');

      // Process payment with card details
      const response = await fetch(`${API_BASE}/api/orders/payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          mealTitle: currentMeal.itemName,
          mealPrice: currentMeal.price.toString(),
          orderTime: orderTime || "ASAP",
          specialNotes: specialNotes,
          paymentToken: paymentIntentData.clientSecret,
          cardNumber: cardNumber.replace(/\s/g, ''),
          cardExpiry: cardExpiry,
          cardCvc: cardCvc,
          cardholderName: cardholderName,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        console.log('✅ Payment successful');
        setShowPayment(false);
        setShowConfirmation(true);
      } else {
        Alert.alert("Error", result.error || "Payment failed");
      }
    } catch (error: any) {
      console.error('❌ Payment error:', error);
      Alert.alert("Error", error.message || "Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmationDone = () => {
    handleCloseModal();
  };

  const currentMeal = menuItems.find((item) => item.foodItemId === selectedMeal);

  const tileBasis = isWide ? "48%" : isTablet ? "47%" : "100%";

  return (
    <SafeAreaView style={styles.safe}>
      {/* NAVBAR - Outside ScrollView for better touch handling */}
      <View style={styles.nav}>
        <View style={styles.brandRow}>
          <View style={styles.logoFlame} />
          <Text style={styles.brand}>GAEL&apos;S CRAVES</Text>
        </View>

        {isMobile ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              console.log('🍔 Order Hamburger clicked!');
              setMenuOpen(true);
            }}
            style={styles.menuButton}
          >
            <IconSymbol name="line.3.horizontal" size={32} color={TEXT} />
          </TouchableOpacity>
        ) : (
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
        )}
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.container,
          isMobile && styles.containerMobile,
        ]}
      >
        {/* Mobile Menu Modal */}
        {isMobile && (
          <Modal
            visible={menuOpen}
            transparent
            animationType="slide"
            onRequestClose={() => {
              console.log('Order modal close requested');
              setMenuOpen(false);
            }}
            statusBarTranslucent
          >
            <TouchableOpacity 
              style={styles.menuModalOverlay} 
              activeOpacity={1}
              onPress={() => {
                console.log('🚪 Order backdrop pressed');
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
                  <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigate("/(tabs)")}>
                    <IconSymbol name="house.fill" size={20} color={PEACH} />
                    <Text style={styles.menuItemText}>Home</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigate("/about")}>
                    <IconSymbol name="info.circle.fill" size={20} color={PEACH} />
                    <Text style={styles.menuItemText}>About</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.menuItem, styles.activeMenuItem]} onPress={() => handleNavigate("/order")}>
                    <IconSymbol name="book.fill" size={20} color={PEACH} />
                    <Text style={styles.menuItemText}>Menu</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigate("/contact")}>
                    <IconSymbol name="envelope.fill" size={20} color={PEACH} />
                    <Text style={styles.menuItemText}>Contact</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigate("/(tabs)/faq")}>
                    <IconSymbol name="questionmark.circle.fill" size={20} color={PEACH} />
                    <Text style={styles.menuItemText}>FAQ</Text>
                  </TouchableOpacity>

                  {user ? (
                    <TouchableOpacity style={[styles.menuItem, styles.logoutMenuItem]} onPress={() => {
                      setMenuOpen(false);
                      handleLogout();
                    }}>
                      <IconSymbol name="arrow.right.square.fill" size={20} color={PEACH} />
                      <Text style={styles.menuItemText}>Logout</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity style={[styles.menuItem, styles.loginMenuItem]} onPress={() => handleNavigate("/login")}>
                      <IconSymbol name="person.fill" size={20} color={PEACH} />
                      <Text style={styles.menuItemText}>Login</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </TouchableOpacity>
            </TouchableOpacity>
          </Modal>
        )}

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
          {isLoadingMenu ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={PEACH} />
              <Text style={styles.loadingText}>Loading menu...</Text>
            </View>
          ) : menuItems.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No menu items available</Text>
              <Text style={styles.emptySubtext}>Please check back later</Text>
            </View>
          ) : (
            menuItems.map((item) => (
              <View
                key={item.foodItemId}
                style={[styles.menuCard, { flexBasis: tileBasis }]}
              >
                {/* Placeholder for future food image */}
                <View style={styles.cardImagePlaceholder}>
                  <Text style={styles.cardImageText}>
                    {item.imageUrl ? "🍽️" : "Food Image"}
                  </Text>
                </View>

                <View style={styles.cardBody}>
                  <Text style={styles.cardTitle}>{item.itemName}</Text>
                  <Text style={styles.cardSubtitle}>{item.description}</Text>
                  
                  {(item.calories || item.protein) && (
                    <Text style={styles.cardNutrition}>
                      {item.calories ? `${item.calories} cal` : ''}{item.calories && item.protein ? ' • ' : ''}{item.protein ? `${item.protein}g protein` : ''}
                    </Text>
                  )}
                  
                  <Text style={styles.cardPrice}>${item.price.toFixed(2)}</Text>

                  <Pressable
                    style={[
                      styles.cardButton,
                      !item.available && styles.cardButtonDisabled
                    ]}
                    onPress={() => handleStartOrder(item.foodItemId)}
                    disabled={!item.available}
                  >
                    <Text style={styles.cardButtonText}>
                      {item.available ? "START ORDER" : "UNAVAILABLE"}
                    </Text>
                  </Pressable>
                </View>
              </View>
            ))
          )}
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
          visible={selectedMeal !== null && !showPayment && !showConfirmation}
          transparent
          animationType="fade"
          onRequestClose={handleCloseModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{currentMeal?.itemName}</Text>
              
              <View style={styles.modalSection}>
                <Text style={styles.modalLabel}>Price</Text>
                <Text style={styles.modalValue}>${currentMeal?.price.toFixed(2)}</Text>
              </View>

              {(currentMeal?.calories || currentMeal?.protein) && (
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Nutrition</Text>
                  <Text style={styles.modalValue}>
                    {currentMeal?.calories ? `${currentMeal.calories} cal` : ''}{currentMeal?.calories && currentMeal?.protein ? ' • ' : ''}{currentMeal?.protein ? `${currentMeal.protein}g protein` : ''}
                  </Text>
                </View>
              )}

              <View style={styles.modalSection}>
                <Text style={styles.modalLabel}>What's Included</Text>
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
                    PROCEED TO PAYMENT
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        {/* CONFIRMATION SCREEN MODAL */}
        <Modal
          visible={showConfirmation && !showPayment}
          transparent
          animationType="fade"
          onRequestClose={handleConfirmationDone}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.confirmationContent}>
              <Text style={styles.confirmationTitle}>✓ Payment Successful!</Text>
              
              <View style={styles.confirmationSection}>
                <Text style={styles.confirmationLabel}>Meal</Text>
                <Text style={styles.confirmationValue}>{currentMeal?.itemName}</Text>
              </View>

              <View style={styles.confirmationSection}>
                <Text style={styles.confirmationLabel}>Price</Text>
                <Text style={styles.confirmationValue}>${currentMeal?.price.toFixed(2)}</Text>
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
                  onPress={handleConfirmationDone}
                >
                  <Text style={styles.confirmationButtonText}>DONE</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        {/* PAYMENT SCREEN MODAL */}
        <Modal
          visible={showPayment}
          transparent
          animationType="fade"
          onRequestClose={() => setShowPayment(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.paymentContent}>
              <Text style={styles.paymentTitle}>Complete Your Payment</Text>
              <View style={styles.paymentSummary}>
                <View style={styles.paymentSummaryRow}>
                  <Text style={styles.paymentSummaryLabel}>Meal</Text>
                  <Text style={styles.paymentSummaryValue}>{currentMeal?.itemName}</Text>
                </View>
                <View style={styles.paymentSummaryRow}>
                  <Text style={styles.paymentSummaryLabel}>Amount</Text>
                  <Text style={styles.paymentSummaryValue}>${currentMeal?.price.toFixed(2)}</Text>
                </View>
              </View>
              
              {/* Stripe Card Input Form */}
              <View style={styles.paymentForm}>
                <Text style={styles.paymentFormTitle}>Card Details</Text>
                
                {/* Test Card Banner */}
                <View style={styles.testCardBanner}>
                  <Text style={styles.testCardTitle}>🧪 Test Mode</Text>
                  <Text style={styles.testCardText}>Card: 4242 4242 4242 4242</Text>
                  <Text style={styles.testCardText}>Expiry: Any future date</Text>
                  <Text style={styles.testCardText}>CVC: Any 3 digits</Text>
                </View>

                {/* Cardholder Name */}
                <View style={styles.paymentFieldGroup}>
                  <Text style={styles.paymentFieldLabel}>Cardholder Name</Text>
                  <TextInput
                    style={styles.paymentInput}
                    placeholder="John Doe"
                    placeholderTextColor={MUTED}
                    value={cardholderName}
                    onChangeText={setCardholderName}
                    autoCapitalize="words"
                  />
                </View>

                {/* Card Number */}
                <View style={styles.paymentFieldGroup}>
                  <Text style={styles.paymentFieldLabel}>Card Number</Text>
                  <TextInput
                    style={styles.paymentInput}
                    placeholder="4242 4242 4242 4242"
                    placeholderTextColor={MUTED}
                    value={cardNumber}
                    onChangeText={(text) => setCardNumber(formatCardNumber(text))}
                    keyboardType="numeric"
                    maxLength={19}
                  />
                </View>

                {/* Expiry and CVC */}
                <View style={styles.paymentFieldRow}>
                  <View style={[styles.paymentFieldGroup, { flex: 1 }]}>
                    <Text style={styles.paymentFieldLabel}>Expiry Date</Text>
                    <TextInput
                      style={styles.paymentInput}
                      placeholder="MM/YY"
                      placeholderTextColor={MUTED}
                      value={cardExpiry}
                      onChangeText={(text) => setCardExpiry(formatExpiry(text))}
                      keyboardType="numeric"
                      maxLength={5}
                    />
                  </View>

                  <View style={[styles.paymentFieldGroup, { flex: 1 }]}>
                    <Text style={styles.paymentFieldLabel}>CVC</Text>
                    <TextInput
                      style={styles.paymentInput}
                      placeholder="123"
                      placeholderTextColor={MUTED}
                      value={cardCvc}
                      onChangeText={(text) => setCardCvc(text.replace(/\D/g, '').substring(0, 4))}
                      keyboardType="numeric"
                      maxLength={4}
                      secureTextEntry
                    />
                  </View>
                </View>
                
                <View style={styles.paymentButtons}>
                  <Pressable
                    style={[styles.paymentButton, styles.paymentButtonSecondary]}
                    onPress={() => setShowPayment(false)}
                    disabled={isProcessing}
                  >
                    <Text style={styles.paymentButtonText}>CANCEL</Text>
                  </Pressable>
                  <Pressable
                    style={[
                      styles.paymentButton,
                      styles.paymentButtonPrimary,
                      isProcessing && styles.paymentButtonDisabled,
                    ]}
                    onPress={handlePayment}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <ActivityIndicator color="#1b1b1b" />
                    ) : (
                      <Text style={[styles.paymentButtonText, styles.paymentButtonTextPrimary]}>PAY ${currentMeal?.price.toFixed(2)}</Text>
                    )}
                  </Pressable>
                </View>
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
    paddingHorizontal: 20,
    backgroundColor: BG,
    zIndex: 1000,
    elevation: 1000,
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
  menuButton: {
    padding: 16,
    marginRight: -12,
    zIndex: 1000,
    elevation: 1000,
  },
  menuModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  menuDrawer: {
    backgroundColor: PANEL,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'android' ? 60 : 40,
    maxHeight: '85%',
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
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
    flexDirection: 'row',
    alignItems: 'center',
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
  activeMenuItem: {
    backgroundColor: PEACH + '20',
  },
  logoutMenuItem: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    paddingTop: 24,
  },
  loginMenuItem: {
    marginTop: 16,
    backgroundColor: PEACH + '20',
  },

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
  cardNutrition: {
    color: PEACH,
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
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
    flexDirection: "row",
    gap: 12,
  },
  confirmationButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  confirmationButtonPrimary: {
    backgroundColor: PEACH,
  },
  confirmationButtonSecondary: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  confirmationButtonText: {
    color: "#1b1b1b",
    fontWeight: "800",
    fontSize: 14,
  },

  // PAYMENT
  paymentContent: {
    backgroundColor: PANEL,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    padding: 24,
    maxWidth: 500,
    width: "100%",
  },
  paymentTitle: {
    color: TEXT,
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 20,
  },
  paymentSummary: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  paymentSummaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  paymentSummaryLabel: {
    color: MUTED,
    fontSize: 12,
    fontWeight: "600",
  },
  paymentSummaryValue: {
    color: TEXT,
    fontSize: 14,
    fontWeight: "600",
  },
  paymentSection: {
    marginBottom: 20,
  },
  paymentLabel: {
    color: TEXT,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  paymentForm: {
    width: "100%",
  },
  paymentFormTitle: {
    color: TEXT,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  testCardBanner: {
    backgroundColor: "rgba(231, 196, 163, 0.15)",
    borderWidth: 1,
    borderColor: PEACH,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    marginTop: 8,
  },
  testCardTitle: {
    color: PEACH,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  testCardText: {
    color: TEXT,
    fontSize: 13,
    marginBottom: 4,
    textAlign: "center",
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  paymentNote: {
    color: MUTED,
    fontSize: 13,
    marginBottom: 20,
    backgroundColor: "rgba(231, 196, 163, 0.1)",
    padding: 12,
    borderRadius: 8,
    textAlign: "center",
  },
  paymentFieldGroup: {
    marginBottom: 16,
  },
  paymentFieldRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  paymentFieldLabel: {
    color: TEXT,
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
  },
  paymentInput: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    color: TEXT,
    fontSize: 16,
  },
  paymentButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  paymentButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  paymentButtonPrimary: {
    backgroundColor: PEACH,
  },
  paymentButtonSecondary: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  paymentButtonDisabled: {
    opacity: 0.5,
  },
  paymentButtonText: {
    color: TEXT,
    fontSize: 14,
    fontWeight: "700",
  },
  paymentButtonTextPrimary: {
    color: "#1b1b1b",
  },
  // Loading and Empty States
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  loadingText: {
    color: TEXT,
    fontSize: 16,
    marginTop: 12,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyText: {
    color: TEXT,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  emptySubtext: {
    color: MUTED,
    fontSize: 14,
  },
  cardPrice: {
    color: PEACH,
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 12,
  },
  cardButtonDisabled: {
    backgroundColor: "rgba(255,255,255,0.08)",
    opacity: 0.5,
  },
});

