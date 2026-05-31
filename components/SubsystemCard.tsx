import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors, radius, spacing, statusColor } from '@/theme';
import type { Subsystem } from '@/types';
import { evaluateSubsystem, evaluateMetric } from '@/utils/status';
import { StatusPill } from './StatusPill';

interface Props {
  subsystem: Subsystem;
  onPress?: () => void;
}

/** Cartão-resumo de um subsistema para o dashboard. */
export function SubsystemCard({ subsystem, onPress }: Props) {
  const level = evaluateSubsystem(subsystem);
  const color = statusColor(level);
  const issues = subsystem.metrics.filter(
    (m) => evaluateMetric(m) !== 'nominal',
  ).length;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.card, { borderColor: `${color}55` }]}>
      <View style={styles.top}>
        <View style={[styles.iconWrap, { backgroundColor: `${color}1f` }]}>
          <Ionicons name={subsystem.icon as never} size={22} color={color} />
        </View>
        <StatusPill level={level} small />
      </View>

      <Text style={styles.label}>{subsystem.label}</Text>
      <Text style={styles.meta}>
        {subsystem.metrics.length} métricas
        {issues > 0 ? ` · ${issues} fora da faixa` : ' · todas nominais'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: '46%',
    backgroundColor: colors.panel,
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  meta: {
    color: colors.textMuted,
    fontSize: 12,
  },
});
