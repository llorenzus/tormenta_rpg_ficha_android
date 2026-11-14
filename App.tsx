import React, { useEffect, useState } from 'react';
import {
  Alert,
  BackHandler,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { CompendioModal } from './src/components/CompendioModal';
import { ModalExportarFicha } from './src/components/ModalExportarFicha';
import {
  converterMagiaParaItem,
  converterTalentoParaItem,
  MagiaData,
  TalentoData,
} from './src/data';
import {
  criarNovaFichaPadrao,
  FichaPersonagem,
  gerarProximoNomePadrao,
} from './src/models/ficha';
import { FichaDetalheScreen } from './src/screens/FichaDetalheScreen';
import { ListaFichasScreen } from './src/screens/ListaFichasScreen';
import { TelaInicialScreen } from './src/screens/TelaInicialScreen';
import {
  carregarFichasLocais,
  compartilharJson,
  compartilharPdf,
  excluirFichaLocal,
  imprimirFichaDireto,
  importarFichaArquivoJson,
  salvarFichaLocal,
  salvarJsonNoAparelho,
  salvarPdfNoAparelho,
} from './src/storage/fichaStorage';
import { COLORS } from './src/theme/colors';

export default function App() {
  const [iniciado, setIniciado] = useState(false);
  const [fichas, setFichas] = useState<FichaPersonagem[]>([]);
  const [fichaAberta, setFichaAberta] = useState<FichaPersonagem | null>(null);
  const [compendioGeralAberto, setCompendioGeralAberto] = useState(false);
  const [fichaParaExportar, setFichaParaExportar] = useState<FichaPersonagem | null>(null);

  useEffect(() => {
    carregarFichasLocais().then(setFichas);
  }, []);

  const handleVoltarDaFicha = async () => {
    if (!fichaAberta) {
      setFichaAberta(null);
      return;
    }

    const nomeTrim = fichaAberta.nomePersonagem?.trim();

    // Se o nome ficou vazio ao sair, gera o próximo nome padrão
    if (!nomeTrim) {
      const nomePadrao = gerarProximoNomePadrao(fichas, fichaAberta.id);
      const fichaSalva = { ...fichaAberta, nomePersonagem: nomePadrao };
      const listaAtualizada = await salvarFichaLocal(fichaSalva);
      setFichas(listaAtualizada);
    } else {
      const listaAtualizada = await salvarFichaLocal(fichaAberta);
      setFichas(listaAtualizada);
    }

    setFichaAberta(null);
  };

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (compendioGeralAberto) {
        setCompendioGeralAberto(false);
        return true;
      }
      if (fichaParaExportar) {
        setFichaParaExportar(null);
        return true;
      }
      if (fichaAberta) {
        handleVoltarDaFicha();
        return true;
      }
      if (iniciado) {
        setIniciado(false);
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [compendioGeralAberto, fichaParaExportar, fichaAberta, iniciado, fichas]);

  const handleCriarNova = () => {
    // Cria ficha nova com nome vazio conforme especificação
    const nova = criarNovaFichaPadrao();
    setFichaAberta(nova);
  };

  const handleAtualizarFicha = async (editada: FichaPersonagem) => {
    setFichaAberta(editada);
    // Persistência contínua dos dados
    const listaAtualizada = await salvarFichaLocal(editada);
    setFichas(listaAtualizada);
  };

  const handleSalvarManual = async (): Promise<boolean> => {
    if (!fichaAberta) return false;

    let fichaFinal: FichaPersonagem;
    const nomeTrim = fichaAberta.nomePersonagem?.trim();

    // Se o nome não foi alterado (está vazio), atribui 'Novo Personagem', 'Novo Personagem 2'...
    if (!nomeTrim) {
      const nomePadrao = gerarProximoNomePadrao(fichas, fichaAberta.id);
      fichaFinal = { ...fichaAberta, nomePersonagem: nomePadrao };
    } else {
      fichaFinal = { ...fichaAberta, nomePersonagem: nomeTrim };
    }

    setFichaAberta(fichaFinal);
    const listaAtualizada = await salvarFichaLocal(fichaFinal);
    setFichas(listaAtualizada);
    return true;
  };

  const handleExcluirFicha = async (id: string) => {
    const listaAtualizada = await excluirFichaLocal(id);
    setFichas(listaAtualizada);
    if (fichaAberta?.id === id) {
      setFichaAberta(null);
    }
  };

  const handleExportarFicha = (ficha: FichaPersonagem) => {
    setFichaParaExportar(ficha);
  };

  const handleSalvarPdfLocal = async (ficha: FichaPersonagem) => {
    try {
      const salvou = await salvarPdfNoAparelho(ficha);
      if (salvou) {
        setFichaParaExportar(null);
        Alert.alert(
          'PDF Salvo com Sucesso!',
          `A ficha de "${ficha.nomePersonagem || 'Personagem'}" foi gravada no seu aparelho.`
        );
      }
    } catch (e: any) {
      Alert.alert(
        'Erro ao Salvar PDF',
        e?.message || 'Não foi possível gravar o arquivo PDF no aparelho.'
      );
    }
  };

  const handleSalvarJsonLocal = async (ficha: FichaPersonagem) => {
    try {
      const salvou = await salvarJsonNoAparelho(ficha);
      if (salvou) {
        setFichaParaExportar(null);
        Alert.alert(
          'JSON Salvo com Sucesso!',
          `O arquivo JSON de "${ficha.nomePersonagem || 'Personagem'}" foi gravado no seu aparelho.`
        );
      }
    } catch (e: any) {
      Alert.alert(
        'Erro ao Salvar JSON',
        e?.message || 'Não foi possível gravar o arquivo JSON no aparelho.'
      );
    }
  };

  const handleCompartilharPdf = async (ficha: FichaPersonagem) => {
    try {
      setFichaParaExportar(null);
      await compartilharPdf(ficha);
    } catch (e: any) {
      Alert.alert(
        'Erro ao Compartilhar PDF',
        e?.message || 'Não foi possível compartilhar o PDF da ficha.'
      );
    }
  };

  const handleCompartilharJson = async (ficha: FichaPersonagem) => {
    try {
      setFichaParaExportar(null);
      await compartilharJson(ficha);
    } catch (e: any) {
      Alert.alert(
        'Erro ao Compartilhar JSON',
        e?.message || 'Não foi possível compartilhar a ficha em JSON.'
      );
    }
  };

  const handleImprimirDireto = async (ficha: FichaPersonagem) => {
    try {
      setFichaParaExportar(null);
      await imprimirFichaDireto(ficha);
    } catch (e: any) {
      Alert.alert(
        'Erro ao Imprimir',
        e?.message || 'Não foi possível acionar o serviço de impressão.'
      );
    }
  };

  const handleImportarFicha = async () => {
    try {
      const resultado = await importarFichaArquivoJson();
      if (!resultado) return;
      setFichas(resultado.lista);
      Alert.alert(
        'Ficha Importada!',
        `A ficha de "${resultado.fichaImportada.nomePersonagem}" foi importada com sucesso!`,
        [
          { text: 'Ficar na Lista', style: 'cancel' },
          {
            text: 'Abrir Ficha',
            onPress: () => setFichaAberta(resultado.fichaImportada),
          },
        ]
      );
    } catch (e: any) {
      Alert.alert(
        'Erro ao Importar Ficha',
        e?.message || 'O arquivo selecionado não é uma ficha válida do Tormenta RPG em formato JSON.'
      );
    }
  };

  const handleAdicionarItemParaFichaEspecifica = async (
    fichaId: string,
    tipo: 'talento' | 'magia',
    item: TalentoData | MagiaData
  ) => {
    const alvo = fichas.find((f) => f.id === fichaId);
    if (!alvo) return;

    let fichaModificada: FichaPersonagem;
    if (tipo === 'talento') {
      const novoTalento = converterTalentoParaItem(item as TalentoData);
      fichaModificada = {
        ...alvo,
        talentos: [...alvo.talentos, novoTalento],
      };
    } else {
      const novaMagia = converterMagiaParaItem(item as MagiaData);
      fichaModificada = {
        ...alvo,
        magias: [...alvo.magias, novaMagia],
      };
    }

    const listaAtualizada = await salvarFichaLocal(fichaModificada);
    setFichas(listaAtualizada);
    if (fichaAberta?.id === fichaId) {
      setFichaAberta(fichaModificada);
    }

    Alert.alert(
      'Adicionado com Sucesso!',
      `"${item.nome}" foi registrado na ficha de "${alvo.nomePersonagem || 'Personagem'}".`
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        {!iniciado ? (
          <TelaInicialScreen onIniciar={() => setIniciado(true)} />
        ) : fichaAberta ? (
          <FichaDetalheScreen
            ficha={fichaAberta}
            onChange={handleAtualizarFicha}
            onSalvarManual={handleSalvarManual}
            onExportar={() => handleExportarFicha(fichaAberta)}
            onVoltar={handleVoltarDaFicha}
          />
        ) : (
          <ListaFichasScreen
            fichas={fichas}
            onCriarNova={handleCriarNova}
            onImportarFicha={handleImportarFicha}
            onExportarFicha={handleExportarFicha}
            onAbrirFicha={(f) => setFichaAberta(f)}
            onExcluirFicha={handleExcluirFicha}
            onAbrirCompendio={() => setCompendioGeralAberto(true)}
          />
        )}

        <CompendioModal
          visivel={compendioGeralAberto}
          onFechar={() => setCompendioGeralAberto(false)}
          todasFichas={fichas}
          fichaAtual={fichaAberta}
          onAdicionarItemParaFichaEspecifica={handleAdicionarItemParaFichaEspecifica}
        />

        <ModalExportarFicha
          visivel={!!fichaParaExportar}
          ficha={fichaParaExportar}
          onFechar={() => setFichaParaExportar(null)}
          onSalvarPdf={handleSalvarPdfLocal}
          onSalvarJson={handleSalvarJsonLocal}
          onCompartilharPdf={handleCompartilharPdf}
          onCompartilharJson={handleCompartilharJson}
          onImprimirDireto={handleImprimirDireto}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.primaryDark,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
