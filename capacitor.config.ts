import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.github.miguelsaliba.completionist',
  appName: 'completionist',
  webDir: 'dist',
  android: {
    // Fixes issue with android stopping location access after 5 minutes
    // See https://github.com/ionic-team/capacitor/issues/6234#issuecomment-1522947722
    useLegacyBridge: true,
  },
};

export default config;
