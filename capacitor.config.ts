import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.weather.app',
  appName: 'Weatherama',
  webDir: 'build',
  plugins: {
    "CapacitorHttp": {
      enabled: true
    }
  }
};

export default config;
