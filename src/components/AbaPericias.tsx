import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
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

type TipoPericiaComplementar = 'Atuação' | 'Conhecimento' | 'Ofício';

interface ConfigPericiaComplementar {
  nomeBase: TipoPericiaComplementar;
  atributoChave: AtributoSigla;
  somenteTreinada?: boolean;
  placeholder: string;
}

const PERICIAS_COMPLEMENTARES: ConfigPericiaComplementar[] = [
  {
    nomeBase: 'Atuação',
    atributoChave: 'CAR',
    somenteTreinada: false,
    placeholder: 'Ex: Música, Teatro...',
  },
  {
    nomeBase: 'Conhecimento',
    atributoChave: 'INT',
    somenteTreinada: true,
    placeholder: 'Ex: Arcano, Religião...',
  },
  {
    nomeBase: 'Ofício',
    atributoChave: 'INT',
    somenteTreinada: false,
    placeholder: 'Ex: Alquimia, Ferreiro...',
  },
];

function obterConfigComplementar(
  pericia: PericiaItem
): ConfigPericiaComplementar | undefined {
  const nomeLimpo = pericia.nome.trim();
  return PERICIAS_COMPLEMENTARES.find(
    (cfg) =>
      nomeLimpo === cfg.nomeBase ||
      nomeLimpo.startsWith(`${cfg.nomeBase} (`) ||
      nomeLimpo.startsWith(`${cfg.nomeBase}(`)
  );
}

function extrairComplemento(pericia: PericiaItem): string {
  if (typeof pericia.complemento === 'string') {
    return pericia.complemento;
  }
  const match = pericia.nome.match(/^[^(]+\((.*)\)$/);
  return match ? match[1] : '';
}

function montarNomeComComplemento(nomeBase: string, complemento: string): string {
  const limpo = complemento.trim();
  return limpo ? `${nomeBase} (${limpo})` : nomeBase;
}

export const AbaPericias: React.FC<Props> = ({ ficha, onChange }) => {
  const [modalVisivel, setModalVisivel] = useState(false);
  const [tipoSelecionado, setTipoSelecionado] =
    useState<TipoPericiaComplementar>('Ofício');
  const [novoComplemento, setNovoComplemento] = useState('');

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

  const alterarComplemento = (
    periciaId: string,
    nomeBase: TipoPericiaComplementar,
    complemento: string
  ) => {
    const novaLista = ficha.pericias.map((p) =>
      p.id === periciaId
        ? {
            ...p,
            complemento,
            nome: montarNomeComComplemento(nomeBase, complemento),
          }
        : p
    );
    onChange({ ...ficha, pericias: novaLista });
  };

  const abrirModalParaTipo = (tipo: TipoPericiaComplementar) => {
    setTipoSelecionado(tipo);
    setNovoComplemento('');
    setModalVisivel(true);
  };

  const adicionarPericiaComplementar = () => {
    const cfg =
      PERICIAS_COMPLEMENTARES.find((c) => c.nomeBase === tipoSelecionado) ||
      PERICIAS_COMPLEMENTARES[2];
    const compLimpo = novoComplemento.trim();

    const nova: PericiaItem = {
      id: gerarId(),
      nome: montarNomeComComplemento(cfg.nomeBase, compLimpo),
      atributoChave: cfg.atributoChave,
      somenteTreinada: cfg.somenteTreinada,
      treinada: true,
      outrosBonus: 0,
      complemento: compLimpo,
    };

    // Insere logo abaixo da última perícia do mesmo tipo (Atuação, Conhecimento ou Ofício)
    let ultimoIndiceMesmoTipo = -1;
    ficha.pericias.forEach((p, idx) => {
      const pCfg = obterConfigComplementar(p);
      if (pCfg?.nomeBase === cfg.nomeBase) {
        ultimoIndiceMesmoTipo = idx;
      }
    });

    const novaLista = [...ficha.pericias];
    if (ultimoIndiceMesmoTipo >= 0) {
      novaLista.splice(ultimoIndiceMesmoTipo + 1, 0, nova);
    } else {
      novaLista.push(nova);
    }

    onChange({ ...ficha, pericias: novaLista });
    setNovoComplemento('');
    setModalVisivel(false);
  };

  const removerPericiaComplementar = (periciaId: string) => {
    const novaLista = ficha.pericias.filter((p) => p.id !== periciaId);
    onChange({ ...ficha, pericias: novaLista });
  };

  const contarPorTipo = (nomeBase: TipoPericiaComplementar): number => {
    return ficha.pericias.filter(
      (p) => obterConfigComplementar(p)?.nomeBase === nomeBase
    ).length;
  };

  const configAtualModal =
    PERICIAS_COMPLEMENTARES.find((c) => c.nomeBase === tipoSelecionado) ||
    PERICIAS_COMPLEMENTARES[2];

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
            acaoTexto="Nova Especialização"
            onAcaoPress={() => abrirModalParaTipo('Ofício')}
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
            const cfgComp = obterConfigComplementar(pericia);
            const complementoAtual = cfgComp ? extrairComplemento(pericia) : '';
            const podeRemover =
              cfgComp !== undefined && contarPorTipo(cfgComp.nomeBase) > 1;

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

                <View style={styles.colNome}>
                  <View style={styles.nomeTopRow}>
                    <TouchableOpacity
                      style={styles.nomeTouchArea}
                      onPress={() => alternarTreinada(pericia.id)}
                    >
                      <Text
                        style={[
                          styles.periciaNome,
                          pericia.treinada && styles.periciaNomeTreinada,
                        ]}
                      >
                        {cfgComp ? cfgComp.nomeBase : pericia.nome}
                        {pericia.somenteTreinada ? '*' : ''}
                      </Text>
                      <Text style={styles.periciaAtrib}>
                        ({pericia.atributoChave})
                      </Text>
                    </TouchableOpacity>

                    {cfgComp && (
                      <View style={styles.acoesComplementoRow}>
                        <TouchableOpacity
                          style={styles.btnAddInline}
                          onPress={() => abrirModalParaTipo(cfgComp.nomeBase)}
                        >
                          <Text style={styles.btnAddInlineText}>+ Nova</Text>
                        </TouchableOpacity>
                        {podeRemover && (
                          <TouchableOpacity
                            style={styles.btnRemInline}
                            onPress={() => removerPericiaComplementar(pericia.id)}
                          >
                            <Text style={styles.btnRemInlineText}>✕</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    )}
                  </View>

                  {cfgComp && (
                    <TextInput
                      style={styles.inputComplemento}
                      value={complementoAtual}
                      onChangeText={(txt) =>
                        alterarComplemento(pericia.id, cfgComp.nomeBase, txt)
                      }
                      placeholder={cfgComp.placeholder}
                      placeholderTextColor="#9D8E80"
                    />
                  )}
                </View>

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
            <Text style={styles.modalTitle}>Incluir Nova Perícia</Text>
            <Text style={styles.modalSubLabel}>Escolha a perícia:</Text>
            <View style={styles.chipsRow}>
              {PERICIAS_COMPLEMENTARES.map((cfg) => {
                const selecionado = tipoSelecionado === cfg.nomeBase;
                return (
                  <TouchableOpacity
                    key={cfg.nomeBase}
                    style={[styles.chip, selecionado && styles.chipSelected]}
                    onPress={() => setTipoSelecionado(cfg.nomeBase)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        selecionado && styles.chipTextSelected,
                      ]}
                    >
                      {cfg.nomeBase} ({cfg.atributoChave})
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <CampoTexto
              label={`Complemento de ${tipoSelecionado}`}
              value={novoComplemento}
              onChangeText={setNovoComplemento}
              placeholder={configAtualModal.placeholder}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.btnSecundario}
                onPress={() => setModalVisivel(false)}
              >
                <Text style={styles.btnSecundarioText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnPrimario}
                onPress={adicionarPericiaComplementar}
              >
                <Text style={styles.btnPrimarioText}>Incluir</Text>
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
    maxWidth: 960,
    width: '100%',
    alignSelf: 'center',
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
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colNome: {
    flex: 1,
    paddingHorizontal: 4,
  },
  nomeTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 4,
  },
  nomeTouchArea: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    flexShrink: 1,
  },
  acoesComplementoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  btnAddInline: {
    backgroundColor: COLORS.surfaceVariant,
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
  },
  btnAddInlineText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  btnRemInline: {
    backgroundColor: 'rgba(179,38,30,0.12)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
  },
  btnRemInlineText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.danger,
  },
  inputComplemento: {
    marginTop: 4,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    fontSize: 12,
    color: COLORS.text,
  },
  colNum: {
    width: 36,
    textAlign: 'center',
  },
  colOutros: {
    width: 58,
    paddingHorizontal: 2,
  },
  colTotal: {
    width: 46,
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
    width: 44,
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
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  modalSubLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
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
    marginTop: 12,
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
