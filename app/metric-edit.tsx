import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { FormField } from '@/components/FormField';
import { MetricGauge } from '@/components/MetricGauge';
import { Panel } from '@/components/Panel';
import { useMission } from '@/context/MissionContext';
import { colors, spacing } from '@/theme';
import type { SubsystemKey } from '@/types';
import { validateMetricValue } from '@/utils/validation';

export default function MetricEditScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ subsystem: string; metricId: string }>();
  const { subsystems, updateMetricValue } = useMission();

  const subsystemKey = params.subsystem as SubsystemKey;
  const subsystem = subsystems.find((s) => s.key === subsystemKey);
  const metric = subsystem?.metrics.find((m) => m.id === params.metricId);

  const [value, setValue] = useState(metric ? String(metric.value) : '');
  const [error, setError] = useState<string>();

  // Pré-visualização do gauge com o valor digitado.
  const preview = useMemo(() => {
    if (!metric) return null;
    const n = Number(value);
    if (Number.isNaN(n)) return metric;
    return { ...metric, value: n };
  }, [metric, value]);

  if (!subsystem || !metric) {
    return (
      <View style={styles.missing}>
        <Text style={styles.missingText}>Métrica não encontrada.</Text>
        <Button title="Voltar" variant="outline" onPress={() => router.back()} />
      </View>
    );
  }

  const onSave = () => {
    const validationError = validateMetricValue(value, metric.min, metric.max);
    setError(validationError ?? undefined);
    if (validationError) return;
    updateMetricValue(subsystemKey, metric.id, Number(value));
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + spacing.xl },
        ]}
        keyboardShouldPersistTaps="handled">
        <Text style={styles.intro}>
          {subsystem.label} · inserir leitura manual. Um valor fora da faixa nominal
          dispara um alerta automático.
        </Text>

        {preview && (
          <Panel title="Pré-visualização">
            <MetricGauge metric={preview} />
          </Panel>
        )}

        <FormField
          label={`${metric.label} (${metric.unit})`}
          value={value}
          onChangeText={setValue}
          keyboardType="numbers-and-punctuation"
          placeholder={`${metric.min} a ${metric.max}`}
          error={error}
          hint={`Faixa permitida: ${metric.min} a ${metric.max} ${metric.unit}.`}
        />

        <Button title="Salvar leitura" onPress={onSave} />
        <Button title="Cancelar" variant="outline" onPress={() => router.back()} />
      </ScrollView>
    </KeyboardAvoidingView>
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
  intro: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 19,
  },
  missing: {
    flex: 1,
    backgroundColor: colors.space,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
    padding: spacing.xl,
  },
  missingText: {
    color: colors.text,
    fontSize: 16,
  },
});
