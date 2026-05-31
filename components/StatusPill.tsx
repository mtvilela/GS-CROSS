import { StyleSheet, Text, View } from 'react-native';

import { radius, spacing, statusColor, statusLabel, type StatusLevel } from '@/theme';

interface Props {
  level: StatusLevel;
  /** Texto opcional sobrepondo o rótulo padrão. */
  label?: string;
  small?: boolean;
}

/** Selo colorido com o status (NOMINAL / ATENÇÃO / CRÍTICO / OFFLINE). */
export function StatusPill({ level, label, small }: Props) {
  const color = statusColor(level);
  return (
    <View
      style={[
        styles.pill,
        small && styles.pillSmall,
        { borderColor: color, backgroundColor: `${color}22` },
      ]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.text, small && styles.textSmall, { color }]}>
        {label ?? statusLabel(level)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    gap: spacing.xs,
  },
  pillSmall: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  text: {
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 1,
  },
  textSmall: {
    fontSize: 10,
  },
});
