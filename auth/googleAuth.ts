import * as Google from "expo-auth-session/providers/google";
import { useEffect } from "react";
import { makeRedirectUri } from "expo-auth-session";
import { Platform } from "react-native";
import { useAuth } from "@/auth/AuthContext";
import Constants from "expo-constants";

const extra = (Constants.expoConfig && Constants.expoConfig.extra) || (Constants.manifest && Constants.manifest.extra) || {};
// Only use platform-specific IDs from app.config.js -> .env
const GOOGLE_WEB_CLIENT_ID = extra.GOOGLE_WEB_CLIENT_ID;
const GOOGLE_ANDROID_CLIENT_ID = extra.GOOGLE_ANDROID_CLIENT_ID;
const GOOGLE_IOS_CLIENT_ID = extra.GOOGLE_IOS_CLIENT_ID;
const API_BASE = extra.API_BASE || 'http://localhost:8080';


export const PROXY_REDIRECT_URI = makeRedirectUri({ useProxy: true } as any);
export const NON_PROXY_REDIRECT_URI = makeRedirectUri({
  useProxy: false,
} as any);

export function useGoogleLogin() {
  const { setUser } = useAuth();
  // Use the Expo proxy for native (Expo Go) and a non-proxy redirect for web.
  const useProxy = Platform.OS !== 'web';

  const redirectUri = makeRedirectUri({ useProxy } as any);

  console.log('[googleAuth] chosen redirectUri=', redirectUri, 'useProxy=', useProxy);

  const [request, response, promptAsync] = Google.useAuthRequest({
    // Provide platform-specific IDs; web requires webClientId specifically
    webClientId: GOOGLE_WEB_CLIENT_ID,
    androidClientId: GOOGLE_ANDROID_CLIENT_ID,
    iosClientId: GOOGLE_IOS_CLIENT_ID,
    redirectUri,
    responseType: "code",
    scopes: ["openid", "profile", "email"],
  });

  useEffect(() => {
    // Primary path: expo-auth-session provided a response object
    if (response?.type === "success") {
      const params = response.params as { code?: string; id_token?: string };
      const { code } = params;
      const idToken = params.id_token;
      // If we got an id_token (some flows/platforms), decode it to get email
      if (idToken) {
        try {
          const payload = idToken.split(".")[1];
          const decoded = JSON.parse(
            atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
          );
          const emailFromId =
            decoded.email || decoded.preferred_username || decoded.sub;
          if (emailFromId) {
            try {
              setUser({ email: emailFromId });
            } catch (e) {
              console.warn("setUser failed", e);
            }
            if (Platform.OS === "web") {
              window.localStorage.setItem(
                "@user",
                JSON.stringify({ email: emailFromId })
              );
              window.location.href = "http://localhost:8081/";
            }
            return; // done
          }
        } catch (e) {
          console.warn("Failed to decode id_token", e);
        }
      }
      if (code) {
        // Send the authorization code and redirectUri to your backend so it
        // can exchange the code for tokens using the client secret.
        (async () => {
          try {
            const resp = await fetch(`${API_BASE}/api/v1/auth/google`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ code, redirectUri }),
            });
            if (!resp.ok) {
              console.warn("Backend exchange failed", resp.status);
              return;
            }
            const profile = await resp.json();
            // Expect at least an email in the returned profile from backend
            const email =
              profile.email ||
              profile.email_address ||
              profile.preferred_email ||
              profile.emailAddress;
            if (email) {
              setUser({ email });
              if (Platform.OS === "web") {
                // Redirect to requested URL on web after login
                window.location.href = "http://localhost:8081/";
              }
            } else {
              console.warn("No email in profile returned by backend", profile);
              console.log("backend profile raw:", profile);
            }
          } catch (err) {
            console.warn("Failed to send code to backend", err);
          }
        })();
      } else {
        console.warn(
          "No authorization code returned by Google",
          response.params
        );
      }
    }

    // Secondary path (web): if the browser was redirected back with a ?code= in the URL
    // but expo-auth-session didn't populate `response`, parse the URL and handle it.
    if (Platform.OS === "web" && !response) {
      try {
        const params = new URLSearchParams(window.location.search);
        const codeFromUrl = params.get("code");
        if (codeFromUrl) {
          console.log("[googleAuth] found code in URL -> processing");
          (async () => {
            try {
              const resp = await fetch(`${API_BASE}/api/v1/auth/google`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: codeFromUrl, redirectUri }),
              });
              if (!resp.ok) {
                console.warn("Backend exchange failed", resp.status);
                return;
              }
              const profile = await resp.json();
              const email =
                profile.email ||
                profile.email_address ||
                profile.preferred_email;
              if (email) {
                setUser({ email });
              } else {
                console.warn(
                  "No email in profile returned by backend",
                  profile
                );
              }

              // Clean the URL to remove the code and other oauth params
              params.delete("code");
              params.delete("scope");
              params.delete("authuser");
              params.delete("prompt");
              const newSearch = params.toString();
              const newUrl =
                window.location.origin +
                window.location.pathname +
                (newSearch ? `?${newSearch}` : "");
              window.history.replaceState({}, document.title, newUrl);
            } catch (err) {
              console.warn("Failed to send code to backend (url path)", err);
            }
          })();
        }
      } catch (e) {
        // ignore parsing errors
      }
    }
  }, [response]);

  return { promptAsync, request, response };
}
