import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Share } from 'react-native';
import {
  calcularCaTotal,
  criarPericiasPadrao,
  FichaPersonagem,
  gerarId,
} from '../models/ficha';

const STORAGE_KEY = '@tormenta_rpg:fichas_v1';
const MARCADOR_INICIO = '===TORMENTA_FICHA_INICIO===';
const MARCADOR_FIM = '===TORMENTA_FICHA_FIM===';

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

export function serializarFichaParaTxt(ficha: FichaPersonagem): string {
  const ca = calcularCaTotal(ficha);
  const nome = ficha.nomePersonagem?.trim() || 'Sem Nome';
  const raca = ficha.raca?.trim() || '-';
  const classe = ficha.classe?.trim() || '-';

  const linhasResumo = [
    '==========================================',
    `FICHA TORMENTA RPG: ${nome}`,
    '==========================================',
    `Raça: ${raca} | Classe: ${classe} | Nível: ${ficha.nivel}`,
    `PV: ${ficha.pvAtual}/${ficha.pvTotal} | PM: ${ficha.pmAtual}/${ficha.pmTotal} | CA: ${ca} | BBA: +${ficha.bba}`,
    `FOR: ${ficha.forca} | DES: ${ficha.destreza} | CON: ${ficha.constituicao} | INT: ${ficha.inteligencia} | SAB: ${ficha.sabedoria} | CAR: ${ficha.carisma}`,
    '',
    'Para importar esta ficha no aplicativo Tormenta RPG,',
    'basta selecionar este arquivo .txt na opção "Importar Ficha".',
    '',
    MARCADOR_INICIO,
    JSON.stringify(ficha, null, 2),
    MARCADOR_FIM,
    '',
  ];

  return linhasResumo.join('\n');
}

export function extrairFichaDeTxt(conteudo: string): FichaPersonagem {
  const texto = conteudo.trim();
  let jsonStr = texto;

  const idxInicio = texto.indexOf(MARCADOR_INICIO);
  const idxFim = texto.indexOf(MARCADOR_FIM);

  if (idxInicio !== -1 && idxFim !== -1 && idxFim > idxInicio) {
    jsonStr = texto.substring(idxInicio + MARCADOR_INICIO.length, idxFim).trim();
  } else {
    const primeiroBrace = texto.indexOf('{');
    const ultimoBrace = texto.lastIndexOf('}');
    if (primeiroBrace !== -1 && ultimoBrace > primeiroBrace) {
      jsonStr = texto.substring(primeiroBrace, ultimoBrace + 1);
    }
  }

  const parsed = JSON.parse(jsonStr);
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Formato de arquivo inválido.');
  }

  const novaFicha: FichaPersonagem = normalizarFicha({
    ...parsed,
    id: gerarId(),
    atualizadoEm: Date.now(),
    nomePersonagem:
      typeof parsed.nomePersonagem === 'string' && parsed.nomePersonagem.trim()
        ? parsed.nomePersonagem.trim()
        : 'Personagem Importado',
  });

  return novaFicha;
}

export async function exportarFichaArquivoTxt(ficha: FichaPersonagem): Promise<void> {
  const conteudoTxt = serializarFichaParaTxt(ficha);
  const slugNome = (ficha.nomePersonagem || 'personagem')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/gi, '_')
    .replace(/^_+|_+$/g, '') || 'personagem';

  const nomeArquivo = `ficha_tormenta_${slugNome}.txt`;
  const diretorio = FileSystem.cacheDirectory || FileSystem.documentDirectory;

  if (diretorio) {
    const fileUri = `${diretorio}${nomeArquivo}`;
    await FileSystem.writeAsStringAsync(fileUri, conteudoTxt, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    const podeCompartilhar = await Sharing.isAvailableAsync();
    if (podeCompartilhar) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/plain',
        dialogTitle: `Exportar Ficha - ${ficha.nomePersonagem || 'Personagem'}`,
        UTI: 'public.plain-text',
      });
      return;
    }
  }

  await Share.share({
    title: `Ficha Tormenta RPG - ${ficha.nomePersonagem || 'Personagem'}`,
    message: conteudoTxt,
  });
}

export async function importarFichaArquivoTxt(): Promise<{
  lista: FichaPersonagem[];
  fichaImportada: FichaPersonagem;
} | null> {
  const resultado = await DocumentPicker.getDocumentAsync({
    type: ['text/plain', 'application/json', '*/*'],
    copyToCacheDirectory: true,
    multiple: false,
  });

  if (resultado.canceled || !resultado.assets || resultado.assets.length === 0) {
    return null;
  }

  const arquivo = resultado.assets[0];
  const conteudo = await FileSystem.readAsStringAsync(arquivo.uri, {
    encoding: FileSystem.EncodingType.UTF8,
  });

  const fichaImportada = extrairFichaDeTxt(conteudo);
  const lista = await salvarFichaLocal(fichaImportada);
  return { lista, fichaImportada };
}
