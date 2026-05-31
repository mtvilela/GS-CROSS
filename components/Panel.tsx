import { StyleSheet, Text, View, type ViewProps } from 'react-native';

import { colors, radius, spacing } from '@/theme';

interface Props extends ViewProps {
  title?: string;
  /** Conteúdo renderizado à direita do título (ex.: um StatusPill). */
  right?: React.ReactNode;
}

/** Container padrão de painel com fundo, borda e título opcional. */
export function Panel({ title, right, style, children, ...rest }: Props) {
  return (
    <View style={[styles.panel, style]} {...rest}>
      {(title || right) && (
        <View style={styles.header}>
          {title ? <Text style={styles.title}>{title}</Text> : <View />}
          {right}
        </View>
      )}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: colors.panel,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    padding: spacing.lg,
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
