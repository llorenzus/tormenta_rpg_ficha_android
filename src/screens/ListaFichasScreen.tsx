import React from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  calcularCaTotal,
  FichaPersonagem,
  formatarModificador,
} from '../models/ficha';
import { COLORS } from '../theme/colors';

interface Props {
  fichas: FichaPersonagem[];
  onCriarNova: () => void;
  onImportarFicha: () => void;
  onExportarFicha: (ficha: FichaPersonagem) => void;
  onAbrirFicha: (ficha: FichaPersonagem) => void;
  onExcluirFicha: (id: string) => void;
  onAbrirCompendio: () => void;
}

export const ListaFichasScreen: React.FC<Props> = ({
  fichas,
  onCriarNova,
  onImportarFicha,
  onExportarFicha,
  onAbrirFicha,
  onExcluirFicha,
  onAbrirCompendio,
}) => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 800;
  const numColumns = width >= 1200 ? 3 : width >= 800 ? 2 : 1;

  const confirmarExclusao = (ficha: FichaPersonagem) => {
    const nome = ficha.nomePersonagem?.trim() || 'Sem Nome';
    Alert.alert(
      'Excluir Ficha?',
      `Deseja realmente excluir a ficha de "${nome}" do seu aparelho?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => onExcluirFicha(ficha.id),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Bar com container centralizado no Desktop */}
      <View style={styles.topBar}>
        <View style={[styles.topBarContent, isDesktop && styles.desktopMaxWidth]}>
          <View style={styles.topBarLeft}>
            <Text style={styles.topBarTitle}>Tormenta RPG</Text>
            <Text style={styles.topBarSubtitle}>Gerenciador de Fichas</Text>
          </View>
          <View style={styles.topActionsRow}>
            <TouchableOpacity
              style={styles.btnTopCompendio}
              onPress={onAbrirCompendio}
            >
              <Text style={styles.btnTopCompendioText}>📖 Compêndio</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnTopImportar}
              onPress={onImportarFicha}
            >
              <Text style={styles.btnTopImportarText}>Importar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnTopNova} onPress={onCriarNova}>
              <Text style={styles.btnTopNovaText}>+ Nova Ficha</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {fichas.length === 0 ? (
        <View style={styles.emptyWrap}>
          <View style={[styles.emptyCard, isDesktop && styles.emptyCardDesktop]}>
            <Text style={styles.emptyTitle}>Nenhuma ficha salva ainda</Text>
            <Text style={styles.emptyDesc}>
              Toque em "+ Nova Ficha" para criar seu personagem de Tormenta RPG
              ou importe um arquivo .json enviado por um amigo.
            </Text>
            <View style={styles.emptyActionsCol}>
              <TouchableOpacity
                style={styles.btnCriarGrande}
                onPress={onCriarNova}
              >
                <Text style={styles.btnCriarGrandeText}>
                  + Criar Personagem
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnCompendioGrande}
                onPress={onAbrirCompendio}
              >
                <Text style={styles.btnCompendioGrandeText}>
                  📖 Consultar Compêndio de Regras
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnImportarGrande}
                onPress={onImportarFicha}
              >
                <Text style={styles.btnImportarGrandeText}>
                  Importar Arquivo JSON
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        <FlatList
          key={`lista-fichas-grid-${numColumns}`}
          data={fichas}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          columnWrapperStyle={numColumns > 1 ? styles.gridRow : undefined}
          contentContainerStyle={[styles.listContent, isDesktop && styles.listContentDesktop]}
          renderItem={({ item }) => {
            const ca = calcularCaTotal(item);
            const subtitulo = [
              item.raca?.trim(),
              item.classe?.trim(),
              `Nível ${item.nivel}`,
            ]
              .filter(Boolean)
              .join(' • ');

            return (
              <TouchableOpacity
                style={[styles.fichaCard, numColumns > 1 && styles.fichaCardGrid]}
                onPress={() => onAbrirFicha(item)}
                activeOpacity={0.85}
              >
                <View style={styles.fichaCardTop}>
                  <View style={styles.fichaTitleCol}>
                    <Text style={styles.fichaNome} numberOfLines={1}>
                      {item.nomePersonagem?.trim() || 'Personagem Sem Nome'}
                    </Text>
                    <Text style={styles.fichaSub} numberOfLines={1}>
                      {subtitulo || 'Sem detalhes cadastrados'}
                    </Text>
                  </View>
                  <View style={styles.cardActionsRow}>
                    <TouchableOpacity
                      style={styles.btnExport}
                      onPress={() => onExportarFicha(item)}
                    >
                      <Text style={styles.btnExportText}>Exportar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.btnDelete}
                      onPress={() => confirmarExclusao(item)}
                    >
                      <Text style={styles.btnDeleteText}>Excluir</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.badgesRow}>
                  <View style={styles.badge}>
                    <Text style={styles.badgeLabel}>PV </Text>
                    <Text style={styles.badgeValue}>
                      {item.pvAtual}/{item.pvTotal}
                    </Text>
                  </View>
                  <View style={styles.badge}>
                    <Text style={styles.badgeLabel}>PM </Text>
                    <Text style={styles.badgeValue}>
                      {item.pmAtual}/{item.pmTotal}
                    </Text>
                  </View>
                  <View style={styles.badge}>
                    <Text style={styles.badgeLabel}>CA </Text>
                    <Text style={styles.badgeValue}>{ca}</Text>
                  </View>
                  <View style={styles.badge}>
                    <Text style={styles.badgeLabel}>BBA </Text>
                    <Text style={styles.badgeValue}>
                      {formatarModificador(item.bba)}
                    </Text>
                  </View>
                </View>

                {isDesktop && (
                  <View style={styles.desktopOpenHint}>
                    <Text style={styles.desktopOpenHintText}>Clique para abrir e editar a ficha →</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topBar: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  topBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    width: '100%',
  },
  desktopMaxWidth: {
    maxWidth: 1300,
    alignSelf: 'center',
  },
  topBarLeft: {
    flex: 1,
  },
  topBarTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  topBarSubtitle: {
    color: '#FFEAA7',
    fontSize: 12,
  },
  topActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  btnTopCompendio: {
    backgroundColor: 'rgba(200,157,60,0.25)',
    borderWidth: 1,
    borderColor: COLORS.gold,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  btnTopCompendioText: {
    color: '#FFEAA7',
    fontWeight: 'bold',
    fontSize: 12,
  },
  btnTopImportar: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    borderColor: COLORS.gold,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  btnTopImportarText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 12,
  },
  btnTopNova: {
    backgroundColor: COLORS.gold,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  btnTopNovaText: {
    color: '#1F1A17',
    fontWeight: 'bold',
    fontSize: 13,
  },
  emptyWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    width: '100%',
  },
  emptyCardDesktop: {
    maxWidth: 500,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 18,
    lineHeight: 20,
  },
  emptyActionsCol: {
    width: '100%',
    gap: 10,
  },
  btnCriarGrande: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnCriarGrandeText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 15,
  },
  btnCompendioGrande: {
    backgroundColor: COLORS.surfaceVariant,
    borderWidth: 1,
    borderColor: COLORS.gold,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnCompendioGrandeText: {
    color: '#8A6414',
    fontWeight: 'bold',
    fontSize: 14,
  },
  btnImportarGrande: {
    backgroundColor: COLORS.surfaceVariant,
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnImportarGrandeText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 15,
  },
  listContent: {
    padding: 14,
    paddingBottom: 32,
  },
  listContentDesktop: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    maxWidth: 1300,
    alignSelf: 'center',
    width: '100%',
  },
  gridRow: {
    gap: 14,
  },
  fichaCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
  },
  fichaCardGrid: {
    flex: 1,
    marginBottom: 14,
  },
  fichaCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  fichaTitleCol: {
    flex: 1,
    paddingRight: 8,
  },
  fichaNome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  fichaSub: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  cardActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  btnExport: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: COLORS.surfaceVariant,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  btnExportText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: 'bold',
  },
  btnDelete: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: 'rgba(179,38,30,0.1)',
  },
  btnDeleteText: {
    color: COLORS.danger,
    fontSize: 12,
    fontWeight: 'bold',
  },
  badgesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: COLORS.surfaceVariant,
    paddingTop: 10,
    gap: 6,
  },
  badge: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  badgeValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  desktopOpenHint: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0E8D4',
    alignItems: 'flex-end',
  },
  desktopOpenHintText: {
    fontSize: 11,
    color: COLORS.gold,
    fontWeight: 'bold',
  },
});
