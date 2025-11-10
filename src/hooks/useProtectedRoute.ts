import { NavigationProp } from '@react-navigation/native';
import { useEffect } from 'react';

import { useAuth } from '../context/AuthContext';
import { RootStackParamList } from '../navigation/types';

export const useProtectedRoute = (navigation: NavigationProp<RootStackParamList>) => {
  const auth = useAuth();

  useEffect(() => {
    if (auth.status === 'unauthenticated') {
      navigation.reset({ index: 0, routes: [{ name: 'auth' }] });
    }
  }, [auth.status, navigation]);

  return auth;
};
