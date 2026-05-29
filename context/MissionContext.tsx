import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import type { StatusLevel } from '@/theme';
import type {
  AlertEntry,
  AlertSeverity,
  Metric,
  MissionConfig,
  Settings,
  Subsystem,
  SubsystemKey,
} from '@/types';
import { defaultMission, defaultSettings, defaultSubsystems } from '@/utils/defaults';
import { injectAnomaly, tickSubsystems } from '@/utils/simulation';
import { evaluateMetric, evaluateMission } from '@/utils/status';
import { storage } from '@/utils/storage';

const MAX_ALERTS = 100;

interface MissionContextValue {
  ready: boolean;
  mission: MissionConfig;
  subsystems: Subsystem[];
  settings: Settings;
  alerts: AlertEntry[];
  missionStatus: StatusLevel;
  unacknowledgedCount: number;

  updateMission: (mission: MissionConfig) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  updateMetricValue: (subsystemKey: SubsystemKey, metricId: string, value: number) => void;
  triggerAnomaly: () => void;
  acknowledgeAlert: (id: string) => void;
  acknowledgeAll: () => void;
  clearAlerts: () => void;
  resetAll: () => Promise<void>;
}

const MissionContext = createContext<MissionContextValue | undefined>(undefined);

/** Gera um id único sem depender de libs externas. */
let alertSeq = 0;
function makeAlertId(timestamp: number): string {
  alertSeq += 1;
  return `alert-${timestamp}-${alertSeq}`;
}

function makeAlert(
  subsystem: SubsystemKey,
  metric: Metric,
  severity: AlertSeverity,
  timestamp: number,
): AlertEntry {
  const verb = severity === 'critical' ? 'CRÍTICO' : 'fora da faixa nominal';
  return {
    id: makeAlertId(timestamp),
    timestamp,
    subsystem,
    metricId: metric.id,
    metricLabel: metric.label,
    severity,
    message: `${metric.label} ${verb}: ${metric.value} ${metric.unit}`,
    value: metric.value,
    unit: metric.unit,
    acknowledged: false,
  };
}

export function MissionProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [mission, setMission] = useState<MissionConfig>(defaultMission);
  const [subsystems, setSubsystems] = useState<Subsystem[]>(defaultSubsystems);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [alerts, setAlerts] = useState<AlertEntry[]>([]);

  /**
   * Guarda o último status conhecido de cada métrica. Um alerta só é gerado
   * na TRANSIÇÃO para warning/critical — evita enxurrada de alertas idênticos
   * a cada tick enquanto a métrica permanece fora da faixa.
   */
  const lastLevels = useRef<Record<string, StatusLevel>>({});

  // ---- Carregamento inicial a partir do AsyncStorage ----
  useEffect(() => {
    let active = true;
    (async () => {
      const [m, subs, s, a] = await Promise.all([
        storage.loadMission(),
        storage.loadSubsystems(),
        storage.loadSettings(),
        storage.loadAlerts(),
      ]);
      if (!active) return;
      if (m) setMission(m);
      if (subs) setSubsystems(subs);
      if (s) setSettings(s);
      if (a) setAlerts(a);
      setReady(true);
    })();
    return () => {
      active = false;
    };
  }, []);

  // ---- Persistência reativa (após carregamento concluído) ----
  useEffect(() => {
    if (ready) storage.saveMission(mission);
  }, [ready, mission]);
  useEffect(() => {
    if (ready) storage.saveSubsystems(subsystems);
  }, [ready, subsystems]);
  useEffect(() => {
    if (ready) storage.saveSettings(settings);
  }, [ready, settings]);
  useEffect(() => {
    if (ready) storage.saveAlerts(alerts);
  }, [ready, alerts]);

  /** Detecta transições para warning/critical e registra alertas. */
  const registerAlerts = useCallback(
    (snapshot: Subsystem[], enabled: boolean) => {
      const timestamp = Date.now();
      const fresh: AlertEntry[] = [];
      for (const sub of snapshot) {
        for (const metric of sub.metrics) {
          const level = evaluateMetric(metric);
          const key = `${sub.key}:${metric.id}`;
          const prev = lastLevels.current[key] ?? 'nominal';
          const wasOk = prev === 'nominal' || prev === 'offline';
          const isBad = level === 'warning' || level === 'critical';
          // Dispara em qualquer agravamento (ok->ruim ou warning->critical).
          const worsened = isBad && (wasOk || (prev === 'warning' && level === 'critical'));
          if (worsened && enabled) {
            fresh.push(makeAlert(sub.key, metric, level, timestamp));
          }
          lastLevels.current[key] = level;
        }
      }
      if (fresh.length > 0) {
        setAlerts((prev) => [...fresh, ...prev].slice(0, MAX_ALERTS));
      }
    },
    [],
  );

  // ---- Loop de simulação (auto-refresh) ----
  useEffect(() => {
    if (!ready || !settings.autoRefresh) return;
    const intervalMs = Math.max(1, settings.refreshIntervalSec) * 1000;
    const id = setInterval(() => {
      setSubsystems((prev) => {
        const next = tickSubsystems(prev);
        registerAlerts(next, settings.alertsEnabled);
        return next;
      });
    }, intervalMs);
    return () => clearInterval(id);
  }, [ready, settings.autoRefresh, settings.refreshIntervalSec, settings.alertsEnabled, registerAlerts]);

  // ---- Ações expostas ----
  const updateMission = useCallback((next: MissionConfig) => setMission(next), []);

  const updateSettings = useCallback(
    (patch: Partial<Settings>) => setSettings((prev) => ({ ...prev, ...patch })),
    [],
  );

  const updateMetricValue = useCallback(
    (subsystemKey: SubsystemKey, metricId: string, value: number) => {
      setSubsystems((prev) => {
        const next = prev.map((sub) =>
          sub.key !== subsystemKey
            ? sub
            : {
                ...sub,
                metrics: sub.metrics.map((m) =>
                  m.id === metricId ? { ...m, value } : m,
                ),
              },
        );
        registerAlerts(next, settings.alertsEnabled);
        return next;
      });
    },
    [registerAlerts, settings.alertsEnabled],
  );

  const triggerAnomaly = useCallback(() => {
    setSubsystems((prev) => {
      const next = injectAnomaly(prev);
      registerAlerts(next, settings.alertsEnabled);
      return next;
    });
  }, [registerAlerts, settings.alertsEnabled]);

  const acknowledgeAlert = useCallback((id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)),
    );
  }, []);

  const acknowledgeAll = useCallback(() => {
    setAlerts((prev) => prev.map((a) => ({ ...a, acknowledged: true })));
  }, []);

  const clearAlerts = useCallback(() => setAlerts([]), []);

  const resetAll = useCallback(async () => {
    await storage.clearAll();
    lastLevels.current = {};
    setMission(defaultMission);
    setSubsystems(defaultSubsystems);
    setSettings(defaultSettings);
    setAlerts([]);
  }, []);

  const missionStatus = useMemo(() => evaluateMission(subsystems), [subsystems]);
  const unacknowledgedCount = useMemo(
    () => alerts.filter((a) => !a.acknowledged).length,
    [alerts],
  );

  const value = useMemo<MissionContextValue>(
    () => ({
      ready,
      mission,
      subsystems,
      settings,
      alerts,
      missionStatus,
      unacknowledgedCount,
      updateMission,
      updateSettings,
      updateMetricValue,
      triggerAnomaly,
      acknowledgeAlert,
      acknowledgeAll,
      clearAlerts,
      resetAll,
    }),
    [
      ready,
      mission,
      subsystems,
      settings,
      alerts,
      missionStatus,
      unacknowledgedCount,
      updateMission,
      updateSettings,
      updateMetricValue,
      triggerAnomaly,
      acknowledgeAlert,
      acknowledgeAll,
      clearAlerts,
      resetAll,
    ],
  );

  return <MissionContext.Provider value={value}>{children}</MissionContext.Provider>;
}

/** Hook de acesso ao estado global da missão. */
export function useMission(): MissionContextValue {
  const ctx = useContext(MissionContext);
  if (!ctx) {
    throw new Error('useMission deve ser usado dentro de <MissionProvider>.');
  }
  return ctx;
}
