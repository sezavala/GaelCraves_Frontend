require('dotenv/config');

export default ({ config }) => ({
  ...config,
  extra: {
    // Fallback single client ID (legacy)
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    // Platform-specific IDs (preferred)
    GOOGLE_WEB_CLIENT_ID: process.env.GOOGLE_WEB_CLIENT_ID,
    GOOGLE_ANDROID_CLIENT_ID: process.env.GOOGLE_ANDROID_CLIENT_ID,
    GOOGLE_IOS_CLIENT_ID: process.env.GOOGLE_IOS_CLIENT_ID,
    API_BASE: process.env.API_BASE || 'http://localhost:8080',
  },
});