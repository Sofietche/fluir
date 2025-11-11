import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import Swiper from 'react-native-deck-swiper';
import {
  DocumentData,
  QueryDocumentSnapshot,
  collection,
  onSnapshot,
  orderBy,
  query
} from 'firebase/firestore';

import { RootStackParamList } from '../navigation/types';
import { db } from '../firebase/firebaseConfig';

type TopicCard = {
  id: string;
  prompt: string;
  tone: string;
  requiresParticipant: boolean;
  order: number;
};

type NoiseVeil = {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
  width: number;
  height: number;
  opacity: number;
  rotate: string;
};

const noiseVeil: NoiseVeil[] = [
  { top: -60, right: -20, width: 240, height: 240, opacity: 0.16, rotate: '18deg' },
  { top: 120, left: -80, width: 280, height: 280, opacity: 0.12, rotate: '-24deg' },
  { bottom: -90, right: -60, width: 260, height: 260, opacity: 0.1, rotate: '32deg' }
];

type TopicScreenProps = NativeStackScreenProps<RootStackParamList, 'topic'>;

const TopicScreen: React.FC<TopicScreenProps> = ({ navigation, route }) => {
  const { id, title, description, gradient, accentColor } = route.params;
  const [cards, setCards] = useState<TopicCard[]>([]);
  const [deckCards, setDeckCards] = useState<TopicCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [deckKey, setDeckKey] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const cardsRef = collection(db, 'topics', id, 'cards');
    const cardsQuery = query(cardsRef, orderBy('order', 'asc'));

    const unsubscribe = onSnapshot(
      cardsQuery,
      (snapshot) => {
        const nextCards = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
          id: doc.id,
          prompt: doc.data().prompt as string,
          tone: (doc.data().tone as string) ?? 'relajada',
          requiresParticipant: Boolean(doc.data().requiresParticipant),
          order: typeof doc.data().order === 'number' ? (doc.data().order as number) : Number.MAX_SAFE_INTEGER
        }));

        setCards(nextCards);
        setDeckCards(nextCards);
        setDeckKey((prev) => prev + 1);
        setCurrentIndex(0);
        setErrorMessage(null);
        setIsLoading(false);
      },
      () => {
        setCards([]);
        setDeckCards([]);
        setErrorMessage('No pudimos cargar las cartas en este momento. Intenta de nuevo más tarde.');
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [id]);

  const hasCards = deckCards.length > 0;

  const shuffleCards = useCallback(() => {
    if (!cards.length) {
      return;
    }

    const shuffled = [...cards]
      .map((card) => ({ sort: Math.random(), value: card }))
      .sort((a, b) => a.sort - b.sort)
      .map((entry) => entry.value);

    setDeckCards(shuffled);
    setDeckKey((prev) => prev + 1);
    setCurrentIndex(0);
  }, [cards]);

  const toneLabel = useCallback((tone: string) => {
    const normalized = tone?.trim();
    if (!normalized) {
      return 'Relajada';
    }
    return normalized.charAt(0).toUpperCase() + normalized.slice(1).toLowerCase();
  }, []);

  const progressLabel = useMemo(() => {
    if (!deckCards.length) {
      return '0 / 0';
    }

    const total = deckCards.length;
    const current = Math.min(currentIndex + 1, total);
    return `${current} / ${total}`;
  }, [currentIndex, deckCards.length]);

  return (
    <View style={styles.wrapper}>
      <StatusBar style="light" animated />
      <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.background}>
        <View pointerEvents="none" style={styles.noiseLayer}>
          {noiseVeil.map((blob, index) => (
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
        <View style={[styles.blob, styles.blobOne]} />
        <View style={[styles.blob, styles.blobTwo]} />
      </LinearGradient>
      <SafeAreaView style={styles.safeArea}>
        <TouchableOpacity accessibilityRole="button" onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
        <View style={styles.contentCard}>
          <View style={[styles.accentBar, { backgroundColor: accentColor }]} />
          <View style={styles.headerRow}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity
              accessibilityRole="button"
              onPress={shuffleCards}
              disabled={!cards.length}
              style={[styles.shuffleButton, { borderColor: accentColor, opacity: cards.length ? 1 : 0.45 }]}
            >
              <Text style={[styles.shuffleText, { color: accentColor }]}>🔀 Barajar</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.description}>{description}</Text>
          {isLoading ? (
            <View style={styles.loaderWrapper}>
              <ActivityIndicator size="large" color="#F8FAFC" />
              <Text style={styles.loaderText}>Cargando cartas...</Text>
            </View>
          ) : errorMessage ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Ups, algo salió mal.</Text>
              <Text style={styles.emptyDescription}>{errorMessage}</Text>
            </View>
          ) : hasCards ? (
            <View style={styles.deckArea}>
              <Swiper
                key={`deck-${deckKey}`}
                cards={deckCards}
                renderCard={(card) =>
                  card ? (
                    <View style={styles.card}>
                      <View style={[styles.toneBadge, { backgroundColor: accentColor }]}>
                        <Text style={styles.toneText}>{toneLabel(card.tone)}</Text>
                      </View>
                      <Text style={styles.promptText}>{card.prompt}</Text>
                      {card.requiresParticipant ? (
                        <Text style={[styles.participantHint, { color: accentColor }]}>Ideal para compartir.</Text>
                      ) : null}
                    </View>
                  ) : (
                    <View style={styles.card} />
                  )
                }
                backgroundColor="transparent"
                stackSize={3}
                cardVerticalMargin={16}
                cardHorizontalMargin={0}
                onSwiped={() => setCurrentIndex((prev) => prev + 1)}
                onSwipedAll={() => setCurrentIndex(deckCards.length)}
                disableTopSwipe
                disableBottomSwipe
                verticalSwipe={false}
              />
              <View style={styles.progressRow}>
                <Text style={styles.progressLabel}>Cartas: {progressLabel}</Text>
              </View>
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Aún no hay cartas aquí.</Text>
              <Text style={styles.emptyDescription}>
                Cuando agreguemos nuevas preguntas para este tópico aparecerán en este espacio. Mientras tanto,
                explora otros mazos.
              </Text>
            </View>
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
  noiseLayer: {
    ...StyleSheet.absoluteFillObject
  },
  noiseBlob: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.25)'
  },
  blob: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 999,
    opacity: 0.65
  },
  blobOne: {
    width: 220,
    height: 220,
    top: -40,
    right: -60
  },
  blobTwo: {
    width: 180,
    height: 180,
    bottom: -60,
    left: -40
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 24
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    marginBottom: 32,
    backgroundColor: 'rgba(15, 23, 42, 0.25)',
    borderColor: 'rgba(255,255,255,0.4)'
  },
  backButtonText: {
    color: '#F8FAFC',
    fontWeight: '600',
    letterSpacing: 0.3
  },
  contentCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    borderRadius: 32,
    padding: 28,
    flex: 1,
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#F8FAFC',
    flex: 1,
    paddingRight: 12
  },
  description: {
    fontSize: 16,
    color: 'rgba(248, 250, 252, 0.85)',
    marginBottom: 20
  },
  shuffleButton: {
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.2)'
  },
  shuffleText: {
    fontWeight: '700',
    letterSpacing: 0.4
  },
  loaderWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  loaderText: {
    marginTop: 16,
    color: 'rgba(248, 250, 252, 0.85)',
    fontSize: 15
  },
  deckArea: {
    flex: 1
  },
  card: {
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(248, 250, 252, 0.1)',
    height: 320,
    justifyContent: 'center',
    shadowColor: '#0f172a',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 24
  },
  toneBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 18,
    backgroundColor: '#F97316'
  },
  toneText: {
    color: '#0F172A',
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase'
  },
  promptText: {
    fontSize: 22,
    lineHeight: 30,
    color: '#F8FAFC',
    fontWeight: '600'
  },
  participantHint: {
    marginTop: 24,
    fontSize: 14,
    fontWeight: '600'
  },
  progressRow: {
    marginTop: 18,
    alignItems: 'center'
  },
  progressLabel: {
    color: 'rgba(248, 250, 252, 0.85)',
    fontSize: 14,
    letterSpacing: 0.4
  },
  emptyState: {
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 8,
    textAlign: 'center'
  },
  emptyDescription: {
    fontSize: 15,
    color: 'rgba(248, 250, 252, 0.75)',
    textAlign: 'center'
  }
});

export default TopicScreen;
