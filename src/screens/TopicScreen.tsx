import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RootStackParamList } from '../navigation/types';

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
  const { title, description, gradient, accentColor } = route.params;

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
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
          <View style={styles.metaRow}>
            <View style={[styles.metaPill, { backgroundColor: accentColor }]} />
            <Text style={styles.metaText}>Fluye con esta experiencia.</Text>
          </View>
          <Text style={styles.bodyText}>
            Pronto encontrarás meditaciones guiadas, visualizaciones y música inmersiva pensadas para este
            tópico. Mientras tanto, sigue explorando y mantén tu atención suave, como lava que fluye.
          </Text>
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
    justifyContent: 'space-between'
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
  bodyText: {
    fontSize: 15,
    lineHeight: 22,
    color: 'rgba(248, 250, 252, 0.78)'
  }
});

export default TopicScreen;
