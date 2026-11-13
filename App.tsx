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
import { criarNovaFichaPadrao, FichaPersonagem } from './src/models/ficha';
import { FichaDetalheScreen } from './src/screens/FichaDetalheScreen';
import { ListaFichasScreen } from './src/screens/ListaFichasScreen';
import { TelaInicialScreen } from './src/screens/TelaInicialScreen';
import {
  carregarFichasLocais,
  excluirFichaLocal,
  exportarFichaArquivoTxt,
  importarFichaArquivoTxt,
  salvarFichaLocal,
} from './src/storage/fichaStorage';
import { COLORS } from './src/theme/colors';

export default function App() {
  const [iniciado, setIniciado] = useState(false);
  const [fichas, setFichas] = useState<FichaPersonagem[]>([]);
  const [fichaAberta, setFichaAberta] = useState<FichaPersonagem | null>(null);

  useEffect(() => {
    carregarFichasLocais().then(setFichas);
  }, []);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
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
  }, [fichaAberta, iniciado]);

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

  const handleExportarFicha = async (ficha: FichaPersonagem) => {
    try {
      await exportarFichaArquivoTxt(ficha);
    } catch (e: any) {
      Alert.alert(
        'Erro ao Exportar',
        e?.message || 'Não foi possível exportar o arquivo da ficha.'
      );
    }
  };

  const handleImportarFicha = async () => {
    try {
      const resultado = await importarFichaArquivoTxt();
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
        'Erro ao Importar',
        'O arquivo selecionado não é uma ficha válida do Tormenta RPG.'
      );
    }
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
          />
        )}
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
