import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AlertRow } from '@/components/AlertRow';
import { useMission } from '@/context/MissionContext';
import { colors, radius, spacing } from '@/theme';
import type { AlertEntry } from '@/types';

type Filter = 'all' | 'critical' | 'warning' | 'unack';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'unack', label: 'Não lidos' },
  { key: 'critical', label: 'Críticos' },
  { key: 'warning', label: 'Atenção' },
];

export default function AlertsScreen() {
  const insets = useSafeAreaInsets();
  const { alerts, acknowledgeAlert, acknowledgeAll, clearAlerts } = useMission();
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = useMemo(() => {
    switch (filter) {
      case 'critical':
        return alerts.filter((a) => a.severity === 'critical');
      case 'warning':
        return alerts.filter((a) => a.severity === 'warning');
      case 'unack':
        return alerts.filter((a) => !a.acknowledged);
      default:
        return alerts;
    }
  }, [alerts, filter]);

  return (
    <View style={[styles.screen, { paddingBottom: insets.bottom }]}>
      {/* Filtros */}
      <View style={styles.filterBar}>
        {FILTERS.map((f) => {
          const active = filter === f.key;
          return (
            <TouchableOpacity
              key={f.key}
              onPress={() => setFilter(f.key)}
              style={[styles.chip, active && styles.chipActive]}>
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Ações em massa */}
      <View style={styles.toolbar}>
        <TouchableOpacity
          style={styles.toolBtn}
          onPress={acknowledgeAll}
          disabled={alerts.length === 0}>
          <Ionicons name="checkmark-done" size={16} color={colors.primary} />
          <Text style={styles.toolText}>Marcar todos como lidos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.toolBtn}
          onPress={clearAlerts}
          disabled={alerts.length === 0}>
          <Ionicons name="trash-outline" size={16} color={colors.critical} />
          <Text style={[styles.toolText, { color: colors.critical }]}>Limpar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item: AlertEntry) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <AlertRow alert={item} onAcknowledge={acknowledgeAlert} />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="shield-checkmark-outline" size={40} color={colors.nominal} />
            <Text style={styles.emptyText}>
              {filter === 'all'
                ? 'Nenhum alerta registrado. Todos os sistemas nominais.'
                : 'Nenhum alerta neste filtro.'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.space,
  },
  filterBar: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    backgroundColor: colors.panel,
  },
  chipActive: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}22`,
  },
  chipText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  chipTextActive: {
    color: colors.primary,
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  toolBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  toolText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  list: {
    padding: spacing.lg,
    paddingTop: 0,
    gap: spacing.sm,
    flexGrow: 1,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.xxl * 2,
    gap: spacing.md,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
});
