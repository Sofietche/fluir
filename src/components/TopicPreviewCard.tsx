import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import TexturedBackground, { TextureShape } from './TexturedBackground';

type TopicPreviewCardProps = {
  title: string;
  description: string;
  gradient: [string, string];
  accentColor: string;
  onPress?: () => void;
};

const textureShapes: TextureShape[] = [
  { top: -36, left: -48, width: 160, height: 160, opacity: 0.18, rotate: '-18deg' },
  { top: -24, right: -28, width: 140, height: 140, opacity: 0.12, rotate: '22deg' },
  { bottom: -32, left: 12, width: 180, height: 180, opacity: 0.14, rotate: '-12deg' },
  { bottom: -42, right: -36, width: 150, height: 150, opacity: 0.1, rotate: '16deg' }
];

const TopicPreviewCard: React.FC<TopicPreviewCardProps> = ({ title, description, gradient, accentColor, onPress }) => {
  return (
    <TouchableOpacity accessibilityRole="button" activeOpacity={0.85} onPress={onPress} style={styles.container}>
      <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradient}>
        <TexturedBackground shapes={textureShapes} />
        <View style={styles.content}>
          <View style={[styles.indicator, { backgroundColor: accentColor }]} />
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
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
  gradient: {
    padding: 20,
    borderRadius: 28,
    minHeight: 160,
    position: 'relative',
    overflow: 'hidden'
  },
  content: {
    flex: 1,
    justifyContent: 'space-between'
  },
  indicator: {
    width: 32,
    height: 4,
    borderRadius: 999,
    marginBottom: 18
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12
  },
  description: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.88)',
    lineHeight: 20
  }
});

export default TopicPreviewCard;
