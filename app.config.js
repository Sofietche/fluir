import 'dotenv/config';

export default ({ config }) => ({
  ...config,
  name: config.name ?? 'fluir',
  slug: config.slug ?? 'fluir',
  version: config.version ?? '1.0.0',
  orientation: config.orientation ?? 'portrait',
  userInterfaceStyle: config.userInterfaceStyle ?? 'automatic',
  splash: {
    ...(config.splash ?? {}),
    backgroundColor: config.splash?.backgroundColor ?? '#EEF1FF'
  },
  ios: {
    ...(config.ios ?? {}),
    supportsTablet: true
  },
  android: {
    ...(config.android ?? {})
  },
  plugins: Array.from(new Set([...(config.plugins ?? []), 'react-native-reanimated'])),
  extra: {
    ...(config.extra ?? {}),
    firebase: {
      apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? '',
      authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '',
      projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? '',
      storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ?? '',
      messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '',
      appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID ?? '',
      measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID ?? ''
    },
    google: {
      expoClientId: process.env.EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID ?? '',
      iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ?? '',
      androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID ?? '',
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? ''
    }
  }
});
