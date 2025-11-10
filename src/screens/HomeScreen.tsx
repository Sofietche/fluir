import React, { useMemo } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { signOut } from 'firebase/auth';

import PrimaryButton from '../components/PrimaryButton';
import TopicPreviewCard from '../components/TopicPreviewCard';
import { auth } from '../firebase/firebaseConfig';
import { useProtectedRoute } from '../hooks/useProtectedRoute';
import { RootStackParamList } from '../navigation/types';

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'home'>;

type TopicCard = {
  id: string;
  title: string;
  description: string;
  gradient: [string, string];
  accentColor: string;
};

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

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { user } = useProtectedRoute(navigation);

  const initials = useMemo(() => {
    if (!user) {
      return '?';
    }

    if (!user.displayName) {
      return user.email?.charAt(0).toUpperCase() ?? '?';
    }

    return user.displayName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((segment) => segment.charAt(0).toUpperCase())
      .join('');
  }, [user]);

  if (!user) {
    return null;
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} style={styles.screen}>
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
        <PrimaryButton
          label="Cerrar sesión"
          onPress={() => signOut(auth)}
          size="small"
          variant="outline"
          style={styles.signOutButton}
          textStyle={styles.signOutText}
        />
      </View>
      <Text style={styles.sectionTitle}>Explora tu próxima carta</Text>
      <View style={styles.topicsContainer}>
        {topics.map((topic) => (
          <TopicPreviewCard
            key={topic.id}
            title={topic.title}
            description={topic.description}
            gradient={topic.gradient}
            accentColor={topic.accentColor}
            onPress={() =>
              navigation.navigate('topic', {
                id: topic.id,
                title: topic.title,
                description: topic.description,
                gradient: topic.gradient,
                accentColor: topic.accentColor
              })
            }
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#EEF1FF'
  },
  scrollContainer: {
    paddingTop: 48,
    paddingBottom: 40
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
    paddingHorizontal: 18
  },
  signOutText: {
    fontSize: 14,
    fontWeight: '600'
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    paddingHorizontal: 24,
    marginBottom: 16,
    color: '#1F2937'
  },
  topicsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 24
  }
});

export default HomeScreen;
