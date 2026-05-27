/**
 * Tema visual da Central de Monitoramento de Missões Espaciais.
 * Paleta inspirada em painéis de controle de centros aeroespaciais:
 * fundo profundo do espaço, acentos neon e cores semânticas de status.
 */

export const colors = {
  // Fundos
  space: '#05070f',
  spaceDeep: '#02030a',
  panel: '#0d1325',
  panelAlt: '#121b33',
  panelBorder: '#1f2c4d',

  // Texto
  text: '#e6ecff',
  textMuted: '#8c98c4',
  textDim: '#5b678f',

  // Acentos / marca
  primary: '#22d3ee', // ciano de telemetria
  primaryDim: '#0e7490',
  accent: '#7c5cff', // roxo orbital

  // Status semântico
  nominal: '#34d399', // verde — tudo ok
  warning: '#fbbf24', // amarelo — atenção
  critical: '#f87171', // vermelho — crítico
  offline: '#64748b', // cinza — sem dados

  // Utilitários
  overlay: 'rgba(2, 3, 10, 0.7)',
  glow: 'rgba(34, 211, 238, 0.25)',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 18,
  pill: 999,
} as const;

export const typography = {
  mono: 'monospace',
} as const;

export type StatusLevel = 'nominal' | 'warning' | 'critical' | 'offline';

export const statusColor = (level: StatusLevel): string => colors[level];

export const statusLabel = (level: StatusLevel): string => {
  switch (level) {
    case 'nominal':
      return 'NOMINAL';
    case 'warning':
      return 'ATENÇÃO';
    case 'critical':
      return 'CRÍTICO';
    default:
      return 'OFFLINE';
  }
};
