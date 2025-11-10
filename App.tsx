import 'react-native-gesture-handler';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { onAuthStateChanged, User } from 'firebase/auth';

import AuthScreen from './src/screens/AuthScreen';
import HomeScreen from './src/screens/HomeScreen';
import TopicScreen from './src/screens/TopicScreen';
import { auth } from './src/firebase/firebaseConfig';
import { RootStackParamList } from './src/navigation/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const NavigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#EEF1FF'
  }
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsInitializing(false);
    });

    return unsubscribe;
  }, []);

  const initialRouteName = useMemo(() => (user ? 'home' : 'auth'), [user]);

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <NavigationContainer theme={NavigationTheme}>
          <StatusBar style="dark" />
          {isInitializing ? (
            <View style={styles.loader}>
              <ActivityIndicator size="large" color="#312E81" />
            </View>
          ) : (
            <Stack.Navigator
              initialRouteName={initialRouteName}
              screenOptions={{
                headerShown: false
              }}
            >
              {user ? (
                <>
                  <Stack.Screen name="home">
                    {({ navigation }) => <HomeScreen user={user} navigation={navigation} />}
                  </Stack.Screen>
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
          )}
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF1FF'
  }
});

export default App;
