import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { FormField } from '@/components/FormField';
import { useMission } from '@/context/MissionContext';
import { colors, spacing } from '@/theme';
import type { MissionConfig } from '@/types';
import { hasErrors, validateMission, type FieldErrors } from '@/utils/validation';

export default function MissionSetupScreen() {
  const insets = useSafeAreaInsets();
  const { mission, updateMission } = useMission();

  // Estado controlado dos campos (como strings para validar a entrada bruta).
  const [name, setName] = useState(mission.name);
  const [code, setCode] = useState(mission.code);
  const [commander, setCommander] = useState(mission.commander);
  const [crewSize, setCrewSize] = useState(String(mission.crewSize));
  const [launchDate, setLaunchDate] = useState(mission.launchDate);
  const [targetOrbitKm, setTargetOrbitKm] = useState(String(mission.targetOrbitKm));
  const [errors, setErrors] = useState<FieldErrors<MissionConfig>>({});

  const onSave = () => {
    const input = { name, code, commander, crewSize, launchDate, targetOrbitKm };
    const validation = validateMission(input);
    setErrors(validation);
    if (hasErrors(validation)) return;

    updateMission({
      name: name.trim(),
      code: code.trim().toUpperCase(),
      commander: commander.trim(),
      crewSize: Number(crewSize),
      launchDate: launchDate.trim(),
      targetOrbitKm: Number(targetOrbitKm),
    });
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
          Defina os parâmetros da missão. Todos os campos são obrigatórios e validados.
        </Text>

        <FormField
          label="Nome da missão"
          value={name}
          onChangeText={setName}
          placeholder="Ex.: Exploração de Marte"
          error={errors.name}
        />
        <FormField
          label="Código da missão"
          value={code}
          onChangeText={setCode}
          autoCapitalize="characters"
          placeholder="Ex.: ARES-IX"
          error={errors.code}
          hint="Formato AAA-000 (2 a 6 letras, hífen, até 4 caracteres)."
        />
        <FormField
          label="Comandante"
          value={commander}
          onChangeText={setCommander}
          placeholder="Ex.: Cmd. A. Ramos"
          error={errors.commander}
        />
        <FormField
          label="Tamanho da tripulação"
          value={crewSize}
          onChangeText={setCrewSize}
          keyboardType="number-pad"
          placeholder="1 a 12"
          error={errors.crewSize}
        />
        <FormField
          label="Data de lançamento"
          value={launchDate}
          onChangeText={setLaunchDate}
          placeholder="AAAA-MM-DD"
          autoCapitalize="none"
          error={errors.launchDate}
          hint="Formato ISO: AAAA-MM-DD."
        />
        <FormField
          label="Órbita-alvo (km)"
          value={targetOrbitKm}
          onChangeText={setTargetOrbitKm}
          keyboardType="number-pad"
          placeholder="150 a 2000"
          error={errors.targetOrbitKm}
        />

        <Button title="Salvar missão" onPress={onSave} />
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
});
