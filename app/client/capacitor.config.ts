import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ionic.fitbitapplehealth',
  appName: 'client',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
