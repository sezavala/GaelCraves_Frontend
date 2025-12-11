/**
 * Environment Configuration
 * Centralized configuration for different environments
 */

import { Platform } from "react-native";
import Constants from "expo-constants";

const getDevApiUrl = () => {
  // For Android emulator: 10.0.2.2 maps to host's localhost
  // For iOS simulator & web: localhost works fine
  if (Platform.OS === "android") {
    return "http://10.0.2.2:8080/api";
  }
  return "http://localhost:8080/api";
};

// Read from Expo extra if provided (e.g. app.config.js / app.json)
const extraApiBase = Constants.expoConfig?.extra?.API_BASE as
  | string
  | undefined;

// Force production mode setting - set to true to always use Heroku backend
const FORCE_PRODUCTION = true;

const ENV = {
  development: {
    API_BASE_URL: getDevApiUrl(),
    ENABLE_LOGGING: true,
  },
  production: {
    // Prefer value passed through Expo extra / env (Heroku)
    // If extraApiBase doesn't have /api, append it
    API_BASE_URL: extraApiBase
      ? extraApiBase.endsWith("/api")
        ? extraApiBase
        : `${extraApiBase}/api`
      : "https://gaelcraves-backend-256f85b120e2.herokuapp.com/api",
    ENABLE_LOGGING: true, // Keep logging enabled in production for debugging
  },
} as const;

// Determine current environment
// Force production mode if FORCE_PRODUCTION is true, otherwise use __DEV__
const isDevelopment = FORCE_PRODUCTION ? false : __DEV__;
const currentEnv = isDevelopment ? "development" : "production";

export const API_BASE_URL = ENV[currentEnv].API_BASE_URL;
export const ENABLE_LOGGING = ENV[currentEnv].ENABLE_LOGGING;

// Log the API URL on startup for debugging
console.log(`🌐 Environment: ${currentEnv}`);
console.log(`📡 API Base URL: ${API_BASE_URL}`);
console.log(`📱 Platform: ${Platform.OS}`);

/**
 * Conditional logging utility
 * Only logs in development mode
 */
export const devLog = (...args: any[]) => {
  if (ENABLE_LOGGING) {
    console.log(...args);
  }
};

export const devError = (...args: any[]) => {
  if (ENABLE_LOGGING) {
    console.error(...args);
  }
};
