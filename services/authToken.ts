import * as SecureStore from "expo-secure-store";

/**
 * Get authentication token from storage (SecureStore on native, localStorage on web).
 */
export async function getAuthToken(): Promise<string | null> {
  try {
    // Try SecureStore first (React Native / native)
    try {
      const token = await SecureStore.getItemAsync("userToken");
      if (token) {
        console.log("🔐 Token found in SecureStore");
        return token;
      }
    } catch (secureStoreError) {
      console.log(
        "📱 SecureStore not available or stubbed (likely web), trying localStorage..."
      );
    }

    // Fallback to localStorage (Web)
    if (typeof window !== "undefined" && window.localStorage) {
      // First try @token key
      const localToken = window.localStorage.getItem("@token");
      if (localToken) {
        console.log("🔐 Token found in localStorage @token");
        return localToken;
      }

      // Try getting from @user object
      const userStr = window.localStorage.getItem("@user");
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user.token) {
          console.log("🔐 Token found in @user object");
          return user.token;
        }
      }
    }

    console.warn("⚠️ No token found in any storage");
    return null;
  } catch (error) {
    console.error("❌ Error retrieving token:", error);
    return null;
  }
}
