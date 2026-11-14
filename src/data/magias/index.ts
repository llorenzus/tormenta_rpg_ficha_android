import magiasRaw from './magias.json';

export interface MagiaData {
  id: string;
  nome: string;
  nivel: number;
  tipo: string;
  escola: string;
  tempoExecucao: string;
  alcance: string;
  alvoAreaEfeito: string;
  duracao: string;
  resistencia?: string;
  componenteMaterial?: string;
  custoXp?: string;
  descricao: string;
}

export const magias: MagiaData[] = magiasRaw as unknown as MagiaData[];

/**
 * Agrupamento de magias por nível (0 a 9) calculado a partir do arquivo único.
 */
export const MAGIAS_POR_NIVEL: Record<number, MagiaData[]> = {
  0: magias.filter((m) => m.nivel === 0),
  1: magias.filter((m) => m.nivel === 1),
  2: magias.filter((m) => m.nivel === 2),
  3: magias.filter((m) => m.nivel === 3),
  4: magias.filter((m) => m.nivel === 4),
  5: magias.filter((m) => m.nivel === 5),
  6: magias.filter((m) => m.nivel === 6),
  7: magias.filter((m) => m.nivel === 7),
  8: magias.filter((m) => m.nivel === 8),
  9: magias.filter((m) => m.nivel === 9),
};

export const getMagiasPorNivel = (nivel: number): MagiaData[] => {
  return MAGIAS_POR_NIVEL[nivel] || [];
};

export const getMagiaPorId = (id: string): MagiaData | undefined => {
  return magias.find((m) => m.id === id);
};

export default magias;
