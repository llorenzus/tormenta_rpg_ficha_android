import talentosRaw from './talentos.json';

export type CategoriaTalento =
  | 'Combate'
  | 'Perícia'
  | 'Magia'
  | 'Destino'
  | 'Poderes Concedidos'
  | 'Tormenta';

export interface TalentoData {
  id: string;
  nome: string;
  categoria: CategoriaTalento;
  preRequisitos: string;
  beneficio: string;
  descricao: string;
}

export const talentos: TalentoData[] = talentosRaw as unknown as TalentoData[];

export const TALENTOS_POR_CATEGORIA: Record<CategoriaTalento, TalentoData[]> = {
  Combate: talentos.filter((t) => t.categoria === 'Combate'),
  Perícia: talentos.filter((t) => t.categoria === 'Perícia'),
  Magia: talentos.filter((t) => t.categoria === 'Magia'),
  Destino: talentos.filter((t) => t.categoria === 'Destino'),
  'Poderes Concedidos': talentos.filter((t) => t.categoria === 'Poderes Concedidos'),
  Tormenta: talentos.filter((t) => t.categoria === 'Tormenta'),
};

export const getTalentosPorCategoria = (categoria: CategoriaTalento): TalentoData[] => {
  return TALENTOS_POR_CATEGORIA[categoria] || [];
};

export const getTalentoPorId = (id: string): TalentoData | undefined => {
  return talentos.find((t) => t.id === id);
};

export default talentos;
