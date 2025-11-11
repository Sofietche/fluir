import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import TexturedBackground, { TextureShape } from './TexturedBackground';

type PromptCardProps = {
  prompt: string;
  tone?: string;
  tags?: string[];
  index?: number;
  accentColor: string;
};

const textureShapes: TextureShape[] = [
  { top: -48, right: -24, width: 180, height: 180, opacity: 0.12, rotate: '18deg' },
  { bottom: -36, left: -20, width: 160, height: 160, opacity: 0.1, rotate: '-22deg' }
];

const PromptCard: React.FC<PromptCardProps> = ({ prompt, tone, tags, index, accentColor }) => {
  return (
    <View style={styles.card}>
      <TexturedBackground shapes={textureShapes} />
      <View style={[styles.indicator, { backgroundColor: accentColor }]} />
      {typeof index === 'number' ? <Text style={styles.index}>{String(index).padStart(2, '0')}</Text> : null}
      <Text style={styles.prompt}>{prompt}</Text>
      <View style={styles.metaRow}>
        {tone ? <Text style={[styles.badge, styles.tone]}>{tone}</Text> : null}
        {tags?.map((tag) => (
          <Text key={tag} style={[styles.badge, styles.tag]}>
            #{tag}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    position: 'relative',
    backgroundColor: '#EEF2FF',
    borderRadius: 28,
    padding: 24,
    marginBottom: 18,
    shadowColor: '#1F2937',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 6,
    overflow: 'hidden'
  },
  indicator: {
    width: 44,
    height: 4,
    borderRadius: 999,
    marginBottom: 16
  },
  index: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: '#4338CA',
    marginBottom: 12
  },
  prompt: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 16
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 8,
    rowGap: 8
  },
  badge: {
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999
  },
  tone: {
    backgroundColor: 'rgba(67, 56, 202, 0.12)',
    color: '#312E81'
  },
  tag: {
    backgroundColor: 'rgba(79, 70, 229, 0.08)',
    color: '#4338CA'
  }
});

export default PromptCard;
