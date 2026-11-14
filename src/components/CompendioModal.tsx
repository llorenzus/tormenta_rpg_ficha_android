import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  CATEGORIAS_TALENTO,
  CategoriaTalento,
  converterMagiaParaItem,
  converterTalentoParaItem,
  ESCOLAS_MAGIA,
  filtrarMagias,
  filtrarTalentos,
  formatarDescricaoMagia,
  formatarDescricaoTalento,
  MagiaData,
  magias,
  TalentoData,
  talentos,
} from '../data';
import { FichaPersonagem } from '../models/ficha';
import { COLORS } from '../theme/colors';

interface Props {
  visivel: boolean;
  onFechar: () => void;
  abaInicial?: 'talentos' | 'magias';
  nivelFiltroInicial?: number | null;
  categoriaInicial?: CategoriaTalento | 'Todas';

  // Quando acionado a partir de uma ficha aberta:
  fichaAtual?: FichaPersonagem | null;
  onAdicionarTalentoAFicha?: (talento: TalentoData) => void;
  onAdicionarMagiaAFicha?: (magia: MagiaData) => void;

  // Quando acionado da lista de fichas (selecionador de personagem):
  todasFichas?: FichaPersonagem[];
  onAdicionarItemParaFichaEspecifica?: (
    fichaId: string,
    tipo: 'talento' | 'magia',
    item: TalentoData | MagiaData
  ) => void;
}

export const CompendioModal: React.FC<Props> = ({
  visivel,
  onFechar,
  abaInicial = 'talentos',
  nivelFiltroInicial = null,
  categoriaInicial = 'Todas',
  fichaAtual,
  onAdicionarTalentoAFicha,
  onAdicionarMagiaAFicha,
  todasFichas = [],
  onAdicionarItemParaFichaEspecifica,
}) => {
  const [abaAtiva, setAbaAtiva] = useState<'talentos' | 'magias'>(abaInicial);
  const [busca, setBusca] = useState('');

  // Filtros de Talentos
  const [categoriaSel, setCategoriaSel] = useState<CategoriaTalento | 'Todas'>(
    categoriaInicial
  );

  // Filtros de Magias
  const [nivelSel, setNivelSel] = useState<number | null>(nivelFiltroInicial);
  const [tipoSel, setTipoSel] = useState<'Todas' | 'Arcana' | 'Divina'>('Todas');
  const [escolaSel, setEscolaSel] = useState<string>('Todas');

  // Controle de cards expandidos
  const [expandidos, setExpandidos] = useState<Record<string, boolean>>({});

  // Modal para escolher personagem caso estejamos na tela geral
  const [itemParaAdicionar, setItemParaAdicionar] = useState<{
    tipo: 'talento' | 'magia';
    dado: TalentoData | MagiaData;
  } | null>(null);

  // Atualiza estado ao abrir com valores iniciais se mudarem
  React.useEffect(() => {
    if (visivel) {
      setAbaAtiva(abaInicial);
      if (nivelFiltroInicial !== undefined) setNivelSel(nivelFiltroInicial);
      if (categoriaInicial !== undefined) setCategoriaSel(categoriaInicial);
    }
  }, [visivel, abaInicial, nivelFiltroInicial, categoriaInicial]);

  const alternarExpandido = (id: string) => {
    setExpandidos((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Listas filtradas
  const talentosFiltrados = useMemo(() => {
    if (abaAtiva !== 'talentos') return [];
    return filtrarTalentos({ termo: busca, categoria: categoriaSel });
  }, [abaAtiva, busca, categoriaSel]);

  const magiasFiltradas = useMemo(() => {
    if (abaAtiva !== 'magias') return [];
    return filtrarMagias({
      termo: busca,
      nivel: nivelSel,
      tipo: tipoSel,
      escola: escolaSel,
    });
  }, [abaAtiva, busca, nivelSel, tipoSel, escolaSel]);

  const handleCliqueAdicionar = (
    tipo: 'talento' | 'magia',
    item: TalentoData | MagiaData
  ) => {
    if (fichaAtual) {
      if (tipo === 'talento' && onAdicionarTalentoAFicha) {
        onAdicionarTalentoAFicha(item as TalentoData);
      } else if (tipo === 'magia' && onAdicionarMagiaAFicha) {
        onAdicionarMagiaAFicha(item as MagiaData);
      }
    } else if (todasFichas.length === 1 && onAdicionarItemParaFichaEspecifica) {
      onAdicionarItemParaFichaEspecifica(todasFichas[0].id, tipo, item);
    } else if (todasFichas.length > 1) {
      setItemParaAdicionar({ tipo, dado: item });
    }
  };

  const confirmarAdicaoParaFicha = (fichaId: string) => {
    if (itemParaAdicionar && onAdicionarItemParaFichaEspecifica) {
      onAdicionarItemParaFichaEspecifica(
        fichaId,
        itemParaAdicionar.tipo,
        itemParaAdicionar.dado
      );
    }
    setItemParaAdicionar(null);
  };

  // Checa se o item já está na ficha atual
  const estaNaListaFicha = (tipo: 'talento' | 'magia', nome: string): boolean => {
    if (!fichaAtual) return false;
    if (tipo === 'talento') {
      return fichaAtual.talentos.some(
        (t) => t.nome.trim().toLowerCase() === nome.trim().toLowerCase()
      );
    } else {
      return fichaAtual.magias.some(
        (m) => m.nome.trim().toLowerCase() === nome.trim().toLowerCase()
      );
    }
  };

  return (
    <Modal
      visible={visivel}
      animationType="slide"
      onRequestClose={onFechar}
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.innerContainer}>
          {/* Top Header */}
        <View style={styles.header}>
          <View style={styles.headerTitleCol}>
            <Text style={styles.headerTitle}>Compêndio de Regras</Text>
            <Text style={styles.headerSubtitle}>
              {fichaAtual
                ? `Adicionando à ficha: ${fichaAtual.nomePersonagem || 'Personagem'}`
                : 'Consulta geral de Talentos e Magias'}
            </Text>
          </View>
          <TouchableOpacity style={styles.btnFechar} onPress={onFechar}>
            <Text style={styles.btnFecharText}>✕ Fechar</Text>
          </TouchableOpacity>
        </View>

        {/* Abas Superiores (Talentos vs Magias) */}
        <View style={styles.tabsRow}>
          <TouchableOpacity
            style={[
              styles.tabBtn,
              abaAtiva === 'talentos' && styles.tabBtnAtivo,
            ]}
            onPress={() => setAbaAtiva('talentos')}
          >
            <Text
              style={[
                styles.tabBtnText,
                abaAtiva === 'talentos' && styles.tabBtnTextAtivo,
              ]}
            >
              Talentos ({talentos.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabBtn,
              abaAtiva === 'magias' && styles.tabBtnAtivo,
            ]}
            onPress={() => setAbaAtiva('magias')}
          >
            <Text
              style={[
                styles.tabBtnText,
                abaAtiva === 'magias' && styles.tabBtnTextAtivo,
              ]}
            >
              Magias ({magias.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Barra de Busca */}
        <View style={styles.buscaWrap}>
          <TextInput
            style={styles.buscaInput}
            placeholder={
              abaAtiva === 'talentos'
                ? 'Buscar talento por nome, pré-requisito ou efeito...'
                : 'Buscar magia por nome ou descrição...'
            }
            placeholderTextColor={COLORS.textSecondary}
            value={busca}
            onChangeText={setBusca}
            autoCorrect={false}
          />
          {busca.length > 0 && (
            <TouchableOpacity
              style={styles.btnLimparBusca}
              onPress={() => setBusca('')}
            >
              <Text style={styles.btnLimparBuscaText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Barra de Filtros */}
        <View style={styles.filtrosContainer}>
          {abaAtiva === 'talentos' ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipsScroll}
            >
              {CATEGORIAS_TALENTO.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.chip,
                    categoriaSel === cat && styles.chipAtivo,
                  ]}
                  onPress={() => setCategoriaSel(cat)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      categoriaSel === cat && styles.chipTextAtivo,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.magiaFiltrosCol}>
              {/* Nível da Magia */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipsScroll}
              >
                <TouchableOpacity
                  style={[styles.chip, nivelSel === null && styles.chipAtivo]}
                  onPress={() => setNivelSel(null)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      nivelSel === null && styles.chipTextAtivo,
                    ]}
                  >
                    Todos os Níveis
                  </Text>
                </TouchableOpacity>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((lvl) => (
                  <TouchableOpacity
                    key={lvl}
                    style={[styles.chip, nivelSel === lvl && styles.chipAtivo]}
                    onPress={() => setNivelSel(lvl)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        nivelSel === lvl && styles.chipTextAtivo,
                      ]}
                    >
                      {lvl === 0 ? 'Nível 0' : `${lvl}º Nível`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Linha com Tipo e Escola */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={[styles.chipsScroll, { marginTop: 6 }]}
              >
                {(['Todas', 'Arcana', 'Divina'] as const).map((tipo) => (
                  <TouchableOpacity
                    key={tipo}
                    style={[styles.chip, tipoSel === tipo && styles.chipAtivo]}
                    onPress={() => setTipoSel(tipo)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        tipoSel === tipo && styles.chipTextAtivo,
                      ]}
                    >
                      {tipo === 'Todas' ? 'Arcana / Divina' : tipo}
                    </Text>
                  </TouchableOpacity>
                ))}

                <View style={styles.divisorVertical} />

                {ESCOLAS_MAGIA.map((esc) => (
                  <TouchableOpacity
                    key={esc}
                    style={[styles.chip, escolaSel === esc && styles.chipAtivo]}
                    onPress={() => setEscolaSel(esc)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        escolaSel === esc && styles.chipTextAtivo,
                      ]}
                    >
                      {esc}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Contador de resultados */}
        <View style={styles.contadorRow}>
          <Text style={styles.contadorText}>
            {abaAtiva === 'talentos'
              ? `${talentosFiltrados.length} talentos encontrados`
              : `${magiasFiltradas.length} magias encontradas`}
          </Text>
        </View>

        {/* Lista de Resultados */}
        {abaAtiva === 'talentos' ? (
          <FlatList
            data={talentosFiltrados}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            initialNumToRender={15}
            maxToRenderPerBatch={20}
            windowSize={10}
            ListEmptyComponent={
              <View style={styles.emptyWrap}>
                <Text style={styles.emptyText}>
                  Nenhum talento encontrado com os filtros selecionados.
                </Text>
              </View>
            }
            renderItem={({ item }) => {
              const expandido = !!expandidos[item.id];
              const jaPossui = estaNaListaFicha('talento', item.nome);
              return (
                <View style={styles.cardItem}>
                  <TouchableOpacity
                    style={styles.cardItemHeader}
                    onPress={() => alternarExpandido(item.id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.cardItemTitleCol}>
                      <View style={styles.badgeRow}>
                        <View style={styles.badgeCategoria}>
                          <Text style={styles.badgeCategoriaText}>
                            {item.categoria}
                          </Text>
                        </View>
                        {jaPossui && (
                          <View style={styles.badgePossui}>
                            <Text style={styles.badgePossuiText}>✓ Na Ficha</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.cardItemNome}>{item.nome}</Text>
                      {item.preRequisitos && item.preRequisitos !== 'Nenhum.' && (
                        <Text
                          style={styles.cardItemPreReq}
                          numberOfLines={expandido ? undefined : 1}
                        >
                          <Text style={styles.negrito}>Pré-requisitos: </Text>
                          {item.preRequisitos}
                        </Text>
                      )}
                    </View>

                    <TouchableOpacity
                      style={[
                        styles.btnAdicionar,
                        jaPossui && styles.btnAdicionarSecundario,
                      ]}
                      onPress={() => handleCliqueAdicionar('talento', item)}
                    >
                      <Text style={styles.btnAdicionarText}>
                        {fichaAtual ? '+ Adicionar' : '+ Personagem'}
                      </Text>
                    </TouchableOpacity>
                  </TouchableOpacity>

                  {/* Prévia curta de benefício se recolhido */}
                  {!expandido && (
                    <TouchableOpacity
                      onPress={() => alternarExpandido(item.id)}
                      style={styles.previaContainer}
                    >
                      <Text
                        style={styles.cardItemBeneficioPrevia}
                        numberOfLines={2}
                      >
                        {item.beneficio}
                      </Text>
                      <Text style={styles.toqueMaisText}>Toque para ver detalhes ▼</Text>
                    </TouchableOpacity>
                  )}

                  {/* Corpo Expandido */}
                  {expandido && (
                    <View style={styles.cardItemExpandido}>
                      {item.descricao ? (
                        <Text style={styles.cardItemDescricaoFlavor}>
                          "{item.descricao}"
                        </Text>
                      ) : null}

                      <View style={styles.beneficioBox}>
                        <Text style={styles.beneficioLabel}>Benefício:</Text>
                        <Text style={styles.beneficioTexto}>{item.beneficio}</Text>
                      </View>

                      <TouchableOpacity
                        style={styles.btnRecolher}
                        onPress={() => alternarExpandido(item.id)}
                      >
                        <Text style={styles.btnRecolherText}>Recolher ▲</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            }}
          />
        ) : (
          <FlatList
            data={magiasFiltradas}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            initialNumToRender={15}
            maxToRenderPerBatch={20}
            windowSize={10}
            ListEmptyComponent={
              <View style={styles.emptyWrap}>
                <Text style={styles.emptyText}>
                  Nenhuma magia encontrada com os filtros selecionados.
                </Text>
              </View>
            }
            renderItem={({ item }) => {
              const expandido = !!expandidos[item.id];
              const jaPossui = estaNaListaFicha('magia', item.nome);
              return (
                <View style={styles.cardItem}>
                  <TouchableOpacity
                    style={styles.cardItemHeader}
                    onPress={() => alternarExpandido(item.id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.cardItemTitleCol}>
                      <View style={styles.badgeRow}>
                        <View style={styles.badgeNivel}>
                          <Text style={styles.badgeNivelText}>
                            {item.nivel === 0 ? 'Nível 0' : `${item.nivel}º Nível`}
                          </Text>
                        </View>
                        <View style={styles.badgeEscola}>
                          <Text style={styles.badgeEscolaText}>
                            {item.escola}
                          </Text>
                        </View>
                        <View style={styles.badgeTipo}>
                          <Text style={styles.badgeTipoText}>{item.tipo}</Text>
                        </View>
                        {jaPossui && (
                          <View style={styles.badgePossui}>
                            <Text style={styles.badgePossuiText}>✓ No Grimório</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.cardItemNome}>{item.nome}</Text>
                      <Text
                        style={styles.cardItemResumo}
                        numberOfLines={expandido ? undefined : 1}
                      >
                        {item.tempoExecucao} • {item.alcance} • {item.duracao}
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={[
                        styles.btnAdicionar,
                        jaPossui && styles.btnAdicionarSecundario,
                      ]}
                      onPress={() => handleCliqueAdicionar('magia', item)}
                    >
                      <Text style={styles.btnAdicionarText}>
                        {fichaAtual ? '+ Adicionar' : '+ Personagem'}
                      </Text>
                    </TouchableOpacity>
                  </TouchableOpacity>

                  {/* Prévia se recolhido */}
                  {!expandido && (
                    <TouchableOpacity
                      onPress={() => alternarExpandido(item.id)}
                      style={styles.previaContainer}
                    >
                      <Text
                        style={styles.cardItemBeneficioPrevia}
                        numberOfLines={2}
                      >
                        {item.descricao}
                      </Text>
                      <Text style={styles.toqueMaisText}>Toque para ver detalhes ▼</Text>
                    </TouchableOpacity>
                  )}

                  {/* Corpo Expandido da Magia */}
                  {expandido && (
                    <View style={styles.cardItemExpandido}>
                      <View style={styles.magiaGridParametros}>
                        <View style={styles.magiaParamItem}>
                          <Text style={styles.paramLabel}>Tempo de Execução:</Text>
                          <Text style={styles.paramVal}>{item.tempoExecucao}</Text>
                        </View>
                        <View style={styles.magiaParamItem}>
                          <Text style={styles.paramLabel}>Alcance:</Text>
                          <Text style={styles.paramVal}>{item.alcance}</Text>
                        </View>
                        {item.alvoAreaEfeito ? (
                          <View style={styles.magiaParamItem}>
                            <Text style={styles.paramLabel}>Alvo / Área / Efeito:</Text>
                            <Text style={styles.paramVal}>{item.alvoAreaEfeito}</Text>
                          </View>
                        ) : null}
                        <View style={styles.magiaParamItem}>
                          <Text style={styles.paramLabel}>Duração:</Text>
                          <Text style={styles.paramVal}>{item.duracao}</Text>
                        </View>
                        {item.resistencia ? (
                          <View style={styles.magiaParamItem}>
                            <Text style={styles.paramLabel}>Teste de Resistência:</Text>
                            <Text style={styles.paramVal}>{item.resistencia}</Text>
                          </View>
                        ) : null}
                        {item.componenteMaterial ? (
                          <View style={styles.magiaParamItem}>
                            <Text style={styles.paramLabel}>Componente Material:</Text>
                            <Text style={styles.paramVal}>{item.componenteMaterial}</Text>
                          </View>
                        ) : null}
                      </View>

                      <View style={styles.beneficioBox}>
                        <Text style={styles.beneficioLabel}>Efeito Mágico:</Text>
                        <Text style={styles.beneficioTexto}>{item.descricao}</Text>
                      </View>

                      <TouchableOpacity
                        style={styles.btnRecolher}
                        onPress={() => alternarExpandido(item.id)}
                      >
                        <Text style={styles.btnRecolherText}>Recolher ▲</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            }}
          />
        )}

        {/* Modal de Escolha de Personagem (quando acionado fora da ficha) */}
        {itemParaAdicionar && (
          <Modal
            transparent
            animationType="fade"
            visible={!!itemParaAdicionar}
            onRequestClose={() => setItemParaAdicionar(null)}
          >
            <View style={styles.modalBackdrop}>
              <View style={styles.dialogCard}>
                <Text style={styles.dialogTitle}>
                  Adicionar {itemParaAdicionar.tipo === 'talento' ? 'Talento' : 'Magia'}
                </Text>
                <Text style={styles.dialogSubtitle}>
                  Selecione o personagem que irá registrar "{itemParaAdicionar.dado.nome}":
                </Text>

                <ScrollView style={styles.dialogScroll}>
                  {todasFichas.map((f) => (
                    <TouchableOpacity
                      key={f.id}
                      style={styles.dialogFichaItem}
                      onPress={() => confirmarAdicaoParaFicha(f.id)}
                    >
                      <Text style={styles.dialogFichaNome}>
                        {f.nomePersonagem || 'Personagem sem Nome'}
                      </Text>
                      <Text style={styles.dialogFichaDetalhes}>
                        Nível {f.nivel} • {f.classe || 'Classe não definida'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <TouchableOpacity
                  style={styles.dialogBtnCancelar}
                  onPress={() => setItemParaAdicionar(null)}
                >
                  <Text style={styles.dialogBtnCancelarText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  innerContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 1100,
    alignSelf: 'center',
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitleCol: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  btnFechar: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(139,30,30,0.1)',
  },
  btnFecharText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 13,
  },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceVariant,
    padding: 6,
    gap: 8,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  tabBtnAtivo: {
    backgroundColor: COLORS.primary,
  },
  tabBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
  },
  tabBtnTextAtivo: {
    color: COLORS.white,
  },
  buscaWrap: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: COLORS.surface,
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  buscaInput: {
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  btnLimparBusca: {
    position: 'absolute',
    right: 22,
    top: 16,
    padding: 4,
  },
  btnLimparBuscaText: {
    color: COLORS.textSecondary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  filtrosContainer: {
    backgroundColor: COLORS.surface,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  chipsScroll: {
    paddingHorizontal: 12,
    gap: 6,
    alignItems: 'center',
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: COLORS.surfaceVariant,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipAtivo: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
  },
  chipTextAtivo: {
    color: COLORS.white,
  },
  magiaFiltrosCol: {
    gap: 4,
  },
  divisorVertical: {
    width: 1,
    height: 20,
    backgroundColor: COLORS.border,
    marginHorizontal: 4,
  },
  contadorRow: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: COLORS.background,
  },
  contadorText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  listContent: {
    padding: 12,
    paddingBottom: 36,
  },
  cardItem: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 10,
    overflow: 'hidden',
    elevation: 1,
  },
  cardItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    gap: 8,
  },
  cardItemTitleCol: {
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 4,
  },
  badgeCategoria: {
    backgroundColor: 'rgba(139,30,30,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeCategoriaText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 11,
  },
  badgeNivel: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeNivelText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 11,
  },
  badgeEscola: {
    backgroundColor: 'rgba(200,157,60,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeEscolaText: {
    color: '#8A6414',
    fontWeight: 'bold',
    fontSize: 11,
  },
  badgeTipo: {
    backgroundColor: COLORS.surfaceVariant,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeTipoText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    textTransform: 'capitalize',
  },
  badgePossui: {
    backgroundColor: 'rgba(46,107,62,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgePossuiText: {
    color: COLORS.success,
    fontWeight: 'bold',
    fontSize: 11,
  },
  cardItemNome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 2,
  },
  cardItemPreReq: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  cardItemResumo: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  negrito: {
    fontWeight: 'bold',
  },
  btnAdicionar: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnAdicionarSecundario: {
    backgroundColor: COLORS.success,
  },
  btnAdicionarText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 12,
  },
  previaContainer: {
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  cardItemBeneficioPrevia: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 17,
  },
  toqueMaisText: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: '600',
    marginTop: 4,
  },
  cardItemExpandido: {
    padding: 12,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.surfaceVariant,
  },
  cardItemDescricaoFlavor: {
    fontSize: 12,
    fontStyle: 'italic',
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  beneficioBox: {
    backgroundColor: COLORS.surface,
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 8,
  },
  beneficioLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  beneficioTexto: {
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 18,
  },
  magiaGridParametros: {
    backgroundColor: COLORS.surface,
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 8,
    gap: 4,
  },
  magiaParamItem: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  paramLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  paramVal: {
    fontSize: 12,
    color: COLORS.textSecondary,
    flex: 1,
  },
  btnRecolher: {
    alignSelf: 'center',
    paddingVertical: 4,
    paddingHorizontal: 16,
  },
  btnRecolherText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: 'bold',
  },
  emptyWrap: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dialogCard: {
    width: '100%',
    maxWidth: 480,
    maxHeight: '80%',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  dialogSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  dialogScroll: {
    maxHeight: 280,
    marginBottom: 12,
  },
  dialogFichaItem: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: COLORS.surfaceVariant,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dialogFichaNome: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  dialogFichaDetalhes: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  dialogBtnCancelar: {
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: 'rgba(139,30,30,0.1)',
  },
  dialogBtnCancelarText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 14,
  },
});
