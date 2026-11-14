import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  converterMagiaParaItem,
  converterTalentoParaItem,
  formatarDescricaoMagia,
  formatarDescricaoTalento,
  MagiaData,
  TalentoData,
} from '../data';
import {
  FichaPersonagem,
  gerarId,
  HabilidadeOuTalento,
  MagiaItem,
} from '../models/ficha';
import { COLORS } from '../theme/colors';
import { CampoComSugestoes } from './CampoComSugestoes';
import { CampoTexto, SecaoHeader } from './CommonInput';
import { CompendioModal } from './CompendioModal';

interface Props {
  ficha: FichaPersonagem;
  onChange: (nova: FichaPersonagem) => void;
}

const NIVEIS_MAGIA = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

export const AbaHabilidadesEMagias: React.FC<Props> = ({ ficha, onChange }) => {
  // Controle do Compêndio Modal
  const [compendioVisivel, setCompendioVisivel] = useState(false);
  const [compendioAba, setCompendioAba] = useState<'talentos' | 'magias'>('talentos');
  const [compendioNivelFiltro, setCompendioNivelFiltro] = useState<number | null>(null);

  const abrirCompendioTalentos = () => {
    setCompendioAba('talentos');
    setCompendioNivelFiltro(null);
    setCompendioVisivel(true);
  };

  const abrirCompendioMagias = (nivel?: number | null) => {
    setCompendioAba('magias');
    setCompendioNivelFiltro(nivel !== undefined ? nivel : null);
    setCompendioVisivel(true);
  };

  // Funções de manipulação de itens da ficha
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

  // Callback ao adicionar talento vindo do Compêndio
  const handleAdicionarTalentoCompendio = (talento: TalentoData) => {
    const novo = converterTalentoParaItem(talento);
    onChange({
      ...ficha,
      talentos: [...ficha.talentos, novo],
    });
  };

  // Callback ao adicionar magia vinda do Compêndio
  const handleAdicionarMagiaCompendio = (magia: MagiaData) => {
    const nova = converterMagiaParaItem(magia);
    onChange({
      ...ficha,
      magias: [...ficha.magias, nova],
    });
  };

  // Callback de preenchimento automático em um item específico de talento
  const handlePreencherTalentoExistente = (
    itemAntigo: HabilidadeOuTalento,
    talento: TalentoData
  ) => {
    const atualizado: HabilidadeOuTalento = {
      ...itemAntigo,
      nome: talento.nome,
      descricao: formatarDescricaoTalento(talento),
    };
    atualizarItem('talentos', atualizado);
  };

  // Callback de preenchimento automático em um item específico de magia
  const handlePreencherMagiaExistente = (
    magiaAntiga: MagiaItem,
    magia: MagiaData
  ) => {
    const atualizada: MagiaItem = {
      ...magiaAntiga,
      nome: magia.nome,
      nivelCirculo: magia.nivel,
      custoPm: magia.nivel === 0 ? '0' : String(magia.nivel),
      descricao: formatarDescricaoMagia(magia),
    };
    atualizarMagia(atualizada);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      {/* 1. HABILIDADES DE RAÇA */}
      <BlocoHabilidadesSimples
        titulo="Habilidades de Raça"
        subtitulo="Traços e habilidades raciais do personagem"
        placeholderNome="Nome da Habilidade Racial"
        itens={ficha.habilidadesRaca}
        onAdicionar={() => adicionarItem('habilidadesRaca')}
        onAtualizar={(item) => atualizarItem('habilidadesRaca', item)}
        onRemover={(id) => removerItem('habilidadesRaca', id)}
      />

      {/* 2. HABILIDADES DE CLASSE */}
      <BlocoHabilidadesSimples
        titulo="Habilidades de Classe"
        subtitulo="Poderes e características de classe"
        placeholderNome="Nome da Habilidade de Classe"
        itens={ficha.habilidadesClasse}
        onAdicionar={() => adicionarItem('habilidadesClasse')}
        onAtualizar={(item) => atualizarItem('habilidadesClasse', item)}
        onRemover={(id) => removerItem('habilidadesClasse', id)}
      />

      {/* 3. TALENTOS COM AUTOCOMPLETE E COMPÊNDIO */}
      <View style={styles.card}>
        <View style={styles.cardHeaderWithAction}>
          <View style={styles.cardHeaderTitleCol}>
            <Text style={styles.cardHeaderTitle}>Talentos</Text>
            <Text style={styles.cardHeaderSubtitle}>
              Gerais, Combate, Perícia, Destino, Magia, Poderes ou Tormenta
            </Text>
          </View>
          <View style={styles.headerButtonsRow}>
            <TouchableOpacity
              style={styles.btnCompendio}
              onPress={abrirCompendioTalentos}
            >
              <Text style={styles.btnCompendioText}>📖 Compêndio</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnAdicionarHeader}
              onPress={() => adicionarItem('talentos')}
            >
              <Text style={styles.btnAdicionarHeaderText}>+ Manual</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.cardBody}>
          {ficha.talentos.length === 0 ? (
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyText}>
                Nenhum talento cadastrado. Toque em "📖 Compêndio" para escolher da lista ou "+ Manual" para criar.
              </Text>
            </View>
          ) : (
            ficha.talentos.map((item) => (
              <View key={item.id} style={styles.itemSubCard}>
                <View style={styles.rowTop}>
                  <View style={styles.colFlex}>
                    <CampoComSugestoes
                      label="Nome do Talento"
                      value={item.nome}
                      onChangeText={(v) => atualizarItem('talentos', { ...item, nome: v })}
                      tipo="talento"
                      placeholder="Ex: Ataque Poderoso, Foco em Arma..."
                      onSelecionarSugestao={(t) =>
                        handlePreencherTalentoExistente(item, t as TalentoData)
                      }
                      onAbrirCompendio={abrirCompendioTalentos}
                    />
                  </View>
                  <TouchableOpacity
                    style={styles.btnRemove}
                    onPress={() => removerItem('talentos', item.id)}
                  >
                    <Text style={styles.btnRemoveText}>✕</Text>
                  </TouchableOpacity>
                </View>
                <CampoTexto
                  label="Descrição / Pré-requisitos / Benefício"
                  value={item.descricao}
                  onChangeText={(v) =>
                    atualizarItem('talentos', { ...item, descricao: v })
                  }
                  multiline
                />
              </View>
            ))
          )}
        </View>
      </View>

      {/* 4. MAGIAS DIVIDIDAS POR NÍVEL COM COMPÊNDIO */}
      <View style={styles.card}>
        <View style={styles.cardHeaderWithAction}>
          <View style={styles.cardHeaderTitleCol}>
            <Text style={styles.cardHeaderTitle}>Magias por Nível</Text>
            <Text style={styles.cardHeaderSubtitle}>
              Grimório dividido do 0º ao 9º nível com consulta e preenchimento
            </Text>
          </View>
          <TouchableOpacity
            style={styles.btnCompendio}
            onPress={() => abrirCompendioMagias(null)}
          >
            <Text style={styles.btnCompendioText}>📖 Grimório Geral</Text>
          </TouchableOpacity>
        </View>

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
                  <View style={styles.nivelMagiaActions}>
                    <TouchableOpacity
                      style={styles.btnBuscarNivel}
                      onPress={() => abrirCompendioMagias(nivel)}
                    >
                      <Text style={styles.btnBuscarNivelText}>📖 Buscar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.btnAddMagia}
                      onPress={() => adicionarMagia(nivel)}
                    >
                      <Text style={styles.btnAddMagiaText}>+ Manual</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {magiasNivel.length === 0 ? (
                  <Text style={styles.emptyText}>
                    Espaço livre — toque em "📖 Buscar" ou "+ Manual" para adicionar.
                  </Text>
                ) : (
                  magiasNivel.map((magia) => (
                    <View key={magia.id} style={styles.itemSubCard}>
                      <View style={styles.rowTop}>
                        <View style={styles.colNomeMagia}>
                          <CampoComSugestoes
                            label="Nome da Magia"
                            value={magia.nome}
                            onChangeText={(v) =>
                              atualizarMagia({ ...magia, nome: v })
                            }
                            tipo="magia"
                            nivelMagia={nivel}
                            placeholder="Ex: Bola de Fogo, Curar Ferimentos..."
                            onSelecionarSugestao={(m) =>
                              handlePreencherMagiaExistente(magia, m as MagiaData)
                            }
                            onAbrirCompendio={() => abrirCompendioMagias(nivel)}
                          />
                        </View>
                        <View style={styles.colPmMagia}>
                          <CampoTexto
                            label="Custo PM"
                            value={magia.custoPm}
                            onChangeText={(v) =>
                              atualizarMagia({ ...magia, custoPm: v })
                            }
                            keyboardType="numeric"
                          />
                        </View>
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

      {/* Modal do Compêndio */}
      <CompendioModal
        visivel={compendioVisivel}
        onFechar={() => setCompendioVisivel(false)}
        abaInicial={compendioAba}
        nivelFiltroInicial={compendioNivelFiltro}
        fichaAtual={ficha}
        onAdicionarTalentoAFicha={handleAdicionarTalentoCompendio}
        onAdicionarMagiaAFicha={handleAdicionarMagiaCompendio}
      />
    </ScrollView>
  );
};

interface BlocoHabilidadesSimplesProps {
  titulo: string;
  subtitulo: string;
  placeholderNome: string;
  itens: HabilidadeOuTalento[];
  onAdicionar: () => void;
  onAtualizar: (item: HabilidadeOuTalento) => void;
  onRemover: (id: string) => void;
}

const BlocoHabilidadesSimples: React.FC<BlocoHabilidadesSimplesProps> = ({
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
    maxWidth: 960,
    width: '100%',
    alignSelf: 'center',
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  cardHeaderWithAction: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: COLORS.surfaceVariant,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    flexWrap: 'wrap',
    gap: 8,
  },
  cardHeaderTitleCol: {
    flex: 1,
    minWidth: 180,
  },
  cardHeaderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  cardHeaderSubtitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  headerButtonsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  btnCompendio: {
    backgroundColor: COLORS.gold,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  btnCompendioText: {
    color: '#3B2900',
    fontWeight: 'bold',
    fontSize: 12,
  },
  btnAdicionarHeader: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  btnAdicionarHeaderText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 12,
  },
  cardBody: {
    padding: 12,
  },
  emptyWrap: {
    paddingVertical: 12,
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
    alignItems: 'flex-start',
    gap: 8,
  },
  colFlex: {
    flex: 1,
  },
  colNomeMagia: {
    flex: 1.5,
  },
  colPmMagia: {
    width: 75,
  },
  btnRemove: {
    marginTop: 24,
    width: 34,
    height: 38,
    borderRadius: 6,
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
    flexWrap: 'wrap',
    gap: 6,
  },
  nivelMagiaTitulo: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  nivelMagiaActions: {
    flexDirection: 'row',
    gap: 6,
  },
  btnBuscarNivel: {
    backgroundColor: 'rgba(200,157,60,0.25)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.gold,
  },
  btnBuscarNivelText: {
    color: '#8A6414',
    fontWeight: 'bold',
    fontSize: 11,
  },
  btnAddMagia: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  btnAddMagiaText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 11,
  },
});
