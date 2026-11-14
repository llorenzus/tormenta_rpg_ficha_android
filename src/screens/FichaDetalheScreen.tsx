import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { AbaDadosEAtributos } from '../components/AbaDadosEAtributos';
import { AbaEquipamentos } from '../components/AbaEquipamentos';
import { AbaHabilidadesEMagias } from '../components/AbaHabilidadesEMagias';
import { AbaPericias } from '../components/AbaPericias';
import { PainelLateralDesktop } from '../components/PainelLateralDesktop';
import { calcularCaTotal, FichaPersonagem } from '../models/ficha';
import { COLORS } from '../theme/colors';

interface Props {
  ficha: FichaPersonagem;
  onChange: (nova: FichaPersonagem) => void;
  onSalvarManual: () => Promise<boolean> | boolean;
  onExportar: () => void;
  onVoltar: () => void;
}

const ABAS = [
  'Dados / Atributos',
  'Perícias',
  'Habilidades / Magias',
  'Equipamentos',
];

export const FichaDetalheScreen: React.FC<Props> = ({
  ficha,
  onChange,
  onSalvarManual,
  onExportar,
  onVoltar,
}) => {
  const [abaAtiva, setAbaAtiva] = useState(0);
  const { width } = useWindowDimensions();
  const isDesktop = width >= 850;
  const caTotal = calcularCaTotal(ficha);

  const handleSalvarClick = async () => {
    const sucesso = await onSalvarManual();
    if (sucesso) {
      Alert.alert('Ficha Salva', 'Todas as alterações foram salvas no seu aparelho.');
    }
  };

  const subtituloDesktop = [
    ficha.raca?.trim(),
    ficha.classe?.trim(),
    `Nível ${ficha.nivel}`,
    ficha.jogador?.trim() && `Jogador: ${ficha.jogador.trim()}`,
  ]
    .filter(Boolean)
    .join(' • ');

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={onVoltar}>
          <Text style={styles.backBtnText}>← Fichas</Text>
        </TouchableOpacity>

        <View style={styles.titleCol}>
          <Text style={styles.titleText} numberOfLines={1}>
            {ficha.nomePersonagem?.trim() || 'Ficha de Personagem'}
          </Text>
          <Text style={styles.subtitleText} numberOfLines={1}>
            {isDesktop
              ? subtituloDesktop || 'Tormenta RPG'
              : `PV ${ficha.pvAtual}/${ficha.pvTotal} • PM ${ficha.pmAtual}/${ficha.pmTotal} • CA ${caTotal}`}
          </Text>
        </View>

        <View style={styles.topRightActions}>
          <TouchableOpacity style={styles.exportBtn} onPress={onExportar}>
            <Text style={styles.exportBtnText}>Exportar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSalvarClick}>
            <Text style={styles.saveBtnText}>Salvar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Corpo Dividido no Desktop / Vertical no Mobile */}
      <View style={isDesktop ? styles.desktopBody : styles.mobileBody}>
        {isDesktop && (
          <View style={styles.desktopSidebar}>
            <PainelLateralDesktop ficha={ficha} onChange={onChange} />
          </View>
        )}

        <View style={isDesktop ? styles.desktopMain : styles.mobileMain}>
          {/* Abas na ordem solicitada */}
          <View style={styles.tabBarWrap}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tabBarScroll}
            >
              {ABAS.map((titulo, idx) => {
                const selecionada = abaAtiva === idx;
                return (
                  <TouchableOpacity
                    key={titulo}
                    style={[styles.tabItem, selecionada && styles.tabItemActive]}
                    onPress={() => setAbaAtiva(idx)}
                  >
                    <Text
                      style={[styles.tabText, selecionada && styles.tabTextActive]}
                    >
                      {titulo}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Conteúdo da Aba */}
          <View style={styles.contentWrap}>
            {abaAtiva === 0 && (
              <AbaDadosEAtributos ficha={ficha} onChange={onChange} />
            )}
            {abaAtiva === 1 && <AbaPericias ficha={ficha} onChange={onChange} />}
            {abaAtiva === 2 && (
              <AbaHabilidadesEMagias ficha={ficha} onChange={onChange} />
            )}
            {abaAtiva === 3 && (
              <AbaEquipamentos ficha={ficha} onChange={onChange} />
            )}
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topBar: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  backBtn: {
    paddingVertical: 6,
    paddingRight: 6,
  },
  backBtnText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 13,
  },
  titleCol: {
    flex: 1,
    paddingHorizontal: 2,
  },
  titleText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  subtitleText: {
    color: 'rgba(255,255,255,0.88)',
    fontSize: 12,
    marginTop: 1,
  },
  topRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  exportBtn: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    borderColor: COLORS.gold,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  exportBtnText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 12,
  },
  saveBtn: {
    backgroundColor: COLORS.gold,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  saveBtnText: {
    color: '#1F1A17',
    fontWeight: 'bold',
    fontSize: 12,
  },
  desktopBody: {
    flex: 1,
    flexDirection: 'row',
  },
  mobileBody: {
    flex: 1,
  },
  desktopSidebar: {
    width: 360,
    borderRightWidth: 1.5,
    borderRightColor: COLORS.border,
    backgroundColor: '#F5EFE1',
  },
  desktopMain: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  mobileMain: {
    flex: 1,
  },
  tabBarWrap: {
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tabBarScroll: {
    paddingHorizontal: 8,
  },
  tabItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabItemActive: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  contentWrap: {
    flex: 1,
  },
});
