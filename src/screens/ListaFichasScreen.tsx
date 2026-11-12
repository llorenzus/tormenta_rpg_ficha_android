import React from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
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
  onAbrirFicha: (ficha: FichaPersonagem) => void;
  onExcluirFicha: (id: string) => void;
}

export const ListaFichasScreen: React.FC<Props> = ({
  fichas,
  onCriarNova,
  onAbrirFicha,
  onExcluirFicha,
}) => {
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
      <View style={styles.topBar}>
        <View>
          <Text style={styles.topBarTitle}>Tormenta RPG</Text>
          <Text style={styles.topBarSubtitle}>Gerenciador de Fichas Locais</Text>
        </View>
        <TouchableOpacity style={styles.btnTopNova} onPress={onCriarNova}>
          <Text style={styles.btnTopNovaText}>+ Nova Ficha</Text>
        </TouchableOpacity>
      </View>

      {fichas.length === 0 ? (
        <View style={styles.emptyWrap}>
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>Nenhuma ficha salva ainda</Text>
            <Text style={styles.emptyDesc}>
              Toque em "+ Nova Ficha" para criar seu personagem de Tormenta RPG.
              Todas as fichas ficam salvas localmente no seu celular.
            </Text>
            <TouchableOpacity style={styles.btnCriarGrande} onPress={onCriarNova}>
              <Text style={styles.btnCriarGrandeText}>+ Criar Personagem</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <FlatList
          data={fichas}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
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
                style={styles.fichaCard}
                onPress={() => onAbrirFicha(item)}
                activeOpacity={0.85}
              >
                <View style={styles.fichaCardTop}>
                  <View style={styles.fichaTitleCol}>
                    <Text style={styles.fichaNome}>
                      {item.nomePersonagem?.trim() || 'Personagem Sem Nome'}
                    </Text>
                    <Text style={styles.fichaSub}>{subtitulo}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.btnDelete}
                    onPress={() => confirmarExclusao(item)}
                  >
                    <Text style={styles.btnDeleteText}>Excluir</Text>
                  </TouchableOpacity>
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
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topBarTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  topBarSubtitle: {
    color: 'rgba(255,255,255,0.85)',
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
    padding: 24,
  },
  emptyCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
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
  btnCriarGrande: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  btnCriarGrandeText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 15,
  },
  listContent: {
    padding: 14,
    paddingBottom: 32,
  },
  fichaCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
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
  btnDelete: {
    paddingHorizontal: 10,
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
});

