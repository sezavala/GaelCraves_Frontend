require('dotenv/config');

export default ({ config }) => ({
  ...config,
  extra: {
    // Google OAuth Client IDs
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_WEB_CLIENT_ID,
    GOOGLE_WEB_CLIENT_ID: process.env.GOOGLE_WEB_CLIENT_ID || process.env.GOOGLE_CLIENT_ID,
    GOOGLE_ANDROID_CLIENT_ID: process.env.GOOGLE_ANDROID_CLIENT_ID,
    GOOGLE_IOS_CLIENT_ID: process.env.GOOGLE_IOS_CLIENT_ID,
    
    // GitHub OAuth Client IDs
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_MOBILE_CLIENT_ID: process.env.GITHUB_MOBILE_CLIENT_ID || process.env.GITHUB_CLIENT_ID,

    // API Configuration
    API_BASE: process.env.API_BASE || 'https://gaelcraves-backend-256f85b120e2.herokuapp.com',
    
    // Environment
    NODE_ENV: process.env.NODE_ENV || 'development',
  },
});