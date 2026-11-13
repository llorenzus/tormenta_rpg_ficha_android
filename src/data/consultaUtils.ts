import { gerarId, HabilidadeOuTalento, MagiaItem } from '../models/ficha';
import { MagiaData, magias } from './magias';
import { CategoriaTalento, TalentoData, talentos } from './talentos';

export const normalizarTexto = (texto: string): string => {
  if (!texto) return '';
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
};

export const formatarDescricaoTalento = (talento: TalentoData): string => {
  const partes: string[] = [];
  partes.push(`[${talento.categoria}]`);
  if (talento.preRequisitos && talento.preRequisitos.trim()) {
    partes.push(`Pré-requisitos: ${talento.preRequisitos}`);
  }
  if (talento.beneficio && talento.beneficio.trim()) {
    partes.push(`Benefício: ${talento.beneficio}`);
  }
  if (talento.descricao && talento.descricao.trim()) {
    partes.push(`\n${talento.descricao}`);
  }
  return partes.join('\n');
};

export const formatarDescricaoMagia = (magia: MagiaData): string => {
  const partes: string[] = [];
  partes.push(`[${magia.escola} • ${magia.tipo}]`);

  const detalhesCabecalho: string[] = [];
  if (magia.tempoExecucao) detalhesCabecalho.push(`Execução: ${magia.tempoExecucao}`);
  if (magia.alcance) detalhesCabecalho.push(`Alcance: ${magia.alcance}`);
  if (magia.alvoAreaEfeito) detalhesCabecalho.push(`Área/Alvo: ${magia.alvoAreaEfeito}`);
  if (magia.duracao) detalhesCabecalho.push(`Duração: ${magia.duracao}`);
  if (magia.resistencia) detalhesCabecalho.push(`Resistência: ${magia.resistencia}`);

  if (detalhesCabecalho.length > 0) {
    partes.push(detalhesCabecalho.join(' | '));
  }

  if (magia.componenteMaterial) {
    partes.push(`Componente Material: ${magia.componenteMaterial}`);
  }
  if (magia.custoXp) {
    partes.push(`Custo em XP: ${magia.custoXp}`);
  }

  if (magia.descricao) {
    partes.push(`\n${magia.descricao}`);
  }

  return partes.join('\n');
};

export const converterTalentoParaItem = (talento: TalentoData): HabilidadeOuTalento => {
  return {
    id: gerarId(),
    nome: talento.nome,
    descricao: formatarDescricaoTalento(talento),
  };
};

export const converterMagiaParaItem = (magia: MagiaData): MagiaItem => {
  return {
    id: gerarId(),
    nivelCirculo: magia.nivel,
    nome: magia.nome,
    custoPm: magia.nivel === 0 ? '0' : String(magia.nivel),
    descricao: formatarDescricaoMagia(magia),
  };
};

export const buscarTalentosSugeridos = (
  termo: string,
  categoria?: CategoriaTalento,
  limite = 8
): TalentoData[] => {
  const norm = normalizarTexto(termo);
  if (!norm || norm.length < 2) return [];

  let lista = talentos;
  if (categoria) {
    lista = lista.filter((t) => t.categoria === categoria);
  }

  const exatos: TalentoData[] = [];
  const comecaCom: TalentoData[] = [];
  const contem: TalentoData[] = [];

  for (const t of lista) {
    const nomeNorm = normalizarTexto(t.nome);
    if (nomeNorm === norm) {
      exatos.push(t);
    } else if (nomeNorm.startsWith(norm)) {
      comecaCom.push(t);
    } else if (nomeNorm.includes(norm)) {
      contem.push(t);
    }
    if (exatos.length + comecaCom.length + contem.length >= limite * 2) break;
  }

  return [...exatos, ...comecaCom, ...contem].slice(0, limite);
};

export const buscarMagiasSugeridas = (
  termo: string,
  nivelFiltro?: number | null,
  limite = 8
): MagiaData[] => {
  const norm = normalizarTexto(termo);
  if (!norm || norm.length < 2) return [];

  let lista = magias;
  if (nivelFiltro !== undefined && nivelFiltro !== null) {
    lista = lista.filter((m) => m.nivel === nivelFiltro);
  }

  const exatos: MagiaData[] = [];
  const comecaCom: MagiaData[] = [];
  const contem: MagiaData[] = [];

  for (const m of lista) {
    const nomeNorm = normalizarTexto(m.nome);
    if (nomeNorm === norm) {
      exatos.push(m);
    } else if (nomeNorm.startsWith(norm)) {
      comecaCom.push(m);
    } else if (nomeNorm.includes(norm)) {
      contem.push(m);
    }
    if (exatos.length + comecaCom.length + contem.length >= limite * 2) break;
  }

  return [...exatos, ...comecaCom, ...contem].slice(0, limite);
};

export interface FiltrosTalentos {
  termo?: string;
  categoria?: CategoriaTalento | 'Todas';
}

export const filtrarTalentos = ({
  termo = '',
  categoria = 'Todas',
}: FiltrosTalentos): TalentoData[] => {
  const normTermo = normalizarTexto(termo);

  return talentos.filter((t) => {
    if (categoria !== 'Todas' && t.categoria !== categoria) {
      return false;
    }
    if (!normTermo) return true;

    const nomeNorm = normalizarTexto(t.nome);
    const descNorm = normalizarTexto(t.descricao);
    const benefNorm = normalizarTexto(t.beneficio);
    const reqNorm = normalizarTexto(t.preRequisitos);

    return (
      nomeNorm.includes(normTermo) ||
      benefNorm.includes(normTermo) ||
      descNorm.includes(normTermo) ||
      reqNorm.includes(normTermo)
    );
  });
};

export interface FiltrosMagias {
  termo?: string;
  nivel?: number | null; // null = todos
  tipo?: 'Todas' | 'Arcana' | 'Divina';
  escola?: string | 'Todas';
}

export const filtrarMagias = ({
  termo = '',
  nivel = null,
  tipo = 'Todas',
  escola = 'Todas',
}: FiltrosMagias): MagiaData[] => {
  const normTermo = normalizarTexto(termo);
  const normTipo = normalizarTexto(tipo);
  const normEscola = normalizarTexto(escola);

  return magias.filter((m) => {
    if (nivel !== null && m.nivel !== nivel) {
      return false;
    }

    if (tipo !== 'Todas') {
      const tipoMagiaNorm = normalizarTexto(m.tipo);
      if (!tipoMagiaNorm.includes(normTipo)) {
        return false;
      }
    }

    if (escola !== 'Todas') {
      const escolaMagiaNorm = normalizarTexto(m.escola);
      if (!escolaMagiaNorm.includes(normEscola)) {
        return false;
      }
    }

    if (!normTermo) return true;

    const nomeNorm = normalizarTexto(m.nome);
    const descNorm = normalizarTexto(m.descricao);

    return nomeNorm.includes(normTermo) || descNorm.includes(normTermo);
  });
};

export const ESCOLAS_MAGIA = [
  'Todas',
  'Abjuração',
  'Adivinhação',
  'Convocação',
  'Encantamento',
  'Evocação',
  'Ilusão',
  'Necromancia',
  'Transmutação',
];

export const CATEGORIAS_TALENTO: Array<CategoriaTalento | 'Todas'> = [
  'Todas',
  'Combate',
  'Destino',
  'Magia',
  'Perícia',
  'Poderes Concedidos',
  'Tormenta',
];
