import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  FichaPersonagem,
  gerarId,
  HabilidadeOuTalento,
  MagiaItem,
} from '../models/ficha';
import { COLORS } from '../theme/colors';
import { CampoTexto, SecaoHeader } from './CommonInput';

interface Props {
  ficha: FichaPersonagem;
  onChange: (nova: FichaPersonagem) => void;
}

const NIVEIS_MAGIA = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

export const AbaHabilidadesEMagias: React.FC<Props> = ({ ficha, onChange }) => {
  const adicionarItem = (
    campo: 'habilidadesRaca' | 'habilidadesClasse' | 'talentos'
  ) => {
    const novo: HabilidadeOuTalento = {
      id: gerarId(),
      nome: '',
      descricao: '',
    };
    onChange({ ...ficha, [campo]: [...ficha[campo], novo] });
  };

  const atualizarItem = (
    campo: 'habilidadesRaca' | 'habilidadesClasse' | 'talentos',
    editado: HabilidadeOuTalento
  ) => {
    onChange({
      ...ficha,
      [campo]: ficha[campo].map((item) =>
        item.id === editado.id ? editado : item
      ),
    });
  };

  const removerItem = (
    campo: 'habilidadesRaca' | 'habilidadesClasse' | 'talentos',
    id: string
  ) => {
    onChange({
      ...ficha,
      [campo]: ficha[campo].filter((item) => item.id !== id),
    });
  };

  const adicionarMagia = (nivelCirculo: number) => {
    const nova: MagiaItem = {
      id: gerarId(),
      nivelCirculo,
      nome: '',
      custoPm: nivelCirculo === 0 ? '0' : String(nivelCirculo),
      descricao: '',
    };
    onChange({ ...ficha, magias: [...ficha.magias, nova] });
  };

  const atualizarMagia = (magiaEditada: MagiaItem) => {
    onChange({
      ...ficha,
      magias: ficha.magias.map((m) =>
        m.id === magiaEditada.id ? magiaEditada : m
      ),
    });
  };

  const removerMagia = (id: string) => {
    onChange({
      ...ficha,
      magias: ficha.magias.filter((m) => m.id !== id),
    });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      {/* 1. HABILIDADES DE RAÇA */}
      <BlocoHabilidades
        titulo="Habilidades de Raça"
        subtitulo="Traços e habilidades raciais do personagem"
        placeholderNome="Nome da Habilidade Racial"
        itens={ficha.habilidadesRaca}
        onAdicionar={() => adicionarItem('habilidadesRaca')}
        onAtualizar={(item) => atualizarItem('habilidadesRaca', item)}
        onRemover={(id) => removerItem('habilidadesRaca', id)}
      />

      {/* 2. HABILIDADES DE CLASSE */}
      <BlocoHabilidades
        titulo="Habilidades de Classe"
        subtitulo="Poderes e características de classe"
        placeholderNome="Nome da Habilidade de Classe"
        itens={ficha.habilidadesClasse}
        onAdicionar={() => adicionarItem('habilidadesClasse')}
        onAtualizar={(item) => atualizarItem('habilidadesClasse', item)}
        onRemover={(id) => removerItem('habilidadesClasse', id)}
      />

      {/* 3. TALENTOS */}
      <BlocoHabilidades
        titulo="Talentos"
        subtitulo="Talentos gerais, de combate, destino, magia ou tormenta"
        placeholderNome="Nome do Talento"
        itens={ficha.talentos}
        onAdicionar={() => adicionarItem('talentos')}
        onAtualizar={(item) => atualizarItem('talentos', item)}
        onRemover={(id) => removerItem('talentos', id)}
      />

      {/* 4. MAGIAS DIVIDIDAS POR NÍVEL DE MAGIA */}
      <View style={styles.card}>
        <SecaoHeader
          titulo="Magias por Nível"
          subtitulo="Dividido com espaço para cada nível de magia (0º ao 9º)"
        />
        <View style={styles.cardBody}>
          {NIVEIS_MAGIA.map((nivel) => {
            const magiasNivel = ficha.magias.filter(
              (m) => m.nivelCirculo === nivel
            );
            return (
              <View key={nivel} style={styles.nivelMagiaBox}>
                <View style={styles.nivelMagiaHeader}>
                  <Text style={styles.nivelMagiaTitulo}>
                    {nivel === 0
                      ? 'Nível 0 (Truques / Preces)'
                      : `${nivel}º Nível de Magia`}
                  </Text>
                  <TouchableOpacity
                    style={styles.btnAddMagia}
                    onPress={() => adicionarMagia(nivel)}
                  >
                    <Text style={styles.btnAddMagiaText}>+ Magia</Text>
                  </TouchableOpacity>
                </View>

                {magiasNivel.length === 0 ? (
                  <Text style={styles.emptyText}>
                    Espaço livre — nenhuma magia de {nivel}º nível cadastrada.
                  </Text>
                ) : (
                  magiasNivel.map((magia) => (
                    <View key={magia.id} style={styles.itemSubCard}>
                      <View style={styles.rowTop}>
                        <CampoTexto
                          label="Nome da Magia"
                          value={magia.nome}
                          onChangeText={(v) =>
                            atualizarMagia({ ...magia, nome: v })
                          }
                          style={styles.colFlex}
                        />
                        <TouchableOpacity
                          style={styles.btnRemove}
                          onPress={() => removerMagia(magia.id)}
                        >
                          <Text style={styles.btnRemoveText}>✕</Text>
                        </TouchableOpacity>
                      </View>
                      <CampoTexto
                        label="Efeito / Alcance / Duração / Resistência"
                        value={magia.descricao}
                        onChangeText={(v) =>
                          atualizarMagia({ ...magia, descricao: v })
                        }
                        multiline
                      />
                    </View>
                  ))
                )}
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
};

interface BlocoHabilidadesProps {
  titulo: string;
  subtitulo: string;
  placeholderNome: string;
  itens: HabilidadeOuTalento[];
  onAdicionar: () => void;
  onAtualizar: (item: HabilidadeOuTalento) => void;
  onRemover: (id: string) => void;
}

const BlocoHabilidades: React.FC<BlocoHabilidadesProps> = ({
  titulo,
  subtitulo,
  placeholderNome,
  itens,
  onAdicionar,
  onAtualizar,
  onRemover,
}) => {
  return (
    <View style={styles.card}>
      <SecaoHeader
        titulo={titulo}
        subtitulo={subtitulo}
        acaoTexto="Adicionar"
        onAcaoPress={onAdicionar}
      />
      <View style={styles.cardBody}>
        {itens.length === 0 ? (
          <Text style={styles.emptyText}>
            Nenhum item cadastrado. Toque em "+ Adicionar" para incluir.
          </Text>
        ) : (
          itens.map((item) => (
            <View key={item.id} style={styles.itemSubCard}>
              <View style={styles.rowTop}>
                <CampoTexto
                  label={placeholderNome}
                  value={item.nome}
                  onChangeText={(v) => onAtualizar({ ...item, nome: v })}
                  style={styles.colFlex}
                />
                <TouchableOpacity
                  style={styles.btnRemove}
                  onPress={() => onRemover(item.id)}
                >
                  <Text style={styles.btnRemoveText}>✕</Text>
                </TouchableOpacity>
              </View>
              <CampoTexto
                label="Descrição / Efeito"
                value={item.descricao}
                onChangeText={(v) => onAtualizar({ ...item, descricao: v })}
                multiline
              />
            </View>
          ))
        )}
      </View>
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
  itemSubCard: {
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  colFlex: {
    flex: 1,
  },
  colNomeMagia: {
    flex: 1.6,
  },
  colPmMagia: {
    flex: 0.6,
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
  btnRemoveText: {
    color: COLORS.danger,
    fontWeight: 'bold',
    fontSize: 15,
  },
  nivelMagiaBox: {
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  nivelMagiaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  nivelMagiaTitulo: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  btnAddMagia: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  btnAddMagiaText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 12,
  },
});

