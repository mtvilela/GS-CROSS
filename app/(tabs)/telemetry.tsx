import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MetricGauge } from '@/components/MetricGauge';
import { Panel } from '@/components/Panel';
import { StatusPill } from '@/components/StatusPill';
import { useMission } from '@/context/MissionContext';
import { colors, spacing, statusColor } from '@/theme';
import { evaluateSubsystem } from '@/utils/status';

export default function TelemetryScreen() {
  const insets = useSafeAreaInsets();
  const { subsystems } = useMission();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingBottom: insets.bottom + spacing.xl },
      ]}>
      <Text style={styles.hint}>
        Toque em uma métrica para inserir uma leitura manual (com validação).
      </Text>

      {subsystems.map((sub) => {
        const level = evaluateSubsystem(sub);
        return (
          <Panel
            key={sub.key}
            title={sub.label}
            right={<StatusPill level={level} small />}>
            <View style={styles.iconTitleRow}>
              <Ionicons
                name={sub.icon as never}
                size={16}
                color={statusColor(level)}
              />
              <Text style={styles.subKey}>{sub.key.toUpperCase()}</Text>
            </View>

            <View style={{ gap: spacing.lg }}>
              {sub.metrics.map((metric) => (
                <TouchableOpacity
                  key={metric.id}
                  activeOpacity={0.7}
                  onPress={() =>
                    router.push({
                      pathname: '/metric-edit',
                      params: { subsystem: sub.key, metricId: metric.id },
                    })
                  }>
                  <MetricGauge metric={metric} />
                </TouchableOpacity>
              ))}
            </View>
          </Panel>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.space,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  hint: {
    color: colors.textMuted,
    fontSize: 12,
    fontStyle: 'italic',
  },
  iconTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: -spacing.xs,
  },
  subKey: {
    color: colors.textDim,
    fontSize: 11,
    letterSpacing: 1,
    fontWeight: '700',
  },
});
