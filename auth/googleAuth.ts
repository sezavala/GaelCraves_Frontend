import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";
import { makeRedirectUri } from "expo-auth-session";
import { Platform } from "react-native";
import { useAuth } from "@/auth/AuthContext";
import Constants from "expo-constants";
import { useRouter } from "expo-router";

// Required for web: completes the auth redirect flow and resolves the response
WebBrowser.maybeCompleteAuthSession();

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
  const router = useRouter();
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
    // Use OIDC id_token on web to avoid client_secret exchange
    responseType: "id_token" as any,
    usePKCE: false,
    scopes: ["openid", "profile", "email"],
  });

  useEffect(() => {
    // Debug: show raw response object states
    if (typeof window !== 'undefined') {
      console.log('[googleAuth] effect fired. response=', response);
    }

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
            // SPA navigation so state persists and Logout shows
            try {
              router.replace("/");
            } catch {}
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
              // Navigate to home without reloading
              try {
                router.replace("/");
              } catch {}
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

    // Secondary path (web): if redirected back but no `response`, parse current URL
    if (Platform.OS === "web" && !response) {
      try {
        const url = new URL(window.location.href);
        const params = new URLSearchParams(url.search);
        const hashParams = new URLSearchParams(url.hash.startsWith('#') ? url.hash.slice(1) : url.hash);
        const codeFromUrl = params.get("code");
        const idTokenFromUrl = params.get("id_token") || hashParams.get("id_token");

        if (idTokenFromUrl && !codeFromUrl) {
          console.log('[googleAuth] found id_token in URL hash');
          try {
            const payload = idTokenFromUrl.split(".")[1];
            const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
            const emailFromId = decoded.email || decoded.preferred_username || decoded.sub;
            if (emailFromId) {
              setUser({ email: emailFromId });
              try { router.replace("/"); } catch {}
              return;
            }
          } catch (e) {
            console.warn('[googleAuth] failed to decode id_token from URL', e);
          }
        }

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
                try {
                  router.replace("/");
                } catch {}
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
        } else {
          console.log('[googleAuth] no code/id_token in URL to process');
        }
      } catch (e) {
        // ignore parsing errors
      }
    }
  }, [response]);

  return { promptAsync, request, response };
}
