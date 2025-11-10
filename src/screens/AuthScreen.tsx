import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import Constants from 'expo-constants';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';

import PrimaryButton from '../components/PrimaryButton';
import TexturedBackground, { TextureShape } from '../components/TexturedBackground';
import { auth, db } from '../firebase/firebaseConfig';

WebBrowser.maybeCompleteAuthSession();

type GoogleExtraConfig = {
  expoClientId?: string;
  iosClientId?: string;
  androidClientId?: string;
  webClientId?: string;
};

const resolveGoogleConfig = (): GoogleExtraConfig => {
  const extra = (Constants.expoConfig?.extra ??
    (Constants.manifest2 as { extra?: { google?: GoogleExtraConfig } } | null | undefined)?.extra ??
    (Constants.manifest as { extra?: { google?: GoogleExtraConfig } } | null | undefined)?.extra) as
    | { google?: GoogleExtraConfig }
    | undefined;

  return extra?.google ?? {};
};

const backgroundShapes: TextureShape[] = [
  { top: -120, right: -60, width: 260, height: 260, opacity: 0.12, rotate: '24deg' },
  { bottom: -140, left: -80, width: 280, height: 280, opacity: 0.08, rotate: '-18deg' },
  { top: 180, left: -40, width: 160, height: 160, opacity: 0.1, rotate: '16deg' }
];

const AuthScreen: React.FC = () => {
  const googleConfig = useMemo(resolveGoogleConfig, []);
  const [request, , promptAsync] = Google.useAuthRequest({
    expoClientId: googleConfig.expoClientId,
    iosClientId: googleConfig.iosClientId,
    androidClientId: googleConfig.androidClientId,
    webClientId: googleConfig.webClientId,
    scopes: ['profile', 'email']
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isConfigured = useMemo(
    () => Boolean(googleConfig.expoClientId || googleConfig.iosClientId || googleConfig.androidClientId || googleConfig.webClientId),
    [googleConfig]
  );

  const handleGoogleSignIn = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const result = await promptAsync({ useProxy: true });

      if (result.type !== 'success' || !result.authentication) {
        if (result.type === 'error') {
          setError('No se pudo completar la autenticación con Google.');
        }
        return;
      }

      const { idToken, accessToken } = result.authentication;
      if (!idToken) {
        throw new Error('Google no envió el idToken necesario para autenticarte.');
      }

      const credential = GoogleAuthProvider.credential(idToken, accessToken);
      const { user } = await signInWithCredential(auth, credential);

      await setDoc(
        doc(db, 'users', user.uid),
        {
          uid: user.uid,
          displayName: user.displayName ?? '',
          email: user.email ?? '',
          photoURL: user.photoURL ?? '',
          lastLoginAt: serverTimestamp()
        },
        { merge: true }
      );
    } catch (authError) {
      console.error(authError);
      setError('Ocurrió un problema al iniciar sesión. Inténtalo nuevamente.');
    } finally {
      setIsLoading(false);
    }
  }, [promptAsync]);

  return (
    <View style={styles.container}>
      <TexturedBackground shapes={backgroundShapes} />
      <Text style={styles.title}>Fluir</Text>
      <Text style={styles.subtitle}>Inicia sesión para continuar.</Text>
      <PrimaryButton
        label="Continuar con Google"
        onPress={handleGoogleSignIn}
        loading={isLoading}
        disabled={!request || isLoading || !isConfigured}
        size="large"
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      {!isConfigured ? (
        <Text style={styles.helperText}>
          Configura las credenciales de Google en tu archivo .env para habilitar el inicio de sesión.
        </Text>
      ) : null}
      {!request && !isConfigured ? <ActivityIndicator style={styles.indicator} color="#312E81" /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    backgroundColor: '#f4f3ff',
    position: 'relative'
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    marginBottom: 12
  },
  subtitle: {
    fontSize: 16,
    color: '#4a4a4a',
    marginBottom: 32,
    textAlign: 'center'
  },
  errorText: {
    color: '#d93025',
    marginTop: 16,
    textAlign: 'center'
  },
  helperText: {
    marginTop: 12,
    fontSize: 12,
    color: '#666',
    textAlign: 'center'
  },
  indicator: {
    marginTop: 16
  }
});

export default AuthScreen;
