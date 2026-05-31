import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors, radius, spacing, statusColor } from '@/theme';
import type { AlertEntry } from '@/types';

interface Props {
  alert: AlertEntry;
  onAcknowledge: (id: string) => void;
}

function formatTime(ts: number): string {
  const d = new Date(ts);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

/** Linha de um alerta na lista, com botão para reconhecer (acknowledge). */
export function AlertRow({ alert, onAcknowledge }: Props) {
  const color = statusColor(alert.severity);
  return (
    <View
      style={[
        styles.row,
        { borderLeftColor: color, opacity: alert.acknowledged ? 0.55 : 1 },
      ]}>
      <Ionicons
        name={alert.severity === 'critical' ? 'warning' : 'alert-circle'}
        size={20}
        color={color}
        style={styles.icon}
      />
      <View style={styles.body}>
        <Text style={styles.message}>{alert.message}</Text>
        <Text style={styles.meta}>
          {formatTime(alert.timestamp)} · {alert.subsystem}
        </Text>
      </View>
      {alert.acknowledged ? (
        <Ionicons name="checkmark-done" size={18} color={colors.textDim} />
      ) : (
        <TouchableOpacity
          onPress={() => onAcknowledge(alert.id)}
          hitSlop={8}
          style={styles.ackBtn}>
          <Text style={styles.ackText}>OK</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.panel,
    borderRadius: radius.md,
    borderLeftWidth: 4,
    padding: spacing.md,
  },
  icon: {
    marginTop: 2,
  },
  body: {
    flex: 1,
    gap: 2,
  },
  message: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  meta: {
    color: colors.textDim,
    fontSize: 11,
    fontVariant: ['tabular-nums'],
  },
  ackBtn: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  ackText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 12,
  },
});
