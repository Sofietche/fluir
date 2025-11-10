import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AuthProvider } from './src/context/AuthContext';
import { TopicsProvider } from './src/context/TopicsContext';
import RootNavigator from './src/navigation/RootNavigator';

const NavigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#EEF1FF'
  }
};

const App: React.FC = () => {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <AuthProvider>
          <TopicsProvider>
            <NavigationContainer theme={NavigationTheme}>
              <StatusBar style="dark" />
              <RootNavigator />
            </NavigationContainer>
          </TopicsProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1
  }
});

export default App;
