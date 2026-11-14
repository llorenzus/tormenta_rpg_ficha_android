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
import {
  converterMagiaParaItem,
  converterTalentoParaItem,
  MagiaData,
  TalentoData,
} from './src/data';
import { criarNovaFichaPadrao, FichaPersonagem } from './src/models/ficha';
import { FichaDetalheScreen } from './src/screens/FichaDetalheScreen';
import { ListaFichasScreen } from './src/screens/ListaFichasScreen';
import { TelaInicialScreen } from './src/screens/TelaInicialScreen';
import {
  carregarFichasLocais,
  excluirFichaLocal,
  exportarFichaArquivoJson,
  exportarFichaArquivoPdf,
  importarFichaArquivoJson,
  salvarFichaLocal,
} from './src/storage/fichaStorage';
import { COLORS } from './src/theme/colors';

export default function App() {
  const [iniciado, setIniciado] = useState(false);
  const [fichas, setFichas] = useState<FichaPersonagem[]>([]);
  const [fichaAberta, setFichaAberta] = useState<FichaPersonagem | null>(null);
  const [compendioGeralAberto, setCompendioGeralAberto] = useState(false);

  useEffect(() => {
    carregarFichasLocais().then(setFichas);
  }, []);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (compendioGeralAberto) {
        setCompendioGeralAberto(false);
        return true;
      }
      if (fichaAberta) {
        setFichaAberta(null);
        return true;
      }
      if (iniciado) {
        setIniciado(false);
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [compendioGeralAberto, fichaAberta, iniciado]);

  const handleCriarNova = async () => {
    const nova = criarNovaFichaPadrao();
    const listaAtualizada = await salvarFichaLocal(nova);
    setFichas(listaAtualizada);
    setFichaAberta(nova);
  };

  const handleAtualizarFicha = async (editada: FichaPersonagem) => {
    setFichaAberta(editada);
    const listaAtualizada = await salvarFichaLocal(editada);
    setFichas(listaAtualizada);
  };

  const handleSalvarManual = async () => {
    if (!fichaAberta) return;
    const listaAtualizada = await salvarFichaLocal(fichaAberta);
    setFichas(listaAtualizada);
  };

  const handleExcluirFicha = async (id: string) => {
    const listaAtualizada = await excluirFichaLocal(id);
    setFichas(listaAtualizada);
    if (fichaAberta?.id === id) {
      setFichaAberta(null);
    }
  };

  const handleExportarFicha = (ficha: FichaPersonagem) => {
    const nome = ficha.nomePersonagem?.trim() || 'Personagem';
    Alert.alert(
      `Exportar: ${nome}`,
      'Escolha como deseja exportar esta ficha:',
      [
        {
          text: '📄 Gerar PDF (Imprimir)',
          onPress: async () => {
            try {
              await exportarFichaArquivoPdf(ficha);
            } catch (e: any) {
              Alert.alert(
                'Erro ao Exportar PDF',
                e?.message || 'Não foi possível gerar o PDF da ficha.'
              );
            }
          },
        },
        {
          text: '💾 Salvar JSON (Compartilhar)',
          onPress: async () => {
            try {
              await exportarFichaArquivoJson(ficha);
            } catch (e: any) {
              Alert.alert(
                'Erro ao Exportar JSON',
                e?.message || 'Não foi possível exportar a ficha em JSON.'
              );
            }
          },
        },
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
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
            onVoltar={() => setFichaAberta(null)}
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
