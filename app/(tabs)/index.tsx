import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AlertRow } from '@/components/AlertRow';
import { Button } from '@/components/Button';
import { Panel } from '@/components/Panel';
import { StatusPill } from '@/components/StatusPill';
import { SubsystemCard } from '@/components/SubsystemCard';
import { useMission } from '@/context/MissionContext';
import { colors, spacing, statusColor, statusLabel } from '@/theme';

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const {
    ready,
    mission,
    subsystems,
    alerts,
    missionStatus,
    unacknowledgedCount,
    settings,
    triggerAnomaly,
    acknowledgeAlert,
  } = useMission();

  const recentAlerts = alerts.slice(0, 3);
  const statusTone = statusColor(missionStatus);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingBottom: insets.bottom + spacing.xl },
      ]}>
      {/* Cabeçalho da missão */}
      <Panel>
        <View style={styles.missionHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.missionCode}>{mission.code}</Text>
            <Text style={styles.missionName}>{mission.name}</Text>
            <Text style={styles.missionMeta}>
              Cmd. {mission.commander} · Tripulação {mission.crewSize} · Órbita-alvo{' '}
              {mission.targetOrbitKm} km
            </Text>
          </View>
        </View>

        <View style={[styles.statusBar, { borderColor: `${statusTone}55` }]}>
          <View>
            <Text style={styles.statusLabel}>STATUS GERAL DA MISSÃO</Text>
            <Text style={[styles.statusValue, { color: statusTone }]}>
              {statusLabel(missionStatus)}
            </Text>
          </View>
          <StatusPill level={missionStatus} />
        </View>

        <View style={styles.liveRow}>
          <Ionicons
            name={settings.autoRefresh ? 'ellipse' : 'ellipse-outline'}
            size={10}
            color={settings.autoRefresh ? colors.nominal : colors.textDim}
          />
          <Text style={styles.liveText}>
            {settings.autoRefresh
              ? `Telemetria ao vivo · atualizando a cada ${settings.refreshIntervalSec}s`
              : 'Atualização automática pausada'}
          </Text>
        </View>
      </Panel>

      {/* Subsistemas */}
      <Text style={styles.sectionTitle}>Subsistemas</Text>
      <View style={styles.grid}>
        {subsystems.map((sub) => (
          <SubsystemCard
            key={sub.key}
            subsystem={sub}
            onPress={() => router.push('/telemetry')}
          />
        ))}
      </View>

      {/* Ações rápidas */}
      <View style={styles.actions}>
        <View style={{ flex: 1 }}>
          <Button
            title="Simular anomalia"
            variant="danger"
            onPress={triggerAnomaly}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Button
            title="Configurar missão"
            variant="outline"
            onPress={() => router.push('/mission-setup')}
          />
        </View>
      </View>

      {/* Alertas recentes */}
      <Panel
        title="Alertas recentes"
        right={
          unacknowledgedCount > 0 ? (
            <StatusPill level="critical" label={`${unacknowledgedCount} novos`} small />
          ) : undefined
        }>
        {!ready ? (
          <Text style={styles.empty}>Carregando dados da missão…</Text>
        ) : recentAlerts.length === 0 ? (
          <Text style={styles.empty}>Nenhum alerta. Todos os sistemas nominais.</Text>
        ) : (
          <View style={{ gap: spacing.sm }}>
            {recentAlerts.map((a) => (
              <AlertRow key={a.id} alert={a} onAcknowledge={acknowledgeAlert} />
            ))}
          </View>
        )}
      </Panel>
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
  missionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  missionCode: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 2,
  },
  missionName: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
    marginTop: 2,
  },
  missionMeta: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: spacing.xs,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    padding: spacing.md,
    backgroundColor: colors.panelAlt,
  },
  statusLabel: {
    color: colors.textDim,
    fontSize: 10,
    letterSpacing: 1,
    fontWeight: '700',
  },
  statusValue: {
    fontSize: 20,
    fontWeight: '800',
    marginTop: 2,
  },
  liveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  liveText: {
    color: colors.textMuted,
    fontSize: 12,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginTop: spacing.xs,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  empty: {
    color: colors.textMuted,
    fontSize: 13,
    fontStyle: 'italic',
  },
});
