import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";
import { makeRedirectUri } from "expo-auth-session";
import { Platform } from "react-native";
import { useAuth } from "@/auth/AuthContext";
import Constants from "expo-constants";
import { useRouter } from "expo-router";

WebBrowser.maybeCompleteAuthSession();

const extra =
  (Constants.expoConfig && Constants.expoConfig.extra) ||
  (Constants.manifest && Constants.manifest.extra) ||
  {};

const GOOGLE_WEB_CLIENT_ID = extra.GOOGLE_WEB_CLIENT_ID;
const GOOGLE_ANDROID_CLIENT_ID = extra.GOOGLE_ANDROID_CLIENT_ID;
const GOOGLE_IOS_CLIENT_ID = extra.GOOGLE_IOS_CLIENT_ID;
const API_BASE =
  extra.API_BASE || "https://gaelcraves-backend-256f85b120e2.herokuapp.com";

console.log("[googleAuth] GOOGLE_WEB_CLIENT_ID=", GOOGLE_WEB_CLIENT_ID);
console.log("[googleAuth] GOOGLE_ANDROID_CLIENT_ID=", GOOGLE_ANDROID_CLIENT_ID);
console.log("[googleAuth] GOOGLE_IOS_CLIENT_ID=", GOOGLE_IOS_CLIENT_ID);
console.log("[googleAuth] API_BASE=", API_BASE);

export const PROXY_REDIRECT_URI = makeRedirectUri({ useProxy: true } as any);
export const NON_PROXY_REDIRECT_URI = makeRedirectUri({
  useProxy: false,
} as any);

export function useGoogleLogin() {
  const { setUser } = useAuth();
  const router = useRouter();

  // Platform-specific redirect URIs
  let redirectUri: string;
  let useProxy = false;
  let responseType: string;

  if (Platform.OS === "web") {
    // Web: redirect to Heroku login page
    redirectUri =
      "https://gaelcraves-frontend-7a6e5c03f69a.herokuapp.com/login";
    useProxy = false;
    responseType = "id_token";
  } else if (Platform.OS === "android") {
    // Android: Use Heroku redirect endpoint (publicly accessible HTTPS)
    // The Heroku endpoint will handle the OAuth callback and redirect to the app
    redirectUri =
      "https://gaelcraves-frontend-7a6e5c03f69a.herokuapp.com/oauth/callback";
    useProxy = false;
    responseType = "code"; // Use code flow for Android
  } else {
    // iOS: Use authorization code flow
    redirectUri = makeRedirectUri({
      useProxy: true,
    } as any);
    useProxy = true;
    responseType = "code";
  }

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🔐 GOOGLE OAUTH CONFIGURATION");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📱 Platform:", Platform.OS);
  console.log("🔗 Redirect URI:", redirectUri);
  console.log("🌐 Use Proxy:", useProxy);
  console.log(
    "🔑 Web Client ID:",
    GOOGLE_WEB_CLIENT_ID ? "✅ Set" : "❌ Missing"
  );
  console.log(
    "🔑 Android Client ID:",
    GOOGLE_ANDROID_CLIENT_ID ? "✅ Set" : "❌ Missing"
  );
  console.log("📋 Response Type:", responseType);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  // CRITICAL: For Android to work with custom redirect URIs:
  // - We must provide androidClientId (library requires it)
  // - We must add BOTH URIs to Google Console Web Client:
  //   1. https://gaelcraves-frontend-7a6e5c03f69a.herokuapp.com/oauth/callback
  //   2. com.googleusercontent.apps.624682753251-iohflfcepqloe7vk8c2c6g1s25hre0cg:/oauth2redirect
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: GOOGLE_WEB_CLIENT_ID,
    androidClientId: GOOGLE_ANDROID_CLIENT_ID,
    iosClientId: GOOGLE_IOS_CLIENT_ID,
    redirectUri,
    responseType: responseType as any,
    usePKCE: Platform.OS !== "web",
    scopes: ["openid", "profile", "email"],
    extraParams: {
      access_type: "offline",
      prompt: "select_account",
    },
  });

  useEffect(() => {
    console.log("[googleAuth] effect fired. response=", response);

    // Handle successful authentication response from expo-auth-session
    if (response?.type === "success") {
      handleAuthResponse(response);
      return;
    }

    // For web platform, check URL on mount to handle OAuth redirect
    if (Platform.OS === "web" && typeof window !== "undefined") {
      handleWebOAuthRedirect();
    }
  }, [response]);

  const handleAuthResponse = async (authResponse: any) => {
    const params = authResponse.params as { code?: string; id_token?: string };
    const { code, id_token: idToken } = params;

    console.log(
      "[googleAuth] Got response - code:",
      !!code,
      "idToken:",
      !!idToken
    );

    if (idToken) {
      await processIdToken(idToken);
    } else if (code) {
      await processAuthCode(code);
    } else {
      console.warn(
        "[googleAuth] No authorization code or id_token in response",
        params
      );
    }
  };

  const handleWebOAuthRedirect = async () => {
    try {
      const url = new URL(window.location.href);
      const params = new URLSearchParams(url.search);

      // Google returns id_token in the hash fragment for implicit flow
      const hashParams = new URLSearchParams(
        url.hash.startsWith("#") ? url.hash.slice(1) : url.hash
      );

      const code = params.get("code");
      const idToken = params.get("id_token") || hashParams.get("id_token");

      console.log(
        "[googleAuth] Checking URL - code:",
        !!code,
        "idToken:",
        !!idToken
      );
      console.log("[googleAuth] Full hash:", url.hash);
      console.log("[googleAuth] Full search:", url.search);

      if (idToken) {
        console.log("[googleAuth] Found id_token in URL");
        await processIdToken(idToken);
        cleanUrlParameters();
      } else if (code) {
        console.log("[googleAuth] Found code in URL");
        await processAuthCode(code);
        cleanUrlParameters();
      } else {
        console.log("[googleAuth] No code or id_token in URL");
      }
    } catch (e) {
      console.error("[googleAuth] Error handling web redirect:", e);
    }
  };

  const processIdToken = async (idToken: string) => {
    try {
      console.log("[googleAuth] Processing id_token");

      // Decode JWT to extract user info
      const payload = idToken.split(".")[1];
      const decoded = JSON.parse(
        atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
      );

      const email = decoded.email || decoded.preferred_username || decoded.sub;
      const firstName = decoded.given_name || "";
      const lastName = decoded.family_name || "";

      console.log("[googleAuth] Decoded email:", email);

      if (!email) {
        console.error("[googleAuth] No email found in id_token");
        return;
      }

      // Send to backend for verification and user creation/lookup
      console.log("[googleAuth] Sending id_token to backend");
      const resp = await fetch(`${API_BASE}/api/v1/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idToken,
          email,
          firstName,
          lastName,
        }),
      });

      if (!resp.ok) {
        console.warn("[googleAuth] Backend verification failed:", resp.status);
        // Fallback: set user with basic info
        await setUser({
          email,
          firstName,
          lastName,
        });
        router.replace("/(tabs)");
        return;
      }

      const userData = await resp.json();
      console.log("[googleAuth] Backend returned:", userData);

      // Update auth context with complete user data
      await setUser({
        id: userData.userId || userData.id,
        email: userData.email || email,
        firstName: userData.firstName || firstName,
        lastName: userData.lastName || lastName,
        roles: userData.roles || [],
        token: userData.token,
      });

      // Store JWT token for API calls
      if (userData.token && typeof window !== "undefined") {
        window.localStorage.setItem("@token", userData.token);
      }

      console.log(
        "[googleAuth] User authenticated successfully, navigating to home"
      );
      router.replace("/(tabs)");
    } catch (e) {
      console.error("[googleAuth] Error processing id_token:", e);
    }
  };

  const processAuthCode = async (code: string) => {
    try {
      console.log("[googleAuth] Processing authorization code");

      const resp = await fetch(`${API_BASE}/api/v1/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, redirectUri }),
      });

      if (!resp.ok) {
        console.error(
          "[googleAuth] Backend code exchange failed:",
          resp.status
        );
        return;
      }

      const userData = await resp.json();
      console.log("[googleAuth] Backend returned:", userData);

      const email =
        userData.email ||
        userData.email_address ||
        userData.preferred_email ||
        userData.emailAddress;

      if (!email) {
        console.error("[googleAuth] No email in backend response");
        return;
      }

      await setUser({
        id: userData.userId || userData.id,
        email,
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        roles: userData.roles || [],
        token: userData.token,
      });

      if (userData.token && typeof window !== "undefined") {
        window.localStorage.setItem("@token", userData.token);
      }

      console.log(
        "[googleAuth] User authenticated successfully, navigating to home"
      );
      router.replace("/(tabs)");
    } catch (err) {
      console.error("[googleAuth] Error processing auth code:", err);
    }
  };

  const cleanUrlParameters = () => {
    if (typeof window === "undefined") return;

    try {
      const url = new URL(window.location.href);
      const params = new URLSearchParams(url.search);

      // Remove OAuth parameters
      params.delete("code");
      params.delete("scope");
      params.delete("authuser");
      params.delete("prompt");
      params.delete("state");
      params.delete("id_token");

      // Clear hash (where id_token is returned)
      const newSearch = params.toString();
      const newUrl =
        window.location.origin +
        window.location.pathname +
        (newSearch ? `?${newSearch}` : "");

      window.history.replaceState({}, document.title, newUrl);
      console.log("[googleAuth] URL cleaned");
    } catch (e) {
      console.error("[googleAuth] Error cleaning URL:", e);
    }
  };

  return { promptAsync, request, response };
}
