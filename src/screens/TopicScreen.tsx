import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

import PrimaryButton from '../components/PrimaryButton';
import PromptCard from '../components/PromptCard';
import TexturedBackground, { TextureShape } from '../components/TexturedBackground';
import { useProtectedRoute } from '../hooks/useProtectedRoute';
import { useTopicCards } from '../hooks/useTopicCards';
import { RootStackParamList } from '../navigation/types';

const textureShapes: TextureShape[] = [
  { top: -60, right: -20, width: 240, height: 240, opacity: 0.16, rotate: '18deg', backgroundColor: 'rgba(255,255,255,0.2)' },
  { top: 120, left: -80, width: 280, height: 280, opacity: 0.12, rotate: '-24deg', backgroundColor: 'rgba(255,255,255,0.18)' },
  { bottom: -90, right: -60, width: 260, height: 260, opacity: 0.1, rotate: '32deg', backgroundColor: 'rgba(255,255,255,0.14)' }
];

const TopicScreen: React.FC<NativeStackScreenProps<RootStackParamList, 'topic'>> = ({ navigation, route }) => {
  useProtectedRoute(navigation);
  const { id, title, description, gradient, accentColor } = route.params;

  const { cards, status, error, refetch } = useTopicCards(id);

  const isLoading = status === 'loading' || status === 'idle';
  const hasError = status === 'error';

  return (
    <View style={styles.wrapper}>
      <StatusBar style="light" animated />
      <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.background}>
        <TexturedBackground shapes={textureShapes} />
      </LinearGradient>
      <SafeAreaView style={styles.safeArea}>
        <PrimaryButton
          label="Volver"
          onPress={() => navigation.goBack()}
          variant="translucent"
          size="small"
          style={styles.backButton}
        />
        <View style={styles.contentCard}>
          <View style={[styles.accentBar, { backgroundColor: accentColor }]} />
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
          <View style={styles.metaRow}>
            <View style={[styles.metaPill, { backgroundColor: accentColor }]} />
            <Text style={styles.metaText}>Fluye con esta experiencia.</Text>
          </View>
          {isLoading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator color={accentColor} />
              <Text style={styles.loaderText}>Cargando cartas…</Text>
            </View>
          ) : hasError ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>
                {error ?? 'No pudimos cargar las cartas. Revisa tu conexión e inténtalo de nuevo.'}
              </Text>
              <PrimaryButton label="Reintentar" onPress={() => refetch().catch(() => {})} size="small" />
            </View>
          ) : cards.length > 0 ? (
            <FlatList
              data={cards}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => (
                <PromptCard
                  prompt={item.prompt}
                  tone={item.tone}
                  tags={item.tags}
                  index={index + 1}
                  accentColor={accentColor}
                />
              )}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <Text style={styles.emptyText}>
              Aún no hay cartas disponibles para este tópico. Añade algunas desde Firebase.
            </Text>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#0F172A'
  },
  background: {
    ...StyleSheet.absoluteFillObject
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
    justifyContent: 'space-between'
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
    marginBottom: 24
  },
  contentCard: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    borderRadius: 32,
    padding: 28,
    shadowColor: '#0f172a',
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 18 },
    shadowRadius: 36,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)'
  },
  accentBar: {
    width: 54,
    height: 6,
    borderRadius: 999,
    marginBottom: 24
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 12
  },
  description: {
    fontSize: 16,
    color: 'rgba(248, 250, 252, 0.85)',
    marginBottom: 24
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  metaPill: {
    width: 36,
    height: 10,
    borderRadius: 999,
    opacity: 0.9
  },
  metaText: {
    color: 'rgba(248, 250, 252, 0.9)',
    fontWeight: '600',
    letterSpacing: 0.4,
    marginLeft: 12
  },
  loaderContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  loaderText: {
    color: 'rgba(248, 250, 252, 0.85)',
    fontWeight: '600',
    marginLeft: 12
  },
  errorContainer: {
    backgroundColor: 'rgba(248, 113, 113, 0.08)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(248, 113, 113, 0.35)'
  },
  errorText: {
    color: 'rgba(254, 226, 226, 0.95)',
    lineHeight: 20,
    marginBottom: 12
  },
  listContent: {
    paddingTop: 12,
    paddingBottom: 4
  },
  emptyText: {
    marginTop: 16,
    color: 'rgba(248, 250, 252, 0.78)',
    lineHeight: 22
  }
});

export default TopicScreen;
