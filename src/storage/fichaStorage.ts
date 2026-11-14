import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Share } from 'react-native';
import {
  FichaPersonagem,
  criarPericiasPadrao,
  gerarId,
} from '../models/ficha';
import { gerarHtmlFichaPdf } from './fichaPdfGenerator';

const STORAGE_KEY = '@tormenta_rpg:fichas_v1';

export interface EnvelopeExportacaoFicha {
  tipoArquivo: 'TORMENTA_RPG_FICHA';
  versaoApp: string;
  exportadoEm: string;
  ficha: FichaPersonagem;
}

export function normalizarFicha(ficha: FichaPersonagem): FichaPersonagem {
  return {
    ...ficha,
    nivel: Math.max(1, Number(ficha.nivel) || 1),
    forca: Number.isFinite(ficha.forca) ? ficha.forca : 10,
    destreza: Number.isFinite(ficha.destreza) ? ficha.destreza : 10,
    constituicao: Number.isFinite(ficha.constituicao) ? ficha.constituicao : 10,
    inteligencia: Number.isFinite(ficha.inteligencia) ? ficha.inteligencia : 10,
    sabedoria: Number.isFinite(ficha.sabedoria) ? ficha.sabedoria : 10,
    carisma: Number.isFinite(ficha.carisma) ? ficha.carisma : 10,
    pvTotal: Number.isFinite(ficha.pvTotal) ? ficha.pvTotal : 10,
    pvAtual: Number.isFinite(ficha.pvAtual) ? ficha.pvAtual : 10,
    pmTotal: Number.isFinite(ficha.pmTotal) ? ficha.pmTotal : 0,
    pmAtual: Number.isFinite(ficha.pmAtual) ? ficha.pmAtual : 0,
    bba: Number.isFinite(ficha.bba) ? ficha.bba : 0,
    caBonusTamanho: Number.isFinite(ficha.caBonusTamanho) ? ficha.caBonusTamanho : 0,
    caOutrosBonus: Number.isFinite(ficha.caOutrosBonus) ? ficha.caOutrosBonus : 0,
    fortitudeOutros: Number.isFinite(ficha.fortitudeOutros) ? ficha.fortitudeOutros : 0,
    reflexosOutros: Number.isFinite(ficha.reflexosOutros) ? ficha.reflexosOutros : 0,
    vontadeOutros: Number.isFinite(ficha.vontadeOutros) ? ficha.vontadeOutros : 0,
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

export function gerarSlugNome(nome?: string): string {
  return (nome || 'personagem')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9_-]+/gi, '_')
    .replace(/^_+|_+$/g, '') || 'personagem';
}

/**
 * Exporta a ficha em formato JSON estruturado para importação em outro dispositivo.
 */
export async function exportarFichaArquivoJson(ficha: FichaPersonagem): Promise<void> {
  const payload: EnvelopeExportacaoFicha = {
    tipoArquivo: 'TORMENTA_RPG_FICHA',
    versaoApp: '1.1.0',
    exportadoEm: new Date().toISOString(),
    ficha: normalizarFicha(ficha),
  };

  const conteudoJson = JSON.stringify(payload, null, 2);
  const slug = gerarSlugNome(ficha.nomePersonagem);
  const nomeArquivo = `ficha_tormenta_${slug}.json`;
  const diretorio = FileSystem.cacheDirectory || FileSystem.documentDirectory;

  if (diretorio) {
    const fileUri = `${diretorio}${nomeArquivo}`;
    await FileSystem.writeAsStringAsync(fileUri, conteudoJson, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    const podeCompartilhar = await Sharing.isAvailableAsync();
    if (podeCompartilhar) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/json',
        dialogTitle: `Exportar Ficha (JSON) - ${ficha.nomePersonagem || 'Personagem'}`,
        UTI: 'public.json',
      });
      return;
    }
  }

  await Share.share({
    title: `Ficha Tormenta RPG - ${ficha.nomePersonagem || 'Personagem'}`,
    message: conteudoJson,
  });
}

/**
 * Exporta a ficha formatada em PDF profissional para impressão ou visualização.
 */
export async function exportarFichaArquivoPdf(ficha: FichaPersonagem): Promise<void> {
  const html = gerarHtmlFichaPdf(ficha);
  const slug = gerarSlugNome(ficha.nomePersonagem);

  // Gera o PDF a partir do HTML estilizado
  const { uri } = await Print.printToFileAsync({
    html,
    base64: false,
  });

  // Copia/move para um nome de arquivo amigável caso haja diretório de cache
  let uriFinal = uri;
  const diretorio = FileSystem.cacheDirectory || FileSystem.documentDirectory;
  if (diretorio) {
    const destinoUri = `${diretorio}ficha_tormenta_${slug}.pdf`;
    try {
      await FileSystem.copyAsync({ from: uri, to: destinoUri });
      uriFinal = destinoUri;
    } catch {
      uriFinal = uri;
    }
  }

  const podeCompartilhar = await Sharing.isAvailableAsync();
  if (podeCompartilhar) {
    await Sharing.shareAsync(uriFinal, {
      mimeType: 'application/pdf',
      dialogTitle: `Exportar Ficha (PDF) - ${ficha.nomePersonagem || 'Personagem'}`,
      UTI: 'com.adobe.pdf',
    });
  } else {
    throw new Error('O compartilhamento de arquivos não está disponível neste dispositivo.');
  }
}

/**
 * Importa uma ficha a partir de um arquivo .json selecionado pelo usuário.
 */
export async function importarFichaArquivoJson(): Promise<{
  lista: FichaPersonagem[];
  fichaImportada: FichaPersonagem;
} | null> {
  const resultado = await DocumentPicker.getDocumentAsync({
    type: ['application/json', 'text/json', '*/*'],
    copyToCacheDirectory: true,
    multiple: false,
  });

  if (resultado.canceled || !resultado.assets || resultado.assets.length === 0) {
    return null;
  }

  const arquivo = resultado.assets[0];

  // Validação por extensão se o picker do Android retornar tipo genérico
  if (arquivo.name && !arquivo.name.toLowerCase().endsWith('.json')) {
    throw new Error('Apenas arquivos no formato .json são aceitos para importação de ficha.');
  }

  const conteudo = await FileSystem.readAsStringAsync(arquivo.uri, {
    encoding: FileSystem.EncodingType.UTF8,
  });

  let parsed: any;
  try {
    parsed = JSON.parse(conteudo);
  } catch {
    throw new Error('O arquivo selecionado não contém um JSON válido.');
  }

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Formato do arquivo de ficha inválido.');
  }

  // Suporte a envelope { tipoArquivo: 'TORMENTA_RPG_FICHA', ficha: {...} } ou ficha direta
  let dadosFicha: any;
  if (parsed.tipoArquivo === 'TORMENTA_RPG_FICHA' && parsed.ficha) {
    dadosFicha = parsed.ficha;
  } else if (parsed.nomePersonagem !== undefined || parsed.forca !== undefined) {
    dadosFicha = parsed;
  } else {
    throw new Error('O arquivo JSON não corresponde à estrutura de uma ficha do Tormenta RPG.');
  }

  const fichaImportada: FichaPersonagem = normalizarFicha({
    ...dadosFicha,
    id: gerarId(),
    atualizadoEm: Date.now(),
    nomePersonagem:
      typeof dadosFicha.nomePersonagem === 'string' && dadosFicha.nomePersonagem.trim()
        ? dadosFicha.nomePersonagem.trim()
        : 'Personagem Importado',
  });

  const lista = await salvarFichaLocal(fichaImportada);
  return { lista, fichaImportada };
}
