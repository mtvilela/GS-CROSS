import type { MissionConfig } from '@/types';

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

/** Verdadeiro se a data está no formato yyyy-mm-dd e é um calendário válido. */
export function isValidIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [y, m, d] = value.split('-').map(Number);
  if (m < 1 || m > 12) return false;
  const date = new Date(Date.UTC(y, m - 1, d));
  return (
    date.getUTCFullYear() === y &&
    date.getUTCMonth() === m - 1 &&
    date.getUTCDate() === d
  );
}

/**
 * Valida o formulário de configuração da missão.
 * Regras: campos obrigatórios, formato do código, limites numéricos e data válida.
 */
export function validateMission(input: {
  name: string;
  code: string;
  commander: string;
  crewSize: string;
  launchDate: string;
  targetOrbitKm: string;
}): FieldErrors<MissionConfig> {
  const errors: FieldErrors<MissionConfig> = {};

  if (!input.name.trim()) {
    errors.name = 'Informe o nome da missão.';
  } else if (input.name.trim().length < 3) {
    errors.name = 'O nome deve ter ao menos 3 caracteres.';
  }

  if (!input.code.trim()) {
    errors.code = 'Informe o código da missão.';
  } else if (!/^[A-Z]{2,6}-[A-Z0-9]{1,4}$/.test(input.code.trim())) {
    errors.code = 'Use o formato AAA-000 (ex.: ARES-IX).';
  }

  if (!input.commander.trim()) {
    errors.commander = 'Informe o(a) comandante.';
  }

  const crew = Number(input.crewSize);
  if (!input.crewSize.trim()) {
    errors.crewSize = 'Informe o tamanho da tripulação.';
  } else if (!Number.isInteger(crew) || crew < 1 || crew > 12) {
    errors.crewSize = 'A tripulação deve ser um inteiro entre 1 e 12.';
  }

  if (!input.launchDate.trim()) {
    errors.launchDate = 'Informe a data de lançamento.';
  } else if (!isValidIsoDate(input.launchDate.trim())) {
    errors.launchDate = 'Data inválida. Use o formato AAAA-MM-DD.';
  }

  const orbit = Number(input.targetOrbitKm);
  if (!input.targetOrbitKm.trim()) {
    errors.targetOrbitKm = 'Informe a órbita-alvo.';
  } else if (Number.isNaN(orbit) || orbit < 150 || orbit > 2000) {
    errors.targetOrbitKm = 'A órbita-alvo deve estar entre 150 e 2000 km.';
  }

  return errors;
}

/** Valida os limites de uma métrica no formulário de edição manual. */
export function validateMetricValue(
  raw: string,
  min: number,
  max: number,
): string | null {
  if (!raw.trim()) return 'Informe um valor.';
  const value = Number(raw);
  if (Number.isNaN(value)) return 'O valor deve ser numérico.';
  if (value < min || value > max) {
    return `O valor deve estar entre ${min} e ${max}.`;
  }
  return null;
}

export function hasErrors<T>(errors: FieldErrors<T>): boolean {
  return Object.keys(errors).length > 0;
}
