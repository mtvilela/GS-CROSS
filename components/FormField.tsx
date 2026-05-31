import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { colors, radius, spacing } from '@/theme';

interface Props extends TextInputProps {
  label: string;
  error?: string;
  hint?: string;
}

/** Campo de formulário com rótulo, dica e mensagem de erro de validação. */
export function FormField({ label, error, hint, style, ...inputProps }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.textDim}
        {...inputProps}
        style={[
          styles.input,
          { borderColor: error ? colors.critical : colors.panelBorder },
          style,
        ]}
      />
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : hint ? (
        <Text style={styles.hint}>{hint}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  label: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  input: {
    backgroundColor: colors.panelAlt,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    color: colors.text,
    fontSize: 15,
  },
  error: {
    color: colors.critical,
    fontSize: 12,
  },
  hint: {
    color: colors.textDim,
    fontSize: 12,
  },
});
