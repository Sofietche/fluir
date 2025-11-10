import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import TexturedBackground, { TextureShape } from './TexturedBackground';

type FullScreenLoaderProps = {
  message?: string;
};

const textureShapes: TextureShape[] = [
  { top: -80, left: -40, width: 220, height: 220, opacity: 0.12, rotate: '-22deg' },
  { bottom: -90, right: -60, width: 260, height: 260, opacity: 0.08, rotate: '18deg' },
  { top: 120, right: -40, width: 180, height: 180, opacity: 0.1, rotate: '32deg' }
];

const FullScreenLoader: React.FC<FullScreenLoaderProps> = ({ message = 'Cargando…' }) => (
  <View style={styles.container}>
    <TexturedBackground shapes={textureShapes} />
    <ActivityIndicator size="large" color="#312E81" />
    <Text style={styles.message}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF1FF',
    position: 'relative'
  },
  message: {
    marginTop: 12,
    fontSize: 16,
    color: '#312E81',
    fontWeight: '600'
  }
});

export default FullScreenLoader;
