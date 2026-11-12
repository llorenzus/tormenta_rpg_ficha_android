import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { AbaDadosEAtributos } from '../components/AbaDadosEAtributos';
import { AbaEquipamentos } from '../components/AbaEquipamentos';
import { AbaHabilidadesEMagias } from '../components/AbaHabilidadesEMagias';
import { AbaPericias } from '../components/AbaPericias';
import { calcularCaTotal, FichaPersonagem } from '../models/ficha';
import { COLORS } from '../theme/colors';

interface Props {
  ficha: FichaPersonagem;
  onChange: (nova: FichaPersonagem) => void;
  onSalvarManual: () => void;
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
  onVoltar,
}) => {
  const [abaAtiva, setAbaAtiva] = useState(0);
  const caTotal = calcularCaTotal(ficha);

  const handleSalvarClick = () => {
    onSalvarManual();
    Alert.alert('Ficha Salva', 'Todas as alterações foram salvas no seu aparelho.');
  };

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
            Nív {ficha.nivel} • PV {ficha.pvAtual}/{ficha.pvTotal} • PM{' '}
            {ficha.pmAtual}/{ficha.pmTotal} • CA {caTotal}
          </Text>
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={handleSalvarClick}>
          <Text style={styles.saveBtnText}>Salvar</Text>
        </TouchableOpacity>
      </View>

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
  },
  backBtn: {
    paddingVertical: 6,
    paddingRight: 10,
  },
  backBtnText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 13,
  },
  titleCol: {
    flex: 1,
    paddingHorizontal: 4,
  },
  titleText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  subtitleText: {
    color: 'rgba(255,255,255,0.88)',
    fontSize: 11,
    marginTop: 1,
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
  tabBarWrap: {
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tabBarScroll: {
    paddingHorizontal: 8,
  },
  tabItem: {
    paddingHorizontal: 14,
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

