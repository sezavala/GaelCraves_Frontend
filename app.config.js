require('dotenv/config');

export default ({ config }) => ({
  ...config,
  extra: {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    API_BASE: process.env.API_BASE || 'http://localhost:8080',
  },
});