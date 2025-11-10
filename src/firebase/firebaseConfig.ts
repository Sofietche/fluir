import Constants from 'expo-constants';
import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

type FirebaseExtraConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
};

type ExtraConfig = {
  firebase?: FirebaseExtraConfig;
};

const resolveExtra = (): ExtraConfig => {
  const expoExtra = (Constants.expoConfig?.extra ??
    (Constants.manifest2 as { extra?: ExtraConfig } | null | undefined)?.extra ??
    (Constants.manifest as { extra?: ExtraConfig } | null | undefined)?.extra) as ExtraConfig | undefined;

  return expoExtra ?? {};
};

const extra = resolveExtra();

if (!extra.firebase) {
  throw new Error('Firebase configuration is missing. Verify your environment variables in .env.');
}

const firebaseConfig = extra.firebase;

let app: FirebaseApp;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

export const firebaseApp = app;
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
