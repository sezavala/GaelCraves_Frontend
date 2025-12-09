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
  const useProxy = Platform.OS !== "web";

  // For web on Heroku, use the full URL with trailing slash
  const redirectUri =
    Platform.OS === "web"
      ? "https://gaelcraves-frontend-7a6e5c03f69a.herokuapp.com"
      : makeRedirectUri({ useProxy } as any);

  console.log(
    "[googleAuth] chosen redirectUri=",
    redirectUri,
    "useProxy=",
    useProxy
  );

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: GOOGLE_WEB_CLIENT_ID,
    androidClientId: GOOGLE_ANDROID_CLIENT_ID,
    iosClientId: GOOGLE_IOS_CLIENT_ID,
    redirectUri,
    responseType: "id_token" as any,
    usePKCE: false,
    scopes: ["openid", "profile", "email"],
    // Add these parameters to help with state management
    extraParams: {
      access_type: "offline",
      prompt: "select_account",
    },
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log("[googleAuth] effect fired. response=", response);
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
          const firstName = decoded.given_name || "";
          const lastName = decoded.family_name || "";

          if (emailFromId) {
            // Send id_token to backend to get or create user and receive JWT
            (async () => {
              try {
                console.log(
                  "[googleAuth] Sending id_token to backend for verification"
                );
                const resp = await fetch(`${API_BASE}/api/v1/auth/google`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    idToken,
                    email: emailFromId,
                    firstName,
                    lastName,
                  }),
                });

                if (!resp.ok) {
                  console.warn("Backend Google auth failed", resp.status);
                  // Fallback to minimal user data
                  setUser({
                    email: emailFromId,
                    firstName,
                    lastName,
                  });
                  router.replace("/");
                  return;
                }

                const userData = await resp.json();
                console.log(
                  "[googleAuth] Received user data from backend:",
                  userData
                );

                // Store complete user data with token
                setUser({
                  id: userData.userId || userData.id,
                  email: userData.email || emailFromId,
                  firstName: userData.firstName || firstName,
                  lastName: userData.lastName || lastName,
                  roles: userData.roles || [],
                  token: userData.token,
                });

                // Store token separately for API calls
                if (userData.token && typeof window !== "undefined") {
                  window.localStorage.setItem("@token", userData.token);
                }

                router.replace("/");
              } catch (e) {
                console.warn("Failed to verify with backend", e);
                // Fallback to minimal user data
                setUser({
                  email: emailFromId,
                  firstName,
                  lastName,
                });
                router.replace("/");
              }
            })();
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
            const userData = await resp.json();
            console.log(
              "[googleAuth] Received user data from backend (code exchange):",
              userData
            );

            // Store complete user data with token
            const email =
              userData.email ||
              userData.email_address ||
              userData.preferred_email ||
              userData.emailAddress;

            if (email) {
              setUser({
                id: userData.userId || userData.id,
                email: email,
                firstName: userData.firstName || "",
                lastName: userData.lastName || "",
                roles: userData.roles || [],
                token: userData.token,
              });

              // Store token separately for API calls
              if (userData.token && typeof window !== "undefined") {
                window.localStorage.setItem("@token", userData.token);
              }

              // Navigate to home without reloading
              try {
                router.replace("/");
              } catch {}
            } else {
              console.warn("No email in profile returned by backend", userData);
              console.log("backend profile raw:", userData);
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
        const hashParams = new URLSearchParams(
          url.hash.startsWith("#") ? url.hash.slice(1) : url.hash
        );
        const codeFromUrl = params.get("code");
        const idTokenFromUrl =
          params.get("id_token") || hashParams.get("id_token");

        if (idTokenFromUrl && !codeFromUrl) {
          console.log("[googleAuth] found id_token in URL hash");
          try {
            const payload = idTokenFromUrl.split(".")[1];
            const decoded = JSON.parse(
              atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
            );
            const emailFromId =
              decoded.email || decoded.preferred_username || decoded.sub;
            const firstName = decoded.given_name || "";
            const lastName = decoded.family_name || "";

            if (emailFromId) {
              // Send id_token to backend to get or create user and receive JWT
              (async () => {
                try {
                  console.log(
                    "[googleAuth] Sending id_token to backend for verification (URL path)"
                  );
                  const resp = await fetch(`${API_BASE}/api/v1/auth/google`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      idToken: idTokenFromUrl,
                      email: emailFromId,
                      firstName,
                      lastName,
                    }),
                  });

                  if (!resp.ok) {
                    console.warn("Backend Google auth failed", resp.status);
                    setUser({
                      email: emailFromId,
                      firstName,
                      lastName,
                    });
                    router.replace("/");
                    return;
                  }

                  const userData = await resp.json();
                  console.log(
                    "[googleAuth] Received user data from backend (URL path):",
                    userData
                  );

                  setUser({
                    id: userData.userId || userData.id,
                    email: userData.email || emailFromId,
                    firstName: userData.firstName || firstName,
                    lastName: userData.lastName || lastName,
                    roles: userData.roles || [],
                    token: userData.token,
                  });

                  if (userData.token && typeof window !== "undefined") {
                    window.localStorage.setItem("@token", userData.token);
                  }

                  router.replace("/");
                } catch (e) {
                  console.warn("Failed to verify with backend (URL path)", e);
                  setUser({
                    email: emailFromId,
                    firstName,
                    lastName,
                  });
                  router.replace("/");
                }
              })();
              return;
            }
          } catch (e) {
            console.warn("[googleAuth] failed to decode id_token from URL", e);
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
              const userData = await resp.json();
              console.log(
                "[googleAuth] Received user data from backend (URL code path):",
                userData
              );

              const email =
                userData.email ||
                userData.email_address ||
                userData.preferred_email;

              if (email) {
                setUser({
                  id: userData.userId || userData.id,
                  email: email,
                  firstName: userData.firstName || "",
                  lastName: userData.lastName || "",
                  roles: userData.roles || [],
                  token: userData.token,
                });

                if (userData.token && typeof window !== "undefined") {
                  window.localStorage.setItem("@token", userData.token);
                }

                try {
                  router.replace("/");
                } catch {}
              } else {
                console.warn(
                  "No email in profile returned by backend",
                  userData
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
          console.log("[googleAuth] no code/id_token in URL to process");
        }
      } catch (e) {
        // ignore parsing errors
      }
    }
  }, [response]);

  return { promptAsync, request, response };
}
