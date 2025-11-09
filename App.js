import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet, View, Text } from 'react-native';
import Swiper from 'react-native-deck-swiper';

const Stack = createNativeStackNavigator();

const cards = [
  { id: '1', title: 'Bienvenida', description: 'Desliza para explorar la app.' },
  { id: '2', title: 'Explora', description: 'Encuentra experiencias significativas.' },
  { id: '3', title: 'Conecta', description: 'Comparte momentos con la comunidad.' }
];

function HomeScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.heading}>Fluir</Text>
      <Swiper
        cards={cards}
        keyExtractor={(card) => card.id}
        renderCard={(card) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{card.title}</Text>
            <Text style={styles.cardDescription}>{card.description}</Text>
          </View>
        )}
        backgroundColor="transparent"
        stackSize={3}
        cardVerticalMargin={24}
        animateCardOpacity
      />
    </View>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <NavigationContainer theme={NavigationTheme}>
          <StatusBar style="auto" />
          <Stack.Navigator>
            <Stack.Screen
              name="home"
              component={HomeScreen}
              options={{ title: 'Inicio' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const NavigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#f4f3ff'
  }
};

const styles = StyleSheet.create({
  root: {
    flex: 1
  },
  screen: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 48
  },
  heading: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 32
  },
  card: {
    flex: 0.75,
    borderRadius: 24,
    padding: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 12
  },
  cardDescription: {
    fontSize: 16,
    textAlign: 'center',
    color: '#444'
  }
});
