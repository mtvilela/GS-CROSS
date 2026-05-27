import type { StatusLevel } from '@/theme';

/** Identificadores dos subsistemas monitorados. */
export type SubsystemKey = 'sensors' | 'energy' | 'communication' | 'orbital';

/** Uma métrica individual de telemetria (ex.: temperatura, bateria...). */
export interface Metric {
  id: string;
  label: string;
  unit: string;
  value: number;
  /** Faixa nominal: fora dela é ATENÇÃO; fora dos limites críticos é CRÍTICO. */
  warnLow: number;
  warnHigh: number;
  critLow: number;
  critHigh: number;
  /** Limites do gauge para renderização. */
  min: number;
  max: number;
}

/** Agrupamento de métricas por subsistema. */
export interface Subsystem {
  key: SubsystemKey;
  label: string;
  icon: string; // nome do ícone Ionicons
  metrics: Metric[];
}

/** Configuração editável da missão. */
export interface MissionConfig {
  name: string;
  code: string; // ex.: ARES-IX
  commander: string;
  crewSize: number;
  launchDate: string; // ISO yyyy-mm-dd
  targetOrbitKm: number;
}

/** Preferências do operador (persistidas). */
export interface Settings {
  autoRefresh: boolean;
  refreshIntervalSec: number;
  alertsEnabled: boolean;
}

export type AlertSeverity = Extract<StatusLevel, 'warning' | 'critical'>;

/** Registro de um alerta gerado automaticamente. */
export interface AlertEntry {
  id: string;
  timestamp: number;
  subsystem: SubsystemKey;
  metricId: string;
  metricLabel: string;
  severity: AlertSeverity;
  message: string;
  value: number;
  unit: string;
  acknowledged: boolean;
}

/** Estado completo persistido em AsyncStorage. */
export interface PersistedState {
  mission: MissionConfig;
  subsystems: Subsystem[];
  settings: Settings;
  alerts: AlertEntry[];
}
