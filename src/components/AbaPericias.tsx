import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  ATRIBUTOS_LISTA,
  AtributoSigla,
  calcularGraduacaoPericia,
  calcularTotalPericia,
  FichaPersonagem,
  formatarModificador,
  gerarId,
  obterModAtributo,
  PericiaItem,
} from '../models/ficha';
import { COLORS } from '../theme/colors';
import { CampoInteiro, CampoTexto, SecaoHeader } from './CommonInput';

interface Props {
  ficha: FichaPersonagem;
  onChange: (nova: FichaPersonagem) => void;
}

export const AbaPericias: React.FC<Props> = ({ ficha, onChange }) => {
  const [modalVisivel, setModalVisivel] = useState(false);
  const [novoNome, setNovoNome] = useState('Ofício ()');
  const [novoAtrib, setNovoAtrib] = useState<AtributoSigla>('INT');

  const alternarTreinada = (periciaId: string) => {
    const novaLista = ficha.pericias.map((p) =>
      p.id === periciaId ? { ...p, treinada: !p.treinada } : p
    );
    onChange({ ...ficha, pericias: novaLista });
  };

  const alterarOutrosBonus = (periciaId: string, novoBonus: number) => {
    const novaLista = ficha.pericias.map((p) =>
      p.id === periciaId ? { ...p, outrosBonus: novoBonus } : p
    );
    onChange({ ...ficha, pericias: novaLista });
  };

  const adicionarPericiaExtra = () => {
    if (!novoNome.trim()) return;
    const nova: PericiaItem = {
      id: gerarId(),
      nome: novoNome.trim(),
      atributoChave: novoAtrib,
      treinada: true,
      outrosBonus: 0,
    };
    onChange({ ...ficha, pericias: [...ficha.pericias, nova] });
    setNovoNome('Ofício ()');
    setModalVisivel(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <SecaoHeader
            titulo="3. Perícias"
            subtitulo="Total = Graduação + Mod. Habilidade + Outros Bônus"
            acaoTexto="Ofício/Conhec."
            onAcaoPress={() => setModalVisivel(true)}
          />

          <View style={styles.tableHeader}>
            <Text style={[styles.th, styles.colCheck]}>Trein.</Text>
            <Text style={[styles.th, styles.colNome]}>Perícia (Atrib.)</Text>
            <Text style={[styles.th, styles.colNum]}>Grad.</Text>
            <Text style={[styles.th, styles.colNum]}>Mod.</Text>
            <Text style={[styles.th, styles.colOutros]}>Outros</Text>
            <Text style={[styles.th, styles.colTotal]}>Total</Text>
          </View>

          {ficha.pericias.map((pericia) => {
            const grad = calcularGraduacaoPericia(ficha, pericia);
            const mod = obterModAtributo(ficha, pericia.atributoChave);
            const total = calcularTotalPericia(ficha, pericia);

            return (
              <View key={pericia.id} style={styles.rowPericia}>
                <TouchableOpacity
                  style={styles.colCheck}
                  onPress={() => alternarTreinada(pericia.id)}
                >
                  <View
                    style={[
                      styles.checkbox,
                      pericia.treinada && styles.checkboxChecked,
                    ]}
                  >
                    {pericia.treinada && <Text style={styles.checkMark}>✓</Text>}
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.colNome}
                  onPress={() => alternarTreinada(pericia.id)}
                >
                  <Text
                    style={[
                      styles.periciaNome,
                      pericia.treinada && styles.periciaNomeTreinada,
                    ]}
                  >
                    {pericia.nome}
                    {pericia.somenteTreinada ? '*' : ''}
                  </Text>
                  <Text style={styles.periciaAtrib}>{pericia.atributoChave}</Text>
                </TouchableOpacity>

                <Text style={[styles.cellText, styles.colNum]}>+{grad}</Text>

                <Text style={[styles.cellText, styles.colNum]}>
                  {formatarModificador(mod)}
                </Text>

                <View style={styles.colOutros}>
                  <CampoInteiro
                    valor={pericia.outrosBonus}
                    onValorChange={(v) => alterarOutrosBonus(pericia.id, v)}
                    min={-99}
                    max={99}
                    compact
                  />
                </View>

                <View
                  style={[
                    styles.totalBadge,
                    pericia.treinada && styles.totalBadgeTreinada,
                  ]}
                >
                  <Text
                    style={[
                      styles.totalText,
                      pericia.treinada && styles.totalTextTreinada,
                    ]}
                  >
                    {formatarModificador(total)}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <Modal
        visible={modalVisivel}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisivel(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Nova Especialização de Perícia</Text>
            <CampoTexto
              label="Nome (ex: Conhecimento (Arcano), Ofício (Alquimia))"
              value={novoNome}
              onChangeText={setNovoNome}
            />
            <Text style={styles.modalSubLabel}>Atributo Chave:</Text>
            <View style={styles.chipsRow}>
              {ATRIBUTOS_LISTA.map((a) => (
                <TouchableOpacity
                  key={a.sigla}
                  style={[
                    styles.chip,
                    novoAtrib === a.sigla && styles.chipSelected,
                  ]}
                  onPress={() => setNovoAtrib(a.sigla)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      novoAtrib === a.sigla && styles.chipTextSelected,
                    ]}
                  >
                    {a.sigla}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.btnSecundario}
                onPress={() => setModalVisivel(false)}
              >
                <Text style={styles.btnSecundarioText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnPrimario}
                onPress={adicionarPericiaExtra}
              >
                <Text style={styles.btnPrimarioText}>Adicionar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 12,
    paddingBottom: 36,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: COLORS.surfaceVariant,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  th: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  rowPericia: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceVariant,
  },
  colCheck: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colNome: {
    flex: 1,
    paddingHorizontal: 4,
    textAlign: 'left',
  },
  colNum: {
    width: 38,
    textAlign: 'center',
  },
  colOutros: {
    width: 60,
    paddingHorizontal: 2,
  },
  colTotal: {
    width: 48,
    textAlign: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
  },
  checkMark: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
  periciaNome: {
    fontSize: 13,
    color: COLORS.text,
  },
  periciaNomeTreinada: {
    fontWeight: 'bold',
    color: COLORS.primaryDark,
  },
  periciaAtrib: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  cellText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  totalBadge: {
    width: 46,
    marginLeft: 4,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: COLORS.surfaceVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },
  totalBadgeTreinada: {
    backgroundColor: COLORS.primary,
  },
  totalText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  totalTextTreinada: {
    color: COLORS.white,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 12,
  },
  modalSubLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginTop: 8,
    marginBottom: 6,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 16,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surfaceVariant,
  },
  chipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  chipTextSelected: {
    color: COLORS.white,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  btnSecundario: {
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  btnSecundarioText: {
    color: COLORS.textSecondary,
    fontWeight: 'bold',
  },
  btnPrimario: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  btnPrimarioText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
});

