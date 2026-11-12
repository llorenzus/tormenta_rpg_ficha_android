export type AtributoSigla = 'FOR' | 'DES' | 'CON' | 'INT' | 'SAB' | 'CAR';

export interface AtributoInfo {
  sigla: AtributoSigla;
  nome: string;
  campo: keyof Pick<
    FichaPersonagem,
    'forca' | 'destreza' | 'constituicao' | 'inteligencia' | 'sabedoria' | 'carisma'
  >;
}

export const ATRIBUTOS_LISTA: AtributoInfo[] = [
  { sigla: 'FOR', nome: 'Força', campo: 'forca' },
  { sigla: 'DES', nome: 'Destreza', campo: 'destreza' },
  { sigla: 'CON', nome: 'Constituição', campo: 'constituicao' },
  { sigla: 'INT', nome: 'Inteligência', campo: 'inteligencia' },
  { sigla: 'SAB', nome: 'Sabedoria', campo: 'sabedoria' },
  { sigla: 'CAR', nome: 'Carisma', campo: 'carisma' },
];

export type TipoProtecao = 'ARMADURA' | 'ESCUDO';

export interface PericiaItem {
  id: string;
  nome: string;
  atributoChave: AtributoSigla;
  somenteTreinada?: boolean;
  treinada: boolean;
  outrosBonus: number;
}

export interface HabilidadeOuTalento {
  id: string;
  nome: string;
  descricao: string;
}

export interface MagiaItem {
  id: string;
  nivelCirculo: number; // 0 a 9
  nome: string;
  custoPm: string;
  descricao: string;
}

export interface ArmaItem {
  id: string;
  nome: string;
  bonusAtaque: string;
  dano: string;
  critico: string;
  distancia: string;
  tipoDano: string;
}

export interface ArmaduraEquipamento {
  id: string;
  nome: string;
  tipo: TipoProtecao;
  bonusCa: number;
  equipada: boolean;
}

export interface ItemGeral {
  id: string;
  nome: string;
  quantidade: string;
}

export interface FichaPersonagem {
  id: string;
  atualizadoEm: number;

  // 1. Dados Cadastrais
  nomePersonagem: string;
  jogador: string;
  raca: string;
  classe: string;
  nivel: number;
  tendencia: string;
  sexo: string;
  idade: string;
  divindade: string;
  tamanho: string;
  deslocamento: string;

  // 2. Atributos Principais
  forca: number;
  destreza: number;
  constituicao: number;
  inteligencia: number;
  sabedoria: number;
  carisma: number;

  // Status de Combate: PV, PM, BBA e CA (campos manuais)
  pvTotal: number;
  pvAtual: number;
  pmTotal: number;
  pmAtual: number;
  bba: number;
  caBonusTamanho: number;
  caOutrosBonus: number;

  // 3. Perícias
  pericias: PericiaItem[];

  // 4. Habilidades de Raça, Classe, Talentos e Magias
  habilidadesRaca: HabilidadeOuTalento[];
  habilidadesClasse: HabilidadeOuTalento[];
  talentos: HabilidadeOuTalento[];
  magias: MagiaItem[];

  // 5. Equipamentos
  armas: ArmaItem[];
  armaduras: ArmaduraEquipamento[];
  itensGerais: ItemGeral[];
  tibares: string;
}

export function gerarId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function calcularModificador(valor: number): number {
  const num = Number.isFinite(valor) ? valor : 10;
  return Math.floor((num - 10) / 2);
}

export function formatarModificador(mod: number): string {
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

export function obterMeioNivel(nivel: number): number {
  const niv = Math.max(1, Math.floor(nivel || 1));
  return Math.floor(niv / 2);
}

export function obterValorAtributo(ficha: FichaPersonagem, sigla: AtributoSigla): number {
  switch (sigla) {
    case 'FOR':
      return ficha.forca;
    case 'DES':
      return ficha.destreza;
    case 'CON':
      return ficha.constituicao;
    case 'INT':
      return ficha.inteligencia;
    case 'SAB':
      return ficha.sabedoria;
    case 'CAR':
      return ficha.carisma;
  }
}

export function obterModAtributo(ficha: FichaPersonagem, sigla: AtributoSigla): number {
  return calcularModificador(obterValorAtributo(ficha, sigla));
}

export function obterBonusArmaduraEquipada(ficha: FichaPersonagem): number {
  return (ficha.armaduras || [])
    .filter((a) => a.equipada && a.tipo === 'ARMADURA')
    .reduce((acc, item) => acc + (Number(item.bonusCa) || 0), 0);
}

export function obterBonusEscudoEquipado(ficha: FichaPersonagem): number {
  return (ficha.armaduras || [])
    .filter((a) => a.equipada && a.tipo === 'ESCUDO')
    .reduce((acc, item) => acc + (Number(item.bonusCa) || 0), 0);
}

/**
 * CA = 10 + 1/2 nível + mod_des + armadura + escudo + tamanho + outros bônus
 */
export function calcularCaTotal(ficha: FichaPersonagem): number {
  const meioNivel = obterMeioNivel(ficha.nivel);
  const modDes = calcularModificador(ficha.destreza);
  const armadura = obterBonusArmaduraEquipada(ficha);
  const escudo = obterBonusEscudoEquipado(ficha);
  const tamanho = Number(ficha.caBonusTamanho) || 0;
  const outros = Number(ficha.caOutrosBonus) || 0;
  return 10 + meioNivel + modDes + armadura + escudo + tamanho + outros;
}

/**
 * Graduação de perícia:
 * - Treinada: Nível + 3
 * - Não treinada: 1/2 Nível (arredondado para baixo)
 */
export function calcularGraduacaoPericia(ficha: FichaPersonagem, pericia: PericiaItem): number {
  const niv = Math.max(1, Math.floor(ficha.nivel || 1));
  return pericia.treinada ? niv + 3 : Math.floor(niv / 2);
}

/**
 * Total da perícia = Graduação + Mod. de Habilidade + Outros Bônus
 */
export function calcularTotalPericia(ficha: FichaPersonagem, pericia: PericiaItem): number {
  const grad = calcularGraduacaoPericia(ficha, pericia);
  const mod = obterModAtributo(ficha, pericia.atributoChave);
  const outros = Number(pericia.outrosBonus) || 0;
  return grad + mod + outros;
}

export function criarPericiasPadrao(): PericiaItem[] {
  const base: Array<{ nome: string; atributoChave: AtributoSigla; somenteTreinada?: boolean }> = [
    { nome: 'Acrobacia', atributoChave: 'DES' },
    { nome: 'Adestrar Animais', atributoChave: 'CAR', somenteTreinada: true },
    { nome: 'Atletismo', atributoChave: 'FOR' },
    { nome: 'Atuação', atributoChave: 'CAR' },
    { nome: 'Cavalgar', atributoChave: 'DES' },
    { nome: 'Conhecimento', atributoChave: 'INT', somenteTreinada: true },
    { nome: 'Cura', atributoChave: 'SAB' },
    { nome: 'Diplomacia', atributoChave: 'CAR' },
    { nome: 'Enganação', atributoChave: 'CAR' },
    { nome: 'Furtividade', atributoChave: 'DES' },
    { nome: 'Identificar Magia', atributoChave: 'INT', somenteTreinada: true },
    { nome: 'Iniciativa', atributoChave: 'DES' },
    { nome: 'Intimidação', atributoChave: 'CAR' },
    { nome: 'Intuição', atributoChave: 'SAB' },
    { nome: 'Ladinagem', atributoChave: 'DES', somenteTreinada: true },
    { nome: 'Obter Informação', atributoChave: 'CAR' },
    { nome: 'Ofício', atributoChave: 'INT' },
    { nome: 'Percepção', atributoChave: 'SAB' },
    { nome: 'Sobrevivência', atributoChave: 'SAB' },
  ];

  return base.map((item, idx) => ({
    id: `pericia-${idx}-${item.nome.toLowerCase().replace(/\s+/g, '-')}`,
    nome: item.nome,
    atributoChave: item.atributoChave,
    somenteTreinada: item.somenteTreinada,
    treinada: false,
    outrosBonus: 0,
  }));
}

export function criarNovaFichaPadrao(): FichaPersonagem {
  return {
    id: gerarId(),
    atualizadoEm: Date.now(),
    nomePersonagem: 'Novo Personagem',
    jogador: '',
    raca: '',
    classe: '',
    nivel: 1,
    tendencia: '',
    sexo: '',
    idade: '',
    divindade: '',
    tamanho: 'Médio',
    deslocamento: '9m',
    forca: 10,
    destreza: 10,
    constituicao: 10,
    inteligencia: 10,
    sabedoria: 10,
    carisma: 10,
    pvTotal: 10,
    pvAtual: 10,
    pmTotal: 0,
    pmAtual: 0,
    bba: 0,
    caBonusTamanho: 0,
    caOutrosBonus: 0,
    pericias: criarPericiasPadrao(),
    habilidadesRaca: [],
    habilidadesClasse: [],
    talentos: [],
    magias: [],
    armas: [],
    armaduras: [],
    itensGerais: [],
    tibares: '',
  };
}

