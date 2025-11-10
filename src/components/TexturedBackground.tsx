import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

type TextureShape = {
  width: number;
  height: number;
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
  opacity?: number;
  rotate?: string;
  backgroundColor?: string;
};

type TexturedBackgroundProps = {
  shapes: TextureShape[];
  style?: StyleProp<ViewStyle>;
  pointerEvents?: 'box-none' | 'none' | 'box-only' | 'auto';
};

const TexturedBackground: React.FC<TexturedBackgroundProps> = ({ shapes, style, pointerEvents = 'none' }) => {
  return (
    <View pointerEvents={pointerEvents} style={[styles.container, style]}>
      {shapes.map((shape, index) => (
        <View
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          style={[
            styles.shape,
            {
              top: shape.top,
              right: shape.right,
              bottom: shape.bottom,
              left: shape.left,
              width: shape.width,
              height: shape.height,
              opacity: shape.opacity ?? 0.15,
              transform: shape.rotate ? [{ rotate: shape.rotate }] : undefined,
              backgroundColor: shape.backgroundColor ?? 'rgba(255, 255, 255, 0.28)'
            }
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject
  },
  shape: {
    position: 'absolute',
    borderRadius: 999
  }
});

export type { TextureShape };
export default TexturedBackground;
