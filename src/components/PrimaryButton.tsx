import React from 'react';
import { ActivityIndicator, StyleProp, StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';

type ButtonVariant = 'primary' | 'outline' | 'translucent';
type ButtonSize = 'small' | 'medium' | 'large';

type PrimaryButtonProps = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

const sizeStyles: Record<ButtonSize, ViewStyle> = {
  small: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    minWidth: 120
  },
  medium: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    minWidth: 160
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 28,
    minWidth: 200
  }
};

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  label,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary',
  size = 'medium',
  style,
  textStyle
}) => {
  const isDisabled = disabled || loading;

  const getVariantStyles = (): { container: ViewStyle; text: TextStyle } => {
    switch (variant) {
      case 'outline':
        return {
          container: {
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: '#312E81'
          },
          text: {
            color: '#312E81'
          }
        };
      case 'translucent':
        return {
          container: {
            backgroundColor: 'rgba(15, 23, 42, 0.25)',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.45)'
          },
          text: {
            color: '#F8FAFC'
          }
        };
      case 'primary':
      default:
        return {
          container: {
            backgroundColor: '#3730A3',
            shadowColor: '#312E81',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 4
          },
          text: {
            color: '#FFFFFF'
          }
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      activeOpacity={0.85}
      onPress={onPress}
      disabled={isDisabled}
      style={[styles.base, sizeStyles[size], variantStyles.container, isDisabled && styles.disabled, style]}
    >
      {loading ? <ActivityIndicator color={variantStyles.text.color} /> : <Text style={[styles.label, variantStyles.text, textStyle]}>{label}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  label: {
    fontSize: 16,
    fontWeight: '600'
  },
  disabled: {
    opacity: 0.7
  }
});

export default PrimaryButton;
