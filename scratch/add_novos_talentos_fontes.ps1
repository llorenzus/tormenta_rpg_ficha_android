# Script para adicionar os novos talentos de:
# - Guerras Táuricas
# - Reinos de Moreania
# - Manual do Combate

$talentosPath = "src/data/talentos/talentos.json"
$existing = Get-Content -Path $talentosPath -Raw -Encoding UTF8 | ConvertFrom-Json

$existingIds = @{}
foreach ($item in $existing) {
    $existingIds[$item.id] = $true
}

$novosTalentos = @(
    # ========================================================
    # GUERRAS TÁURICAS
    # ========================================================
    @{
        id = "ataques_multiplos"
        nome = "Ataques Múltiplos"
        categoria = "Combate"
        preRequisitos = "Uma ou mais armas naturais."
        descricao = "Você sabe como usar todo o seu corpo em uma luta."
        beneficio = "Quando faz um ataque adicional com uma arma natural, a penalidade que você sofre em seus ataques diminui para –2 (normal: sofre –4)."
    },
    @{
        id = "codigo_militar"
        nome = "Código Militar"
        categoria = "Perícia"
        preRequisitos = "Nenhum."
        descricao = "Você adota um jargão com seus soldados ou companheiros, um verdadeiro idioma incompreensível para todos os inimigos."
        beneficio = "Personagens com este talento podem se comunicar verbalmente na frente de outras pessoas sem serem entendidos. Em combate, podem formular táticas e estratégias sem que o inimigo compreenda. Mensagens também podem ser escritas no código. Nenhuma perícia é capaz de decifrá-lo (quebrado apenas por magias como compreender idiomas)."
    },
    @{
        id = "destino"
        nome = "Destino"
        categoria = "Destino"
        preRequisitos = "Nenhum."
        descricao = "Os oráculos avisaram que você tem grandes feitos a realizar. Você não planeja morrer antes de cumprir a profecia."
        beneficio = "Você recebe um ponto de ação adicional no início de cada sessão de jogo. Quando gasta um ponto de ação para recuperar pontos de vida, recupera o dobro do normal. Especial: só pode ser escolhido no 1º nível de personagem."
    },
    @{
        id = "escudo_fraterno"
        nome = "Escudo Fraterno"
        categoria = "Combate"
        preRequisitos = "Usar Escudo."
        descricao = "Você aprendeu a usar seu escudo para proteger seus aliados, além de si mesmo."
        beneficio = "Se você terminar seu turno adjacente a um aliado, pode conceder seu bônus de escudo em CA a ele (sem que você o perca). O aliado perde o bônus se não estiver mais adjacente. Especial: não pode ser usado em falange."
    },
    @{
        id = "escudo_veloz"
        nome = "Escudo Veloz"
        categoria = "Combate"
        preRequisitos = "Usar Escudo."
        descricao = "Você sabe se movimentar com rapidez, usando seu escudo para se defender de ataques de todos os lados."
        beneficio = "Se você estiver usando um escudo, não pode ser flanqueado."
    },
    @{
        id = "falange"
        nome = "Falange"
        categoria = "Combate"
        preRequisitos = "Usar Escudo."
        descricao = "Você é experiente em lutar em uma formação compacta, juntando seu escudo com os de seus companheiros."
        beneficio = "Se você estiver usando um escudo, recebe um bônus de +1 na CA. Além disso, se estiver adjacente a um aliado com este talento, vocês podem gastar uma ação de movimento para formar uma falange, que concede cobertura a todos os seus participantes."
    },
    @{
        id = "formacao_tartaruga"
        nome = "Formação Tartaruga"
        categoria = "Combate"
        preRequisitos = "Escudo Veloz."
        descricao = "Usando um escudo em um padrão de movimentos complexos, você se protege por inteiro, como uma tartaruga dentro de seu casco."
        beneficio = "Se você estiver usando um escudo, recebe um bônus de +2 nos testes de resistência."
    },
    @{
        id = "heroismo_rotineiro"
        nome = "Heroísmo Rotineiro"
        categoria = "Destino"
        preRequisitos = "7º nível de personagem."
        descricao = "Para você, façanhas são apenas parte do trabalho, e proezas extraordinárias são lugar-comum."
        beneficio = "Você recebe um ponto de ação adicional no início de cada sessão de jogo. Além disso, pode gastar um ponto de ação para ganhar um uso adicional de qualquer habilidade de classe que possua usos diários (como destruir o mal, fúria, música de bardo, etc.)."
    },
    @{
        id = "magia_camuflada"
        nome = "Magia Camuflada"
        categoria = "Magia"
        preRequisitos = "Magia sem Gestos, Magia Silenciosa."
        descricao = "Mesmo em um combate, você mantém seus poderes mágicos em segredo. Bolas de fogo brotam do chão, sem que você comprometa sua identidade."
        beneficio = "Depois que você lançar uma magia, um oponente deve ser bem-sucedido num teste de Identificar Magia contra CD 25 – nível da magia para determinar quem é o conjurador. Cada magia lançada dá direito a um novo teste."
    },
    @{
        id = "medico_de_campo"
        nome = "Médico de Campo"
        categoria = "Magia"
        preRequisitos = "Capacidade de lançar magias divinas de 1º nível."
        descricao = "Você está acostumado a correr sob saraivadas de flechas, para salvar a vida de companheiros e soldados caídos."
        beneficio = "Você pode usar uma magia de curar ferimentos em um aliado até uma rodada depois de sua morte."
    },
    @{
        id = "olho_marcial"
        nome = "Olho Marcial"
        categoria = "Perícia"
        preRequisitos = "Treinado em Percepção."
        descricao = "Você é capaz de avaliar um oponente, descobrindo seus pontos fortes e fracos."
        beneficio = "Faça um teste de Percepção (CD 10 + nível do oponente) como ação de movimento. Em caso de sucesso, você descobre sua classe de armadura, bônus de ataque ou quantidade de pontos de vida atual. Novos testes revelam as informações restantes."
    },
    @{
        id = "ousadia"
        nome = "Ousadia"
        categoria = "Destino"
        preRequisitos = "Nenhum."
        descricao = "Para alguém acostumado à guerra, o perigo pode ser um vício. O risco de morte é um verdadeiro combustível."
        beneficio = "Quando você faz um ato de heroísmo recebe dois pontos de ação, em vez de um."
    },
    @{
        id = "parede_de_escudos"
        nome = "Parede de Escudos"
        categoria = "Combate"
        preRequisitos = "Falange."
        descricao = "Ao lado de seus companheiros, seu escudo é uma defesa impenetrável."
        beneficio = "Se você estiver participando de uma falange, pode fazer um ataque corpo-a-corpo imediato contra qualquer criatura que se mova para ficar adjacente a você ou aos aliados adjacentes a você (uma vez por rodada)."
    },

    # ========================================================
    # REINOS DE MOREANIA
    # ========================================================
    @{
        id = "asas_de_aco"
        nome = "Asas de Aço"
        categoria = "Destino"
        preRequisitos = "Asas."
        descricao = "Você tem asas anormalmente rígidas, que podem ser empregadas como armas ou escudos."
        beneficio = "Suas asas elevam sua CA em +1 para cada asa ou podem ser usadas para golpear (dano 1d4 + mod. For cada). Contam como armas leves para Combater com Duas Armas. Não pode atacar e proteger com a mesma asa ou usar enquanto voa. Especial: pode escolher Ataque com Escudo Aprimorado para atacar com as asas sem perder a CA."
    },
    @{
        id = "asas_de_morcego"
        nome = "Asas de Morcego"
        categoria = "Destino"
        preRequisitos = "Herança do Morcego, patágio."
        descricao = "Você tem asas verdadeiras e pode voar."
        beneficio = "Você recebe asas que oferecem deslocamento de voo 15m."
    },
    @{
        id = "craque_gu_on"
        nome = "Craque Gu-On"
        categoria = "Combate"
        preRequisitos = "Usar Arma Exótica (bola gu-on), Foco em Arma (bola gu-on)."
        descricao = "Você é um fenômeno com a bola gu-on."
        beneficio = "Ao errar um ataque, não precisa de ação de movimento para recuperar a bola. Ao rolar 1 natural, pode recuperá-la com ação de movimento em vez de errar totalmente."
    },
    @{
        id = "faro_aprimorado"
        nome = "Faro Aprimorado"
        categoria = "Destino"
        preRequisitos = "Faro."
        descricao = "Você tem olfato ainda mais aguçado."
        beneficio = "Você percebe criaturas a até 15m e recebe +6 em testes de Sobrevivência para rastrear usando o faro (normal: 9m e +4)."
    },
    @{
        id = "faro_discriminatorio"
        nome = "Faro Discriminatório"
        categoria = "Destino"
        preRequisitos = "Faro, Sabedoria 15."
        descricao = "Você identifica muita coisa através do cheiro."
        beneficio = "Ao perceber criaturas, identifica seu tipo (animal, monstro, humanoide, etc., desde que já farejado). Pode identificar criatura disfarçada adjacente com ação completa e teste de Percepção (CD 15). Recebe +4 em Intuição e +2 em Ofício (avaliação)."
    },
    @{
        id = "faro_para_magia"
        nome = "Faro para Magia"
        categoria = "Destino"
        preRequisitos = "Faro, Sabedoria 15, Faro Discriminatório."
        descricao = "Você sente cheiro de magia."
        beneficio = "Você pode farejar auras mágicas, como se estivesse sob efeito constante da magia detectar magia."
    },
    @{
        id = "grande_automato"
        nome = "Grande Autômato"
        categoria = "Magia"
        preRequisitos = "Artífice 4º nível."
        descricao = "Vamos lá, grandalhão!"
        beneficio = "Você pode escolher um companheiro autômato de tamanho Grande (normal: Pequeno ou Médio)."
    },
    @{
        id = "ginga_das_ondas"
        nome = "Ginga das Ondas"
        categoria = "Perícia"
        preRequisitos = "Nenhum."
        descricao = "Você está acostumado a viver em navios e ri daqueles que perdem o equilíbrio no mar."
        beneficio = "Você recebe +1 em testes de Reflexos. Em embarcações, nunca precisa de testes de Acrobacia para ficar em pé pelas condições marítimas e não sofre penalidades em testes apenas por estar navegando."
    },
    @{
        id = "herdeiro_aprimorado"
        nome = "Herdeiro Aprimorado"
        categoria = "Destino"
        preRequisitos = "Qualquer talento moreau."
        descricao = "Você tem uma ligação ainda maior com seu ancestral animal."
        beneficio = "Você pode escolher mais duas habilidades da lista de seu talento moreau (normal: apenas duas)."
    },
    @{
        id = "mandibula_de_aco"
        nome = "Mandíbula de Aço"
        categoria = "Combate"
        preRequisitos = "Gnoll ou Herança da Hiena, bônus base de ataque +2."
        descricao = "A hiena tem uma das mordidas mais fortes do reino animal. Você não fica atrás."
        beneficio = "Quando ataca com mordida, recebe +2 nas rolagens de dano e +2 em testes de agarrar e separar."
    },
    @{
        id = "marrada_poderosa"
        nome = "Marrada Poderosa"
        categoria = "Combate"
        preRequisitos = "Arma natural (chifres), Ataque Poderoso, bônus base de ataque +1."
        descricao = "Sua cabeçada é digna de respeito."
        beneficio = "Em ataque de investida com os chifres, aplica o dobro de seu modificador de Força ao dano."
    },
    @{
        id = "marrada_ligeira"
        nome = "Marrada Ligeira"
        categoria = "Combate"
        preRequisitos = "Arma natural (chifres), Ataque Poderoso, bônus base de ataque +4."
        descricao = "Você pode arremeter contra seus alvos e, ao mesmo tempo, realizar outras ações."
        beneficio = "Em ataque de investida com chifres, pode fazer um segundo ataque com outra arma de sua escolha (ambos com bônus +2 de investida)."
    },
    @{
        id = "mestre_em_customizacao"
        nome = "Mestre em Customização"
        categoria = "Magia"
        preRequisitos = "Artífice 4º nível."
        descricao = "Seu autômato é cheio de melhorias."
        beneficio = "Você reduz em 20% todos os custos relacionados a seu companheiro autômato, incluindo modificações."
    },
    @{
        id = "pequeno_moreau"
        nome = "Pequeno Moreau"
        categoria = "Destino"
        preRequisitos = "Herança da Coruja, Coelho, Gato, Morcego, Raposa ou Serpente."
        descricao = "Por descender de um animal pequeno, você é menor e mais ágil que outros moreau."
        beneficio = "Você tem tamanho Pequeno: recebe CA +1, +1 nas jogadas de ataque, +4 em Furtividade, precisa de armas menores e sofre –4 em testes de manobra. Especial: apenas no 1º nível."
    },
    @{
        id = "pontaria_com_varinha"
        nome = "Pontaria com Varinha"
        categoria = "Magia"
        preRequisitos = "Artífice 1º nível ou capacidade de lançar magias arcanas de 3º nível."
        descricao = "Cuidado para onde aponta essa coisa!"
        beneficio = "Você recebe +2 em ataques de toque à distância com varinhas."
    },
    @{
        id = "amigo_dos_animais"
        nome = "Amigo dos Animais"
        categoria = "Poderes Concedidos"
        preRequisitos = "Devoto de Allihanna."
        descricao = "Os animais entendem que você não oferece perigo."
        beneficio = "Você recebe a habilidade de classe empatia selvagem como um druida do seu nível de personagem (ou +4 nos testes se já possuir)."
    },
    @{
        id = "companheiro_draconico"
        nome = "Companheiro Dracônico"
        categoria = "Poderes Concedidos"
        preRequisitos = "5º nível de personagem, devoto de Kallyadranoch, Megalokk ou Wynna, companheiro animal ou familiar."
        descricao = "Você foi premiado com um servo dracônico."
        beneficio = "O companheiro animal ou familiar escolhido adquire o modelo meio-dragão."
    },
    @{
        id = "dom_da_profecia"
        nome = "Dom da Profecia"
        categoria = "Poderes Concedidos"
        preRequisitos = "Devoto de Allihanna ou Thyatis."
        descricao = "Você recebe visões de sua divindade."
        beneficio = "Você pode lançar augúrio uma vez por dia sem gastar PM. Além disso, uma vez por dia recebe +2 em uma jogada de ataque ou teste de habilidade, perícia ou resistência (declarado antes do mestre dizer o resultado)."
    },
    @{
        id = "dominio_das_ondas"
        nome = "Domínio das Ondas"
        categoria = "Poderes Concedidos"
        preRequisitos = "Devoto de Oceano ou Sorinda."
        descricao = "Você é mais habilidoso nas tábuas e cordames de uma embarcação."
        beneficio = "Você recebe +2 na CA e em testes de Acrobacia, Atletismo, Furtividade, Percepção e Ofício (marinheiro) quando estiver em uma embarcação."
    },
    @{
        id = "escamas_do_dragao"
        nome = "Escamas do Dragão"
        categoria = "Poderes Concedidos"
        preRequisitos = "Devoto de Allihanna, Kallyadranoch ou Megalokk."
        descricao = "Sua pele torna-se couro escamoso."
        beneficio = "Você recebe CA +2."
    },
    @{
        id = "faca_nas_costas"
        nome = "Faca nas Costas"
        categoria = "Poderes Concedidos"
        preRequisitos = "Devoto de Hollen, Hyninn ou Sszzaas."
        descricao = "Um ataque traiçoeiro vale por todos os outros."
        beneficio = "Você recebe a habilidade de classe ataque furtivo (+1d6), ou aumenta o dano dela em +1d6 se já a possuir."
    },
    @{
        id = "forca_da_fe"
        nome = "Força da Fé"
        categoria = "Poderes Concedidos"
        preRequisitos = "Bônus base de ataque +3, capacidade de preparar magias divinas, devoto de Kallyadranoch, Keenn, Megalokk, Ragnar ou Tauron."
        descricao = "Você pode canalizar seu poder da fé em violência pura."
        beneficio = "Como uma ação livre, pode converter uma magia divina preparada em um surto muscular, aumentando sua Força em +2 por nível da magia por uma rodada."
    },
    @{
        id = "forma_selvagem_adicional"
        nome = "Forma Selvagem Adicional"
        categoria = "Poderes Concedidos"
        preRequisitos = "Devoto de Allihanna, Megalokk ou Oceano, habilidade de classe forma selvagem."
        descricao = "A fera em você se manifesta mais vezes."
        beneficio = "Você pode utilizar a habilidade de classe forma selvagem duas vezes adicionais por dia."
    },
    @{
        id = "garras_de_fera"
        nome = "Garras de Fera"
        categoria = "Poderes Concedidos"
        preRequisitos = "Devoto de Allihanna, Megalokk ou Oceano."
        descricao = "Suas mãos podem se transformar em garras mortais."
        beneficio = "Você recebe duas armas naturais de garras (dano de espada curta para seu tamanho). Pode atacar com ambas com penalidade de –4 nos ataques. Ação livre, dura uma hora, 1 vez ao dia."
    },
    @{
        id = "herbanario"
        nome = "Herbanário"
        categoria = "Poderes Concedidos"
        preRequisitos = "Devoto de Allihanna, capacidade de lançar magias divinas de 3º nível, Carisma 13."
        descricao = "Você sabe convencer as plantas a crescerem como você quiser."
        beneficio = "Você aprende as magias ampliar plantas e falar com plantas. Pode entrar em transe vegetal para fazer plantas crescerem como quiser (mínimo 1 semana, ficando exausto ao sair)."
    },
    @{
        id = "invocacao_de_monstros"
        nome = "Invocação de Monstros"
        categoria = "Poderes Concedidos"
        preRequisitos = "Devoto de Megalokk."
        descricao = "Você pode fazer surgir um monstro para ajudá-lo."
        beneficio = "Você pode lançar invocar monstro III uma vez por dia."
    },
    @{
        id = "memoria_racial"
        nome = "Memória Racial"
        categoria = "Poderes Concedidos"
        preRequisitos = "Devoto de Allihanna ou Megalokk."
        descricao = "Você pode acessar lembranças de seus ancestrais selvagens para superar desafios."
        beneficio = "Você recebe +4 em testes de Sobrevivência e CA +1 em ambientes naturais."
    },
    @{
        id = "presenca_aterradora"
        nome = "Presença Aterradora"
        categoria = "Poderes Concedidos"
        preRequisitos = "Carisma 15, 5º nível de personagem, devoto de Kallyadranoch, Megalokk, Ragnar ou Tenebra."
        descricao = "Você pode abalar seus inimigos."
        beneficio = "Como ação livre (1 vez por rodada), inimigos a até 9m devem ser bem-sucedidos em Vontade (CD 10 + 1/2 nível + mod. Car) ou ficam abalados por 1 minuto. Não afeta criaturas de nível superior."
    },
    @{
        id = "presenca_aterradora_aprimorada"
        nome = "Presença Aterradora Aprimorada"
        categoria = "Poderes Concedidos"
        preRequisitos = "Presença Aterradora, 10º nível de personagem."
        descricao = "Você pode apavorar seus inimigos."
        beneficio = "Ao usar o talento Presença Aterradora, as vítimas que falharem no teste ficam apavoradas em vez de abaladas."
    },
    @{
        id = "saliva_venenosa"
        nome = "Saliva Venenosa"
        categoria = "Poderes Concedidos"
        preRequisitos = "Devoto de Kallyadranoch, Megalokk ou Sszzaas."
        descricao = "Seus lábios gotejam veneno mortal."
        beneficio = "Uma vez por dia, com ação padrão, pode cuspir veneno em criatura adjacente (Fortitude CD 10 + 1/2 nível + mod. Con ou 1d4 Con após 1 min, +1d4 a cada 8 níveis). Se possuir Usar Venenos, pode aplicar em uma arma por 1 minuto."
    },
    @{
        id = "vencedor_de_limites"
        nome = "Vencedor de Limites"
        categoria = "Poderes Concedidos"
        preRequisitos = "Devoto de Champarr."
        descricao = "Você pode realizar uma demonstração de habilidade sobrenatural."
        beneficio = "Uma vez por dia, como ação livre, soma seu nível de personagem a uma habilidade básica à sua escolha durante um minuto."
    },
    @{
        id = "voz_de_allihanna"
        nome = "Voz de Allihanna"
        categoria = "Poderes Concedidos"
        preRequisitos = "Domínio dos Animais, devoto de Allihanna."
        descricao = "Você pode dominar animais."
        beneficio = "Você pode lançar dominar animal uma vez por dia sem gastar PM (CD 10 + 1/2 nível + mod. Car)."
    },
    @{
        id = "voz_de_megalokk"
        nome = "Voz de Megalokk"
        categoria = "Poderes Concedidos"
        preRequisitos = "Devoto de Megalokk."
        descricao = "Você pode falar com monstros."
        beneficio = "Você conhece os idiomas de todos os monstros inteligentes (Int 3+) e pode se comunicar livremente com monstros não inteligentes (Int 1 ou 2) como em falar com animais (não funciona com lefeu)."
    },

    # ========================================================
    # MANUAL DO COMBATE
    # ========================================================
    @{
        id = "alcance_supremo"
        nome = "Alcance Supremo"
        categoria = "Combate"
        preRequisitos = "Especialização em Arma."
        descricao = "Você sabe esticar seu corpo e posicionar-se de forma a cobrir uma grande extensão do campo de batalha."
        beneficio = "Enquanto estiver usando uma arma na qual tenha Especialização em Arma, aumenta seu alcance natural em 1,5m."
    },
    @{
        id = "animal_encurralado"
        nome = "Animal Encurralado"
        categoria = "Combate"
        preRequisitos = "Destreza 13."
        descricao = "Você é mais perigoso quando está cercado de inimigos."
        beneficio = "Quando estiver flanqueado, sua margem de ameaça aumenta em 1 por oponente que estiver flanqueando-o (válido apenas contra os oponentes que o flanqueiam)."
    },
    @{
        id = "ataque_com_escudo"
        nome = "Ataque com Escudo"
        categoria = "Combate"
        preRequisitos = "Usar Escudo."
        descricao = "Você é treinado em atacar com uma arma e um escudo."
        beneficio = "Se estiver usando escudo, pode fazer um ataque adicional com ele. No entanto, sofre penalidade de –2 em todas as jogadas de ataque e perde o bônus de CA do escudo até sua próxima rodada."
    },
    @{
        id = "ataque_poderoso_aprimorado"
        nome = "Ataque Poderoso Aprimorado"
        categoria = "Combate"
        preRequisitos = "Ataque Poderoso, bônus base de ataque +6."
        descricao = "Seus golpes destruidores são destruidores mesmo."
        beneficio = "Como Ataque Poderoso, mas você pode sofrer penalidade de –4 no ataque para receber bônus de +8 no dano (não cumulativo com Ataque Poderoso)."
    },
    @{
        id = "ate_acertar"
        nome = "Até Acertar"
        categoria = "Combate"
        preRequisitos = "Foco em Arma."
        descricao = "Você não desiste frente a pequenas falhas. Tenta de novo e de novo, até ser bem-sucedido!"
        beneficio = "Se errar um ataque com arma na qual possui Foco em Arma, recebe +1 cumulativo nas próximas jogadas de ataque contra o mesmo oponente (+2 no seguinte se errar, etc.) até acertar."
    },
    @{
        id = "basta"
        nome = "Basta!"
        categoria = "Combate"
        preRequisitos = "Vontade de Ferro, bônus base de ataque +10."
        descricao = "Você está farto dos truques e artimanhas de seus oponentes. Vai acabar com esta luta em um único golpe!"
        beneficio = "Uma vez por dia, um golpe seu pode ignorar qualquer camuflagem, imunidade e redução de dano do alvo. Se errar o ataque, o uso não é perdido."
    },
    @{
        id = "bote_da_vibora"
        nome = "Bote da Víbora"
        categoria = "Combate"
        preRequisitos = "Combater com Duas Armas."
        descricao = "Você corre em direção ao inimigo e golpeia com duas armas num único ataque."
        beneficio = "Se estiver lutando com duas armas, pode fazer um ataque com cada uma no final de uma investida (com penalidade de duas armas e bônus de investida)."
    },
    @{
        id = "brecha_na_guarda"
        nome = "Brecha na Guarda"
        categoria = "Combate"
        preRequisitos = "Tendência não Leal."
        descricao = "Você sabe se aproveitar das falhas na defesa de seu oponente. Não é covardia — é sobrevivência."
        beneficio = "Você recebe um bônus de +4 nas jogadas de dano contra oponentes atordoados, caídos ou desprevenidos."
    },
    @{
        id = "conhecimento_de_golpes"
        nome = "Conhecimento de Golpes"
        categoria = "Combate"
        preRequisitos = "Bônus base de ataque +1."
        descricao = "Você aprendeu golpes especiais, mais complexos e eficazes que meros cortes e estocadas."
        beneficio = "Você recebe dois golpes marciais e 3 pontos de energia. Pode gastar uma ação completa para tomar fôlego e recuperar 3 pontos de energia. Especial: pode ser escolhido diversas vezes (+2 golpes e +3 energia a cada vez)."
    },
    @{
        id = "conhecimento_de_posturas"
        nome = "Conhecimento de Posturas"
        categoria = "Combate"
        preRequisitos = "Bônus base de ataque +1."
        descricao = "Você treinou diversas posições de luta e pode trocar entre elas conforme a situação exige."
        beneficio = "Você recebe duas posturas de combate. Pode declarar uma postura ativa e trocá-la 1 vez por rodada como ação livre. Especial: pode ser escolhido diversas vezes (+2 posturas a cada vez)."
    },
    @{
        id = "duro_de_ferir"
        nome = "Duro de Ferir"
        categoria = "Combate"
        preRequisitos = "Constituição 13."
        descricao = "Quando está descansado e novo em folha, nada parece abalá-lo."
        beneficio = "Você ignora o primeiro dano que sofrer a cada combate."
    },
    @{
        id = "entrada_triunfal"
        nome = "Entrada Triunfal"
        categoria = "Combate"
        preRequisitos = "Destreza 13, Iniciativa Aprimorada."
        descricao = "Quando você consegue agir primeiro, é capaz de ditar os termos do combate."
        beneficio = "Sempre que você vencer a iniciativa, recebe uma quantidade de PV temporários igual à metade de seus PV normais."
    },
    @{
        id = "erosao"
        nome = "Erosão"
        categoria = "Combate"
        preRequisitos = "Ataque Poderoso."
        descricao = "Não importa a resistência do inimigo. Você é persistente e continua golpeando até acabar com suas defesas."
        beneficio = "Sempre que acertar ataque corpo-a-corpo em inimigo com redução de dano, ele perde 1 ponto de RD (ou 2 pontos em caso de acerto crítico). A RD volta ao normal após o combate."
    },
    @{
        id = "escudo_destemido"
        nome = "Escudo Destemido"
        categoria = "Combate"
        preRequisitos = "Usar Escudo."
        descricao = "Você avança sem medo contra o inimigo, confiando que seu escudo irá protegê-lo."
        beneficio = "Se estiver usando um escudo, não sofre a penalidade de –2 em CA ao realizar uma investida."
    },
    @{
        id = "escudo_heroico"
        nome = "Escudo Heroico"
        categoria = "Combate"
        preRequisitos = "Ataque com Escudo Aprimorado."
        descricao = "Você arremessa seu escudo como uma arma mortal."
        beneficio = "Pode usar o escudo como arma de arremesso (leve: 15m; pesado: 9m). Retorna à mão na mesma rodada se acertar o alvo dentro de um incremento. Mantém o bônus de CA do escudo."
    },
    @{
        id = "escudo_inteligente"
        nome = "Escudo Inteligente"
        categoria = "Combate"
        preRequisitos = "Escudo Heroico."
        descricao = "Quando você arremessa seu escudo, ele parece ter vida própria."
        beneficio = "Ao acertar com escudo arremessado, ele ricocheteia para atingir inimigos subsequentes a até um incremento (penalidade cumulativa de –2 por ataque extra) até errar e retornar à mão."
    },
    @{
        id = "estocada_cruel"
        nome = "Estocada Cruel"
        categoria = "Combate"
        preRequisitos = "Foco em Arma (qualquer arma corpo-a-corpo de perfuração)."
        descricao = "Você é capaz de atravessar seus oponentes com golpes precisos."
        beneficio = "Ao acertar com arma de perfuração com Foco em Arma, o oponente sangra (teste de Constituição CD 15 por turno para estabilizar ou sofre 1d4 pontos de dano). Não acumulativo consigo mesmo. Criaturas imunes a críticos são imunes."
    },
    @{
        id = "estocada_cruel_maior"
        nome = "Estocada Cruel Maior"
        categoria = "Combate"
        preRequisitos = "Estocada Cruel, bônus base de ataque +6."
        descricao = "Os inimigos viram espetinho frente à sua lâmina!"
        beneficio = "Como Estocada Cruel, mas o efeito se acumula consigo mesmo a cada golpe bem-sucedido."
    },
    @{
        id = "exterminador_de_monstros"
        nome = "Exterminador de Monstros"
        categoria = "Combate"
        preRequisitos = "Bônus base de ataque +8."
        descricao = "Você é um especialista em matar criaturas gigantescas."
        beneficio = "Você recebe +2 nas jogadas de dano contra criaturas Grandes ou maiores. Além disso, inimigos não recebem bônus por tamanho em testes de manobra contra você."
    },
    @{
        id = "foco_em_escudo"
        nome = "Foco em Escudo"
        categoria = "Combate"
        preRequisitos = "Saber usar o tipo de escudo escolhido."
        descricao = "Escolha um tipo de escudo entre leve, pesado ou de corpo. Você consegue se proteger muito bem com ele."
        beneficio = "Aumenta o bônus de CA do escudo escolhido em +1 e recebe +1 em todos os testes de resistência enquanto o estiver usando."
    },
    @{
        id = "furia_estendida"
        nome = "Fúria Estendida"
        categoria = "Destino"
        preRequisitos = "Habilidade de classe fúria."
        descricao = "Sua ira queima por mais tempo, com o mesmo ardor."
        beneficio = "A duração de sua fúria aumenta em 3 rodadas. Especial: pode ser escolhido várias vezes (+3 rodadas a cada vez)."
    },
    @{
        id = "golpe_especial"
        nome = "Golpe Especial"
        categoria = "Combate"
        preRequisitos = "Surto Heroico."
        descricao = "Você é um herói. E todo herói tem seu golpe característico."
        beneficio = "Ao usar Surto Heroico para ataque adicional, realiza golpe especial com +2 no ataque e dano e um poder especial de arma mágica equivalente a bônus de +2 (escolhido ao adquirir o talento)."
    },
    @{
        id = "gritos_de_poder"
        nome = "Gritos de Poder"
        categoria = "Destino"
        preRequisitos = "Habilidade de classe fúria."
        descricao = "Você pode usar sua fúria para canalizar o poder de espíritos ou da sua própria natureza selvagem."
        beneficio = "Você recebe dois gritos de poder de bárbaro. Cada grito consome rodadas da fúria (ação livre, CD 10 + 1/2 nível + mod. Car). Especial: pode ser escolhido diversas vezes (+2 gritos a cada vez)."
    },
    @{
        id = "impacto_estonteante"
        nome = "Impacto Estonteante"
        categoria = "Combate"
        preRequisitos = "Foco em Arma (qualquer arma corpo-a-corpo de esmagamento)."
        descricao = "Seus oponentes ficam tontos ante a força de suas pancadas."
        beneficio = "Ao acertar com arma de esmagamento com Foco em Arma, o oponente sofre penalidade de –1 nos ataques na rodada seguinte (ou –2 em acerto crítico)."
    },
    @{
        id = "impacto_estonteante_maior"
        nome = "Impacto Estonteante Maior"
        categoria = "Combate"
        preRequisitos = "Impacto Estonteante, bônus base de ataque +6."
        descricao = "Suas pancadas deixam seus oponentes no chão!"
        beneficio = "Como Impacto Estonteante, e o oponente deve ser bem-sucedido num teste de Reflexos (CD 10 + 1/2 nível + mod. For) ou cai no chão."
    },
    @{
        id = "imobilizacao"
        nome = "Imobilização"
        categoria = "Combate"
        preRequisitos = "Agarrar Aprimorado."
        descricao = "Você sabe como imobilizar um inimigo agarrado."
        beneficio = "Gaste uma ação padrão e faça um teste de manobra para imobilizar criatura agarrada. A criatura fica indefesa e só pode tentar se soltar com manobra."
    },
    @{
        id = "investida_ricochete"
        nome = "Investida Ricochete"
        categoria = "Combate"
        preRequisitos = "Foco em Arma (qualquer arma corpo-a-corpo de esmagamento), Mobilidade."
        descricao = "Você é capaz de ricochetear de um inimigo que tenha acabado de atacar, partindo para o próximo."
        beneficio = "Ao fazer investida com arma de esmagamento com Foco em Arma, pode ricochetear e investir contra um segundo inimigo adjacente ao primeiro."
    },
    @{
        id = "mobilidade_perfeita"
        nome = "Mobilidade Perfeita"
        categoria = "Combate"
        preRequisitos = "Mobilidade."
        descricao = "Você é um relâmpago no campo de batalha — até mesmo magias têm dificuldade em atingi-lo!"
        beneficio = "Você recebe +2 em testes de resistência sempre que usar uma ação de movimento para se deslocar em combate. Não provoca ataques de oportunidade por se deslocar."
    },
    @{
        id = "morte_vinda_do_ceu"
        nome = "Morte Vinda do Céu"
        categoria = "Combate"
        preRequisitos = "Habilidade de classe fúria, treinado em Atletismo."
        descricao = "Você salta com selvageria sobre seus oponentes!"
        beneficio = "Em fúria ao fazer uma investida, você pode saltar em direção ao inimigo, ignorando terreno difícil e obstáculos baixos."
    },
    @{
        id = "olhos_nas_costas"
        nome = "Olhos nas Costas"
        categoria = "Combate"
        preRequisitos = "Treinado em Percepção, Mobilidade."
        descricao = "Você está prevenido contra inimigos que atacam pelas costas."
        beneficio = "Na primeira vez em que for flanqueado em um combate, pode realizar um ataque imediato contra um dos oponentes antes que ele ataque e em seguida mover-se 1,5m em qualquer direção."
    },
    @{
        id = "retroceder_nunca_render_se_jamais"
        nome = "Retroceder Nunca, Render-se Jamais"
        categoria = "Combate"
        preRequisitos = "Vitalidade, Vontade de Ferro."
        descricao = "Você não desiste!"
        beneficio = "Quando estiver com menos da metade dos PV totais, recebe +2 na CA e em todos os testes de resistência (+4 se todos os aliados estiverem caídos)."
    },
    @{
        id = "rigidez_raivosa"
        nome = "Rigidez Raivosa"
        categoria = "Combate"
        preRequisitos = "Casca Grossa, Fortitude Maior."
        descricao = "Ser ferido não o abala, só aumenta sua resolução."
        beneficio = "Sempre que sofrer dano físico, recebe redução de dano 1 cumulativa com outras fontes (ex: três golpes = RD 3). Efeito termina ao recuperar PV ou no fim do combate."
    },
    @{
        id = "sucesso_atrai_sucesso"
        nome = "Sucesso Atrai Sucesso"
        categoria = "Combate"
        preRequisitos = "Bônus base de ataque +6."
        descricao = "Uma vez que entre no ritmo do combate, você se torna invencível."
        beneficio = "Gaste 1 ponto de ação na 1ª rodada do combate: cada acerto crítico que fizer durante a luta aumenta sua margem de ameaça em +1 ponto até o fim do combate."
    },
    @{
        id = "tiro_especial"
        nome = "Tiro Especial"
        categoria = "Combate"
        preRequisitos = "Destreza 15, Tiro Certeiro, Tiro Preciso, bônus base de ataque +4."
        descricao = "Você é capaz de disparos espantosos, capazes de derrubar, desarmar ou empurrar seus inimigos."
        beneficio = "Você pode realizar as manobras derrubar, desarmar e empurrar utilizando ataques à distância com seu bônus de ataque à distância."
    },
    @{
        id = "treinado_em_escola"
        nome = "Treinado em Escola"
        categoria = "Combate"
        preRequisitos = "Variável (veja o texto da escola de combate)."
        descricao = "Você foi treinado em uma escola de combate específica, recebendo grande conhecimento em troca de dedicação."
        beneficio = "Você adquire o estilo e benefícios de uma escola de combate. Cada escola é um talento separado (Artilharia Pesada, Dança do Leopardo, Escola das Armas de Haste, Escola das Duas Mãos, Escudo de Tauron, Guarda de Theudric, Mão de Hisoka, Mão Livre, Rosto de Azgher)."
    },
    @{
        id = "artilharia_pesada"
        nome = "Artilharia Pesada"
        categoria = "Combate"
        preRequisitos = "Especialização em Arma (arco longo ou besta pesada); golpes Estocada Penetrante e Ferir a Perna; bônus base de ataque +6."
        descricao = "Escola de combate focada no potencial destrutivo extremo de arcos longos e bestas pesadas."
        beneficio = "Você recebe +2 no dano com arco longo e besta pesada. Pode sofrer –2 no ataque para aumentar o bônus de dano para +4."
    },
    @{
        id = "danca_do_leopardo"
        nome = "Dança do Leopardo"
        categoria = "Combate"
        preRequisitos = "Ataque Duplo (arma corpo-a-corpo de corte ou perfuração); golpes Ferir o Braço e Lacerar; postura Pata do Leopardo; bônus base de ataque +8."
        descricao = "Escola agressiva desenvolvida em Yuden que mina sistematicamente o vigor muscular dos oponentes."
        beneficio = "Acertos corpo-a-corpo com a arma em que possui Ataque Duplo causam +2 pontos de dano na Força do oponente além do dano normal."
    },
    @{
        id = "escola_das_armas_de_haste"
        nome = "Escola das Armas de Haste"
        categoria = "Combate"
        preRequisitos = "Alcance Supremo, Foco em Arma Aprimorado (qualquer arma de haste); golpe Aparar Ataque Corpo-a-Corpo; postura Base do Soldado."
        descricao = "Escola de infantaria de elite que usa alabardas e piques com alcance defensivo insuperável."
        beneficio = "Você recebe +2 nas jogadas de ataque com armas de haste e pode usá-las para atacar oponentes adjacentes normalmente."
    },
    @{
        id = "escola_das_duas_maos"
        nome = "Escola das Duas Mãos"
        categoria = "Combate"
        preRequisitos = "Empunhadura Poderosa, Golpe com Duas Mãos; golpes Ataque Pesado e Pancada com Pomo; postura Abraço da Montanha; bônus base de ataque +6."
        descricao = "Estilo bárbaro e anão refinado para desferir golpes avassaladores com armas pesadas."
        beneficio = "Pode gastar ação de movimento em vez de energia para o golpe Ataque Pesado. Com arma de duas mãos, pode gastar ação de movimento e 1 energia para rolar novamente um ataque recém realizado."
    },
    @{
        id = "escudo_de_tauron"
        nome = "Escudo de Tauron"
        categoria = "Combate"
        preRequisitos = "Ataque com Escudo Aprimorado; golpes Bloqueio com Escudo, Corte com Escudo, Pancada com Escudo e Sobrepujar; bônus base de ataque +4."
        descricao = "Técnica legionária de Tapista que transforma grandes escudos em ferramentas ofensivas simultâneas."
        beneficio = "Recebe +1 no ataque e dano com escudos. Ao desferir Corte com Escudo ou Pancada com Escudo, realiza ataque adicional com a mão principal (penalidade –4)."
    },
    @{
        id = "guarda_de_theudric"
        nome = "Guarda de Theudric"
        categoria = "Combate"
        preRequisitos = "Ataque com Escudo Aprimorado, Duro de Ferir, Escudo Veloz; golpes Bloqueio com Escudo e Sobrepujar; postura Base do Guarda; bônus base de ataque +4."
        descricao = "Estilo defensivo impenetrável concebido para proteger figuras nobres contra qualquer agressão."
        beneficio = "Com escudo, ganha redução de dano igual ao bônus total de CA concedido pelo escudo (ex: escudo pesado +2 concede RD 4, irredutível por material)."
    },
    @{
        id = "mao_de_hisoka"
        nome = "Mão de Hisoka"
        categoria = "Combate"
        preRequisitos = "Ataque Desarmado Aprimorado, Ataque Poderoso, Separar Aprimorado; golpe Soco Direto; bônus base de ataque +8."
        descricao = "Antigo estilo monástico de Tamu-ra baseado em socos pesados e perfurantes de alcance estendido."
        beneficio = "Seus ataques desarmados causam dano como se você fosse uma categoria de tamanho maior (ex: Médio causa 1d8 em vez de 1d6). Acumula com monge."
    },
    @{
        id = "mao_livre"
        nome = "Mão Livre"
        categoria = "Combate"
        preRequisitos = "Ataque Sagaz, Especialização em Combate, Esquiva; golpes Golpe Baixo e Ripostar; bônus base de ataque +5."
        descricao = "Estilo esgrimístico ligeiro praticado por piratas e duelistas experientes."
        beneficio = "Com uma arma de uma mão e a mão secundária livre, recebe bônus de +1 nas jogadas de ataque, jogadas de dano e CA."
    },
    @{
        id = "rosto_de_azgher"
        nome = "Rosto de Azgher"
        categoria = "Combate"
        preRequisitos = "Treinado em Atuação (dança), Foco em Arma (cimitarra), Mobilidade; golpes Ataque em Arco e Golpe em V; bônus base de ataque +5."
        descricao = "Dança de combate do Deserto da Perdição que confunde opositores com giros de lâminas ofuscantes."
        beneficio = "Ação de movimento para teste de Atuação oposto por Vontade de inimigos a até 9m. Oponentes que falharem ficam desprevenidos até o início de seus próximos turnos."
    },
    @{
        id = "truque_do_desarme"
        nome = "Truque do Desarme"
        categoria = "Combate"
        preRequisitos = "Bloqueio Ambidestro."
        descricao = "Você é capaz de enganar seus oponentes, aparando suas armas de forma a arrancá-las de suas mãos."
        beneficio = "Gaste uma ação completa para ganhar +4 em CA durante uma rodada. Todos os inimigos que atacarem em corpo-a-corpo e errarem são desarmados automaticamente (Intuição CD 20 evita atacar)."
    },
    @{
        id = "usar_escudo_de_corpo"
        nome = "Usar Escudo de Corpo"
        categoria = "Combate"
        preRequisitos = "Usar Escudo."
        descricao = "Você sabe lutar com escudos de corpo com destreza militar."
        beneficio = "Você sabe usar escudos de corpo sem aplicar sua penalidade de armadura em jogadas de ataque e testes de perícias baseadas em Força e Destreza."
    }
)

Write-Host "Talentos a processar: $($novosTalentos.Count)"

$adicionados = 0
$duplicados = 0
$listaFinal = [System.Collections.Generic.List[PSObject]]::new()

foreach ($item in $existing) {
    $listaFinal.Add($item)
}

foreach ($t in $novosTalentos) {
    if ($existingIds.ContainsKey($t.id)) {
        Write-Warning "Talento duplicado ignorado: $($t.id)"
        $duplicados++
    } else {
        $obj = [PSCustomObject]@{
            id = $t.id
            nome = $t.nome
            categoria = $t.categoria
            preRequisitos = $t.preRequisitos
            beneficio = $t.beneficio
            descricao = $t.descricao
        }
        $listaFinal.Add($obj)
        $existingIds[$t.id] = $true
        $adicionados++
    }
}

Write-Host "Adicionados: $adicionados | Ignorados duplicados: $duplicados"
Write-Host "Total final de talentos: $($listaFinal.Count)"

# Ordenar por nome para manter organização elegante
$listaOrdenada = $listaFinal | Sort-Object -Property nome

$jsonOutput = $listaOrdenada | ConvertTo-Json -Depth 5
[System.IO.File]::WriteAllText($talentosPath, $jsonOutput, [System.Text.UTF8Encoding]::new($false))
Write-Host "Arquivo $talentosPath atualizado com sucesso!"
