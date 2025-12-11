import { makeRedirectUri } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { Platform, Alert } from "react-native";
import Constants from "expo-constants";
import { useAuth } from "@/auth/AuthContext";
import { useRouter } from "expo-router";
import { API_BASE_URL } from "@/config/environment";
import type { AuthResponse, User } from "@/services/authService";

const extra =
  (Constants.expoConfig && Constants.expoConfig.extra) ||
  (Constants.manifest && Constants.manifest.extra) ||
  {};

// Public GitHub OAuth client ID for mobile/native flow
const GITHUB_MOBILE_CLIENT_ID = (extra as any).GITHUB_MOBILE_CLIENT_ID || (extra as any).GITHUB_CLIENT_ID;

export async function loginWithGithubNative(): Promise<AuthResponse> {
  if (Platform.OS === "web") {
    return {
      success: false,
      message: "GitHub native login is only for iOS/Android.",
    };
  }

  if (!GITHUB_MOBILE_CLIENT_ID) {
    console.warn("[githubAuth] Missing GITHUB_MOBILE_CLIENT_ID in app.config extra");
    return {
      success: false,
      message: "GitHub mobile client ID not configured.",
    };
  }

  // Use Expo AuthSession to start the GitHub OAuth flow
  const redirectUri = makeRedirectUri({
    useProxy: true,
  } as any);

  const authUrl =
    "https://github.com/login/oauth/authorize" +
    `?client_id=${encodeURIComponent(GITHUB_MOBILE_CLIENT_ID)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    "&scope=" + encodeURIComponent("read:user user:email");

  try {
    const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

    if (result.type !== "success" || !result.url) {
      console.warn("[githubAuth] GitHub login cancelled or failed", result);
      return {
        success: false,
        message: "GitHub login was cancelled or failed.",
      };
    }

    const url = new URL(result.url);
    const code = url.searchParams.get("code");

    if (!code) {
      console.warn("[githubAuth] No authorization code found in redirect URL", result.url);
      return {
        success: false,
        message: "GitHub did not return an authorization code.",
      };
    }

    // Exchange the authorization code for a user session via backend
    const resp = await fetch(`${API_BASE_URL}/v1/auth/github/mobile`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, redirectUri }),
    });

    if (!resp.ok) {
      const text = await resp.text();
      console.error("[githubAuth] Backend /github/mobile failed", resp.status, text);
      return {
        success: false,
        message: "GitHub login failed on server.",
      };
    }

    const data = await resp.json();

    const user: User = {
      id: (data.id ?? data.userId ?? "").toString(),
      email: data.email || "",
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      roles: Array.isArray(data.roles) ? data.roles : [],
      token: data.token,
    };

    return {
      success: true,
      message: "Logged in with GitHub.",
      user,
    };
  } catch (e: any) {
    console.error("[githubAuth] Error during GitHub native login", e);
    return {
      success: false,
      message: e?.message || "GitHub login failed.",
    };
  }
}

export function useGithubLogin() {
  const { setUser } = useAuth();
  const router = useRouter();

  const promptAsync = async () => {
    const result = await loginWithGithubNative();

    if (result.success && result.user) {
      await setUser(result.user);
      router.replace("/(tabs)");
      Alert.alert("Success", result.message);
    } else {
      Alert.alert("GitHub Login", result.message);
    }
  };

  // We don't use a formal AuthRequest object here, just expose a truthy value
  const request = { available: true } as const;

  return { request, promptAsync };
}
