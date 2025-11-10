import React, { useMemo } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { User, signOut } from 'firebase/auth';

import { auth } from '../firebase/firebaseConfig';

type HomeScreenProps = {
  user: User;
};

type ExperienceCard = {
  id: string;
  title: string;
  description: string;
};

const experiences: ExperienceCard[] = [
  { id: '1', title: 'Bienvenida', description: 'Desliza para explorar la app.' },
  { id: '2', title: 'Explora', description: 'Encuentra experiencias significativas.' },
  { id: '3', title: 'Conecta', description: 'Comparte momentos con la comunidad.' }
];

const HomeScreen: React.FC<HomeScreenProps> = ({ user }) => {
  const initials = useMemo(() => {
    if (!user.displayName) {
      return user.email?.charAt(0).toUpperCase() ?? '?';
    }
    return user.displayName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((segment) => segment.charAt(0).toUpperCase())
      .join('');
  }, [user.displayName, user.email]);

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          {user.photoURL ? (
            <Image source={{ uri: user.photoURL }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarFallbackText}>{initials}</Text>
            </View>
          )}
          <View>
            <Text style={styles.greeting}>Hola,</Text>
            <Text style={styles.userName}>{user.displayName ?? user.email ?? 'Usuario'}</Text>
          </View>
        </View>
        <TouchableOpacity
          accessibilityRole="button"
          style={styles.signOutButton}
          onPress={() => signOut(auth)}
        >
          <Text style={styles.signOutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
      <Swiper
        cards={experiences}
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
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingVertical: 48,
    backgroundColor: '#f4f3ff'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 24
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12
  },
  avatarFallback: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#D6BCFA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  avatarFallbackText: {
    color: '#5B21B6',
    fontSize: 18,
    fontWeight: '700'
  },
  greeting: {
    fontSize: 16,
    color: '#4B5563'
  },
  userName: {
    fontSize: 20,
    fontWeight: '700'
  },
  signOutButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#312E81'
  },
  signOutText: {
    color: '#fff',
    fontWeight: '600'
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
    elevation: 6,
    marginHorizontal: 24
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

export default HomeScreen;
