import type { Metric, Subsystem } from '@/types';

/**
 * Motor de simulação de telemetria.
 * A cada "tick" cada métrica sofre um pequeno passeio aleatório (random walk),
 * mantida dentro dos limites min..max do gauge. Isso dá ao painel a sensação
 * de uma missão "ao vivo" sem depender de backend.
 */

/** Amplitude do passo por métrica, proporcional à faixa do gauge. */
function stepFor(metric: Metric): number {
  return (metric.max - metric.min) * 0.04;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Arredonda mantendo 2 casas para valores pequenos (ex.: radiação, velocidade). */
function round(value: number): number {
  return Math.round(value * 100) / 100;
}

function nextValue(metric: Metric): number {
  const step = stepFor(metric);
  // Passo aleatório no intervalo [-step, +step].
  const delta = (Math.random() * 2 - 1) * step;
  return round(clamp(metric.value + delta, metric.min, metric.max));
}

/** Retorna uma nova lista de subsistemas com valores atualizados (imutável). */
export function tickSubsystems(subsystems: Subsystem[]): Subsystem[] {
  return subsystems.map((sub) => ({
    ...sub,
    metrics: sub.metrics.map((metric) => ({
      ...metric,
      value: nextValue(metric),
    })),
  }));
}

/**
 * Empurra uma métrica para uma condição crítica — usado pelo botão
 * "Simular anomalia" para demonstrar o disparo de alertas.
 */
export function injectAnomaly(subsystems: Subsystem[]): Subsystem[] {
  if (subsystems.length === 0) return subsystems;
  const subIndex = Math.floor(Math.random() * subsystems.length);
  return subsystems.map((sub, sIdx) => {
    if (sIdx !== subIndex) return sub;
    const mIndex = Math.floor(Math.random() * sub.metrics.length);
    return {
      ...sub,
      metrics: sub.metrics.map((metric, mIdx) => {
        if (mIdx !== mIndex) return metric;
        // Empurra acima do limite crítico superior (ou abaixo do inferior).
        const goHigh = metric.critHigh < metric.max;
        const target = goHigh
          ? Math.min(metric.max, metric.critHigh + (metric.max - metric.critHigh) * 0.6)
          : Math.max(metric.min, metric.critLow - (metric.critLow - metric.min) * 0.6);
        return { ...metric, value: round(target) };
      }),
    };
  });
}
