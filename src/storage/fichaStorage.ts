import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Platform, Share } from 'react-native';
import {
  FichaPersonagem,
  criarPericiasPadrao,
  existeFichaComMesmoNome,
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
 * 1. SALVAR PDF LOCALMENTE NO APARELHO
 * Solicita ao usuário a pasta onde deseja salvar no Android (SAF) ou compartilha para salvar em arquivos.
 */
export async function salvarPdfNoAparelho(ficha: FichaPersonagem): Promise<boolean> {
  const html = gerarHtmlFichaPdf(ficha);
  const slug = gerarSlugNome(ficha.nomePersonagem || 'personagem');
  const nomeArquivo = `ficha_tormenta_${slug}_${Date.now()}`;

  const resultado = await Print.printToFileAsync({
    html,
    base64: true,
  });

  if (!resultado.base64) {
    throw new Error('Não foi possível gerar os dados do PDF.');
  }

  // No Android, usa StorageAccessFramework para o usuário escolher a pasta de destino
  if (Platform.OS === 'android' && FileSystem.StorageAccessFramework) {
    const permissao = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
    if (!permissao.granted) {
      return false; // Usuário cancelou a seleção da pasta
    }

    const safUri = await FileSystem.StorageAccessFramework.createFileAsync(
      permissao.directoryUri,
      nomeArquivo,
      'application/pdf'
    );

    await FileSystem.writeAsStringAsync(safUri, resultado.base64, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return true;
  }

  // Fallback (iOS ou SAF indisponível)
  const diretorio = FileSystem.documentDirectory || FileSystem.cacheDirectory;
  if (diretorio) {
    const fileUri = `${diretorio}${nomeArquivo}.pdf`;
    await FileSystem.writeAsStringAsync(fileUri, resultado.base64, {
      encoding: FileSystem.EncodingType.Base64,
    });
    await Sharing.shareAsync(fileUri, {
      mimeType: 'application/pdf',
      dialogTitle: `Salvar PDF - ${ficha.nomePersonagem || 'Personagem'}`,
      UTI: 'com.adobe.pdf',
    });
    return true;
  }

  return false;
}

/**
 * 2. SALVAR JSON LOCALMENTE NO APARELHO
 * Solicita ao usuário a pasta onde deseja salvar no Android (SAF) ou compartilha para salvar em arquivos.
 */
export async function salvarJsonNoAparelho(ficha: FichaPersonagem): Promise<boolean> {
  const payload: EnvelopeExportacaoFicha = {
    tipoArquivo: 'TORMENTA_RPG_FICHA',
    versaoApp: '1.1.0',
    exportadoEm: new Date().toISOString(),
    ficha: normalizarFicha(ficha),
  };

  const conteudoJson = JSON.stringify(payload, null, 2);
  const slug = gerarSlugNome(ficha.nomePersonagem || 'personagem');
  const nomeArquivo = `ficha_tormenta_${slug}_${Date.now()}`;

  if (Platform.OS === 'android' && FileSystem.StorageAccessFramework) {
    const permissao = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
    if (!permissao.granted) {
      return false; // Usuário cancelou
    }

    const safUri = await FileSystem.StorageAccessFramework.createFileAsync(
      permissao.directoryUri,
      nomeArquivo,
      'application/json'
    );

    await FileSystem.writeAsStringAsync(safUri, conteudoJson, {
      encoding: FileSystem.EncodingType.UTF8,
    });
    return true;
  }

  const diretorio = FileSystem.documentDirectory || FileSystem.cacheDirectory;
  if (diretorio) {
    const fileUri = `${diretorio}${nomeArquivo}.json`;
    await FileSystem.writeAsStringAsync(fileUri, conteudoJson, {
      encoding: FileSystem.EncodingType.UTF8,
    });
    await Sharing.shareAsync(fileUri, {
      mimeType: 'application/json',
      dialogTitle: `Salvar JSON - ${ficha.nomePersonagem || 'Personagem'}`,
      UTI: 'public.json',
    });
    return true;
  }

  return false;
}

/**
 * 3. COMPARTILHAR PDF
 * Gera o arquivo em cache temporário com identificador único (evita erro de file not found em chamadas seguidas)
 * e abre o menu nativo de compartilhamento do sistema.
 */
export async function compartilharPdf(ficha: FichaPersonagem): Promise<void> {
  const html = gerarHtmlFichaPdf(ficha);
  const slug = gerarSlugNome(ficha.nomePersonagem || 'personagem');

  const resultado = await Print.printToFileAsync({
    html,
    base64: true,
  });

  const diretorio = FileSystem.cacheDirectory || FileSystem.documentDirectory;
  if (!diretorio || !resultado.base64) {
    throw new Error('Falha ao processar o arquivo PDF temporário.');
  }

  const randomSuffix = Math.random().toString(36).substring(2, 7);
  const nomeArquivo = `ficha_tormenta_${slug}_${Date.now()}_${randomSuffix}.pdf`;
  const destinoUri = `${diretorio}${nomeArquivo}`;

  await FileSystem.writeAsStringAsync(destinoUri, resultado.base64, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const podeCompartilhar = await Sharing.isAvailableAsync();
  if (podeCompartilhar) {
    await Sharing.shareAsync(destinoUri, {
      mimeType: 'application/pdf',
      dialogTitle: `Compartilhar Ficha (PDF) - ${ficha.nomePersonagem || 'Personagem'}`,
      UTI: 'com.adobe.pdf',
    });
  } else {
    await Print.printAsync({ html });
  }
}

/**
 * 4. COMPARTILHAR JSON
 * Gera o arquivo .json temporário com identificador único e abre o menu de compartilhamento.
 */
export async function compartilharJson(ficha: FichaPersonagem): Promise<void> {
  const payload: EnvelopeExportacaoFicha = {
    tipoArquivo: 'TORMENTA_RPG_FICHA',
    versaoApp: '1.1.0',
    exportadoEm: new Date().toISOString(),
    ficha: normalizarFicha(ficha),
  };

  const conteudoJson = JSON.stringify(payload, null, 2);
  const slug = gerarSlugNome(ficha.nomePersonagem || 'personagem');
  const diretorio = FileSystem.cacheDirectory || FileSystem.documentDirectory;

  if (diretorio) {
    const randomSuffix = Math.random().toString(36).substring(2, 7);
    const nomeArquivo = `ficha_tormenta_${slug}_${Date.now()}_${randomSuffix}.json`;
    const fileUri = `${diretorio}${nomeArquivo}`;

    await FileSystem.writeAsStringAsync(fileUri, conteudoJson, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    const podeCompartilhar = await Sharing.isAvailableAsync();
    if (podeCompartilhar) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/json',
        dialogTitle: `Compartilhar Ficha (JSON) - ${ficha.nomePersonagem || 'Personagem'}`,
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
 * 5. IMPRESSÃO DIRETA
 * Abre o spooler de impressão nativo do sistema operacional.
 */
export async function imprimirFichaDireto(ficha: FichaPersonagem): Promise<void> {
  const html = gerarHtmlFichaPdf(ficha);
  await Print.printAsync({ html });
}

// Aliases para retrocompatibilidade
export const exportarFichaArquivoPdf = compartilharPdf;
export const exportarFichaArquivoJson = compartilharJson;

/**
 * 6. IMPORTAR FICHA JSON
 * Lê o arquivo .json selecionado e valida se não há personagem existente com o mesmo nome.
 */
export async function importarFichaArquivoJson(fichasExistentes: FichaPersonagem[] = []): Promise<{
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

  let dadosFicha: any;
  if (parsed.tipoArquivo === 'TORMENTA_RPG_FICHA' && parsed.ficha) {
    dadosFicha = parsed.ficha;
  } else if (parsed.nomePersonagem !== undefined || parsed.forca !== undefined) {
    dadosFicha = parsed;
  } else {
    throw new Error('O arquivo JSON não corresponde à estrutura de uma ficha do Tormenta RPG.');
  }

  const nomeCandidato =
    typeof dadosFicha.nomePersonagem === 'string' && dadosFicha.nomePersonagem.trim()
      ? dadosFicha.nomePersonagem.trim()
      : 'Personagem Importado';

  // Validação: não permitir importar personagem com nome já existente
  if (existeFichaComMesmoNome(fichasExistentes, nomeCandidato)) {
    throw new Error(
      `Já existe uma ficha salva com o nome "${nomeCandidato}". Altere o nome na ficha existente ou no arquivo JSON antes de importar.`
    );
  }

  const fichaImportada: FichaPersonagem = normalizarFicha({
    ...dadosFicha,
    id: gerarId(),
    atualizadoEm: Date.now(),
    nomePersonagem: nomeCandidato,
  });

  const lista = await salvarFichaLocal(fichaImportada);
  return { lista, fichaImportada };
}
