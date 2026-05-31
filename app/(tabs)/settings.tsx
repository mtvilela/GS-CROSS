import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { FormField } from '@/components/FormField';
import { Panel } from '@/components/Panel';
import { useMission } from '@/context/MissionContext';
import { colors, spacing } from '@/theme';

const INTERVALS = [1, 2, 3, 5, 10];

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { mission, settings, updateSettings, resetAll } = useMission();
  const [intervalError, setIntervalError] = useState<string>();

  const onCustomInterval = (raw: string) => {
    const n = Number(raw);
    if (raw.trim() === '') {
      setIntervalError('Informe um intervalo.');
      return;
    }
    if (!Number.isInteger(n) || n < 1 || n > 60) {
      setIntervalError('Use um inteiro entre 1 e 60 segundos.');
      return;
    }
    setIntervalError(undefined);
    updateSettings({ refreshIntervalSec: n });
  };

  const confirmReset = () => {
    Alert.alert(
      'Restaurar padrões',
      'Isso apaga a missão, alertas e configurações salvos e restaura os valores de fábrica. Continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Restaurar', style: 'destructive', onPress: () => void resetAll() },
      ],
    );
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingBottom: insets.bottom + spacing.xl },
      ]}>
      {/* Missão atual */}
      <Panel title="Missão atual">
        <Row label="Nome" value={mission.name} />
        <Row label="Código" value={mission.code} />
        <Row label="Comandante" value={mission.commander} />
        <Row label="Tripulação" value={String(mission.crewSize)} />
        <Row label="Lançamento" value={mission.launchDate} />
        <Row label="Órbita-alvo" value={`${mission.targetOrbitKm} km`} />
        <Button
          title="Editar dados da missão"
          variant="outline"
          onPress={() => router.push('/mission-setup')}
        />
      </Panel>

      {/* Telemetria */}
      <Panel title="Telemetria">
        <ToggleRow
          label="Atualização automática"
          description="Simula leituras de telemetria ao vivo."
          value={settings.autoRefresh}
          onChange={(v) => updateSettings({ autoRefresh: v })}
        />

        <Text style={styles.fieldLabel}>Intervalo de atualização</Text>
        <View style={styles.intervalRow}>
          {INTERVALS.map((sec) => {
            const active = settings.refreshIntervalSec === sec;
            return (
              <TouchableOpacity
                key={sec}
                onPress={() => {
                  setIntervalError(undefined);
                  updateSettings({ refreshIntervalSec: sec });
                }}
                style={[styles.intervalChip, active && styles.intervalChipActive]}>
                <Text
                  style={[styles.intervalText, active && styles.intervalTextActive]}>
                  {sec}s
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <FormField
          label="Intervalo personalizado (s)"
          keyboardType="number-pad"
          defaultValue={String(settings.refreshIntervalSec)}
          onChangeText={onCustomInterval}
          error={intervalError}
          hint="Entre 1 e 60 segundos."
        />
      </Panel>

      {/* Alertas */}
      <Panel title="Alertas">
        <ToggleRow
          label="Gerar alertas automáticos"
          description="Dispara alertas quando uma métrica entra em atenção/crítico."
          value={settings.alertsEnabled}
          onChange={(v) => updateSettings({ alertsEnabled: v })}
        />
      </Panel>

      {/* Zona de risco */}
      <Panel title="Dados">
        <Text style={styles.dangerHint}>
          Os dados da missão, alertas e preferências são salvos localmente no
          dispositivo (AsyncStorage) e persistem entre sessões.
        </Text>
        <Button title="Restaurar padrões" variant="danger" onPress={confirmReset} />
      </Panel>
    </ScrollView>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

function ToggleRow({
  label,
  description,
  value,
  onChange,
}: {
  label: string;
  description: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <View style={styles.toggleRow}>
      <View style={{ flex: 1, paddingRight: spacing.md }}>
        <Text style={styles.rowValue}>{label}</Text>
        <Text style={styles.toggleDesc}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ true: colors.primaryDim, false: colors.panelBorder }}
        thumbColor={value ? colors.primary : colors.textDim}
      />
    </View>
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowLabel: {
    color: colors.textMuted,
    fontSize: 14,
  },
  rowValue: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleDesc: {
    color: colors.textDim,
    fontSize: 12,
    marginTop: 2,
  },
  fieldLabel: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  intervalRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  intervalChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    backgroundColor: colors.panelAlt,
  },
  intervalChipActive: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}22`,
  },
  intervalText: {
    color: colors.textMuted,
    fontWeight: '700',
  },
  intervalTextActive: {
    color: colors.primary,
  },
  dangerHint: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
  },
});
