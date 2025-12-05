require('dotenv/config');

export default ({ config }) => ({
  ...config,
  extra: {
    // Support platform-specific Google OAuth client IDs from .env
    GOOGLE_WEB_CLIENT_ID: process.env.GOOGLE_WEB_CLIENT_ID,
    GOOGLE_ANDROID_CLIENT_ID: process.env.GOOGLE_ANDROID_CLIENT_ID,
    GOOGLE_IOS_CLIENT_ID: process.env.GOOGLE_IOS_CLIENT_ID,
    API_BASE: process.env.API_BASE || 'http://localhost:8080',
  },
});