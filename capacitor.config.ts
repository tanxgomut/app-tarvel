import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'oneionic',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    "GoogleAuth": {
      "scopes": ["profile", "email"],
      "serverClientId": "337656762520-hcscbcjcnk4u8f313ie57ion21hlu735.apps.googleusercontent.com",
      "forceCodeForRefreshToken": true
    }
  }
};

export default config;
