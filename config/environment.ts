/**
 * Environment Configuration
 * Centralized configuration for different environments
 */

import { Platform } from 'react-native';

const getDevApiUrl = () => {
  // For Android emulator: 10.0.2.2 maps to host's localhost
  // For iOS simulator: localhost works fine
  // For physical devices: use your computer's IP (192.168.1.245)
  
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8080/api';
  } else if (Platform.OS === 'ios') {
    return 'http://localhost:8080/api';
  } else {
    // Web
    return 'http://localhost:8080/api';
  }
};

const ENV = {
  development: {
    API_BASE_URL: getDevApiUrl(),
    ENABLE_LOGGING: true,
  },
  production: {
    API_BASE_URL: "https://api.gaelcraves.com/api", // Update with your production URL
    ENABLE_LOGGING: false,
  },
};

// Determine current environment
const isDevelopment = __DEV__;
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
