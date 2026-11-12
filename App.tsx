import React, { useEffect, useState } from 'react';
import {
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
import {
  carregarFichasLocais,
  excluirFichaLocal,
  salvarFichaLocal,
} from './src/storage/fichaStorage';
import { COLORS } from './src/theme/colors';

export default function App() {
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
      return false;
    });
    return () => sub.remove();
  }, [fichaAberta]);

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

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={COLORS.primaryDark} barStyle="light-content" />
      <View style={styles.container}>
        {fichaAberta ? (
          <FichaDetalheScreen
            ficha={fichaAberta}
            onChange={handleAtualizarFicha}
            onSalvarManual={handleSalvarManual}
            onVoltar={() => setFichaAberta(null)}
          />
        ) : (
          <ListaFichasScreen
            fichas={fichas}
            onCriarNova={handleCriarNova}
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

