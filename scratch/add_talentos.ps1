# Script to merge new talents into src/data/talentos/talentos.json
$path = "src/data/talentos/talentos.json"
$existing = Get-Content -Path $path -Raw -Encoding UTF8 | ConvertFrom-Json

$existingMap = @{}
foreach ($item in $existing) {
    $existingMap[$item.id] = $item
}

$novosTalentos = @(
    # --- MANUAL DO MALANDRO ---
    @{
        id = "adaga_sorrateira"
        nome = "Adaga Sorrateira"
        categoria = "Combate"
        preRequisitos = "Sacar Rápido, Fintar Aprimorado."
        descricao = "Entre um golpe e outro, uma adaga dispara de suas mãos."
        beneficio = "Quando você erra um ataque corpo-a-corpo, pode sacar e arremessar uma adaga contra o mesmo oponente. Este ataque é uma ação livre, mas sofre uma penalidade de –2. Se você acertar este ataque, causa dano adicional de ataque furtivo (se você tiver esta habilidade). Este truque só funciona uma vez por oponente por combate."
    },
    @{
        id = "arte_comercial"
        nome = "Arte Comercial"
        categoria = "Destino"
        preRequisitos = "Treinado em Perícia (Atuação)."
        descricao = "Você vendeu sua alma artística por ouro. Ouro que não lhe faltará..."
        beneficio = "Quando você faz um teste de Atuação para realizar uma performance que lhe renda dividendos (ouro ou riqueza equivalente), pode escolher 10 e ganhar o triplo da quantidade normal. Contudo, sempre que encontrar um outro bardo ou personagem treinado em Atuação ou Ofício (escrita, escultura, pintura ou desenho), a atitude dele para com você piora em duas categorias, pois você 'se vendeu'."
    },
    @{
        id = "artista_de_conjunto"
        nome = "Artista de Conjunto"
        categoria = "Perícia"
        preRequisitos = "Talento Artista."
        descricao = "A sua estrela brilha mais quando todo o conjunto está unido."
        beneficio = "Você recebe um bônus de +6 em testes de Atuação quando estiver atuando em conjunto com outros artistas."
    },
    @{
        id = "artista_intelectual"
        nome = "Artista Intelectual"
        categoria = "Perícia"
        preRequisitos = "Inteligência ou Sabedoria 13."
        descricao = "Sua personalidade transparece em suas criações e suas ideias produzem obras e argumentos notáveis."
        beneficio = "Você pode aplicar o seu modificador de Inteligência ou Sabedoria em vez de seu modificador de Carisma em testes das perícias Atuação e Diplomacia. Você também recebe um bônus de +1 em todos os testes de Atuação e Diplomacia."
    },
    @{
        id = "artista_solo"
        nome = "Artista Solo"
        categoria = "Perícia"
        preRequisitos = "Talento Artista."
        descricao = "A sua estrela brilha mais quando as outras estão longe; caso contrário, você se sente ofuscado."
        beneficio = "Você recebe um bônus de +6 em testes de Atuação quando estiver atuando sozinho, mas sofre uma penalidade de –4 em testes de Atuação em conjunto. Especial: você não pode aprender este talento se já possuir Artista de Conjunto."
    },
    @{
        id = "ataque_furtivo_aprimorado"
        nome = "Ataque Furtivo Aprimorado"
        categoria = "Combate"
        preRequisitos = "Ataque furtivo +3d6."
        descricao = "Ladrões sabem acertar onde dói. Membros de irmandades sabem acertar onde mata."
        beneficio = "Os dados de dano adicional que você causa com um ataque furtivo aumentam para d8. Se você tiver níveis de ladino capanga, seu dano com ataque furtivo aumenta para d10."
    },
    @{
        id = "bardo_sabichao"
        nome = "Bardo Sabichão"
        categoria = "Perícia"
        preRequisitos = "Habilidade de classe conhecimento de bardo."
        descricao = "Quando o assunto é alguma história, você sempre tem algo a acrescentar."
        beneficio = "Você recebe um bônus de +4 em testes de conhecimento de bardo."
    },
    @{
        id = "conhecimento_anatomico"
        nome = "Conhecimento Anatômico"
        categoria = "Combate"
        preRequisitos = "Treinado em Cura, ataque furtivo +2d6."
        descricao = "Você sabe onde estão os pontos vitais de uma pessoa. E trata de sempre atingi-los."
        beneficio = "Sempre que você fizer um ataque furtivo com uma arma leve, sua margem de ameaça aumenta em +2, e seu multiplicador de crítico aumenta em +1. Por exemplo, se fizer com uma adaga, terá crítico 17-20/x3."
    },
    @{
        id = "domador_amador"
        nome = "Domador Amador"
        categoria = "Perícia"
        preRequisitos = "Foco em Perícia (Adestrar Animais)."
        descricao = "Você fala a língua do coração dos animais."
        beneficio = "Você recebe a habilidade de classe empatia selvagem."
    },
    @{
        id = "domador_de_feras"
        nome = "Domador de Feras"
        categoria = "Perícia"
        preRequisitos = "Habilidade de classe empatia selvagem."
        descricao = "Você fala a língua do coração das feras mais selvagens."
        beneficio = "Você pode utilizar a sua habilidade de classe empatia selvagem também em espíritos e monstros irracionais (com Int 1 ou 2), mas sofre uma penalidade de –4 no teste."
    },
    @{
        id = "evasao_do_cavaleiro"
        nome = "Evasão do Cavaleiro"
        categoria = "Combate"
        preRequisitos = "Especialização em Armadura (pesada)."
        descricao = "Você consegue se movimentar com agilidade mesmo com as maiores armaduras."
        beneficio = "Você pode utilizar a habilidade de classe evasão enquanto estiver usando armadura pesada."
    },
    @{
        id = "evasao_do_soldado"
        nome = "Evasão do Soldado"
        categoria = "Combate"
        preRequisitos = "Especialização em Armadura (média)."
        descricao = "Você consegue se movimentar com agilidade mesmo com armaduras."
        beneficio = "Você pode utilizar a habilidade de classe evasão enquanto estiver usando armadura média."
    },
    @{
        id = "grudar_o_cano"
        nome = "Grudar o Cano"
        categoria = "Combate"
        preRequisitos = "Usar Arma Exótica (pistola, mosquete ou outra arma de fogo)."
        descricao = "Para você, atirar com uma arma de fogo faz parte do combate corpo-a-corpo."
        beneficio = "Se você disparar sua arma de fogo quando estiver adjacente ao oponente (a até 1,5m), recebe um bônus de +2 na jogada de ataque e aumenta a margem de ameaça de crítico em +1."
    },
    @{
        id = "idolo_artoniano"
        nome = "Ídolo Artoniano"
        categoria = "Destino"
        preRequisitos = "Habilidade de classe música de bardo e talento Atraente."
        descricao = "Não basta apenas habilidade musical. Você usa sua beleza para se tornar um verdadeiro ídolo."
        beneficio = "Você pode aplicar seu bônus pelo talento Atraente (+4) em testes de Atuação. Além disso, aumente a CD de suas músicas de bardo em +2 quando elas afetarem qualquer um que possa se sentir fisicamente atraído por você."
    },
    @{
        id = "inimigo_odiado"
        nome = "Inimigo Odiado"
        categoria = "Combate"
        preRequisitos = "Habilidade de classe inimigo predileto."
        descricao = "Você realmente prefere combater alguns inimigos."
        beneficio = "Você aumenta o bônus nas jogadas de dano e em testes de Percepção, Intuição e Sobrevivência contra seus inimigos prediletos em +2."
    },
    @{
        id = "membro_de_gangue"
        nome = "Membro de Gangue"
        categoria = "Combate"
        preRequisitos = "Nenhum."
        descricao = "Essa história de 'duelo' não é com você."
        beneficio = "Se você fizer um ataque corpo-a-corpo contra um inimigo em alcance corpo-a-corpo de um aliado seu, você recebe um bônus de +1 nas jogadas de ataque e dano. Se o aliado também tiver este talento, o bônus aumenta para +2."
    },
    @{
        id = "olho_do_cacador"
        nome = "Olho do Caçador"
        categoria = "Combate"
        preRequisitos = "Foco em Perícia (Percepção), talento Olho Marcial."
        descricao = "Você é capaz de encontrar pontos fracos na mais pesada das armaduras e na mais espessa carapaça."
        beneficio = "Você pode tentar encontrar uma brecha ou fraqueza na armadura ou carapaça de um oponente. Faça um teste de Percepção contra CD 15 + nível da criatura. Com um sucesso, recebe +2 em ataque até o fim da luta (+4 se passar por 10 ou mais). Ação de movimento, 1x por oponente por combate."
    },
    @{
        id = "sanguinario"
        nome = "Sanguinário"
        categoria = "Combate"
        preRequisitos = "Ataque furtivo +1d6, tendência não Bondosa."
        descricao = "Você termina todo combate banhado em sangue."
        beneficio = "Quando você faz um ataque furtivo, pode rolar novamente qualquer '1' rolado no dano (tanto do ataque básico quanto dos dados de bônus do ataque furtivo). Você pode rolar cada dado apenas uma vez."
    },
    @{
        id = "sentinela_implacavel"
        nome = "Sentinela Implacável"
        categoria = "Combate"
        preRequisitos = "Treinado em Iniciativa e Percepção."
        descricao = "Acampamentos sob sua guarda estão sempre seguros."
        beneficio = "Se você estiver com uma arma de ataque à distância, pode fazer um ataque automático contra qualquer criatura que entrar no incremento de distância da arma. Este ataque é uma reação durante a ação do inimigo e interrompe a ação dele. 1x por combate."
    },
    @{
        id = "sorte_infinita"
        nome = "Sorte Infinita"
        categoria = "Destino"
        preRequisitos = "Habilidade de classe sortudo."
        descricao = "Algumas pessoas são bonitas, outras são fortes, outras são inteligentes... Você é só sortudo."
        beneficio = "Quando utiliza a habilidade de classe sortudo, você recebe um bônus de +10 na jogada de d20 para repetir o teste falho."
    },
    @{
        id = "tecnica_ladina_adicional"
        nome = "Técnica Ladina Adicional"
        categoria = "Destino"
        preRequisitos = "Habilidade de classe técnica ladina."
        descricao = "Quanto mais ladino, melhor."
        beneficio = "Você aprende mais uma técnica ladina."
    },
    @{
        id = "terreno_predileto_aprimorado"
        nome = "Terreno Predileto Aprimorado"
        categoria = "Combate"
        preRequisitos = "Habilidade de classe terreno predileto."
        descricao = "No seu terreno predileto, quase ninguém é tão bom quanto você."
        beneficio = "Você aumenta o bônus na classe de armadura e testes de Acrobacia, Atletismo, Furtividade, Percepção e Sobrevivência no(s) tipo(s) de terrenos escolhido(s) em +2."
    },
    @{
        id = "truque_do_chapeu"
        nome = "Truque do Chapéu"
        categoria = "Combate"
        preRequisitos = "Fintar Aprimorado, Sacar Rápido."
        descricao = "Um chapéu voa no meio do combate. Sangue respinga no chão."
        beneficio = "Como uma ação de movimento, você arremessa seu chapéu no rosto de um oponente a até 9m e faz uma finta. Com sucesso, tem direito a teste de Furtividade ou ataque. Se acertar o ataque, causa dano furtivo adicional. 1x por oponente por combate."
    },
    @{
        id = "preparar_armadilhas"
        nome = "Preparar Armadilhas"
        categoria = "Perícia"
        preRequisitos = "Treinado em Ofício ou Sobrevivência."
        descricao = "Para que sujar as mãos de sangue? Suje-as de graxa e deixe as armadilhas fazerem o trabalho..."
        beneficio = "Você aprende a construir e armar duas armadilhas da lista de armadilhas. Construir exige dez minutos e matérias-primas; armar exige ação completa (área 3m de lado)."
    },
    @{
        id = "armadilheiro_de_combate"
        nome = "Armadilheiro de Combate"
        categoria = "Perícia"
        preRequisitos = "Preparar Armadilhas."
        descricao = "Você deixa armadilhas preparadas para uso quase imediato."
        beneficio = "Você pode construir e carregar armadilhas para uso posterior. Pode carregar 1 + modificador de Inteligência armadilhas desta forma."
    },
    @{
        id = "armadilheiro_mal_intencionado"
        nome = "Armadilheiro Mal-Intencionado"
        categoria = "Perícia"
        preRequisitos = "Preparar Armadilhas."
        descricao = "É melhor enfrentar um guerreiro com uma espada de duas mãos do que cair numa de suas armadilhas."
        beneficio = "Todas as suas armadilhas que causam dano causam 2d6 pontos de dano adicional. A CD de Percepção para encontrar suas armadilhas e dos testes de resistência aumenta em +2."
    },
    @{
        id = "armadilheiro_peconhento"
        nome = "Armadilheiro Peçonhento"
        categoria = "Perícia"
        preRequisitos = "Armadilheiro Mal-Intencionado; lançar envenenamento/praga ou habilidade fabricar venenos."
        descricao = "O inimigo pode achar que sobreviveu às suas armadilhas. Mas, alguns dias depois, começa a se sentir mal..."
        beneficio = "Você pode adicionar às suas armadilhas o efeito das magias envenenamento ou praga ou de um veneno fabricável."
    },
    @{
        id = "armadilheiro_versatil"
        nome = "Armadilheiro Versátil"
        categoria = "Perícia"
        preRequisitos = "Int 15 ou Sab 15, Preparar Armadilhas."
        descricao = "Sua criatividade sádica não conhece limites."
        beneficio = "Você pode construir e armar todas as armadilhas da lista."
    },
    @{
        id = "mestre_armadilheiro"
        nome = "Mestre Armadilheiro"
        categoria = "Perícia"
        preRequisitos = "Preparar Armadilhas, mais um talento de armadilheiro."
        descricao = "Suas armadilhas mais parecem máquinas de guerra."
        beneficio = "Você pode construir armadilhas Enormes (quadrado de 6m de lado) pelo dobro do custo. Pode armar até duas armadilhas no mesmo espaço, atingindo simultaneamente."
    },
    @{
        id = "preparar_armadilhas_de_covil"
        nome = "Preparar Armadilhas de Covil"
        categoria = "Perícia"
        preRequisitos = "Preparar Armadilhas."
        descricao = "Existe decoração melhor para um covil?"
        beneficio = "Você pode preparar qualquer armadilha do Capítulo 10 de Tormenta RPG (1 dia por ND ou 10 min para ND 1/2; custo 10 x ND em TO)."
    },
    @{
        id = "cancao_aterrorizante"
        nome = "Canção Aterrorizante"
        categoria = "Destino"
        preRequisitos = "Música de bardo (canção apavorante)."
        descricao = "Suas canções assustadoras são mais dramáticas e poderosas."
        beneficio = "A sua canção apavorante afeta criaturas que possuem imunidades aos efeitos abalado ou apavorado, como se elas não fossem imunes."
    },
    @{
        id = "compositor_prolifico"
        nome = "Compositor Prolífico"
        categoria = "Destino"
        preRequisitos = "Habilidade de classe música de bardo."
        descricao = "Você compõe novas músicas no seu tempo livre."
        beneficio = "Você aprende duas novas músicas de bardo."
    },
    @{
        id = "marcha_das_maquinas"
        nome = "Marcha das Máquinas"
        categoria = "Destino"
        preRequisitos = "Música de bardo (sugestão em massa) e Foco em Perícia (Conhecimento [arcano])."
        descricao = "Nada consegue resistir à sua música."
        beneficio = "Você pode gastar dois usos diários de música de bardo para tomar posse de criaturas do tipo construto (Vontade CD 10 + metade do nível + mod Car anula) por um dia."
    },
    @{
        id = "musica_bombastica"
        nome = "Música Bombástica"
        categoria = "Destino"
        preRequisitos = "Habilidade de classe música de bardo."
        descricao = "Quando você toca ou canta, acorda todos os vizinhos e incomoda as igrejas próximas!"
        beneficio = "O alcance de suas músicas de bardo passa a ser 18m (normal 9m)."
    },
    @{
        id = "musica_emocionante"
        nome = "Música Emocionante"
        categoria = "Destino"
        preRequisitos = "Música de bardo (inspirar competência)."
        descricao = "Sua música é como a trilha sonora de uma história de aventuras, e faz o sangue de seu público ferver!"
        beneficio = "Sempre que utilizar sua música de bardo para inspirar competência, cada personagem beneficiado recebe um ponto de ação que dura um minuto (1x ao dia por personagem)."
    },
    @{
        id = "melodia_fortalecedora"
        nome = "Melodia Fortalecedora"
        categoria = "Perícia"
        preRequisitos = "Música de bardo (melodia revigorante)."
        descricao = "Enquanto você cantar, seus aliados se recusam a cair."
        beneficio = "Pode gastar um uso adicional de música de bardo ao usar melodia revigorante para conceder a mesma quantidade em PVs temporários em vez de cura."
    },
    @{
        id = "musica_complexa"
        nome = "Música Complexa"
        categoria = "Destino"
        preRequisitos = "Pelo menos duas músicas de bardo diferentes."
        descricao = "Suas canções podem ser compreendidas de vários modos, incitando diferentes emoções."
        beneficio = "Você pode gastar quatro usos diários de sua música de bardo para gerar os efeitos de duas músicas conhecidas ao mesmo tempo."
    },
    @{
        id = "requiem_do_submundo"
        nome = "Réquiem do Submundo"
        categoria = "Destino"
        preRequisitos = "Músicas de bardo canção apavorante e sugestão em massa."
        descricao = "Você tem vários fãs... No cemitério."
        beneficio = "Pode gastar dois usos diários de música de bardo para comandar mortos-vivos (Vontade CD 10 + metade do nível + mod Car anula) por um dia."
    },

    # --- MANUAL DO ARCANO ---
    @{
        id = "adaptabilidade"
        nome = "Adaptabilidade"
        categoria = "Magia"
        preRequisitos = "Classe mago."
        descricao = "Na hora de maior necessidade, você lembra como lançar aquela magia que não tinha preparado."
        beneficio = "Você pode lançar uma magia que não preparou perdendo magias preparadas cujo custo some pelo menos o dobro do custo da magia que quer lançar."
    },
    @{
        id = "alquimista_avarento"
        nome = "Alquimista Avarento"
        categoria = "Perícia"
        preRequisitos = "Treinado em Ofício (alquimia)."
        descricao = "Você pode criar itens alquímicos com menos materiais (ou materiais mais baratos)."
        beneficio = "Você pode criar itens alquímicos por um sexto do preço de mercado (normal é um terço)."
    },
    @{
        id = "alquimista_prodigio"
        nome = "Alquimista Prodígio"
        categoria = "Perícia"
        preRequisitos = "Foco em Perícia (Ofício [alquimia])."
        descricao = "Você se destaca no ofício da alquimia."
        beneficio = "Você pode criar versões obra-prima de itens alquímicos (+1 dado de dano do mesmo tipo, ou +2 na CD / dobro de duração; CD de Ofício +5, custo +100 TO)."
    },
    @{
        id = "ameaca_concreta"
        nome = "Ameaça Concreta"
        categoria = "Combate"
        preRequisitos = "Car 13."
        descricao = "Você não ameaça — você conjura."
        beneficio = "Sempre que reduzir os PV de um inimigo para 0 ou menos com magia, inimigos de nível menor ou igual sofrem –1 em ataque e testes de resistência até o fim do combate (Int 3+)."
    },
    @{
        id = "amigo_imaginario"
        nome = "Amigo Imaginário"
        categoria = "Destino"
        preRequisitos = "Habilidade de classe familiar."
        descricao = "Ninguém mais vê seu familiar... Mas você jura que ele está ao seu lado!"
        beneficio = "Você possui um familiar que existe apenas na sua imaginação, mantendo todos os bônus mecânicos sem poder ser atacado, capturado ou notado."
    },
    @{
        id = "conjurador_sortudo"
        nome = "Conjurador Sortudo"
        categoria = "Destino"
        preRequisitos = "Dois talentos metamágicos quaisquer."
        descricao = "Wynna parece favorecer suas magias."
        beneficio = "Quando você lança uma magia com efeitos medidos em dados, pode rolar novamente todos os resultados '1' (aceitando o novo resultado)."
    },
    @{
        id = "duelista_arcano"
        nome = "Duelista Arcano"
        categoria = "Combate"
        preRequisitos = "Treinado em Percepção e Identificar Magia."
        descricao = "Você é hábil em prever as manobras de outros conjuradores e contra-atacá-las."
        beneficio = "Ação de movimento para teste de Identificar Magia oposto a Enganação para prever se um conjurador lançará magia no próximo turno e qual será."
    },
    @{
        id = "esculpir_magia"
        nome = "Esculpir Magia"
        categoria = "Magia"
        preRequisitos = "Talento Metamágico (Custo: +1 PM)."
        descricao = "Você pode lançar bolas de fogo quadradas e cones glaciais em linha!"
        beneficio = "Pode trocar a forma de magias de área para: cilindro 3m raio, cone 9m, esfera 6m raio, linha 30m ou quadrado 9m de lado."
    },
    @{
        id = "especializacao_em_raio"
        nome = "Especialização em Raio"
        categoria = "Combate"
        preRequisitos = "Foco em Raio."
        descricao = "Seus raios são mais poderosos."
        beneficio = "Você recebe um bônus de +3 em jogadas de dano com magias que exigem ataques de toque à distância."
    },
    @{
        id = "especializacao_em_toque"
        nome = "Especialização em Toque"
        categoria = "Combate"
        preRequisitos = "Foco em Toque."
        descricao = "Seus ataques de toque são mais poderosos."
        beneficio = "Você recebe um bônus de +3 em jogadas de dano com magias que exigem ataques de toque."
    },
    @{
        id = "estudos_diletantes"
        nome = "Estudos Diletantes"
        categoria = "Destino"
        preRequisitos = "Mago generalista."
        descricao = "Você é ótimo em pesquisar magias... Mas nem tanto em usá-las."
        beneficio = "Você aprende três magias (em vez de duas) ao subir de nível, mas recebe apenas 2 PM por nível."
    },
    @{
        id = "expert_em_cajado"
        nome = "Expert em Cajado"
        categoria = "Magia"
        preRequisitos = "Nenhum."
        descricao = "Você pode canalizar energia mágica através de seu cajado com grande habilidade."
        beneficio = "Com cajado empunhado, suas magias em cone dobram o alcance e você recebe +2 em ataques de toque associados a magias."
    },
    @{
        id = "expert_em_cetro"
        nome = "Expert em Cetro"
        categoria = "Magia"
        preRequisitos = "Nenhum."
        descricao = "Com um cetro em mãos, você se torna mais majestoso."
        beneficio = "Com cetro empunhado, magias de alcance pessoal têm duração dobrada e seu nível conta +2 para comando de mortos-vivos e seguidores de Liderança."
    },
    @{
        id = "expert_em_orbe"
        nome = "Expert em Orbe"
        categoria = "Magia"
        preRequisitos = "Nenhum."
        descricao = "Você usa uma esfera para amplificar suas magias."
        beneficio = "Com orbe ou bola de cristal empunhado, magias de esfera/explosão dobram alcance e causam +1 de dano."
    },
    @{
        id = "expert_em_varinha"
        nome = "Expert em Varinha"
        categoria = "Magia"
        preRequisitos = "Nenhum."
        descricao = "Você maneja sua varinha como um maestro rege uma orquestra."
        beneficio = "Com varinha empunhada, magias de linha dobram o alcance e você recebe +2 em ataques de toque à distância associados a magias."
    },
    @{
        id = "foco_em_toque"
        nome = "Foco em Toque"
        categoria = "Combate"
        preRequisitos = "Bônus base de ataque +1."
        descricao = "Seus ataques de toque são mais precisos."
        beneficio = "Você recebe um bônus de +2 em jogadas de ataque com magias que exigem ataques de toque."
    },
    @{
        id = "foco_em_raio"
        nome = "Foco em Raio"
        categoria = "Combate"
        preRequisitos = "Bônus base de ataque +1."
        descricao = "Seus raios são mais precisos."
        beneficio = "Você recebe um bônus de +2 em jogadas de ataque com magias que exigem ataques de toque à distância."
    },
    @{
        id = "item_de_poder_aprimorado"
        nome = "Item de Poder Aprimorado"
        categoria = "Destino"
        preRequisitos = "Item de poder."
        descricao = "Seu item de poder é imbuído com sua magia."
        beneficio = "Gaste 1 PM no início do dia: arma ganha efeito de arma mágica maior, vestimenta concede +2 na CA, outros itens concedem +2 em testes de resistência por 24 horas."
    },
    @{
        id = "magia_congelante"
        nome = "Magia Congelante"
        categoria = "Magia"
        preRequisitos = "Substituição Elemental (frio). Custo: +1 PM."
        descricao = "Em suas mãos, o frio congela e prende seus inimigos."
        beneficio = "Magias de frio enredam por 1 rodada quem falhar no teste de resistência (ou teste de Fortitude)."
    },
    @{
        id = "magia_corrosiva"
        nome = "Magia Corrosiva"
        categoria = "Magia"
        preRequisitos = "Substituição Elemental (ácido). Custo: +1 PM."
        descricao = "Em suas mãos, o ácido é mais poderoso."
        beneficio = "Magias de ácido causam metade do dano causado na rodada seguinte (sem novo teste de resistência)."
    },
    @{
        id = "magia_duradoura"
        nome = "Magia Duradoura"
        categoria = "Magia"
        preRequisitos = "Estender Magia. Custo: +6 PM."
        descricao = "Suas magias podem durar o dia inteiro."
        beneficio = "Uma magia duradoura tem duração de um dia (não afeta magias instantâneas, permanentes ou concentração)."
    },
    @{
        id = "magia_eletrizante"
        nome = "Magia Eletrizante"
        categoria = "Magia"
        preRequisitos = "Substituição Elemental (eletricidade). Custo: +1 PM."
        descricao = "Suas magias elétricas são capazes de atordoar seus alvos."
        beneficio = "Magias de eletricidade atordoam por 1 rodada alvos que falhem no teste de resistência."
    },
    @{
        id = "magia_explosiva"
        nome = "Magia Explosiva"
        categoria = "Magia"
        preRequisitos = "Substituição Elemental (fogo). Custo: +1 PM."
        descricao = "Em suas mãos, o fogo pode gerar explosões poderosas."
        beneficio = "Magias de fogo arremessam 3m para trás e derrubam alvos que falhem no teste de resistência."
    },
    @{
        id = "magia_piedosa"
        nome = "Magia Piedosa"
        categoria = "Magia"
        preRequisitos = "Custo: +0 PM."
        descricao = "Suas magias podem subjugar seus oponentes sem destruí-los."
        beneficio = "A magia causa dano não-letal em vez de dano normal, mantendo seu descritor."
    },
    @{
        id = "magico_de_palco"
        nome = "Mágico de Palco"
        categoria = "Magia"
        preRequisitos = "Capacidade de lançar magias arcanas."
        descricao = "Você usa sua magia para divertir e impressionar."
        beneficio = "Diminua passos de dano, alcance ou duração de uma magia arcana para receber +1 em testes de perícia de Carisma por passo diminuído."
    },
    @{
        id = "mago_pobretao"
        nome = "Mago Pobretão"
        categoria = "Destino"
        preRequisitos = "Mago de 1º nível."
        descricao = "Você teve uma infância com poucos recursos, e seus estudos foram penosos."
        beneficio = "Comece o jogo com roupas, livro de magias, cajado e 1 TO. Receba +2 PV, treinamento em Ofício e +1 magia no 1º nível."
    },
    @{
        id = "mente_sobre_o_corpo"
        nome = "Mente sobre o Corpo"
        categoria = "Destino"
        preRequisitos = "Classe feiticeiro."
        descricao = "Sua constituição física está ligada a seu poder mágico."
        beneficio = "Você recebe quantidade de PV igual ao valor de Carisma, mais +1 PV para cada talento metamágico que possuir."
    },
    @{
        id = "mente_yudeniana"
        nome = "Mente Yudeniana"
        categoria = "Destino"
        preRequisitos = "Vontade de Ferro."
        descricao = "Dizem que os yudenianos têm mente inflexível e determinação férrea."
        beneficio = "Você recebe +2 em Vontade e, 1x ao dia, recupera PV igual à CD de um teste de Vontade bem-sucedido contra ameaça externa."
    },
    @{
        id = "mestre_elemental"
        nome = "Mestre Elemental"
        categoria = "Magia"
        preRequisitos = "Substituição Elemental (ácido, eletricidade, fogo, frio e sônico). Custo: +0 PM."
        descricao = "Você é capaz de manipular os elementos facilmente."
        beneficio = "Pode trocar qualquer descritor elemental por outro em suas magias sem preparar com antecedência."
    },
    @{
        id = "personalizar_magia"
        nome = "Personalizar Magia"
        categoria = "Magia"
        preRequisitos = "Capacidade de lançar magias arcanas."
        descricao = "Suas magias têm um toque pessoal."
        beneficio = "A CD para identificar suas magias é aumentada para 20 + nível sendo lançadas e 25 + nível já lançadas."
    },
    @{
        id = "poder_embutido"
        nome = "Poder Embutido"
        categoria = "Destino"
        preRequisitos = "Item de poder, Carisma 10 ou menor."
        descricao = "Através de uma complexa cirurgia arcana, você implantou seu item de poder em seu próprio corpo!"
        beneficio = "Seu item de poder é implantado em seu corpo, impossibilitando roubo, desarmar ou destruição direta por ataques normais."
    },
    @{
        id = "recursos_reciclaveis"
        nome = "Recursos Recicláveis"
        categoria = "Magia"
        preRequisitos = "Mago Pobretão."
        descricao = "Devido à sua criação pobre, você aprendeu a administrar seus recursos habilmente."
        beneficio = "Você diminui para um décimo o custo de todos os componentes materiais de suas magias."
    },
    @{
        id = "substituicao_elemental"
        nome = "Substituição Elemental"
        categoria = "Magia"
        preRequisitos = "Custo: +0 PM."
        descricao = "Você é capaz de manipular as energias elementais de formas específicas."
        beneficio = "Escolha um elemento (ácido, fogo, frio, eletricidade ou sônico) e converta o dano de suas magias para este elemento."
    },
    @{
        id = "tese_arcana_de_graduacao"
        nome = "Tese Arcana de Graduação"
        categoria = "Magia"
        preRequisitos = "Mago de 4º nível, guilda/academia de magia, aprovação da banca."
        descricao = "Você se formou em uma escola de magia e desenvolveu uma pesquisa arcana."
        beneficio = "1x ao dia pode usar um talento metamágico de até +2 PM sem pagar custo adicional e sem preparar."
    },
    @{
        id = "tese_arcana_de_mestre"
        nome = "Tese Arcana de Mestre"
        categoria = "Magia"
        preRequisitos = "Mago de 8º nível, Tese Arcana de Graduação, aprovação da banca."
        descricao = "Você é um estudioso da magia reconhecido por outros pesquisadores."
        beneficio = "1x ao dia usa um talento metamágico sem custo adicional e sem preparar; +2 em Diplomacia com outros magos."
    },
    @{
        id = "tese_arcana_de_grao_mestre"
        nome = "Tese Arcana de Grão-Mestre"
        categoria = "Magia"
        preRequisitos = "Mago de 12º nível, Tese Arcana de Mestre, aprovação da banca."
        descricao = "Você é um dos maiores especialistas do mundo na sua área de pesquisa arcana."
        beneficio = "1x ao dia usa qualquer talento metamágico (mesmo não conhecido) sem custo e sem preparar; +4 em Diplomacia com outros magos."
    },
    @{
        id = "toque_longinquo"
        nome = "Toque Longínquo"
        categoria = "Magia"
        preRequisitos = "Talento Metamágico (Custo: +1 PM)."
        descricao = "Suas magias de toque vão além do alcance de seus braços."
        beneficio = "Magias de toque passam a ter alcance de 12m (ataque de toque à distância)."
    },

    # --- MANUAL DO DEVOTO ---
    @{
        id = "arma_divina_esporadica"
        nome = "Arma Divina Esporádica"
        categoria = "Poder Concedido"
        preRequisitos = "Devoto de qualquer deus exceto Lena ou Marah."
        descricao = "Você recebe ajuda divina em combate. Mas só às vezes."
        beneficio = "Ao acertar alvo não devoto do seu deus, role 1d4 junto ao dano: com resultado 4, adicione +2d6 de dano de energia de acordo com sua divindade."
    },
    @{
        id = "canto_monastico"
        nome = "Canto Monástico"
        categoria = "Magia"
        preRequisitos = "Treinado em Atuação (música), capacidade de lançar magias divinas."
        descricao = "Você foi treinado em um mosteiro, onde rezava através de belos cânticos."
        beneficio = "Ação de movimento ao lançar magia divina para aumentar a CD de resistência em +1 (número de vezes ao dia igual a Car + 1)."
    },
    @{
        id = "canto_monastico_aprimorado"
        nome = "Canto Monástico Aprimorado"
        categoria = "Magia"
        preRequisitos = "Atuação (música) 8 graduações, Canto Monástico."
        descricao = "No mosteiro onde foi treinado, você era responsável por ensinar os acólitos a cantar como anjos."
        beneficio = "Ao usar Canto Monástico, soma bônus de Carisma aos efeitos numéricos variáveis da magia (dano, PV curados, etc.)."
    },
    @{
        id = "canto_monastico_magistral"
        nome = "Canto Monástico Magistral"
        categoria = "Magia"
        preRequisitos = "Atuação (música) 13 graduações, Canto Monástico Aprimorado."
        descricao = "Os deuses choram de emoção ao ouvi-lo cantar."
        beneficio = "Ao usar Canto Monástico, a magia fica sob o efeito do talento Maximizar Magia sem custo adicional."
    },
    @{
        id = "circulo_mistico_dourado"
        nome = "Círculo Místico Dourado"
        categoria = "Destino"
        preRequisitos = "Habilidade de classe canalizar energia positiva/negativa."
        descricao = "Você pode criar um pequeno santuário para abençoar seus ataques."
        beneficio = "Ação padrão e 1 uso de canalizar energia cria círculo de 1,5m no chão: quem estiver dentro recebe +2 em todos os ataques por 10 minutos."
    },
    @{
        id = "circulo_mistico_prateado"
        nome = "Círculo Místico Prateado"
        categoria = "Destino"
        preRequisitos = "Habilidade de classe canalizar energia positiva/negativa."
        descricao = "Você pode criar um pequeno santuário para aprimorar suas defesas."
        beneficio = "Ação padrão e 1 uso de canalizar energia cria círculo de 1,5m no chão: quem estiver dentro recebe +2 na CA e em todos os testes de resistência por 10 minutos."
    },
    @{
        id = "circulo_mistico_purpura"
        nome = "Círculo Místico Púrpura"
        categoria = "Destino"
        preRequisitos = "Habilidade de classe canalizar energia positiva/negativa."
        descricao = "Você pode criar um pequeno santuário para abençoar suas magias."
        beneficio = "Ação padrão e 1 uso de canalizar energia cria círculo de 1,5m no chão: adiciona mod Sab a magias de cura ou dano lançadas de dentro do círculo por 10 minutos."
    },
    @{
        id = "circulo_mistico_vermelho"
        nome = "Círculo Místico Vermelho"
        categoria = "Destino"
        preRequisitos = "Habilidade de classe canalizar energia positiva/negativa."
        descricao = "Você pode projetar sua habilidade de energia positiva/negativa em círculos no chão."
        beneficio = "Cria um círculo místico invisível a até 15m; criatura que entrar sofre os efeitos de canalizar energia (1x por criatura, dura 10 min)."
    },
    @{
        id = "companheiro_enxame"
        nome = "Companheiro Enxame"
        categoria = "Destino"
        preRequisitos = "Habilidade de classe companheiro animal."
        descricao = "Você não tem um companheiro animal. Tem centenas."
        beneficio = "Substitui companheiro animal por um enxame de criaturas (ratos, vespas, aranhas, etc.) com atributos de enxame e habilidades selecionáveis."
    },
    @{
        id = "destruir_o_mal_aprimorado"
        nome = "Destruir o Mal Aprimorado"
        categoria = "Combate"
        preRequisitos = "Habilidade de classe destruir o mal."
        descricao = "Oponentes malignos caem como moscas frente ao seu poder divino."
        beneficio = "Ao usar destruir o mal, você recebe um bônus de +4 na jogada de ataque ou na jogada de dano (à sua escolha antes do ataque)."
    },
    @{
        id = "destruir_o_mal_persistente"
        nome = "Destruir o Mal Persistente"
        categoria = "Combate"
        preRequisitos = "Habilidade de classe destruir o mal."
        descricao = "Você não se abala com pequenas derrotas."
        beneficio = "Se errar o ataque ou atacar alvo não-maligno com destruir o mal, você não gasta o uso da habilidade."
    },
    @{
        id = "devoto"
        nome = "Devoto"
        categoria = "Destino"
        preRequisitos = "Sab 11, adorador típico da divindade."
        descricao = "Você segue fielmente o deus escolhido, recebendo uma pequena porção de poder mágico divino."
        beneficio = "Aprende uma magia divina de nível 0 lançável 3x ao dia e ganha acesso a poderes concedidos da divindade padroeira."
    },
    @{
        id = "dizimo_duvidoso"
        nome = "Dízimo Duvidoso"
        categoria = "Perícia"
        preRequisitos = "Treinado em Enganação, tendência não Leal."
        descricao = "Você vende lugares nos Reinos dos Deuses e garante favores em troca de doações."
        beneficio = "Teste de Enganação CD 15 em comunidades do deus: ganha 1 TO por ponto acima da CD ou favores de plebeus (abrigo, comida, transporte)."
    },
    @{
        id = "druida_boticario"
        nome = "Druida Boticário"
        categoria = "Magia"
        preRequisitos = "Classe druida, Preparar Poções, treinado em Ofício (alquimia)."
        descricao = "Quando você e o seu caldeirão se juntam, as possibilidades são enormes."
        beneficio = "Você pode criar poções com magias de até 5º nível (normal até 3º nível)."
    },
    @{
        id = "escudo_da_fe_aprimorado"
        nome = "Escudo da Fé Aprimorado"
        categoria = "Magia"
        preRequisitos = "Treinamento com escudo, capacidade de lançar escudo da fé."
        descricao = "Para você, o nome de certa magia tem significado bem literal."
        beneficio = "Escudo da fé cria um escudo pesado brilhante +2 por 1 dia empunhável apenas por você, sem limite de tempo longe da mão."
    },
    @{
        id = "escrever_pergaminhos"
        nome = "Escrever Pergaminhos"
        categoria = "Magia"
        preRequisitos = "Capacidade de lançar magias de 1º nível."
        descricao = "Você pode criar pergaminhos mágicos de uso único."
        beneficio = "Permite escrever pergaminhos com magias conhecidas pagando nível mín x 25 TO mais custos de material/XP."
    },
    @{
        id = "falcoeiro"
        nome = "Falcoeiro"
        categoria = "Destino"
        preRequisitos = "Treinado em Adestrar Animais."
        descricao = "Você é um mestre na arte da falcoaria."
        beneficio = "Você recebe um falcão como familiar, mesmo que não pertença a uma classe conjuradora."
    },
    @{
        id = "forma_de_enxame"
        nome = "Forma de Enxame"
        categoria = "Destino"
        preRequisitos = "Habilidade de classe forma selvagem."
        descricao = "Você não se transforma em apenas um animal — pode dividir sua consciência em milhares deles."
        beneficio = "Gaste dois usos de forma selvagem para virar um enxame: imune a manobras e dano de alvo único, metade do dano de armas, causa dano automático a quem estiver no seu espaço."
    },
    @{
        id = "forma_selvagem_mistica"
        nome = "Forma Selvagem Mística"
        categoria = "Destino"
        preRequisitos = "Sab 15, habilidade de classe forma selvagem."
        descricao = "Você é capaz de se transformar em um animal híbrido sagrado para seu deus padroeiro."
        beneficio = "Gaste três usos diários de forma selvagem: CA +4 (+6 no 11º nível, +8 no 17º), +1 na CD de todas as magias e 1x ao dia Potencializar Magia gratuito."
    },
    @{
        id = "fundamentalista"
        nome = "Fundamentalista"
        categoria = "Destino"
        preRequisitos = "Devoto, cumpridor das Obrigações & Restrições de seu deus."
        descricao = "Você vive por dogmas muito rígidos e antigos da sua religião."
        beneficio = "Siga os dogmas fundamentalistas de seu deus e receba +2 em duas habilidades básicas à sua escolha e +5 PM."
    },
    @{
        id = "luz_da_alvorada_ocaso"
        nome = "Luz da Alvorada/Ocaso"
        categoria = "Destino"
        preRequisitos = "Habilidade canalizar energia positiva (alvorada) ou negativa (ocaso)."
        descricao = "Você é capaz de invocar uma luz pura e cálida (ou fria e soturna) para guiá-lo em suas jornadas."
        beneficio = "Gaste 1 uso de canalizar energia: luz de 9m por 1 hora que revela criaturas incorpóreas e anula chance de erro contra elas."
    },
    @{
        id = "magia_conspurcada"
        nome = "Magia Conspurcada"
        categoria = "Magia"
        preRequisitos = "Canalizar energia negativa, tendência Maligna."
        descricao = "Suas magias têm um toque sinistro e macabro."
        beneficio = "Custo +1 PM e 1 canalização: dano passa a ter descritor profano, ignorando qualquer resistência a energia."
    },
    @{
        id = "magia_primordial"
        nome = "Magia Primordial"
        categoria = "Magia"
        preRequisitos = "Habilidade de classe forma selvagem."
        descricao = "Suas magias são brutas e diretas, assim como a natureza."
        beneficio = "Custo +1 PM e 1 forma selvagem: converte dano da magia em dano físico (corte, esmagamento ou perfuração), ignorando resistências a energia e magia."
    },
    @{
        id = "magia_santificada"
        nome = "Magia Santificada"
        categoria = "Magia"
        preRequisitos = "Canalizar energia positiva, tendência Bondosa."
        descricao = "Suas magias são puras e abençoadas."
        beneficio = "Custo +1 PM e 1 canalização: dano passa a ter descritor sagrado, ignorando qualquer resistência a energia."
    },
    @{
        id = "outra_face"
        nome = "Outra Face"
        categoria = "Poder Concedido"
        preRequisitos = "Devoto de Lena, Marah ou Thyatis."
        descricao = "Você revida um ataque com um perdão."
        beneficio = "Ao ser atingido com sucesso por um inimigo, perdoe-o para impor penalidade cumulativa de –1 em todas as jogadas de ataque dele na cena (anulada se você atacá-lo)."
    },
    @{
        id = "poder_do_rebanho"
        nome = "Poder do Rebanho"
        categoria = "Magia"
        preRequisitos = "Carisma 13, capacidade de lançar magias divinas."
        descricao = "Você é fortalecido pela fé de seus aliados."
        beneficio = "Aumenta a CD das magias divinas se devotos rezarem a até 18m (+1 para 1 a 9 devotos, +2 para 10 a 49, +3 para 50+)."
    },
    @{
        id = "poder_do_rebanho_aprimorado"
        nome = "Poder do Rebanho Aprimorado"
        categoria = "Magia"
        preRequisitos = "Poder do Rebanho."
        descricao = "Seus aliados nem precisam ter muita fé para ajudá-lo."
        beneficio = "O bônus de Poder do Rebanho também se aplica aos seus testes de resistência e funciona com seguidores leigos de sua divindade."
    },
    @{
        id = "profeta_do_caos"
        nome = "Profeta do Caos"
        categoria = "Poder Concedido"
        preRequisitos = "Carisma 13, devoto de Nimb."
        descricao = "Você pode fazer uma barganha com Nimb. O preço: um palpite. A recompensa: diversão."
        beneficio = "Profetize o resultado do d20 antes da rolagem. Se acertar o número exato, defina o resultado da rolagem (erro crítico, acerto crítico automático, etc.). Usável Car vezes ao dia."
    },
    @{
        id = "projetar_cura_pelas_maos"
        nome = "Projetar Cura pelas Mãos"
        categoria = "Destino"
        preRequisitos = "Habilidade de classe cura pelas mãos."
        descricao = "Você pode transformar sua habilidade de cura pelas mãos em um raio de luz divina."
        beneficio = "Pode usar cura pelas mãos em alvos a até 9m (ataque de toque à distância se usado para ferir mortos-vivos)."
    },
    @{
        id = "protecao_contra_trevas"
        nome = "Proteção contra Trevas"
        categoria = "Destino"
        preRequisitos = "Tendência Bondosa, Carisma 11, canalizar energia positiva."
        descricao = "Uma luz brilha dentro de você, impedindo que as trevas o atinjam."
        beneficio = "Recebe resistência 10 contra dano necromântico e +4 em testes de resistência contra magias de necromancia."
    },
    @{
        id = "purificacao_pelo_fogo"
        nome = "Purificação pelo Fogo"
        categoria = "Destino"
        preRequisitos = "Capacidade de lançar magia divina com descritor fogo."
        descricao = "Seus inimigos são infiéis. Mas o fogo divino vai torná-los puros."
        beneficio = "Ao derrubar inimigo com magia de fogo divina, se ele for curado durante a batalha adquire sua tendência até o final do combate."
    },
    @{
        id = "residuo_magico_curativo"
        nome = "Resíduo Mágico Curativo"
        categoria = "Magia"
        preRequisitos = "Treinado em Conhecimento (arcano) e Cura."
        descricao = "Sempre que você lançar uma magia, recebe uma quantidade de PV temporários igual ao custo em PM da magia."
        beneficio = "Receba PV temporários iguais ao custo em PM da magia lançada até o fim do dia (múltiplos usos não acumulam, prevalece o maior)."
    },
    @{
        id = "sacerdote_copista"
        nome = "Sacerdote Copista"
        categoria = "Magia"
        preRequisitos = "Classe clérigo, treinado em Ofício (caligrafia), Escrever Pergaminhos."
        descricao = "Anos de prática copiando documentos aprimoraram a criação de pergaminhos."
        beneficio = "Pode adicionar talentos metamágicos (Aumentar Magia, Estender Magia, Potencializar Invocação, Potencializar Magia) aos pergaminhos que criar."
    },
    @{
        id = "salto_para_a_salvacao"
        nome = "Salto para a Salvação"
        categoria = "Combate"
        preRequisitos = "Treinado em Cura e Iniciativa."
        descricao = "Seu objetivo no combate não é matar inimigos. É salvar aliados."
        beneficio = "Declare intenção de curar aliado na rodada seguinte: torna-se o primeiro na iniciativa e ganha ação de movimento extra para chegar até o aliado (1x por combate)."
    },
    @{
        id = "senhor_dos_mortos"
        nome = "Senhor dos Mortos"
        categoria = "Destino"
        preRequisitos = "Fascinar Mortos-Vivos, 10º nível de personagem."
        descricao = "Você pode controlar hordas de mortos-vivos."
        beneficio = "O nível máximo somado de mortos-vivos sob seu comando passa a ser o quádruplo do seu nível."
    },
    @{
        id = "sincretismo"
        nome = "Sincretismo"
        categoria = "Destino"
        preRequisitos = "Sab 13, ser devoto de um deus."
        descricao = "Para você, servir a apenas um deus não basta."
        beneficio = "Torne-se devoto de uma segunda divindade (com tendência a no máximo um passo de distância da primeira), podendo escolher poderes concedidos dela."
    }
)

$adicionados = 0
foreach ($t in $novosTalentos) {
    if (-not $existingMap.ContainsKey($t.id)) {
        $existing += [PSCustomObject]$t
        $existingMap[$t.id] = $t
        $adicionados++
    }
}

$existing = $existing | Sort-Object id
$json = $existing | ConvertTo-Json -Depth 5
[System.IO.File]::WriteAllText($path, $json, [System.Text.Encoding]::UTF8)

Write-Host "Total talentos agora: $($existing.Count) (Adicionados novos: $adicionados)"

