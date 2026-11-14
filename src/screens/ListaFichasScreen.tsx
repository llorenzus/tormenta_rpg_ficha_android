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
      {/* Top Bar Responsiva: Perfeita em Mobile e Desktop */}
      <View style={[styles.topBar, isDesktop ? styles.topBarDesktop : styles.topBarMobile]}>
        <View style={[styles.topBarContent, isDesktop && styles.desktopMaxWidth]}>
          <View style={styles.topBarLeft}>
            <Text
              style={isDesktop ? styles.titleDesktop : styles.titleMobile}
              numberOfLines={1}
            >
              Tormenta RPG
            </Text>
            <Text
              style={isDesktop ? styles.subtitleDesktop : styles.subtitleMobile}
              numberOfLines={1}
            >
              {isDesktop ? 'Gerenciador de Fichas de Personagem' : 'Gerenciador de Fichas'}
            </Text>
          </View>

          <View style={[styles.topActionsRow, isDesktop ? styles.actionsDesktop : styles.actionsMobile]}>
            <TouchableOpacity
              style={[styles.btnAction, isDesktop ? styles.btnCompendioDesktop : styles.btnCompendioMobile]}
              onPress={onAbrirCompendio}
              activeOpacity={0.8}
            >
              <Text style={[styles.btnText, isDesktop ? styles.btnTextCompendioDesktop : styles.btnTextCompendioMobile]}>
                {isDesktop ? '📖 Compêndio' : '📖 Regras'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btnAction, isDesktop ? styles.btnImportarDesktop : styles.btnImportarMobile]}
              onPress={onImportarFicha}
              activeOpacity={0.8}
            >
              <Text style={[styles.btnText, isDesktop ? styles.btnTextWhiteDesktop : styles.btnTextWhiteMobile]}>
                {isDesktop ? 'Importar JSON' : 'Importar'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btnAction, isDesktop ? styles.btnNovaDesktop : styles.btnNovaMobile]}
              onPress={onCriarNova}
              activeOpacity={0.8}
            >
              <Text style={[styles.btnText, isDesktop ? styles.btnTextDarkDesktop : styles.btnTextDarkMobile]}>
                {isDesktop ? '+ Nova Ficha' : '+ Nova'}
              </Text>
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
  },
  topBarMobile: {
    paddingVertical: 9,
    paddingHorizontal: 10,
  },
  topBarDesktop: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  topBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  desktopMaxWidth: {
    maxWidth: 1300,
    alignSelf: 'center',
  },
  topBarLeft: {
    flexShrink: 0,
    marginRight: 6,
  },
  titleMobile: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 0.3,
  },
  titleDesktop: {
    color: COLORS.white,
    fontSize: 21,
    fontWeight: 'bold',
    letterSpacing: 0.6,
  },
  subtitleMobile: {
    color: '#FFEAA7',
    fontSize: 10.5,
    marginTop: 1,
  },
  subtitleDesktop: {
    color: '#FFEAA7',
    fontSize: 12,
    marginTop: 2,
  },
  topActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
  },
  actionsMobile: {
    gap: 5,
  },
  actionsDesktop: {
    gap: 10,
  },
  btnAction: {
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnCompendioMobile: {
    backgroundColor: 'rgba(200,157,60,0.25)',
    borderWidth: 1,
    borderColor: COLORS.gold,
    paddingHorizontal: 7,
    paddingVertical: 6,
  },
  btnCompendioDesktop: {
    backgroundColor: 'rgba(200,157,60,0.25)',
    borderWidth: 1,
    borderColor: COLORS.gold,
    paddingHorizontal: 13,
    paddingVertical: 8,
  },
  btnImportarMobile: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    borderColor: COLORS.gold,
    paddingHorizontal: 7,
    paddingVertical: 6,
  },
  btnImportarDesktop: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    borderColor: COLORS.gold,
    paddingHorizontal: 13,
    paddingVertical: 8,
  },
  btnNovaMobile: {
    backgroundColor: COLORS.gold,
    paddingHorizontal: 9,
    paddingVertical: 6,
  },
  btnNovaDesktop: {
    backgroundColor: COLORS.gold,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  btnText: {
    fontWeight: 'bold',
  },
  btnTextCompendioMobile: {
    color: '#FFEAA7',
    fontSize: 11,
  },
  btnTextCompendioDesktop: {
    color: '#FFEAA7',
    fontSize: 13,
  },
  btnTextWhiteMobile: {
    color: COLORS.white,
    fontSize: 11,
  },
  btnTextWhiteDesktop: {
    color: COLORS.white,
    fontSize: 13,
  },
  btnTextDarkMobile: {
    color: '#1F1A17',
    fontSize: 11.5,
  },
  btnTextDarkDesktop: {
    color: '#1F1A17',
    fontSize: 13.5,
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
    padding: 12,
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
