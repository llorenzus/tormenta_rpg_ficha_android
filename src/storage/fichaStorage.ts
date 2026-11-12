import AsyncStorage from '@react-native-async-storage/async-storage';
import { criarPericiasPadrao, FichaPersonagem } from '../models/ficha';

const STORAGE_KEY = '@tormenta_rpg:fichas_v1';

function normalizarFicha(ficha: FichaPersonagem): FichaPersonagem {
  return {
    ...ficha,
    nivel: Math.max(1, Number(ficha.nivel) || 1),
    forca: Number.isFinite(ficha.forca) ? ficha.forca : 10,
    destreza: Number.isFinite(ficha.destreza) ? ficha.destreza : 10,
    constituicao: Number.isFinite(ficha.constituicao) ? ficha.constituicao : 10,
    inteligencia: Number.isFinite(ficha.inteligencia) ? ficha.inteligencia : 10,
    sabedoria: Number.isFinite(ficha.sabedoria) ? ficha.sabedoria : 10,
    carisma: Number.isFinite(ficha.carisma) ? ficha.carisma : 10,
    pericias:
      Array.isArray(ficha.pericias) && ficha.pericias.length > 0
        ? ficha.pericias
        : criarPericiasPadrao(),
    habilidadesRaca: Array.isArray(ficha.habilidadesRaca) ? ficha.habilidadesRaca : [],
    habilidadesClasse: Array.isArray(ficha.habilidadesClasse) ? ficha.habilidadesClasse : [],
    talentos: Array.isArray(ficha.talentos) ? ficha.talentos : [],
    magias: Array.isArray(ficha.magias) ? ficha.magias : [],
    armas: Array.isArray(ficha.armas) ? ficha.armas : [],
    armaduras: Array.isArray(ficha.armaduras) ? ficha.armaduras : [],
    itensGerais: Array.isArray(ficha.itensGerais) ? ficha.itensGerais : [],
    tibares: ficha.tibares || '',
  };
}

export async function carregarFichasLocais(): Promise<FichaPersonagem[]> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (!json) return [];
    const parsed = JSON.parse(json) as FichaPersonagem[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map(normalizarFicha)
      .sort((a, b) => (b.atualizadoEm || 0) - (a.atualizadoEm || 0));
  } catch (e) {
    console.warn('Erro ao carregar fichas locais:', e);
    return [];
  }
}

export async function salvarFichaLocal(ficha: FichaPersonagem): Promise<FichaPersonagem[]> {
  const atuais = await carregarFichasLocais();
  const atualizada = normalizarFicha({
    ...ficha,
    atualizadoEm: Date.now(),
  });
  const index = atuais.findIndex((item) => item.id === atualizada.id);
  let novaLista: FichaPersonagem[];
  if (index >= 0) {
    novaLista = [...atuais];
    novaLista[index] = atualizada;
  } else {
    novaLista = [atualizada, ...atuais];
  }
  novaLista.sort((a, b) => (b.atualizadoEm || 0) - (a.atualizadoEm || 0));
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(novaLista));
  return novaLista;
}

export async function excluirFichaLocal(fichaId: string): Promise<FichaPersonagem[]> {
  const atuais = await carregarFichasLocais();
  const filtrada = atuais.filter((item) => item.id !== fichaId);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtrada));
  return filtrada;
}

