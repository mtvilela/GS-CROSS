import AsyncStorage from '@react-native-async-storage/async-storage';

import type { AlertEntry, MissionConfig, Settings, Subsystem } from '@/types';

/**
 * Camada de persistência local com AsyncStorage.
 * Cada fatia do estado é guardada sob sua própria chave para permitir
 * gravações parciais sem reescrever todo o estado.
 */
const KEYS = {
  mission: '@central:mission',
  subsystems: '@central:subsystems',
  settings: '@central:settings',
  alerts: '@central:alerts',
} as const;

async function readJson<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch (err) {
    console.warn(`[storage] falha ao ler ${key}`, err);
    return null;
  }
}

async function writeJson(key: string, value: unknown): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`[storage] falha ao gravar ${key}`, err);
  }
}

export const storage = {
  loadMission: () => readJson<MissionConfig>(KEYS.mission),
  saveMission: (mission: MissionConfig) => writeJson(KEYS.mission, mission),

  loadSubsystems: () => readJson<Subsystem[]>(KEYS.subsystems),
  saveSubsystems: (subsystems: Subsystem[]) => writeJson(KEYS.subsystems, subsystems),

  loadSettings: () => readJson<Settings>(KEYS.settings),
  saveSettings: (settings: Settings) => writeJson(KEYS.settings, settings),

  loadAlerts: () => readJson<AlertEntry[]>(KEYS.alerts),
  saveAlerts: (alerts: AlertEntry[]) => writeJson(KEYS.alerts, alerts),

  /** Limpa toda a persistência (usado pelo botão "Restaurar padrões"). */
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(Object.values(KEYS));
    } catch (err) {
      console.warn('[storage] falha ao limpar dados', err);
    }
  },
};
