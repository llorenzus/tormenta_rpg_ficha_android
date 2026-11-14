import React from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  calcularCaTotal,
  calcularModificador,
  FichaPersonagem,
  formatarModificador,
  obterBonusArmaduraEquipada,
  obterBonusEscudoEquipado,
  obterMeioNivel,
} from '../models/ficha';
import { COLORS } from '../theme/colors';

interface Props {
  ficha: FichaPersonagem;
  onChange: (nova: FichaPersonagem) => void;
}

export const PainelLateralDesktop: React.FC<Props> = ({ ficha, onChange }) => {
  const meioNivel = obterMeioNivel(ficha.nivel);
  const modDes = calcularModificador(ficha.destreza);
  const modCon = calcularModificador(ficha.constituicao);
  const modSab = calcularModificador(ficha.sabedoria);
  const caTotal = calcularCaTotal(ficha);

  const fortTotal = meioNivel + modCon + (Number(ficha.fortitudeOutros) || 0);
  const refTotal = meioNivel + modDes + (Number(ficha.reflexosOutros) || 0);
  const vonTotal = meioNivel + modSab + (Number(ficha.vontadeOutros) || 0);

  const iniciativaTotal = modDes + meioNivel;

  const alterarPv = (delta: number) => {
    const novo = Math.max(-99, Math.min(999, (ficha.pvAtual ?? 0) + delta));
    onChange({ ...ficha, pvAtual: novo });
  };

  const alterarPm = (delta: number) => {
    const novo = Math.max(0, Math.min(999, (ficha.pmAtual ?? 0) + delta));
    onChange({ ...ficha, pmAtual: novo });
  };

  const alterarAtributo = (campo: keyof FichaPersonagem, delta: number) => {
    const atual = Number(ficha[campo]) || 10;
    const novo = Math.max(1, Math.min(99, atual + delta));
    onChange({ ...ficha, [campo]: novo });
  };

  const handleDescansoLongo = () => {
    onChange({
      ...ficha,
      pvAtual: ficha.pvTotal,
      pmAtual: ficha.pmTotal,
    });
    Alert.alert(
      'Descanso Longo',
      'PV e PM recuperados aos valores máximos!'
    );
  };

  const pctPv = Math.max(0, Math.min(100, ficha.pvTotal > 0 ? (ficha.pvAtual / ficha.pvTotal) * 100 : 0));
  const pctPm = Math.max(0, Math.min(100, ficha.pmTotal > 0 ? (ficha.pmAtual / ficha.pmTotal) * 100 : 0));

  const atributos = [
    { label: 'FOR', chave: 'forca' as const, valor: ficha.forca },
    { label: 'DES', chave: 'destreza' as const, valor: ficha.destreza },
    { label: 'CON', chave: 'constituicao' as const, valor: ficha.constituicao },
    { label: 'INT', chave: 'inteligencia' as const, valor: ficha.inteligencia },
    { label: 'SAB', chave: 'sabedoria' as const, valor: ficha.sabedoria },
    { label: 'CAR', chave: 'carisma' as const, valor: ficha.carisma },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. Header do Personagem */}
      <View style={styles.headerCard}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarIcon}>⚔️</Text>
        </View>
        <Text style={styles.nomePersonagem} numberOfLines={2}>
          {ficha.nomePersonagem?.trim() || 'Personagem Sem Nome'}
        </Text>
        <Text style={styles.subtituloPersonagem}>
          {[
            ficha.raca?.trim(),
            ficha.classe?.trim(),
            `Nível ${ficha.nivel}`,
          ]
            .filter(Boolean)
            .join(' • ')}
        </Text>
      </View>

      {/* 2. Status Vitais (PV e PM) */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardTitle}>Status Vitais</Text>
          <TouchableOpacity
            style={styles.btnDescanso}
            onPress={handleDescansoLongo}
          >
            <Text style={styles.btnDescansoText}>🌙 Descanso</Text>
          </TouchableOpacity>
        </View>

        {/* PV */}
        <View style={styles.vitalBlock}>
          <View style={styles.vitalHeaderRow}>
            <Text style={styles.labelPv}>PONTOS DE VIDA</Text>
            <Text style={styles.valorVital}>
              <Text style={styles.valorDestaquePv}>{ficha.pvAtual}</Text> / {ficha.pvTotal}
            </Text>
          </View>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFillPv,
                { width: `${pctPv}%` },
                ficha.pvAtual <= 0 && styles.progressBarMorto,
              ]}
            />
          </View>
          <View style={styles.quickButtonsRow}>
            <TouchableOpacity style={styles.btnQuick} onPress={() => alterarPv(-5)}>
              <Text style={styles.btnQuickText}>-5</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnQuick} onPress={() => alterarPv(-1)}>
              <Text style={styles.btnQuickText}>-1</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnQuick} onPress={() => alterarPv(1)}>
              <Text style={styles.btnQuickText}>+1</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnQuick} onPress={() => alterarPv(5)}>
              <Text style={styles.btnQuickText}>+5</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* PM */}
        <View style={styles.vitalBlock}>
          <View style={styles.vitalHeaderRow}>
            <Text style={styles.labelPm}>PONTOS DE MAGIA</Text>
            <Text style={styles.valorVital}>
              <Text style={styles.valorDestaquePm}>{ficha.pmAtual}</Text> / {ficha.pmTotal}
            </Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFillPm, { width: `${pctPm}%` }]} />
          </View>
          <View style={styles.quickButtonsRow}>
            <TouchableOpacity style={styles.btnQuick} onPress={() => alterarPm(-3)}>
              <Text style={styles.btnQuickText}>-3</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnQuick} onPress={() => alterarPm(-1)}>
              <Text style={styles.btnQuickText}>-1</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnQuick} onPress={() => alterarPm(1)}>
              <Text style={styles.btnQuickText}>+1</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnQuick} onPress={() => alterarPm(3)}>
              <Text style={styles.btnQuickText}>+3</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* 3. Classe de Armadura & Resistências */}
      <View style={styles.card}>
        <View style={styles.caRow}>
          <View style={styles.caBadge}>
            <Text style={styles.caBadgeLabel}>CLASSE DE ARMADURA</Text>
            <Text style={styles.caBadgeValue}>{caTotal}</Text>
          </View>
        </View>

        <View style={styles.resistenciasRow}>
          <View style={styles.resItem}>
            <Text style={styles.resLabel}>FORTITUDE</Text>
            <Text style={styles.resVal}>{formatarModificador(fortTotal)}</Text>
            <Text style={styles.resSub}>CON</Text>
          </View>
          <View style={styles.resItem}>
            <Text style={styles.resLabel}>REFLEXOS</Text>
            <Text style={styles.resVal}>{formatarModificador(refTotal)}</Text>
            <Text style={styles.resSub}>DES</Text>
          </View>
          <View style={styles.resItem}>
            <Text style={styles.resLabel}>VONTADE</Text>
            <Text style={styles.resVal}>{formatarModificador(vonTotal)}</Text>
            <Text style={styles.resSub}>SAB</Text>
          </View>
        </View>
      </View>

      {/* 4. Atributos Básicos (Grade 2x3) */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Atributos</Text>
        <View style={styles.atributosGrid}>
          {atributos.map((atrib) => {
            const mod = calcularModificador(atrib.valor);
            return (
              <View key={atrib.chave} style={styles.atribCard}>
                <Text style={styles.atribLabel}>{atrib.label}</Text>
                <Text style={styles.atribMod}>{formatarModificador(mod)}</Text>
                <View style={styles.atribControles}>
                  <TouchableOpacity
                    style={styles.atribBtn}
                    onPress={() => alterarAtributo(atrib.chave, -1)}
                  >
                    <Text style={styles.atribBtnText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.atribValor}>{atrib.valor}</Text>
                  <TouchableOpacity
                    style={styles.atribBtn}
                    onPress={() => alterarAtributo(atrib.chave, 1)}
                  >
                    <Text style={styles.atribBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {/* 5. Combate Rápido */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Combate & Movimento</Text>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>BBA</Text>
            <Text style={styles.statVal}>{formatarModificador(ficha.bba)}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>INICIATIVA</Text>
            <Text style={styles.statVal}>{formatarModificador(iniciativaTotal)}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>DESLOC.</Text>
            <Text style={styles.statVal}>{ficha.deslocamento?.trim() || '9m'}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5EFE1',
  },
  content: {
    padding: 12,
    gap: 12,
  },
  headerCard: {
    backgroundColor: COLORS.primaryDark,
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.gold,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(200, 157, 60, 0.25)',
    borderWidth: 1,
    borderColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  avatarIcon: {
    fontSize: 22,
  },
  nomePersonagem: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtituloPersonagem: {
    color: '#FFEAA7',
    fontSize: 12,
    marginTop: 3,
    textAlign: 'center',
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  btnDescanso: {
    backgroundColor: 'rgba(139, 30, 30, 0.08)',
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  btnDescansoText: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: 'bold',
  },
  vitalBlock: {
    marginBottom: 10,
  },
  vitalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  labelPv: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#8B1E1E',
  },
  labelPm: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  valorVital: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  valorDestaquePv: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#8B1E1E',
  },
  valorDestaquePm: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#E8DFC8',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressBarFillPv: {
    height: '100%',
    backgroundColor: '#C53030',
  },
  progressBarMorto: {
    backgroundColor: '#742A2A',
  },
  progressBarFillPm: {
    height: '100%',
    backgroundColor: '#2B6CB0',
  },
  quickButtonsRow: {
    flexDirection: 'row',
    gap: 4,
  },
  btnQuick: {
    flex: 1,
    backgroundColor: '#EDE4D0',
    borderRadius: 4,
    paddingVertical: 3,
    alignItems: 'center',
  },
  btnQuickText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  caRow: {
    alignItems: 'center',
    marginBottom: 10,
  },
  caBadge: {
    width: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.gold,
  },
  caBadgeLabel: {
    color: '#FFEAA7',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  caBadgeValue: {
    color: COLORS.white,
    fontSize: 26,
    fontWeight: 'bold',
  },
  resistenciasRow: {
    flexDirection: 'row',
    gap: 6,
  },
  resItem: {
    flex: 1,
    backgroundColor: '#F5EFE1',
    borderRadius: 6,
    paddingVertical: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  resLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
  },
  resVal: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginVertical: 1,
  },
  resSub: {
    fontSize: 9,
    color: COLORS.textSecondary,
  },
  atributosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  atribCard: {
    width: '31%',
    backgroundColor: '#F5EFE1',
    borderRadius: 6,
    padding: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  atribLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  atribMod: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#B7791F',
    marginVertical: 2,
  },
  atribControles: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  atribBtn: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#E2D8C0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  atribBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.text,
    lineHeight: 14,
  },
  atribValor: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.text,
    minWidth: 16,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#F5EFE1',
    borderRadius: 6,
    paddingVertical: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
  },
  statVal: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 2,
  },
});
