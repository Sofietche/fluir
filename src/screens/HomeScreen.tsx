import React, { useMemo } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { User, signOut } from 'firebase/auth';

import { auth } from '../firebase/firebaseConfig';
import { RootStackParamList } from '../navigation/types';

type HomeScreenProps = {
  user: User;
  navigation: NativeStackNavigationProp<RootStackParamList, 'home'>;
};

type TopicCard = {
  id: string;
  title: string;
  description: string;
  gradient: [string, string];
  accentColor: string;
};

type NoiseBlob = {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
  width: number;
  height: number;
  opacity: number;
  rotate: string;
};

const noiseBlobs: NoiseBlob[] = [
  { top: -36, left: -48, width: 160, height: 160, opacity: 0.18, rotate: '-18deg' },
  { top: -24, right: -28, width: 140, height: 140, opacity: 0.12, rotate: '22deg' },
  { bottom: -32, left: 12, width: 180, height: 180, opacity: 0.14, rotate: '-12deg' },
  { bottom: -42, right: -36, width: 150, height: 150, opacity: 0.1, rotate: '16deg' }
];

const topics: TopicCard[] = [
  {
    id: 'orange',
    title: 'Vitalidad',
    description: 'Activa tu energía creativa con prácticas dinámicas.',
    gradient: ['#FF9A5A', '#FF6B4A'],
    accentColor: '#FF7A3C'
  },
  {
    id: 'fuchsia',
    title: 'Intuición',
    description: 'Explora visualizaciones para profundizar tu voz interior.',
    gradient: ['#FF6FD8', '#C855F4'],
    accentColor: '#FF5BCF'
  },
  {
    id: 'red',
    title: 'Presencia',
    description: 'Respira lento y conecta con el pulso del momento.',
    gradient: ['#FF6B6B', '#C81D25'],
    accentColor: '#F94F5C'
  },
  {
    id: 'blue',
    title: 'Calma',
    description: 'Sumérgete en paisajes sonoros relajantes y fluidos.',
    gradient: ['#60A5FA', '#1E40AF'],
    accentColor: '#3B82F6'
  }
];

const HomeScreen: React.FC<HomeScreenProps> = ({ user, navigation }) => {
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
      <View style={styles.topicsContainer}>
        {topics.map((topic) => (
          <TouchableOpacity
            key={topic.id}
            activeOpacity={0.85}
            style={styles.topicButton}
            onPress={() =>
              navigation.navigate('topic', {
                id: topic.id,
                title: topic.title,
                description: topic.description,
                gradient: topic.gradient,
                accentColor: topic.accentColor
              })
            }
          >
            <LinearGradient
              colors={topic.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.topicGradient}
            >
              <View pointerEvents="none" style={styles.noiseLayer}>
                {noiseBlobs.map((blob, index) => (
                  <View
                    // eslint-disable-next-line react/no-array-index-key
                    key={index}
                    style={[
                      styles.noiseBlob,
                      {
                        top: blob.top,
                        right: blob.right,
                        bottom: blob.bottom,
                        left: blob.left,
                        width: blob.width,
                        height: blob.height,
                        opacity: blob.opacity,
                        transform: [{ rotate: blob.rotate }]
                      }
                    ]}
                  />
                ))}
              </View>
              <View style={styles.topicContent}>
                <View style={[styles.topicIndicator, { backgroundColor: topic.accentColor }]} />
                <Text style={styles.topicTitle}>{topic.title}</Text>
                <Text style={styles.topicDescription}>{topic.description}</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 48,
    paddingBottom: 32,
    backgroundColor: '#EEF1FF'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 16
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
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#3730A3',
    shadowColor: '#312E81',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4
  },
  signOutText: {
    color: '#fff',
    fontWeight: '600'
  },
  topicsContainer: {
    flex: 1,
    paddingHorizontal: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  topicButton: {
    width: '48%',
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#1F2937',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 10,
    marginBottom: 16
  },
  topicGradient: {
    padding: 20,
    borderRadius: 28,
    minHeight: 160,
    position: 'relative',
    overflow: 'hidden'
  },
  noiseLayer: {
    ...StyleSheet.absoluteFillObject
  },
  noiseBlob: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.3)'
  },
  topicContent: {
    flex: 1,
    justifyContent: 'space-between'
  },
  topicIndicator: {
    width: 32,
    height: 4,
    borderRadius: 999,
    marginBottom: 18
  },
  topicTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12
  },
  topicDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.88)',
    lineHeight: 20
  }
});

export default HomeScreen;
