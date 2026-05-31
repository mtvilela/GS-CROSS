import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, statusColor } from '@/theme';
import type { Metric } from '@/types';
import { evaluateMetric, formatValue, metricFraction } from '@/utils/status';

interface Props {
  metric: Metric;
}

/**
 * Medidor de barra horizontal para uma métrica de telemetria.
 * A barra preenche conforme a posição do valor na faixa min..max e é colorida
 * pelo status atual (nominal / atenção / crítico).
 */
export function MetricGauge({ metric }: Props) {
  const level = evaluateMetric(metric);
  const color = statusColor(level);
  const fraction = metricFraction(metric);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{metric.label}</Text>
        <Text style={[styles.value, { color }]}>
          {formatValue(metric.value)}
          <Text style={styles.unit}> {metric.unit}</Text>
        </Text>
      </View>

      <View style={styles.track}>
        <View
          style={[styles.fill, { width: `${fraction * 100}%`, backgroundColor: color }]}
        />
      </View>

      <View style={styles.scale}>
        <Text style={styles.scaleText}>{metric.min}</Text>
        <Text style={styles.scaleText}>{metric.max}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  label: {
    color: colors.textMuted,
    fontSize: 13,
  },
  value: {
    fontSize: 18,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  unit: {
    fontSize: 12,
    color: colors.textDim,
    fontWeight: '500',
  },
  track: {
    height: 10,
    borderRadius: radius.sm,
    backgroundColor: colors.panelAlt,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.panelBorder,
  },
  fill: {
    height: '100%',
    borderRadius: radius.sm,
  },
  scale: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scaleText: {
    color: colors.textDim,
    fontSize: 10,
    fontVariant: ['tabular-nums'],
  },
});
