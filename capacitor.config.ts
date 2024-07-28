import type { CapacitorConfig } from '@capacitor/cli';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'HealthPlanner',
  webDir: 'www',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    GoogleAuth: {
      scopes: ['email', 'profile'],
      clientId: '462475561023-k3e62u4k4qf5dia7tbhsevd8rnvp3ece.apps.googleusercontent.com',
      androidClientId: '462475561023-k3e62u4k4qf5dia7tbhsevd8rnvp3ece.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
    }
  },
};

export default config;
