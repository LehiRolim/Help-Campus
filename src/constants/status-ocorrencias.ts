export const nomesStatus = {
  aberta: 'Aberta',
  fechada: 'Fechada',
} as const;

export type StatusOcorrencia = keyof typeof nomesStatus;

export const filtrosStatus = [
  { value: 'todas', label: 'Todas' },
  { value: 'aberta', label: 'Abertas' },
  { value: 'fechada', label: 'Fechadas' },
] as const;

export type FiltroStatus = (typeof filtrosStatus)[number]['value'];
