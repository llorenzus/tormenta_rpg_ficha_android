import json
import re
import unicodedata
import os
import pypdf

def slugify(name):
    n = unicodedata.normalize('NFD', name)
    n = ''.join(c for c in n if unicodedata.category(c) != 'Mn')
    n = re.sub(r'[^a-zA-Z0-9]+', '_', n).strip('_').lower()
    return n

def clean(t):
    if not t:
        return ''
    t = re.sub(r'[\r\n]+', ' ', t)
    t = re.sub(r'\s+', ' ', t)
    return t.strip()

# 1. Carrega dados existentes
with open('src/data/talentos/talentos.json', 'r', encoding='utf-8-sig') as f:
    talentos_existentes = json.load(f)
talento_ids = {t['id']: t for t in talentos_existentes}
talento_nomes = {t['nome'].lower().strip(): t for t in talentos_existentes}

with open('src/data/magias/magias.json', 'r', encoding='utf-8-sig') as f:
    magias_existentes = json.load(f)
magia_ids = {m['id']: m for m in magias_existentes}
magia_nomes = {m['nome'].lower().strip(): m for m in magias_existentes}

novos_talentos = []
novas_magias = []

# =========================================================================
# 2. NOVAS MAGIAS DO MANUAL DAS RAÇAS (PÁG 89)
# =========================================================================
magias_para_adicionar = [
    {
        "id": "criar_zumbi_vegetal",
        "nome": "Criar Zumbi Vegetal",
        "nivel": 4,
        "tipo": "divina (terra)",
        "escola": "Necromancia",
        "tempoExecucao": "Ação completa",
        "alcance": "Toque",
        "alvoAreaEfeito": "1 tosco",
        "duracao": "Instantânea",
        "resistencia": "Nenhum",
        "componenteMaterial": "Ervas raras no valor de 50 TO",
        "descricao": "Você usa um cadáver como matéria-prima para criar um zumbi vegetal, ou \"tosco\" — um soldado sem mente feito de fibra vegetal. O número máximo de toscos que você pode ter sob seu comando é igual ao seu nível de druida. Eles duram até serem destruídos.\n\nTosco: construto 3, Neutro; ND 1; Médio, desl. 9m; PV 35; CA 18; arma de madeira +5 (1d8+3) ou arma de madeira +3 (1d8+3) e mordida +2 (1d6+3); For 14, Des 14, Con –, Int –, Sab 10, Car 1."
    },
    {
        "id": "criar_fera_vegetal",
        "nome": "Criar Fera Vegetal",
        "nivel": 6,
        "tipo": "divina (terra)",
        "escola": "Convocação",
        "tempoExecucao": "Ação completa",
        "alcance": "9m",
        "alvoAreaEfeito": "1 fera vegetal",
        "duracao": "Instantânea",
        "resistencia": "Nenhum",
        "componenteMaterial": "Ervas raras no valor de 200 TO",
        "descricao": "Você invoca uma fera com aparência de dragão, feita de matéria vegetal retorcida. A fera é totalmente obediente a você, lutando até a destruição. Você só pode ter uma fera sob seu comando por vez.\n\nFera Vegetal: construto 10, Neutro; ND 7; Enorme, desl. 12m, voo 24m; PV 90; CA 24; mordida +14 (2d6+14); sopro cone 9m (8d6+5 de fogo, Reflexos CD 15 metade, recarga 1d4 rodadas); For 29, Des 14, Con —, Int —, Sab 11, Car 1."
    }
]

for m in magias_para_adicionar:
    if m['id'] not in magia_ids and m['nome'].lower() not in magia_nomes:
        novas_magias.append(m)
        magia_ids[m['id']] = m
        magia_nomes[m['nome'].lower()] = m

# =========================================================================
# 3. TALENTOS REGIONAIS CLÁSSICOS DE TORMENTA RPG (REINADO / MUNDO DE ARTON)
# =========================================================================
talentos_regionais = [
    {
        "id": "amigo_de_azgher",
        "nome": "Amigo de Azgher",
        "categoria": "Regional",
        "preRequisitos": "Deserto da Perdição.",
        "descricao": "Você nasceu sob o sol impiedoso das areias do Deserto da Perdição.",
        "beneficio": "Você recebe +4 em testes de Sobrevivência em terreno desértico e em testes de Fortitude para resistir a calor excessivo e desidratação. Além disso, recebe resistência a fogo 2."
    },
    {
        "id": "arma_dupla_zakharov",
        "nome": "Arma Dupla",
        "categoria": "Regional",
        "preRequisitos": "Zakharov.",
        "descricao": "O Reino das Armas desenvolve guerreiros versáteis capazes de alternar pontas e lâminas com maestria singular.",
        "beneficio": "Ao empunhar uma arma dupla (como cajado de batalha ou espada de duas lâminas), a penalidade por combater com duas armas diminui em 1 (para –1 com ambas se tiver Combater com Duas Armas)."
    },
    {
        "id": "arma_de_familia",
        "nome": "Arma de Família",
        "categoria": "Regional",
        "preRequisitos": "Zakharov, Deheon, Portsmouth ou Yuden.",
        "descricao": "Você herdou uma arma tradicional passada de geração em geração.",
        "beneficio": "Você começa o jogo com uma arma de sua escolha que conta como uma arma magistral obra-prima (+1 em jogadas de ataque e dano). No 5º nível e a cada 5 níveis seguintes, esta arma adquire bônus mágico de +1 adicional."
    },
    {
        "id": "armas_taurinas",
        "nome": "Armas Taurinas",
        "categoria": "Regional",
        "preRequisitos": "Tapista.",
        "descricao": "Você foi treinado no uso militar das tradicionais armas das legiões de Tapista.",
        "beneficio": "Você é considerado treinado no uso de espada táurica e rede, e recebe +1 nas jogadas de ataque com qualquer arma de gladiador ou legionário."
    },
    {
        "id": "autoconfiante",
        "nome": "Autoconfiante",
        "categoria": "Regional",
        "preRequisitos": "Valkaria ou Ahlen.",
        "descricao": "Criado na capital do mundo ou em cortes ardilosas, você acredita plenamente no próprio potencial.",
        "beneficio": "Você pode usar seu modificador de Carisma em vez de Sabedoria para testes de Vontade e para a perícia Percepção."
    },
    {
        "id": "bairrista",
        "nome": "Bairrista",
        "categoria": "Regional",
        "preRequisitos": "Yuden.",
        "descricao": "O patriotismo bélico de Yuden corre forte em suas veias.",
        "beneficio": "Você recebe +1 em jogadas de ataque, dano e CA quando estiver lutando ao lado de pelo menos um outro nativo de Yuden ou membro da sua mesma ordem militar."
    },
    {
        "id": "centauro_do_sul",
        "nome": "Centauro do Sul",
        "categoria": "Regional",
        "preRequisitos": "União Púrpura ou Grande Savana.",
        "descricao": "Você cresceu nas vastas e violentas estepes do sul de Arton.",
        "beneficio": "Seu deslocamento aumenta em +3m. Além disso, recebe +2 em testes de Sobrevivência e em jogadas de ataque durante uma investida."
    },
    {
        "id": "comerciante_nato",
        "nome": "Comerciante Nato",
        "categoria": "Regional",
        "preRequisitos": "Vectora.",
        "descricao": "Nascido e criado na Cidade das Nuvens, regatear e negociar são como respirar para você.",
        "beneficio": "Você recebe +4 em testes de Diplomacia e Obter Informação relacionados a comércio. Além disso, pode comprar itens por 10% a menos e vendê-los por 10% a mais do preço padrão de tabela."
    },
    {
        "id": "conhecimento_de_lendas",
        "nome": "Conhecimento de Lendas",
        "categoria": "Regional",
        "preRequisitos": "Porto Livre.",
        "descricao": "As tavernas do maior porto pirata do continente são ricas em contos e segredos arcanos de todos os cantos do mundo.",
        "beneficio": "Você pode fazer qualquer teste de Conhecimento mesmo sem treinamento, somando seu modificador de Carisma em vez de Inteligência ao teste."
    },
    {
        "id": "conhecimento_das_fadas",
        "nome": "Conhecimento das Fadas",
        "categoria": "Regional",
        "preRequisitos": "Pondsmânia.",
        "descricao": "Você cresceu no reino feérico, aprendendo os truques inocentes e caprichosos das fadas.",
        "beneficio": "Você recebe +2 em testes de Enganação e Intuição. Uma vez ao dia, pode lançar uma magia ilusória ou prece menor à sua escolha sem gastar pontos de magia."
    },
    {
        "id": "cosmopolita",
        "nome": "Cosmopolita",
        "categoria": "Regional",
        "preRequisitos": "Valkaria.",
        "descricao": "Em Valkaria convivem todas as raças, credos e culturas conhecidas pelo homem.",
        "beneficio": "Você aprende três idiomas adicionais à sua escolha e recebe +2 em testes de Diplomacia e Conhecimento (local)."
    },
    {
        "id": "curandeiro_das_fadas",
        "nome": "Curandeiro das Fadas",
        "categoria": "Regional",
        "preRequisitos": "Pondsmânia.",
        "descricao": "As energias curativas da natureza mágica de Pondsmânia fluem por suas mãos.",
        "beneficio": "Sempre que você lançar uma magia de cura de ferimentos em um aliado, ela cura 1d8 pontos de vida adicionais."
    },
    {
        "id": "espirito_guerreiro",
        "nome": "Espírito Guerreiro",
        "categoria": "Regional",
        "preRequisitos": "Yuden.",
        "descricao": "Mesmo quando à beira da derrota, a disciplina marcial mantém seu corpo firme.",
        "beneficio": "Quando seus pontos de vida caem abaixo de 0 mas você ainda não está morto, pode continuar agindo por mais uma rodada antes de cair inconsciente."
    },
    {
        "id": "filho_de_nimb",
        "nome": "Filho de Nimb",
        "categoria": "Regional",
        "preRequisitos": "Porto Livre.",
        "descricao": "A sorte e o caos sempre conspiram em sua direção.",
        "beneficio": "Uma vez por dia, você pode rolar novamente qualquer jogada de ataque, teste de habilidade, perícia ou resistência recém realizada. Você deve aceitar o segundo resultado."
    },
    {
        "id": "flerte_lisonjeiro",
        "nome": "Flerte Lisonjeiro",
        "categoria": "Regional",
        "preRequisitos": "Ahlen.",
        "descricao": "No Reino da Intriga, a sedução e as palavras doces abrem qualquer porta.",
        "beneficio": "Você recebe +4 em testes de Enganação e Diplomacia contra alvos que possam se sentir atraídos romanticamente por você."
    },
    {
        "id": "fogo_de_tauron",
        "nome": "Fogo de Tauron",
        "categoria": "Regional",
        "preRequisitos": "Tapista.",
        "descricao": "A chama do Deus da Força arde em sua alma legionária.",
        "beneficio": "Seus ataques corpo-a-corpo ou desarmados causam +1d4 pontos de dano de fogo adicional uma vez por rodada."
    },
    {
        "id": "forte_como_touro",
        "nome": "Forte como Touro",
        "categoria": "Regional",
        "preRequisitos": "Tapista.",
        "descricao": "Seu físico foi forjado no trabalho árduo ou na disciplina de Tapista.",
        "beneficio": "Você recebe +2 em testes de Força e testes de manobras de combate (agarrar, derrubar, empurrar)."
    },
    {
        "id": "gladiador_imperial",
        "nome": "Gladiador Imperial",
        "categoria": "Regional",
        "preRequisitos": "Tapista.",
        "descricao": "Você combateu nas arenas gladiatoriais sob o olhar de milhares de minotauros.",
        "beneficio": "Você recebe +1 nas jogadas de ataque e na CA quando estiver enfrentando dois ou mais adversários ao mesmo tempo."
    },
    {
        "id": "guerrilheiro_das_colinas",
        "nome": "Guerrilheiro das Colinas",
        "categoria": "Regional",
        "preRequisitos": "Colinas Uivantes.",
        "descricao": "Você conhece cada ravina, fenda e esconderijo das terras gélidas e acidentadas das Colinas Uivantes.",
        "beneficio": "Você recebe +2 na CA contra ataques à distância e ignora terrenos difíceis em terrenos rochosos, colinas ou montanhas."
    },
    {
        "id": "heranca_de_wynna",
        "nome": "Herança de Wynna",
        "categoria": "Regional",
        "preRequisitos": "Wynlla.",
        "descricao": "No Reino da Magia, até mesmo plebeus possuem alguma fagulha sobrenatural.",
        "beneficio": "Você recebe +2 pontos de magia (PM) e aprende um truque/prece de nível 0 que pode lançar livremente sem gastar PM."
    },
    {
        "id": "hipismo_lendario",
        "nome": "Hipismo Lendário",
        "categoria": "Regional",
        "preRequisitos": "Namalkah.",
        "descricao": "Cavaleiro nato das planícies de Namalkah, você monta quase antes de andar.",
        "beneficio": "Você recebe +4 em testes de Cavalgar e Adestrar Animais. Montar ou desmontar é considerado uma ação livre para você."
    },
    {
        "id": "historias_de_pescador",
        "nome": "Histórias de Pescador",
        "categoria": "Regional",
        "preRequisitos": "Callistia.",
        "descricao": "As águas de Callistia criam contadores de histórias inacreditáveis e marinheiros natos.",
        "beneficio": "Você recebe +2 em testes de Natação e Enganação, e nunca sofre penalidades por lutar debaixo d'água com armas perfurantes."
    },
    {
        "id": "inimigo_de_deuses_estranhos",
        "nome": "Inimigo de Deuses Estranhos",
        "categoria": "Regional",
        "preRequisitos": "Tollon.",
        "descricao": "Os lenhadores de Tollon guardam devoção estrita e desconfiam abertamente de heresias e cultos forasteiros.",
        "beneficio": "Você recebe +2 em testes de resistência contra magias divinas e +1 em jogadas de ataque contra clérigos e servos de outras divindades que não a sua."
    },
    {
        "id": "intolerancia_religiosa",
        "nome": "Intolerância Religiosa",
        "categoria": "Regional",
        "preRequisitos": "Portsmouth.",
        "descricao": "O controle ferrenho e a caça a conjuradores em Portsmouth afiaram seus instintos defensivos.",
        "beneficio": "Você recebe +2 em testes de Vontade contra feitiços arcanos e +2 nas jogadas de dano contra magos, feiticeiros e bruxos."
    },
    {
        "id": "lobisomem_de_portsmouth",
        "nome": "Lobisomem de Portsmouth",
        "categoria": "Regional",
        "preRequisitos": "Portsmouth.",
        "descricao": "A névoa escura e os bosques sombrios de Portsmouth esconderam a maldição em seu sangue.",
        "beneficio": "Sob a luz da lua cheia, você recebe visão no escuro, Faro e um ataque natural de mordida (1d6) com bônus de +2 em jogadas de ataque."
    },
    {
        "id": "madeira_de_tollon",
        "nome": "Madeira de Tollon",
        "categoria": "Regional",
        "preRequisitos": "Tollon.",
        "descricao": "Você sabe como selecionar e talhar a famosa madeira de Tollon, dura como ferro.",
        "beneficio": "Itens de madeira fabricados ou empunhados por você têm o dobro de pontos de vida e dureza normal, e armas de madeira causam +1 ponto de dano."
    },
    {
        "id": "medico_nato",
        "nome": "Médico Nato",
        "categoria": "Regional",
        "preRequisitos": "Salistick.",
        "descricao": "Em Salistick a medicina dispensa magias divinas através da ciência e estudos avançados do corpo.",
        "beneficio": "Você soma seu modificador de Inteligência em testes de Primeiros Socorros e Tratamento com a perícia Cura. Um tratamento bem-sucedido cura o dobro do normal."
    },
    {
        "id": "mestre_alquimista",
        "nome": "Mestre Alquimista",
        "categoria": "Regional",
        "preRequisitos": "Salistick.",
        "descricao": "Os laboratórios de Salistick produziram fórmulas refinadas para pós e frascos bélicos.",
        "beneficio": "Itens alquímicos preparados ou utilizados por você (fogo alquímico, ácido, granadas) causam +2 dados de dano ou têm sua CD aumentada em +2."
    },
    {
        "id": "militarista",
        "nome": "Militarista",
        "categoria": "Regional",
        "preRequisitos": "Yuden.",
        "descricao": "A academia militar de Yuden incutiu em você técnicas rígidas de formação de combate.",
        "beneficio": "Você sabe usar todas as armas marciais e armaduras médias sem custo de talentos adicionais."
    },
    {
        "id": "montaria_conjurada",
        "nome": "Montaria Conjurada",
        "categoria": "Regional",
        "preRequisitos": "Namalkah.",
        "descricao": "A conexão mística de seu povo com corcéis permite convocar montarias dos planos naturais.",
        "beneficio": "Você pode lançar montaria fantasmagórica uma vez por dia sem gastar pontos de magia."
    },
    {
        "id": "nadador_dos_fiordes",
        "nome": "Nadador dos Fiordes",
        "categoria": "Regional",
        "preRequisitos": "Montanhas Uivantes.",
        "descricao": "Mergulhador experiente em águas congeladas ao redor dos rochedos do norte.",
        "beneficio": "Você adquire deslocamento de natação 9m e não sofre os efeitos de hipotermia por nadar em águas congelantes."
    },
    {
        "id": "nativo_do_oceano",
        "nome": "Nativo do Oceano",
        "categoria": "Regional",
        "preRequisitos": "Mar Negro ou Ilhas de Arton.",
        "descricao": "Filho do mar aberto, você se move em conveses em tempestade com agilidade incrível.",
        "beneficio": "Você recebe +2 em testes de Atletismo e Ofício (marinheiro), e nunca é considerado desprevenido ao lutar em navios ou pontes oscilantes."
    },
    {
        "id": "nobreza_rural",
        "nome": "Nobreza Rural",
        "categoria": "Regional",
        "preRequisitos": "Deheon ou Bielefeld.",
        "descricao": "Você pertence a uma casa nobre do campo que possui terras e respeito comunal.",
        "beneficio": "Você começa o jogo com 200 TO extras e recebe +2 em testes de Diplomacia e Conhecimento (nobreza)."
    },
    {
        "id": "nomade_dos_ermos",
        "nome": "Nômade dos Ermos",
        "categoria": "Regional",
        "preRequisitos": "Ermos Selvagens ou Grande Savana.",
        "descricao": "Você não tem lar fixo e viaja sem cessar pelas vastidões selvagens.",
        "beneficio": "Você recebe +2 em testes de Sobrevivência e Percepção, e não sofre penalidades de deslocamento por carregar carga pesada."
    },
    {
        "id": "olhos_especiais",
        "nome": "Olhos Especiais",
        "categoria": "Regional",
        "preRequisitos": "Ahlen.",
        "descricao": "Ninguém engana quem foi criado em Ahlen.",
        "beneficio": "Você recebe +4 em testes de Intuição para perceber mentiras e blefes, e +2 em testes de Percepção para notar armadilhas e emboscadas."
    },
    {
        "id": "pacificador",
        "nome": "Pacificador",
        "categoria": "Regional",
        "preRequisitos": "Deheon.",
        "descricao": "A paz da deusa Marah e a diplomacia do Reinado guiam suas palavras antes do aço.",
        "beneficio": "Você pode tentar acalmar criaturas hostis com um teste de Diplomacia como ação padrão. Se for bem-sucedido, a criatura se recusa a atacar por 1 rodada."
    },
    {
        "id": "parceiro_animal",
        "nome": "Parceiro Animal",
        "categoria": "Regional",
        "preRequisitos": "Sambúrdia.",
        "descricao": "Sambúrdia é o celeiro de Arton, onde animais e camponeses vivem em profunda simbiose.",
        "beneficio": "Você recebe um cão de guarda, cavalo de carga ou animal similar leal que o acompanha em viagens e recebe bônus de +2 em CA e PV."
    },
    {
        "id": "patriota",
        "nome": "Patriota",
        "categoria": "Regional",
        "preRequisitos": "Deheon.",
        "descricao": "Você acredita com fervor na união dos povos sob a liderança do Reinado.",
        "beneficio": "Você recebe 1 Ponto de Ação extra no início de cada sessão de jogo quando estiver agindo em defesa do Reinado ou de seus aliados."
    },
    {
        "id": "pirata_da_costa",
        "nome": "Pirata da Costa",
        "categoria": "Regional",
        "preRequisitos": "Porto Livre.",
        "descricao": "Você navegou sob bandeira pirata saqueando navios mercantes e explorando mares misteriosos.",
        "beneficio": "Você recebe +2 em jogadas de ataque com sabre ou cutelo e +2 em testes de Intimidação e Acrobacia."
    },
    {
        "id": "prosperidade",
        "nome": "Prosperidade",
        "categoria": "Regional",
        "preRequisitos": "Bielefeld ou Portsmouth.",
        "descricao": "Sua linhagem é afortunada e bem-sucedida nos negócios e colheitas.",
        "beneficio": "Você começa o jogo com 300 TO extras. A cada novo nível adquirido, você recebe mais 100 TO vindos de rendas familiares ou propriedades."
    },
    {
        "id": "ranger_urbano",
        "nome": "Ranger Urbano",
        "categoria": "Regional",
        "preRequisitos": "Valkaria.",
        "descricao": "A maior metrópole de Arton tem becos mais perigosos que qualquer masmorra.",
        "beneficio": "Você pode usar as habilidades de rastrear e terreno familiar em ambientes urbanos (cidades grandes e metrópoles)."
    },
    {
        "id": "resistencia_as_uivantes",
        "nome": "Resistência às Uivantes",
        "categoria": "Regional",
        "preRequisitos": "Montanhas Uivantes.",
        "descricao": "Seu sangue foi temperado pelo gelo eterno do norte artoniano.",
        "beneficio": "Você recebe resistência a frio 5 e bônus de +4 em testes de Fortitude para evitar congelamento e hipotermia."
    },
    {
        "id": "sangue_de_ferro",
        "nome": "Sangue de Ferro",
        "categoria": "Regional",
        "preRequisitos": "Zakharov.",
        "descricao": "O metal de Zakharov parece fazer parte da própria carne dos seus habitantes.",
        "beneficio": "Você recebe redução de dano 1 (RD 1) contra dano físico, acumulativa com outras fontes de redução de dano."
    },
    {
        "id": "sentir_o_mal",
        "nome": "Sentir o Mal",
        "categoria": "Regional",
        "preRequisitos": "Bielefeld.",
        "descricao": "A Ordem da Luz treinou seus sentidos para notar a proximidade das sombras.",
        "beneficio": "Você detecta a presença de criaturas Malignas adjacentes a você instantaneamente, sem necessidade de testes de Percepção."
    },
    {
        "id": "tatuagem_protetora",
        "nome": "Tatuagem Protetora",
        "categoria": "Regional",
        "preRequisitos": "Tamu-ra.",
        "descricao": "Símbolos ancestrais desenhados com tinta especial canalizam o ki dos espíritos sobre seu corpo.",
        "beneficio": "Você recebe um bônus de +1 na Classe de Armadura (CA) e +1 em todos os testes de resistência."
    },
    {
        "id": "tolerancia_ao_calor",
        "nome": "Tolerância ao Calor",
        "categoria": "Regional",
        "preRequisitos": "Deserto da Perdição ou Sckharshantallas.",
        "descricao": "Você suporta temperaturas extremas sem desfalecer.",
        "beneficio": "Você ignora a necessidade de água extra em climas quentes e recebe +4 em testes de Fortitude contra calor."
    },
    {
        "id": "tolerancia_ao_frio",
        "nome": "Tolerância ao Frio",
        "categoria": "Regional",
        "preRequisitos": "Montanhas Uivantes.",
        "descricao": "As rajadas congelantes não abalam sua determinação.",
        "beneficio": "Você nunca sofre penalidades de movimento por neve ou gelo e recebe +4 em testes de resistência contra frio e ventos cortantes."
    },
    {
        "id": "tradicionalista",
        "nome": "Tradicionalista",
        "categoria": "Regional",
        "preRequisitos": "Tamu-ra.",
        "descricao": "Você honra com fervor o código e as armas sagradas dos seus antepassados orientais.",
        "beneficio": "Você recebe +1 nas jogadas de ataque e dano com katana, wakizashi, daikyu ou naginata."
    },
    {
        "id": "tropeiro",
        "nome": "Tropeiro",
        "categoria": "Regional",
        "preRequisitos": "Tollon.",
        "descricao": "Você é hábil em guiar caravanas por trilhas perigosas e estradas acidentadas.",
        "beneficio": "Você recebe +2 em testes de Cavalgar e Sobrevivência, e pode viajar por 12 horas diárias sem precisar fazer testes para evitar fadiga."
    },
    {
        "id": "vigor_da_montanha",
        "nome": "Vigor da Montanha",
        "categoria": "Regional",
        "preRequisitos": "Montanhas Sanguinárias.",
        "descricao": "A rudeza das Montanhas Sanguinárias concedeu a você um corpo inquebrável.",
        "beneficio": "Você recebe +3 pontos de vida (PV) adicionais e +2 em testes de Fortitude contra venenos e doenças."
    }
]

for t in talentos_regionais:
    if t['id'] not in talento_ids and t['nome'].lower() not in talento_nomes:
        novos_talentos.append(t)
        talento_ids[t['id']] = t
        talento_nomes[t['nome'].lower()] = t

# =========================================================================
# 4. TALENTOS DO PANTEÃO (PODERES CONCEDIDOS)
# =========================================================================
talentos_panteao = [
    {
        "id": "alma_do_dragao",
        "nome": "Alma do Dragão",
        "categoria": "Poderes Concedidos",
        "preRequisitos": "Asas do Dragão, Escamas do Dragão, Garras do Dragão, Sopro do Dragão, 17º nível, devoto de Kallyadranoch.",
        "descricao": "Você se torna parte dragão em corpo e essência.",
        "beneficio": "Você adquire o modelo meio-dragão completo, recebendo todos os seus poderes e características raciais."
    },
    {
        "id": "amigo_de_azgher_poder",
        "nome": "Amigo do Sol",
        "categoria": "Poderes Concedidos",
        "preRequisitos": "Devoto de Azgher.",
        "descricao": "Azgher derrama sua bênção sobre os andarilhos do deserto.",
        "beneficio": "Você recebe +4 em testes de Sobrevivência em terreno desértico e em testes de Fortitude para evitar dano por ambientes quentes, além de resistência a fogo 5."
    },
    {
        "id": "anatomia_insana",
        "nome": "Anatomia Insana",
        "categoria": "Poderes Concedidos",
        "preRequisitos": "Devoto de Nimb.",
        "descricao": "A loucura não distorceu apenas sua mente, mas também sua carne.",
        "beneficio": "Você tem 25% de chance de ignorar o dano adicional de um acerto crítico ou ataque furtivo."
    },
    {
        "id": "anfibio_oceano",
        "nome": "Anfíbio",
        "categoria": "Poderes Concedidos",
        "preRequisitos": "Devoto de Oceano.",
        "descricao": "Você fica tão à vontade na água quanto um peixe dos abismos marítimos.",
        "beneficio": "Você pode respirar debaixo d'água livremente e adquire deslocamento de natação igual a seu deslocamento terrestre."
    },
    {
        "id": "arma_de_valkaria",
        "nome": "Arma de Valkaria",
        "categoria": "Poderes Concedidos",
        "preRequisitos": "Devoto de Valkaria.",
        "descricao": "A versatilidade dos servos de Valkaria é espantosa.",
        "beneficio": "Você recebe +1 em jogadas de ataque com todas as armas que saiba usar (não cumulativo com Foco em Arma)."
    },
    {
        "id": "arma_envenenada",
        "nome": "Arma Envenenada",
        "categoria": "Poderes Concedidos",
        "preRequisitos": "Devoto de Sszzaas.",
        "descricao": "Suas armas são perigosas como as presas de uma víbora mortal.",
        "beneficio": "Como ação padrão (até 3 vezes ao dia), faz surgir veneno em arma corpo-a-corpo empunhada: 1d6 dano de Con (Fortitude CD 10 + 1/2 nível + mod. Int reduz à metade)."
    },
    {
        "id": "arma_sagrada",
        "nome": "Arma Sagrada",
        "categoria": "Poderes Concedidos",
        "preRequisitos": "Bônus base de ataque +8, tendência Bondosa, devoto de Azgher, Khalmyr, Lena, Lin-Wu, Tanna-Toh, Thyatis ou Valkaria.",
        "descricao": "Você pode invocar o poder sagrado de sua divindade sobre um tipo de arma.",
        "beneficio": "Ao empunhar o tipo de arma escolhido, recebe +1 cumulativo nas jogadas de ataque e dano (pode ser escolhido até 5 vezes para até +5)."
    },
    {
        "id": "asas_do_dragao",
        "nome": "Asas do Dragão",
        "categoria": "Poderes Concedidos",
        "preRequisitos": "15º nível de personagem, devoto de Kallyadranoch.",
        "descricao": "Asas couraçadas nascem em suas costas.",
        "beneficio": "Você pode voar com deslocamento de 18m."
    },
    {
        "id": "ataque_piedoso",
        "nome": "Ataque Piedoso",
        "categoria": "Poderes Concedidos",
        "preRequisitos": "Devoto de Lena ou Marah.",
        "descricao": "O poder divino impede você de ferir seriamente seus adversários.",
        "beneficio": "Você pode usar armas corpo-a-corpo para causar dano não letal sem sofrer qualquer penalidade na jogada de ataque."
    },
    {
        "id": "aura_de_panico",
        "nome": "Aura de Pânico",
        "categoria": "Poderes Concedidos",
        "preRequisitos": "Devoto de Ragnar.",
        "descricao": "Muitos tremem diante de um servo do Deus da Morte.",
        "beneficio": "Uma vez por dia (ação padrão), inimigos a até 9m devem fazer teste de Vontade (CD 10 + 1/2 nível + mod. Car) ou ficam apavorados por 1 minuto (abalados por 1 rodada em caso de sucesso)."
    },
    {
        "id": "aura_de_paz",
        "nome": "Aura de Paz",
        "categoria": "Poderes Concedidos",
        "preRequisitos": "Aparência Inofensiva, devoto de Marah.",
        "descricao": "É difícil causar-lhe qualquer mal quando sua serenidade desarma os ódios.",
        "beneficio": "Qualquer criatura que tente atacá-lo deve fazer teste de Vontade (CD 10 + 1/2 nível + mod. Car); se falhar, perde a ação e não pode atacá-lo até a próxima rodada."
    },
    {
        "id": "bencao_da_justica",
        "nome": "Bênção da Justiça",
        "categoria": "Poderes Concedidos",
        "preRequisitos": "Devoto de Khalmyr.",
        "descricao": "Khalmyr guia sua mão para reparar injustiças e aplicar a lei divina.",
        "beneficio": "Uma vez por dia, você pode somar seu bônus de Sabedoria em uma jogada de ataque ou teste de manobra contra uma criatura Caótica."
    },
    {
        "id": "centelha_magica",
        "nome": "Centelha Mágica",
        "categoria": "Poderes Concedidos",
        "preRequisitos": "Devoto de Wynna.",
        "descricao": "A Deusa da Magia concede um vislumbre das artes arcanas.",
        "beneficio": "Você aprende duas magias arcanas de 1º nível de sua escolha e pode lançá-las como magias divinas."
    },
    {
        "id": "cura_gentil",
        "nome": "Cura Gentil",
        "categoria": "Poderes Concedidos",
        "preRequisitos": "Devoto de Lena.",
        "descricao": "A Deusa da Vida abençoa seus toques curativos.",
        "beneficio": "Você soma seu modificador de Carisma ao número de pontos de vida curados por qualquer magia de cura lançada por você."
    },
    {
        "id": "danca_do_sol",
        "nome": "Dança do Sol",
        "categoria": "Poderes Concedidos",
        "preRequisitos": "Devoto de Azgher.",
        "descricao": "Você combate como os dervixes do Deserto da Perdição.",
        "beneficio": "Ao empunhar uma cimitarra, você recebe +1 na margem de ameaça e +2 na Classe de Armadura."
    },
    {
        "id": "descanso_natural",
        "nome": "Descanso Natural",
        "categoria": "Poderes Concedidos",
        "preRequisitos": "Devoto de Allihanna.",
        "descricao": "Dormir sob as copas das árvores e o céu estrelado restaura plenamente suas forças.",
        "beneficio": "Em ambientes naturais, você recupera o dobro de pontos de vida e pontos de magia por descanso normal."
    },
    {
        "id": "furia_guerreira",
        "nome": "Fúria Guerreira",
        "categoria": "Poderes Concedidos",
        "preRequisitos": "Devoto de Keenn.",
        "descricao": "O Deus da Guerra concede a sede de combate que alimenta a carnificina.",
        "beneficio": "Uma vez por dia, você pode entrar em uma fúria de batalha idêntica à fúria de bárbaro (+2 nas jogadas de ataque e dano corpo-a-corpo, RD 1) durante 1 minuto."
    },
    {
        "id": "olhar_da_verdade",
        "nome": "Olhar da Verdade",
        "categoria": "Poderes Concedidos",
        "preRequisitos": "Devoto de Khalmyr ou Tanna-Toh.",
        "descricao": "Mentiras não têm refúgio diante do olhar dos deuses da justiça e do conhecimento.",
        "beneficio": "Você recebe +4 em testes de Intuição e pode lançar a magia discernir mentiras uma vez por dia."
    },
    {
        "id": "sangue_de_ferro_tauron",
        "nome": "Couro de Minotauro",
        "categoria": "Poderes Concedidos",
        "preRequisitos": "Devoto de Tauron.",
        "descricao": "Sua devoção a Tauron enrijece sua pele até a consistência do couro bovino.",
        "beneficio": "Você recebe +2 na Classe de Armadura e +2 em testes de Fortitude."
    },
    {
        "id": "toque_da_ressurreicao",
        "nome": "Toque da Ressurreição",
        "categoria": "Poderes Concedidos",
        "preRequisitos": "10º nível, devoto de Thyatis.",
        "descricao": "O Deus da Profecia e da Ressurreição não permite a morte definitiva dos nobres.",
        "beneficio": "Uma vez por semana, você pode ressuscitar uma criatura morta há no máximo um minuto sem custo de componentes materiais."
    }
]

for t in talentos_panteao:
    if t['id'] not in talento_ids and t['nome'].lower() not in talento_nomes:
        novos_talentos.append(t)
        talento_ids[t['id']] = t
        talento_nomes[t['nome'].lower()] = t

# =========================================================================
# 5. TALENTOS DO MANUAL DAS RAÇAS (RACIAIS, AMBIENTAIS, MOREAU E TORMENTA)
# =========================================================================
talentos_manual_racas = [
    # --- Raciais ---
    {
        "id": "alma_de_pedra",
        "nome": "Alma de Pedra",
        "categoria": "Combate",
        "preRequisitos": "Anão ou nagah.",
        "descricao": "Você não pode ser transformado em pedra.",
        "beneficio": "Você é automaticamente bem-sucedido em testes de resistência contra magias e habilidades que transformam em pedra (como o olhar das medusas ou carne para pedra)."
    },
    {
        "id": "amo",
        "nome": "Amo",
        "categoria": "Magia",
        "preRequisitos": "Qareen, qualquer talento metamágico.",
        "descricao": "Você fez um pacto com um amo. Essa ligação torna você mais poderoso, mas também vulnerável.",
        "beneficio": "Escolha alguém como seu amo. Quando conjura magias para atender a uma ordem de seu amo, você gasta –1 PM em cada magia (mínimo 1 PM). No entanto, sofre penalidade de –4 em testes para resistir a ordens do amo."
    },
    {
        "id": "arcano_completo",
        "nome": "Arcano Completo",
        "categoria": "Magia",
        "preRequisitos": "Elfo ou qareen.",
        "descricao": "Você andou lendo um livro muito bom sobre magia e domina toda a teoria arcanológica.",
        "beneficio": "Seu bônus racial em testes de Identificar Magia aumenta para +8 (normal: +4)."
    },
    {
        "id": "arma_amada",
        "nome": "Arma Amada",
        "categoria": "Combate",
        "preRequisitos": "Anão ou bônus base de ataque +5.",
        "descricao": "Separar você de sua arma não é fácil.",
        "beneficio": "Você recebe +4 em jogadas de ataque para evitar manobras de desarmar ou separar empunhando sua arma preferida."
    },
    {
        "id": "arma_natural_aprimorada",
        "nome": "Arma Natural Aprimorada",
        "categoria": "Combate",
        "preRequisitos": "Arma natural, bônus base de ataque +4.",
        "descricao": "Suas garras, presas ou chifres são ainda mais perigosos.",
        "beneficio": "O dano de um tipo de arma natural de sua escolha aumenta em uma categoria de tamanho (ex: 1d6 para 1d8). Especial: pode ser escolhido várias vezes para armas diferentes."
    },
    {
        "id": "armamento_de_allihanna",
        "nome": "Armamento de Allihanna",
        "categoria": "Magia",
        "preRequisitos": "Raça meio-dríade.",
        "descricao": "Sua ligação com as plantas vivas gera armas de poder crescente.",
        "beneficio": "Ao usar moldar madeira para criar arma, recebe bônus mágico conforme nível (+1 no 1º, +2 no 5º, +3 no 10º, +4 no 15º, +5 no 20º). Ao lançar pele de árvore, recebe o mesmo bônus na CA."
    },
    {
        "id": "asas_abissais",
        "nome": "Asas Abissais",
        "categoria": "Destino",
        "preRequisitos": "Sulfure, Herança Extraplanar.",
        "descricao": "Você tem asas de couro e pode voar com rapidez sobrenatural.",
        "beneficio": "Você pode voar com o dobro de seu deslocamento terrestre normal."
    },
    {
        "id": "asas_celestiais",
        "nome": "Asas Celestiais",
        "categoria": "Destino",
        "preRequisitos": "Aggelus, Herança Extraplanar.",
        "descricao": "Você tem asas emplumadas e pode alçar voo aos céus de Arton.",
        "beneficio": "Você pode voar com o dobro de seu deslocamento terrestre normal."
    },
    {
        "id": "ajuda_aprimorada",
        "nome": "Ajuda Aprimorada",
        "categoria": "Perícia",
        "preRequisitos": "Qareen.",
        "descricao": "Você é incrivelmente hábil em prestar auxílio a companheiros.",
        "beneficio": "Você sempre pode escolher 20 em testes de prestar ajuda, concedendo automaticamente +4 ao aliado (em vez de +2)."
    },
    {
        "id": "ajuda_avancada",
        "nome": "Ajuda Avançada",
        "categoria": "Combate",
        "preRequisitos": "Qareen, bônus base de ataque +2, Ajuda Aprimorada.",
        "descricao": "Você é ainda mais rápido em coordenar ataques e defesas para aliados.",
        "beneficio": "Em situações de combate, prestar ajuda requer apenas uma ação de movimento (em vez de ação padrão)."
    },
    {
        "id": "ajuda_extrema",
        "nome": "Ajuda Extrema",
        "categoria": "Combate",
        "preRequisitos": "Qareen, bônus base de ataque +8, Ajuda Avançada.",
        "descricao": "Ajudar é seu estilo definitivo de combate.",
        "beneficio": "Você pode prestar ajuda em combate como uma reação, até uma vez por rodada."
    },
    {
        "id": "bracos_desiguais",
        "nome": "Braços Desiguais",
        "categoria": "Combate",
        "preRequisitos": "Bugbear, lefou, meio-orc, orc ou trog.",
        "descricao": "Um de seus braços é desproporcionalmente longo e musculoso.",
        "beneficio": "Ataques realizados apenas com o braço mais forte causam dano como se você fosse uma categoria de tamanho maior, e aumentam seu alcance corpo-a-corpo com ele em +1,5m."
    },
    {
        "id": "braquiacao",
        "nome": "Braquiação",
        "categoria": "Perícia",
        "preRequisitos": "Elfo ou meio-dríade, treinado em Acrobacia.",
        "descricao": "Você salta entre galhos e cipós como se andasse no chão firme.",
        "beneficio": "Em matas fechadas e florestas com copas altas, você se desloca pelas árvores com seu deslocamento normal, ignorando penalidades de terreno difícil no solo."
    },
    {
        "id": "camuflagem_marinha",
        "nome": "Camuflagem Marinha",
        "categoria": "Perícia",
        "preRequisitos": "Elfo-do-mar ou trog.",
        "descricao": "Como um polvo, você altera a cor e textura de sua pele para sumir no cenário.",
        "beneficio": "Você recebe +8 em testes de Furtividade quando estiver parado em terreno natural ou aquático."
    },
    {
        "id": "cauda_agil",
        "nome": "Cauda Ágil",
        "categoria": "Combate",
        "preRequisitos": "Nagah.",
        "descricao": "Sua cauda de serpente é veloz e precisa.",
        "beneficio": "Você recebe +2 em testes de Acrobacia e Atletismo e pode fazer uma investida sem linha reta perfeita."
    },
    {
        "id": "cauda_manipuladora",
        "nome": "Cauda Manipuladora",
        "categoria": "Destino",
        "preRequisitos": "Nagah, Cauda Ágil.",
        "descricao": "Sua cauda é preênsil e pode operar itens.",
        "beneficio": "Sua cauda conta como uma mão adicional para fins de segurar objetos, abrir portas ou sacar itens rapidamente."
    },
    {
        "id": "chuva_de_laminas",
        "nome": "Chuva de Lâminas",
        "categoria": "Combate",
        "preRequisitos": "Meio-dríade, 15º nível de personagem.",
        "descricao": "Você dispara espinhos e galhos afiados como uma tempestade de flechas.",
        "beneficio": "Uma vez por dia, você dispara uma saraivada de espinhos em cone de 9m causando 10d6 pontos de dano perfurante (Reflexos CD 10 + 1/2 nível + mod. Des reduz à metade)."
    },
    {
        "id": "companheiro_vegetal",
        "nome": "Companheiro Vegetal",
        "categoria": "Magia",
        "preRequisitos": "Elfo ou meio-dríade, companheiro animal.",
        "descricao": "Seu companheiro animal adquire características de plantas mágicas.",
        "beneficio": "Seu companheiro animal recebe redução de dano 5/corte, imunidade a venenos, sono e paralisia, e cura acelerada 1 sob a luz solar."
    },
    {
        "id": "conhecimento_magico_amplo_racial",
        "nome": "Mente Aberta Élfica",
        "categoria": "Magia",
        "preRequisitos": "Elfo ou qareen, classe conjuradora.",
        "descricao": "Sua herança mágica permite absorver feitiços fora do padrão de sua classe.",
        "beneficio": "Você aprende duas magias adicionais de qualquer lista (arcana ou divina) de qualquer nível que já seja capaz de lançar."
    },
    {
        "id": "corpo_vegetal",
        "nome": "Corpo Vegetal",
        "categoria": "Destino",
        "preRequisitos": "Meio-dríade, 10º nível.",
        "descricao": "Sua fisiologia torna-se quase inteiramente feita de vinhas e fibras florais.",
        "beneficio": "Você adquire todas as imunidades normais de criaturas do tipo planta (imune a venenos, sono, paralisia, atordoamento e acertos críticos)."
    },
    {
        "id": "foco_em_habilidade_racial",
        "nome": "Foco em Habilidade Racial",
        "categoria": "Destino",
        "preRequisitos": "Ataque especial racial.",
        "descricao": "É ainda mais difícil resistir a seus poderes inatos de espécie.",
        "beneficio": "A CD de uma habilidade ou talento racial que exige teste de resistência (como olhar das medusas ou cheiro dos trogs) aumenta em +2."
    },
    {
        "id": "foco_em_polvora",
        "nome": "Foco em Pólvora",
        "categoria": "Combate",
        "preRequisitos": "Anão, goblin ou hobgoblin.",
        "descricao": "Alguns amam pólvora mais do que deveriam. Mais do que qualquer um deveria!",
        "beneficio": "Você recebe +1 nas jogadas de ataque e +2 nas rolagens de dano com armas de fogo, granadas e canhões."
    },
    {
        "id": "forma_humana",
        "nome": "Forma Humana",
        "categoria": "Destino",
        "preRequisitos": "Centauro ou nagah, Con 13.",
        "descricao": "De algum modo você pode adotar uma forma humana bípede para circular em cidades.",
        "beneficio": "Com uma ação de movimento (vezes por dia igual a mod. Con), assume forma bípede Média mantendo suas habilidades e itens como na magia alterar-se."
    },
    {
        "id": "magia_primitiva",
        "nome": "Magia Primitiva",
        "categoria": "Magia",
        "preRequisitos": "Capacidade de lançar magias, qualquer talento metamágico.",
        "descricao": "Você lança magias com danças rituais e urros animais para extrair força do solo artoniano.",
        "beneficio": "Pode gastar uma ação completa para lançar magia de ação padrão aplicando o efeito de um talento metamágico sem custo adicional de PM."
    },
    {
        "id": "vitalidade_das_fadas",
        "nome": "Vitalidade das Fadas",
        "categoria": "Destino",
        "preRequisitos": "Qareen ou sprite, Car 13.",
        "descricao": "Sua força vital deriva de sua convicção mágica e charme cintilante.",
        "beneficio": "Seus pontos de vida (PV) adicionais por nível usam seu modificador de Carisma em vez de Constituição. Especial: apenas no 1º nível."
    },
    {
        "id": "vitoria_da_coragem",
        "nome": "Vitória da Coragem",
        "categoria": "Destino",
        "preRequisitos": "Centauro ou minotauro, Sab 15.",
        "descricao": "Você aprendeu a suprimir seu pavor racial de altura.",
        "beneficio": "Seu redutor por medo de altura cai para –2. Além disso, imunidades normais contra medo passam a protegê-lo de fobias de altura."
    },
    {
        "id": "voo_adicional",
        "nome": "Voo Adicional",
        "categoria": "Magia",
        "preRequisitos": "Qareen, 5º nível.",
        "descricao": "Asas de mana e vento sustentam seu corpo por mais tempo.",
        "beneficio": "Você pode lançar a magia voo duas vezes adicionais por dia."
    },

    # --- Talentos Ambientais (Manual das Raças pág 94-96) ---
    {
        "id": "raca_couracada",
        "nome": "Raça Couraçada",
        "categoria": "Destino",
        "preRequisitos": "1º nível de personagem.",
        "descricao": "Adaptação extrema a predadores vorazes com couro espesso ou placas ósseas.",
        "beneficio": "Você recebe +2 na Classe de Armadura (CA), mas sofre redutor de –2 em testes de Reflexos."
    },
    {
        "id": "raca_do_deserto",
        "nome": "Raça do Deserto",
        "categoria": "Destino",
        "preRequisitos": "1º nível de personagem.",
        "descricao": "Habitante de terras áridas e abrasadoras de Arton.",
        "beneficio": "Você recebe +4 em testes de Fortitude contra calor e fogo, e resistência a calor 1 (cumulativa)."
    },
    {
        "id": "raca_domesticada",
        "nome": "Raça Domesticada",
        "categoria": "Destino",
        "preRequisitos": "1º nível de personagem.",
        "descricao": "Criado sob cativeiro pacífico ou servidão com espírito dócil e simpático.",
        "beneficio": "Você recebe +2 em testes de Carisma e perícias baseadas em Carisma (exceto Intimidação), mas sofre penalidade de –2 em testes de Vontade."
    },
    {
        "id": "raca_da_floresta",
        "nome": "Raça da Floresta",
        "categoria": "Destino",
        "preRequisitos": "1º nível de personagem.",
        "descricao": "Criado sob a cobertura densa das florestas de Tollon, Sambúrdia ou Greenaria.",
        "beneficio": "Você recebe +2 em testes de Iniciativa e testes de Percepção para ouvir."
    },
    {
        "id": "raca_do_gelo",
        "nome": "Raça do Gelo",
        "categoria": "Destino",
        "preRequisitos": "1º nível de personagem.",
        "descricao": "Criaturas do extremo norte adaptadas ao frio impiedoso das Montanhas Uivantes.",
        "beneficio": "Você recebe +4 em testes de Fortitude contra frio e gelo, e resistência a frio 1 (cumulativa)."
    },
    {
        "id": "raca_de_magia_forte",
        "nome": "Raça de Magia Forte",
        "categoria": "Magia",
        "preRequisitos": "1º nível de personagem.",
        "descricao": "Nascido em áreas saturadas de linhas de mana mística como Wynlla.",
        "beneficio": "A CD de todas as suas magias ou habilidades mágicas aumenta em +1."
    },
    {
        "id": "raca_das_montanhas",
        "nome": "Raça das Montanhas",
        "categoria": "Destino",
        "preRequisitos": "1º nível de personagem.",
        "descricao": "Acostumado ao ar rarefeito e escarpas pedregosas das Sanguinárias.",
        "beneficio": "Você recebe +2 em testes de Atletismo para escalar e +2 em testes de Fortitude contra cansaço e falta de ar."
    },
    {
        "id": "raca_noturna",
        "nome": "Raça Noturna",
        "categoria": "Destino",
        "preRequisitos": "1º nível de personagem.",
        "descricao": "Seus ancestrais desenvolveram olhos adaptados à escuridão absoluta.",
        "beneficio": "Você adquire visão no escuro com alcance de 18m (ou aumenta o alcance de sua visão no escuro existente em +9m)."
    },
    {
        "id": "raca_dos_pantanos",
        "nome": "Raça dos Pântanos",
        "categoria": "Destino",
        "preRequisitos": "1º nível de personagem.",
        "descricao": "Acostumado com lodo, lamaçal e insetos peçonhentos.",
        "beneficio": "Você recebe +4 em testes de Fortitude contra venenos e doenças, e ignora terreno difícil gerado por lama e pântano."
    },
    {
        "id": "raca_das_planicies",
        "nome": "Raça das Planícies",
        "categoria": "Destino",
        "preRequisitos": "1º nível de personagem.",
        "descricao": "Corredor ágil dos campos abertos e pradarias artonianas.",
        "beneficio": "Seu deslocamento terrestre aumenta em +3m."
    },
    {
        "id": "raca_subterranea",
        "nome": "Raça Subterrânea",
        "categoria": "Destino",
        "preRequisitos": "1º nível de personagem.",
        "descricao": "Habitante de túneis profundos e cidades escavadas de Doherimm.",
        "beneficio": "Você recebe Sentido Sísmico com alcance de 9m para detectar criaturas em contato com o solo ou rocha sólida."
    },

    # --- Talentos da Tormenta (Manual das Raças pág 99-102) ---
    {
        "id": "corpo_aberrante",
        "nome": "Corpo Aberrante",
        "categoria": "Tormenta",
        "preRequisitos": "Dois outros talentos da Tormenta.",
        "descricao": "A matéria vermelha deformou seus órgãos vitais em formas bizarras e desconexas.",
        "beneficio": "Você tem 50% de chance de ignorar acertos críticos e ataques furtivos."
    },
    {
        "id": "deslocar_tormenta",
        "nome": "Deslocar",
        "categoria": "Tormenta",
        "preRequisitos": "Dois outros talentos da Tormenta.",
        "descricao": "Sua imagem oscila entre esta realidade e o nada aberrante.",
        "beneficio": "Você recebe camuflagem (20% de chance de falha em ataques contra você)."
    },
    {
        "id": "deslocar_aprimorado_tormenta",
        "nome": "Deslocar Aprimorado",
        "categoria": "Tormenta",
        "preRequisitos": "Deslocar, três outros talentos da Tormenta, 15º nível.",
        "descricao": "Você existe nesta dimensão apenas de forma parcial e fantasmagórica.",
        "beneficio": "Você recebe camuflagem total (50% de chance de falha em ataques contra você)."
    },
    {
        "id": "forma_aberrante",
        "nome": "Forma Aberrante",
        "categoria": "Tormenta",
        "preRequisitos": "Forma selvagem maior, três outros talentos da Tormenta.",
        "descricao": "Você abraçou a corrupção alienígena e horrenda dos lefeu na metamorfose.",
        "beneficio": "Ao usar forma selvagem, você pode aplicar o modelo Criatura da Tormenta à sua forma animal."
    },
    {
        "id": "furia_vermelha",
        "nome": "Fúria Vermelha",
        "categoria": "Tormenta",
        "preRequisitos": "Força 19, habilidade fúria, bônus base de ataque +8.",
        "descricao": "Ao entrar em fúria suas armas adquirem crostas rubras de matéria corrosiva.",
        "beneficio": "Em fúria, suas armas causam +1d8 pontos de dano de matéria vermelha (ignora qualquer redução de dano)."
    },
    {
        "id": "golpes_da_tempestade",
        "nome": "Golpes da Tempestade",
        "categoria": "Tormenta",
        "preRequisitos": "Dois outros talentos da Tormenta.",
        "descricao": "Crostas pontiagudas vermelhas brotam em suas articulações e punhos.",
        "beneficio": "O dano de seus ataques desarmados ou naturais aumenta em uma categoria de tamanho (1d6 para 1d8, etc.)."
    },
    {
        "id": "insanidade_da_tormenta",
        "nome": "Insanidade da Tormenta",
        "categoria": "Tormenta",
        "preRequisitos": "Três outros talentos da Tormenta.",
        "descricao": "Sua mera presença visual perturba a mente sã de seres civilizados.",
        "beneficio": "Inimigos inteligentes a até 9m que olharem para você devem fazer teste de Vontade (CD 10 + metade do nível) ou ficam confusos por 1 rodada."
    },
    {
        "id": "invocacao_aberrante",
        "nome": "Invocação Aberrante",
        "categoria": "Tormenta",
        "preRequisitos": "Capacidade de lançar invocar monstro, três outros talentos da Tormenta.",
        "descricao": "Você traz monstros corrompidos direto dos redutos da tempestade rubra.",
        "beneficio": "Ao lançar invocar monstro (+3 PM), todas as criaturas invocadas recebem o modelo Criatura da Tormenta."
    },
    {
        "id": "manto_mucoso",
        "nome": "Manto Mucoso",
        "categoria": "Tormenta",
        "preRequisitos": "Dois outros talentos da Tormenta.",
        "descricao": "Uma camada de muco cáustico e escorregadio reveste sua pele.",
        "beneficio": "Você recebe +4 em testes para evitar ser agarrado e atacantes desarmados sofrem 1d6 pontos de dano de ácido ao atingi-lo."
    },
    {
        "id": "membros_extras_tormenta",
        "nome": "Membros Extras",
        "categoria": "Tormenta",
        "preRequisitos": "Dois outros talentos da Tormenta.",
        "descricao": "Tentáculos ou braços extras asquerosos brotam sob suas axilas.",
        "beneficio": "Você recebe dois ataques adicionais por rodada com tentáculos (1d4 pontos de dano cada)."
    },
    {
        "id": "pernas_articuladas",
        "nome": "Pernas Articuladas",
        "categoria": "Tormenta",
        "preRequisitos": "Dois outros talentos da Tormenta.",
        "descricao": "Pernas extras quitinosas de inseto brotam nas laterais do seu tronco.",
        "beneficio": "Seu deslocamento aumenta em +6m e você recebe +4 em testes contra manobras de derrubar."
    },
    {
        "id": "recuperacao_aberrante",
        "nome": "Recuperação Aberrante",
        "categoria": "Tormenta",
        "preRequisitos": "Dois outros talentos da Tormenta.",
        "descricao": "Condições temporárias perversas têm pouca duração em sua carne aberrante.",
        "beneficio": "Efeitos que causem atordoamento, paralisia, fadiga ou abalo têm sua duração reduzida à metade (mínimo 1 rodada)."
    },
    {
        "id": "sangue_acido",
        "nome": "Sangue Ácido",
        "categoria": "Tormenta",
        "preRequisitos": "Um outro talento da Tormenta.",
        "descricao": "Quem faz você sangrar é borrifado por sangue fumegante e corrosivo.",
        "beneficio": "Sempre que sofrer dano cortante ou perfurante corpo-a-corpo, o atacante sofre 1d6 pontos de dano de ácido (+1 para cada dois outros talentos da Tormenta)."
    },
    {
        "id": "toque_da_erosao",
        "nome": "Toque da Erosão",
        "categoria": "Tormenta",
        "preRequisitos": "Um outro talento da Tormenta.",
        "descricao": "Seu toque desintegra materiais inanimados e armaduras.",
        "beneficio": "Ao tocar um objeto ou desferir manobra de separar, você ignora 5 pontos de dureza e causa +2d6 pontos de dano."
    },
    {
        "id": "toque_da_corrosao",
        "nome": "Toque da Corrosão",
        "categoria": "Tormenta",
        "preRequisitos": "Toque da Erosão, dois outros talentos da Tormenta.",
        "descricao": "A matéria se desfaz em ferrugem vermelha ao menor contato de suas mãos.",
        "beneficio": "Ao acertar uma armadura, escudo ou objeto inanimado, causa 4d6 de dano e ignora 10 pontos de dureza."
    },
    {
        "id": "toque_da_destruicao",
        "nome": "Toque da Destruição",
        "categoria": "Tormenta",
        "preRequisitos": "Toque da Corrosão, quatro outros talentos da Tormenta.",
        "descricao": "A própria realidade se corrói diante do toque soberano da antivida.",
        "beneficio": "Com um ataque de toque desarmado, se o alvo falhar em Fortitude (CD 10 + metade do nível), seu item ou armadura se desintegra instantaneamente."
    }
]

for t in talentos_manual_racas:
    if t['id'] not in talento_ids and t['nome'].lower() not in talento_nomes:
        novos_talentos.append(t)
        talento_ids[t['id']] = t
        talento_nomes[t['nome'].lower()] = t

print(f"Total de novos talentos a adicionar: {len(novos_talentos)}")
print(f"Total de novas magias a adicionar: {len(novas_magias)}")

# 6. Salva magias.json
lista_magias_final = list(magias_existentes) + novas_magias
lista_magias_final.sort(key=lambda m: (m['nivel'], m['nome']))
with open('src/data/magias/magias.json', 'w', encoding='utf-8') as f:
    json.dump(lista_magias_final, f, ensure_ascii=False, indent=2)
print(f"Arquivo magias.json atualizado com {len(lista_magias_final)} magias.")

# 7. Salva talentos.json
lista_talentos_final = list(talentos_existentes) + novos_talentos
lista_talentos_final.sort(key=lambda t: t['nome'])
with open('src/data/talentos/talentos.json', 'w', encoding='utf-8') as f:
    json.dump(lista_talentos_final, f, ensure_ascii=False, indent=2)
print(f"Arquivo talentos.json atualizado com {len(lista_talentos_final)} talentos.")
