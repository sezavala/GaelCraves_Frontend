require('dotenv/config');

export default ({ config }) => ({
  ...config,
  extra: {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '624682753251-1777mu4gr62ajtklkeod1j7hugvafjdb.apps.googleusercontent.com',
    API_BASE: process.env.API_BASE || 'https://gaelcraves-backend-256f85b120e2.herokuapp.com',
  },
});