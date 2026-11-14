import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  ArmaItem,
  ArmaduraEquipamento,
  calcularAtaqueArma,
  calcularCaTotal,
  FichaPersonagem,
  formatarModificador,
  gerarId,
  ItemGeral,
  obterBonusArmaduraEquipada,
  obterBonusEscudoEquipado,
  obterModAtributo,
} from '../models/ficha';
import { COLORS } from '../theme/colors';
import { CampoInteiro, CampoTexto, SecaoHeader } from './CommonInput';

interface Props {
  ficha: FichaPersonagem;
  onChange: (nova: FichaPersonagem) => void;
}

export const AbaEquipamentos: React.FC<Props> = ({ ficha, onChange }) => {
  const adicionarArma = () => {
    const nova: ArmaItem = {
      id: gerarId(),
      nome: '',
      bonusAtaque: '',
      dano: '',
      critico: '',
      distancia: '',
      tipoDano: '',
      usaDestreza: false,
      outrosBonus: 0,
    };
    const totalInicial = calcularAtaqueArma(ficha, nova);
    nova.bonusAtaque = formatarModificador(totalInicial);
    onChange({ ...ficha, armas: [...ficha.armas, nova] });
  };

  const atualizarArma = (armaEditada: ArmaItem) => {
    onChange({
      ...ficha,
      armas: ficha.armas.map((a) => (a.id === armaEditada.id ? armaEditada : a)),
    });
  };

  const removerArma = (id: string) => {
    onChange({
      ...ficha,
      armas: ficha.armas.filter((a) => a.id !== id),
    });
  };

  const adicionarArmadura = () => {
    const nova: ArmaduraEquipamento = {
      id: gerarId(),
      nome: '',
      tipo: 'ARMADURA',
      bonusCa: 0,
      equipada: true,
    };
    onChange({ ...ficha, armaduras: [...ficha.armaduras, nova] });
  };

  const atualizarArmadura = (editada: ArmaduraEquipamento) => {
    onChange({
      ...ficha,
      armaduras: ficha.armaduras.map((a) => (a.id === editada.id ? editada : a)),
    });
  };

  const removerArmadura = (id: string) => {
    onChange({
      ...ficha,
      armaduras: ficha.armaduras.filter((a) => a.id !== id),
    });
  };

  const adicionarItemGeral = () => {
    const novo: ItemGeral = {
      id: gerarId(),
      nome: '',
      quantidade: '1',
    };
    onChange({ ...ficha, itensGerais: [...ficha.itensGerais, novo] });
  };

  const atualizarItemGeral = (editado: ItemGeral) => {
    onChange({
      ...ficha,
      itensGerais: ficha.itensGerais.map((i) =>
        i.id === editado.id ? editado : i
      ),
    });
  };

  const removerItemGeral = (id: string) => {
    onChange({
      ...ficha,
      itensGerais: ficha.itensGerais.filter((i) => i.id !== id),
    });
  };

  const bonusArmadura = obterBonusArmaduraEquipada(ficha);
  const bonusEscudo = obterBonusEscudoEquipado(ficha);
  const caTotal = calcularCaTotal(ficha);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      {/* 1. ARMAS */}
      <View style={styles.card}>
        <SecaoHeader
          titulo="Armas"
          subtitulo="Ataques corpo-a-corpo e à distância"
          acaoTexto="Nova Arma"
          onAcaoPress={adicionarArma}
        />
        <View style={styles.cardBody}>
          {ficha.armas.length === 0 ? (
            <Text style={styles.emptyText}>
              Nenhuma arma cadastrada. Toque em "+ Nova Arma" para adicionar.
            </Text>
          ) : (
            ficha.armas.map((arma) => {
              const bba = Number(ficha.bba) || 0;
              const modAtrib = arma.usaDestreza
                ? obterModAtributo(ficha, 'DES')
                : obterModAtributo(ficha, 'FOR');
              const bonusTam = Number(ficha.caBonusTamanho) || 0;
              const outros = Number(arma.outrosBonus) || 0;
              const totalCalculado = bba + modAtrib + bonusTam + outros;

              const alternarAtributo = () => {
                const novoUsaDes = !arma.usaDestreza;
                const novoTotal = calcularAtaqueArma(ficha, {
                  ...arma,
                  usaDestreza: novoUsaDes,
                });
                atualizarArma({
                  ...arma,
                  usaDestreza: novoUsaDes,
                  bonusAtaque: formatarModificador(novoTotal),
                });
              };

              const atualizarOutrosBonus = (novoOutros: number) => {
                const novoTotal = calcularAtaqueArma(ficha, {
                  ...arma,
                  outrosBonus: novoOutros,
                });
                atualizarArma({
                  ...arma,
                  outrosBonus: novoOutros,
                  bonusAtaque: formatarModificador(novoTotal),
                });
              };

              return (
                <View key={arma.id} style={styles.subCard}>
                  {/* Linha superior: Nome e Excluir */}
                  <View style={styles.rowTop}>
                    <CampoTexto
                      label="Nome da Arma"
                      value={arma.nome}
                      onChangeText={(v) => atualizarArma({ ...arma, nome: v })}
                      placeholder="Ex: Espada Longa"
                      style={styles.colFlex}
                    />
                    <TouchableOpacity
                      style={styles.btnRemove}
                      onPress={() => removerArma(arma.id)}
                    >
                      <Text style={styles.btnRemoveText}>✕</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Checkbox de Atributo (Força vs Destreza) */}
                  <TouchableOpacity
                    style={[
                      styles.checkAtributoWrap,
                      arma.usaDestreza && styles.checkAtributoWrapActive,
                    ]}
                    onPress={alternarAtributo}
                    activeOpacity={0.75}
                  >
                    <View
                      style={[
                        styles.checkboxBox,
                        arma.usaDestreza && styles.checkboxBoxActive,
                      ]}
                    >
                      {arma.usaDestreza ? (
                        <Text style={styles.checkboxCheck}>✓</Text>
                      ) : null}
                    </View>
                    <View style={styles.checkAtributoTextCol}>
                      <Text style={styles.checkAtributoLabel}>
                        {arma.usaDestreza
                          ? 'Usar Destreza (Distância / Acuidade)'
                          : 'Usar Força (Corpo-a-corpo padrão)'}
                      </Text>
                    </View>
                    <View style={styles.badgeAtribBox}>
                      <Text style={styles.badgeAtribText}>
                        {arma.usaDestreza
                          ? `DES (${formatarModificador(modAtrib)})`
                          : `FOR (${formatarModificador(modAtrib)})`}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  {/* Resumo do Acerto Calculado (BBA + Mod + Tam + Outros) */}
                  <View style={styles.acertoResumoCard}>
                    <View style={styles.acertoResumoHeader}>
                      <Text style={styles.acertoResumoTitulo}>
                        Acerto Calculado:
                      </Text>
                      <Text style={styles.acertoResumoValor}>
                        {formatarModificador(totalCalculado)}
                      </Text>
                    </View>
                    <Text style={styles.acertoResumoFormula}>
                      Mod {arma.usaDestreza ? 'DES' : 'FOR'} ({formatarModificador(modAtrib)}) + BBA ({formatarModificador(bba)})
                      {bonusTam !== 0 ? ` + Tam (${formatarModificador(bonusTam)})` : ''}
                      {` + Outros (${formatarModificador(outros)})`}
                    </Text>
                  </View>

                  {/* Bônus de Ataque, Outros e Dano */}
                  <View style={styles.row}>
                    <CampoTexto
                      label="Bônus de Ataque"
                      value={arma.bonusAtaque}
                      onChangeText={(v) =>
                        atualizarArma({ ...arma, bonusAtaque: v })
                      }
                      placeholder={formatarModificador(totalCalculado)}
                      style={styles.col}
                    />
                    <CampoInteiro
                      label="Outros Bônus"
                      valor={Number(arma.outrosBonus) || 0}
                      onValorChange={atualizarOutrosBonus}
                      min={-99}
                      max={99}
                      style={styles.col}
                    />
                    <CampoTexto
                      label="Dano"
                      value={arma.dano}
                      onChangeText={(v) => atualizarArma({ ...arma, dano: v })}
                      placeholder="Ex: 1d8+4"
                      style={styles.col}
                    />
                  </View>

                  {/* Crítico, Distância e Tipo */}
                  <View style={styles.row}>
                    <CampoTexto
                      label="Crítico"
                      value={arma.critico}
                      onChangeText={(v) =>
                        atualizarArma({ ...arma, critico: v })
                      }
                      placeholder="Ex: 19-20/x2"
                      style={styles.col}
                    />
                    <CampoTexto
                      label="Distância"
                      value={arma.distancia}
                      onChangeText={(v) =>
                        atualizarArma({ ...arma, distancia: v })
                      }
                      placeholder="Ex: — ou 9m"
                      style={styles.col}
                    />
                    <CampoTexto
                      label="Tipo"
                      value={arma.tipoDano}
                      onChangeText={(v) =>
                        atualizarArma({ ...arma, tipoDano: v })
                      }
                      placeholder="Corte"
                      style={styles.col}
                    />
                  </View>
                </View>
              );
            })
          )}
        </View>
      </View>

      {/* 2. ARMADURAS E ESCUDOS EQUIPADOS (CÁLCULO DA CA) */}
      <View style={styles.card}>
        <SecaoHeader
          titulo="Armaduras e Escudos Equipados"
          subtitulo="Seus bônus entram automaticamente no cálculo da CA"
          acaoTexto="Adicionar"
          onAcaoPress={adicionarArmadura}
        />
        <View style={styles.cardBody}>
          <View style={styles.caSummaryBar}>
            <Text style={styles.caSummaryText}>
              Armadura: +{bonusArmadura} | Escudo: +{bonusEscudo}
            </Text>
            <Text style={styles.caSummaryTotal}>CA Atual: {caTotal}</Text>
          </View>

          {ficha.armaduras.length === 0 ? (
            <Text style={styles.emptyText}>
              Nenhuma armadura ou escudo cadastrado. Toque em "+ Adicionar" para incluir.
            </Text>
          ) : (
            ficha.armaduras.map((armadura) => (
              <View key={armadura.id} style={styles.subCard}>
                <View style={styles.armaduraTopRow}>
                  <View style={styles.tipoSelectorRow}>
                    <TouchableOpacity
                      style={[
                        styles.tipoChip,
                        armadura.tipo === 'ARMADURA' && styles.tipoChipSelected,
                      ]}
                      onPress={() =>
                        atualizarArmadura({ ...armadura, tipo: 'ARMADURA' })
                      }
                    >
                      <Text
                        style={[
                          styles.tipoChipText,
                          armadura.tipo === 'ARMADURA' &&
                            styles.tipoChipTextSelected,
                        ]}
                      >
                        Armadura
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.tipoChip,
                        armadura.tipo === 'ESCUDO' && styles.tipoChipSelected,
                      ]}
                      onPress={() =>
                        atualizarArmadura({ ...armadura, tipo: 'ESCUDO' })
                      }
                    >
                      <Text
                        style={[
                          styles.tipoChipText,
                          armadura.tipo === 'ESCUDO' &&
                            styles.tipoChipTextSelected,
                        ]}
                      >
                        Escudo
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.equipadaRightRow}>
                    <TouchableOpacity
                      style={styles.equipadaToggle}
                      onPress={() =>
                        atualizarArmadura({
                          ...armadura,
                          equipada: !armadura.equipada,
                        })
                      }
                    >
                      <View
                        style={[
                          styles.checkbox,
                          armadura.equipada && styles.checkboxChecked,
                        ]}
                      >
                        {armadura.equipada && (
                          <Text style={styles.checkMark}>✓</Text>
                        )}
                      </View>
                      <Text style={styles.equipadaLabel}>Equipada</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.btnRemoveSmall}
                      onPress={() => removerArmadura(armadura.id)}
                    >
                      <Text style={styles.btnRemoveText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.row}>
                  <CampoTexto
                    label={
                      armadura.tipo === 'ARMADURA'
                        ? 'Nome da Armadura'
                        : 'Nome do Escudo'
                    }
                    value={armadura.nome}
                    onChangeText={(v) =>
                      atualizarArmadura({ ...armadura, nome: v })
                    }
                    placeholder={
                      armadura.tipo === 'ARMADURA'
                        ? 'Ex: Cota de Malha'
                        : 'Ex: Escudo Pesado'
                    }
                    style={styles.colWide}
                  />
                  <CampoInteiro
                    label="Bônus na CA"
                    valor={armadura.bonusCa}
                    onValorChange={(v) =>
                      atualizarArmadura({ ...armadura, bonusCa: v })
                    }
                    min={0}
                    max={50}
                    style={styles.colSmall}
                  />
                </View>
              </View>
            ))
          )}
        </View>
      </View>

      {/* 3. OUTROS EQUIPAMENTOS E TIBARES */}
      <View style={styles.card}>
        <SecaoHeader
          titulo="Mochila e Tibares"
          subtitulo="Itens gerais, consumíveis e dinheiro"
          acaoTexto="Item"
          onAcaoPress={adicionarItemGeral}
        />
        <View style={styles.cardBody}>
          <CampoTexto
            label="Tibares / Dinheiro (T$, TO, TP)"
            value={ficha.tibares}
            onChangeText={(v) => onChange({ ...ficha, tibares: v })}
            placeholder="Ex: 150 T$, 10 TO"
          />

          {ficha.itensGerais.map((item) => (
            <View key={item.id} style={styles.rowTop}>
              <CampoTexto
                label="Item"
                value={item.nome}
                onChangeText={(v) => atualizarItemGeral({ ...item, nome: v })}
                style={styles.colWide}
              />
              <CampoTexto
                label="Qtd"
                value={item.quantidade}
                onChangeText={(v) =>
                  atualizarItemGeral({ ...item, quantidade: v })
                }
                style={styles.colSmall}
              />
              <TouchableOpacity
                style={styles.btnRemove}
                onPress={() => removerItemGeral(item.id)}
              >
                <Text style={styles.btnRemoveText}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
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
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  cardBody: {
    padding: 12,
  },
  emptyText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  subCard: {
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  col: {
    flex: 1,
  },
  colFlex: {
    flex: 1,
  },
  colWide: {
    flex: 1.7,
  },
  colSmall: {
    flex: 0.8,
  },
  btnRemove: {
    marginTop: 14,
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: 'rgba(179,38,30,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnRemoveSmall: {
    width: 30,
    height: 30,
    borderRadius: 6,
    backgroundColor: 'rgba(179,38,30,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  btnRemoveText: {
    color: COLORS.danger,
    fontWeight: 'bold',
    fontSize: 14,
  },
  caSummaryBar: {
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  caSummaryText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
  },
  caSummaryTotal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  armaduraTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  tipoSelectorRow: {
    flexDirection: 'row',
    gap: 6,
  },
  tipoChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  tipoChipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  tipoChipText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  tipoChipTextSelected: {
    color: COLORS.white,
  },
  equipadaRightRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  equipadaToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
  },
  checkMark: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: 'bold',
  },
  equipadaLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
  },
  checkAtributoWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginTop: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  checkAtributoWrapActive: {
    backgroundColor: '#FFF8E7',
    borderColor: COLORS.gold,
  },
  checkboxBox: {
    width: 22,
    height: 22,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: COLORS.textSecondary,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  checkboxBoxActive: {
    borderColor: COLORS.primaryDark,
    backgroundColor: COLORS.primary,
  },
  checkboxCheck: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 13,
  },
  checkAtributoTextCol: {
    flex: 1,
  },
  checkAtributoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
  },
  badgeAtribBox: {
    backgroundColor: COLORS.surfaceVariant,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  badgeAtribText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  acertoResumoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  acertoResumoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  acertoResumoTitulo: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  acertoResumoValor: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  acertoResumoFormula: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});

