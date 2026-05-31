import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';

import { colors, radius, spacing } from '@/theme';

type Variant = 'primary' | 'outline' | 'danger';

interface Props {
  title: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
}

/** Botão temático reutilizável. */
export function Button({ title, onPress, variant = 'primary', disabled, loading }: Props) {
  const palette = VARIANTS[variant];
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.base,
        { backgroundColor: palette.bg, borderColor: palette.border },
        (disabled || loading) && styles.disabled,
      ]}>
      {loading ? (
        <ActivityIndicator color={palette.text} />
      ) : (
        <Text style={[styles.text, { color: palette.text }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const VARIANTS: Record<Variant, { bg: string; border: string; text: string }> = {
  primary: { bg: colors.primary, border: colors.primary, text: colors.spaceDeep },
  outline: { bg: 'transparent', border: colors.panelBorder, text: colors.text },
  danger: { bg: 'transparent', border: colors.critical, text: colors.critical },
};

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    borderWidth: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.45,
  },
  text: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
