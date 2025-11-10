import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import FullScreenLoader from '../components/FullScreenLoader';
import { useAuth } from '../context/AuthContext';
import AuthScreen from '../screens/AuthScreen';
import HomeScreen from '../screens/HomeScreen';
import TopicScreen from '../screens/TopicScreen';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  const { status } = useAuth();

  if (status === 'loading') {
    return <FullScreenLoader message="Preparando tu sesión…" />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      {status === 'authenticated' ? (
        <>
          <Stack.Screen name="home" component={HomeScreen} />
          <Stack.Screen
            name="topic"
            component={TopicScreen}
            options={{
              animation: 'slide_from_right'
            }}
          />
        </>
      ) : (
        <Stack.Screen name="auth" component={AuthScreen} />
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
