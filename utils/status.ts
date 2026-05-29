import type { StatusLevel } from '@/theme';
import type { Metric, Subsystem } from '@/types';

/** Classifica uma métrica em nominal / atenção / crítico conforme seus limites. */
export function evaluateMetric(metric: Metric): StatusLevel {
  const { value, warnLow, warnHigh, critLow, critHigh } = metric;
  if (value <= critLow || value >= critHigh) return 'critical';
  if (value <= warnLow || value >= warnHigh) return 'warning';
  return 'nominal';
}

const SEVERITY_ORDER: Record<StatusLevel, number> = {
  offline: 0,
  nominal: 1,
  warning: 2,
  critical: 3,
};

/** O status de um subsistema é o pior status entre suas métricas. */
export function evaluateSubsystem(subsystem: Subsystem): StatusLevel {
  return subsystem.metrics.reduce<StatusLevel>((worst, metric) => {
    const level = evaluateMetric(metric);
    return SEVERITY_ORDER[level] > SEVERITY_ORDER[worst] ? level : worst;
  }, 'nominal');
}

/** Status geral da missão a partir de todos os subsistemas. */
export function evaluateMission(subsystems: Subsystem[]): StatusLevel {
  return subsystems.reduce<StatusLevel>((worst, sub) => {
    const level = evaluateSubsystem(sub);
    return SEVERITY_ORDER[level] > SEVERITY_ORDER[worst] ? level : worst;
  }, 'nominal');
}

/** Posição relativa (0–1) do valor dentro da faixa min..max, usada nos gauges. */
export function metricFraction(metric: Metric): number {
  const span = metric.max - metric.min;
  if (span <= 0) return 0;
  const frac = (metric.value - metric.min) / span;
  return Math.min(1, Math.max(0, frac));
}

/** Formata um número de telemetria com casas decimais adequadas. */
export function formatValue(value: number): string {
  if (Number.isInteger(value)) return String(value);
  return value.toFixed(Math.abs(value) < 10 ? 2 : 1);
}
