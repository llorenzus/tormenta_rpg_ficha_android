# Batch 2 of Manual do Arcano spells
$path = "src/data/magias/magias.json"
$existing = Get-Content -Path $path -Raw -Encoding UTF8 | ConvertFrom-Json

$existingMap = @{}
foreach ($item in $existing) {
    $existingMap[$item.id] = $item
}

$arcanoMagias2 = @(
    @{
        id = "dominio_da_agua"
        nome = "Domínio da Água"
        nivel = 9
        tipo = "arcana"
        escola = "Evocação"
        tempoExecucao = "1 semana"
        alcance = "10 km"
        alvoAreaEfeito = "Raio de 10km ao redor da fortaleza do conjurador"
        duracao = "1 ano"
        resistencia = "Nenhum"
        componenteMaterial = "Cristal arcano no valor de 10.000 TO"
        descricao = "Transforma a região em torno de sua fortaleza num lago de 1km de raio, pântano de 3km e banhado de 6km, permitindo controlar chuvas, águas e comandar até dois elementais da água anciões."
    },
    @{
        id = "dominio_do_ar"
        nome = "Domínio do Ar"
        nivel = 9
        tipo = "arcana"
        escola = "Evocação"
        tempoExecucao = "1 semana"
        alcance = "10 km"
        alvoAreaEfeito = "Raio de 10km ao redor da fortaleza do conjurador"
        duracao = "1 ano"
        resistencia = "Reflexos parcial"
        componenteMaterial = "Cristal arcano no valor de 10.000 TO"
        descricao = "Cria névoas e vendavais em torno da fortaleza: voo de 18m para o arcano, invocação de relâmpagos como ação padrão e comando de até dois elementais do ar anciões."
    },
    @{
        id = "dominio_do_fogo"
        nome = "Domínio do Fogo"
        nivel = 9
        tipo = "arcana"
        escola = "Evocação"
        tempoExecucao = "1 semana"
        alcance = "10 km"
        alvoAreaEfeito = "Raio de 10km ao redor da fortaleza do conjurador"
        duracao = "1 ano"
        resistencia = "Fortitude parcial"
        componenteMaterial = "Cristal arcano no valor de 10.000 TO"
        descricao = "Cria um deserto escaldante de 9km de raio: onda de calor (CD 25 por hora para não cair exausto/inconsciente), explosões de chamas à vontade e comando de até dois elementais do fogo anciões."
    },
    @{
        id = "dominio_do_gelo"
        nome = "Domínio do Gelo"
        nivel = 9
        tipo = "arcana"
        escola = "Evocação"
        tempoExecucao = "1 semana"
        alcance = "10 km"
        alvoAreaEfeito = "Raio de 10km ao redor da fortaleza do conjurador"
        duracao = "1 ano"
        resistencia = "Fortitude parcial"
        componenteMaterial = "Cristal arcano no valor de 10.000 TO"
        descricao = "Cria um deserto gelado com nevascas de 9km de raio: deslocamento reduzido à metade, frio intenso, torrentes de neve e comando de até três gigantes do gelo."
    },
    @{
        id = "dominio_da_mente"
        nome = "Domínio da Mente"
        nivel = 9
        tipo = "arcana"
        escola = "Encantamento"
        tempoExecucao = "1 semana"
        alcance = "10 km"
        alvoAreaEfeito = "Raio de 10km ao redor da fortaleza do conjurador"
        duracao = "1 ano"
        resistencia = "Vontade parcial"
        componenteMaterial = "Cristal arcano no valor de 10.000 TO"
        descricao = "Permite influenciar atitudes de todas criaturas na área em uma categoria, atrai seguidores como Liderança e permite apavorar criaturas que estejam sob sua vista com teste de Vontade."
    },
    @{
        id = "dominio_da_morte"
        nome = "Domínio da Morte"
        nivel = 9
        tipo = "arcana"
        escola = "Necromancia"
        tempoExecucao = "1 semana"
        alcance = "10 km"
        alvoAreaEfeito = "Raio de 10km ao redor da fortaleza do conjurador"
        duracao = "1 ano"
        resistencia = "Fortitude parcial"
        componenteMaterial = "Cristal arcano no valor de 10.000 TO"
        descricao = "Mata vegetação e criaturas com ND 1 ou menor em um mês, erguendo-as como mortos-vivos sob seu comando. Todos os mortos-vivos na área ganham +1 em ataques, dano, perícias e CA."
    },
    @{
        id = "dominio_da_terra"
        nome = "Domínio da Terra"
        nivel = 9
        tipo = "arcana"
        escola = "Transmutação"
        tempoExecucao = "1 semana"
        alcance = "10 km"
        alvoAreaEfeito = "Raio de 10km ao redor da fortaleza do conjurador"
        duracao = "1 ano"
        resistencia = "Especial"
        componenteMaterial = "Cristal arcano no valor de 10.000 TO"
        descricao = "Ergue montanhas e solo pedregoso intransitável, reduzindo deslocamento à metade. 1x ao dia lança terremoto e comanda até dois elementais da terra anciões."
    },
    @{
        id = "em_chamas"
        nome = "Em Chamas!"
        nivel = 2
        tipo = "arcana"
        escola = "Evocação"
        tempoExecucao = "Ação de movimento"
        alcance = "Pessoal"
        alvoAreaEfeito = "Você"
        duracao = "3 rodadas"
        resistencia = "Nenhum"
        descricao = "Aura de chamas: magias de fogo causam +1 dano, você recebe resistência a fogo 2 e causa 2 pontos de dano a quem atacá-lo corpo-a-corpo. Acumula até 3 vezes."
    },
    @{
        id = "empurrao_arcano"
        nome = "Empurrão Arcano"
        nivel = 4
        tipo = "arcana"
        escola = "Evocação"
        tempoExecucao = "Ação livre"
        alcance = "9m"
        alvoAreaEfeito = "1 criatura"
        duracao = "Instantânea"
        resistencia = "Reflexos parcial"
        descricao = "Palma de energia empurra o alvo para trás de 6m a 12m e derruba-o no chão (metade da distância e não cai se passar no teste de Reflexos)."
    },
    @{
        id = "encantar_arma_de_osso"
        nome = "Encantar Arma de Osso"
        nivel = 5
        tipo = "arcana"
        escola = "Necromancia"
        tempoExecucao = "1 minuto"
        alcance = "Toque"
        alvoAreaEfeito = "1 osso"
        duracao = "Permanente"
        resistencia = "Nenhum"
        descricao = "Transforma um osso em uma clava dissonante +1 infundida com energia necromântica, impondo 2 níveis negativos a qualquer usuário não morto-vivo."
    },
    @{
        id = "encantar_grimorio"
        nome = "Encantar Grimório"
        nivel = 5
        tipo = "arcana"
        escola = "Transmutação"
        tempoExecucao = "1 hora"
        alcance = "Toque"
        alvoAreaEfeito = "1 grimório ou livro"
        duracao = "Permanente"
        resistencia = "Nenhum"
        custoXp = "500 XP"
        descricao = "Dá vida e consciência a um grimório ou livro, ganhando rosto humanoide na capa, personalidade e capacidade de conversar sobre seu conteúdo e magias registradas."
    },
    @{
        id = "envelhecer"
        nome = "Envelhecer"
        nivel = 5
        tipo = "arcana"
        escola = "Transmutação"
        tempoExecucao = "Ação padrão"
        alcance = "9m"
        alvoAreaEfeito = "1 criatura"
        duracao = "Permanente"
        resistencia = "Fortitude parcial"
        descricao = "Faz o alvo envelhecer de 1 a 10 anos em poucos segundos (período equivalente para outras raças), forçando Fortitude para não ficar exausto (falha) ou fatigado (sucesso)."
    },
    @{
        id = "escudo_arcano_maior"
        nome = "Escudo Arcano Maior"
        nivel = 3
        tipo = "arcana"
        escola = "Abjuração"
        tempoExecucao = "Ação padrão"
        alcance = "Pessoal"
        alvoAreaEfeito = "Você"
        duracao = "1 minuto"
        resistencia = "Nenhum"
        descricao = "Como escudo arcano, mas concede CA +5 e imunidade a mísseis mágicos e mísseis mágicos maior."
    },
    @{
        id = "escudo_arcano_supremo"
        nome = "Escudo Arcano Supremo"
        nivel = 5
        tipo = "arcana"
        escola = "Abjuração"
        tempoExecucao = "Ação padrão"
        alcance = "Pessoal"
        alvoAreaEfeito = "Você"
        duracao = "1 minuto"
        resistencia = "Nenhum"
        descricao = "Como escudo arcano, mas concede CA +6 e imunidade total a qualquer tipo de mísseis mágicos."
    },
    @{
        id = "esfera_flamejante_maior"
        nome = "Esfera Flamejante Maior"
        nivel = 4
        tipo = "arcana"
        escola = "Evocação"
        tempoExecucao = "Ação padrão"
        alcance = "30m"
        alvoAreaEfeito = "Esfera de fogo de 1,5m de diâmetro"
        duracao = "1 minuto"
        resistencia = "Reflexos anula"
        descricao = "Como esfera flamejante, mas causa 4d6 pontos de dano de fogo a qualquer criatura que entrar em contato com ela."
    },
    @{
        id = "essencia_caotica_de_nimb"
        nome = "Essência Caótica de Nimb"
        nivel = 7
        tipo = "arcana/divina"
        escola = "Evocação"
        tempoExecucao = "Ação padrão"
        alcance = "9m"
        alvoAreaEfeito = "1 criatura"
        duracao = "1d20 rodadas"
        resistencia = "Nenhum"
        descricao = "Espasmos de essência causam 1d20 pontos de dano por rodada. Rolar 20 permite rolar novamente e somar ao dano. Rolar 1 atinge o próprio conjurador com 1d20."
    },
    @{
        id = "estase"
        nome = "Estase"
        nivel = 7
        tipo = "arcana"
        escola = "Transmutação"
        tempoExecucao = "1 minuto"
        alcance = "Toque"
        alvoAreaEfeito = "1 criatura em repouso ou você"
        duracao = "Permanente ou até condição específica"
        resistencia = "Vontade anula"
        descricao = "Desacelera totalmente o metabolismo colocando o alvo em torpor para sempre sem envelhecer nem sarar, até ser despertado por remover encantamento ou condição específica pré-definida."
    },
    @{
        id = "estase_parcial"
        nome = "Estase Parcial"
        nivel = 3
        tipo = "arcana"
        escola = "Transmutação"
        tempoExecucao = "1 minuto"
        alcance = "Toque"
        alvoAreaEfeito = "1 criatura em repouso ou você"
        duracao = "1 mês ou até ser despertada"
        resistencia = "Vontade anula"
        descricao = "Coloca o alvo em torpor por um mês, curando seus ferimentos como se tivesse dormido apenas um dia. Meios normais podem acordá-lo."
    },
    @{
        id = "estilhacar"
        nome = "Estilhaçar"
        nivel = 4
        tipo = "arcana"
        escola = "Evocação"
        tempoExecucao = "Ação padrão"
        alcance = "15m"
        alvoAreaEfeito = "1 construto ou objeto livre"
        duracao = "Instantânea"
        resistencia = "Vontade reduz à metade / Reflexos anula"
        descricao = "Onda sônica que causa 4d10 pontos de dano a um construto ou objeto (e 2d10 sônico + 2d10 perfuração em quem estiver a até 3m caso seja destruído)."
    },
    @{
        id = "estrepes_magicos"
        nome = "Estrepes Mágicos"
        nivel = 1
        tipo = "arcana"
        escola = "Invocação"
        tempoExecucao = "Ação padrão"
        alcance = "30m"
        alvoAreaEfeito = "Área de quatro quadrados de 1,5m"
        duracao = "1 minuto"
        resistencia = "Nenhum"
        descricao = "Cria estrepes que causam 1 dano e reduzem o deslocamento à metade de quem pisar neles sem armadura pesada (Percepção CD 20 nota)."
    },
    @{
        id = "estrepes_magicos_maior"
        nome = "Estrepes Mágicos Maior"
        nivel = 3
        tipo = "arcana"
        escola = "Ilusão"
        tempoExecucao = "Ação padrão"
        alcance = "30m"
        alvoAreaEfeito = "Área de oito quadrados de 1,5m"
        duracao = "1 minuto"
        resistencia = "Nenhum"
        descricao = "Como estrepes mágicos, mas são invisíveis e cobrem uma área de 8 quadrados de 1,5m."
    },
    @{
        id = "eximio_esportista"
        nome = "Exímio Esportista"
        nivel = 2
        tipo = "arcana"
        escola = "Transmutação"
        tempoExecucao = "Ação padrão"
        alcance = "Toque"
        alvoAreaEfeito = "Você"
        duracao = "1 hora"
        resistencia = "Nenhum"
        descricao = "Concede +4 em testes de Acrobacia, Atletismo e Cavalgar, além de permitir repetir um teste de uma dessas perícias durante a duração escolhendo o melhor."
    },
    @{
        id = "expandir_dominio"
        nome = "Expandir Domínio"
        nivel = 9
        tipo = "arcana"
        escola = "Universal"
        tempoExecucao = "1 dia"
        alcance = "10km"
        alvoAreaEfeito = "Seu domínio arcano"
        duracao = "Especial"
        resistencia = "Nenhum"
        componenteMaterial = "Cristal arcano no valor de 5.000 TO"
        descricao = "Duplica a área de influência de seu domínio arcano criando um domínio secundário contíguo ao principal."
    },
    @{
        id = "faisca_caotica_de_nimb"
        nome = "Faísca Caótica de Nimb"
        nivel = 3
        tipo = "arcana/divina"
        escola = "Evocação"
        tempoExecucao = "Ação de movimento"
        alcance = "9m"
        alvoAreaEfeito = "1 criatura"
        duracao = "1d8 rodadas"
        resistencia = "Nenhum"
        descricao = "Dispara arcos elétricos que causam 1d8 pontos de dano por rodada. Rolar 8 permite rolar novamente e somar ao dano recursivamente."
    },
    @{
        id = "feldspato_fogoso"
        nome = "Feldspato Fogoso"
        nivel = 5
        tipo = "arcana"
        escola = "Evocação"
        tempoExecucao = "Ação padrão"
        alcance = "Toque"
        alvoAreaEfeito = "1 pedra encantada"
        duracao = "1 minuto"
        resistencia = "Reflexos reduz à metade"
        descricao = "Encanta uma pedra para ser arremessada como granada: causa 3d8 dano de corte + 3d8 dano de fogo no alvo direto e a criaturas a até 6m da explosão."
    },
    @{
        id = "festim_dos_mortos"
        nome = "Festim dos Mortos"
        nivel = 2
        tipo = "arcana"
        escola = "Necromancia"
        tempoExecucao = "Ação padrão"
        alcance = "Toque"
        alvoAreaEfeito = "1 carcaça"
        duracao = "1 hora"
        resistencia = "Nenhum"
        descricao = "Permite que mortos-vivos se alimentem da carcaça recuperando todos os PVs e ganhando +2 em jogadas de ataque, dano e testes de resistência por 1 semana."
    },
    @{
        id = "flecha_acida_maior"
        nome = "Flecha Ácida Maior"
        nivel = 5
        tipo = "arcana"
        escola = "Evocação"
        tempoExecucao = "Ação padrão"
        alcance = "30m"
        alvoAreaEfeito = "Flecha ácida"
        duracao = "3 rodadas"
        resistencia = "Nenhum"
        descricao = "Como flecha ácida, mas causa 2d10 pontos de dano imediato e mais 2d10 no início de cada um dos próximos 3 turnos (total 8d10)."
    },
    @{
        id = "fogo_amigo"
        nome = "Fogo Amigo"
        nivel = 2
        tipo = "arcana"
        escola = "Abjuração"
        tempoExecucao = "Ação padrão"
        alcance = "9m"
        alvoAreaEfeito = "Até 5 criaturas"
        duracao = "1 hora"
        resistencia = "Nenhum"
        descricao = "Os aliados protegidos ignoram qualquer dano ou efeito nocivo causado pelas outras magias do conjurador."
    },
    @{
        id = "fumos_negros"
        nome = "Fumos Negros"
        nivel = 6
        tipo = "arcana/divina"
        escola = "Evocação"
        tempoExecucao = "Ação padrão"
        alcance = "9m"
        alvoAreaEfeito = "Explosão em cone"
        duracao = "Instantânea"
        resistencia = "Reflexos ou Fortitude parcial"
        descricao = "Cone de fumaça ácida e venenosa: 8d8 pontos de dano de ácido (Reflexos reduz à metade) e 1d6 pontos de dano de Constituição (Fortitude anula)."
    },
    @{
        id = "gala"
        nome = "Galã"
        nivel = 2
        tipo = "arcana"
        escola = "Ilusão"
        tempoExecucao = "Ação padrão"
        alcance = "Pessoal"
        alvoAreaEfeito = "Você"
        duracao = "10 minutos"
        resistencia = "Nenhum"
        componenteMaterial = "Perfume, flores e caixa de gorad no valor de 10 TO"
        descricao = "Seu Carisma torna-se 18 (ou +2 se já for 18+) e você recebe +4 em Diplomacia e Enganação contra quem possa sentir atração física por você."
    },
    @{
        id = "gato_fiel"
        nome = "Gato Fiel"
        nivel = 5
        tipo = "arcana"
        escola = "Invocação"
        tempoExecucao = "Ação padrão"
        alcance = "9m"
        alvoAreaEfeito = "Gato fantasmagórico invisível"
        duracao = "Permanente até ser descarregada, então 1 min"
        resistencia = "Nenhum"
        componenteMaterial = "Caixa de prata com erva de gato no valor de 500 TO"
        descricao = "Invoca gato invisível que vigia a área: avisa silenciosamente intrusos, acorda aliados, chia impondo –2 em testes de inimigos e arranha agressores (+15 ataque, 1d6 dano)."
    },
    @{
        id = "gato_negro"
        nome = "Gato Negro"
        nivel = 2
        tipo = "arcana"
        escola = "Ilusão"
        tempoExecucao = "Ação padrão"
        alcance = "9m"
        alvoAreaEfeito = "1 criatura"
        duracao = "1 hora"
        resistencia = "Nenhum"
        descricao = "Gato de sombras furtivo segue um alvo (CD 40 de Percepção para notar). Pode retornar e reproduzir o caminho seguido ou receber clarividência através dele."
    },
    @{
        id = "ideia"
        nome = "Ideia"
        nivel = 4
        tipo = "arcana"
        escola = "Adivinhação"
        tempoExecucao = "Ação padrão"
        alcance = "Pessoal"
        alvoAreaEfeito = "Você"
        duracao = "Instantânea"
        resistencia = "Nenhum"
        descricao = "O mestre fornece uma pista relevante ou linha de ação sobre uma situação específica ou enigma que o conjurador esteja enfrentando."
    },
    @{
        id = "invisibilidade_suprema"
        nome = "Invisibilidade Suprema"
        nivel = 8
        tipo = "arcana"
        escola = "Ilusão"
        tempoExecucao = "Ação padrão"
        alcance = "Pessoal ou toque"
        alvoAreaEfeito = "Você ou 1 criatura de até 100kg"
        duracao = "1 minuto"
        resistencia = "Nenhum"
        descricao = "Como invisibilidade maior, mas disfarça qualquer odor corporal (imunidade a faro) e bloqueia totalmente magias de adivinhação (exceto visão suprema)."
    },
    @{
        id = "invocacao_arriscada"
        nome = "Invocação Arriscada"
        nivel = 4
        tipo = "arcana"
        escola = "Invocação"
        tempoExecucao = "Ação de movimento"
        alcance = "Pessoal"
        alvoAreaEfeito = "Você"
        duracao = "1 minuto"
        resistencia = "Nenhum"
        descricao = "Criaturas invocadas por invocar monstro recebem +2 em ataque, dano, CA e testes de resistência, mas a cada rodada o arcano deve passar em Carisma (CD 10 + nível da magia) ou a criatura ataca o conjurador."
    },
    @{
        id = "jogo_justo"
        nome = "Jogo Justo"
        nivel = 5
        tipo = "arcana/divina"
        escola = "Abjuração"
        tempoExecucao = "Ação padrão"
        alcance = "9m"
        alvoAreaEfeito = "1 criatura"
        duracao = "1 minuto"
        resistencia = "Vontade anula"
        descricao = "Todos os itens mágicos do alvo tornam-se versões mundanas por 1 minuto. A cada rodada, um teste de Vontade bem-sucedido recupera um item à escolha dele (Arcana 5 / Divina 6)."
    },
    @{
        id = "lacaio_armadilha"
        nome = "Lacaio-Armadilha"
        nivel = 5
        tipo = "arcana"
        escola = "Evocação"
        tempoExecucao = "Ação padrão"
        alcance = "Toque"
        alvoAreaEfeito = "1 lacaio vivo"
        duracao = "Permanente até ser ativada"
        resistencia = "Vontade anula / Reflexos parcial"
        componenteMaterial = "Pó de enxofre no valor de 10 TO por nível do alvo"
        descricao = "Encanta um servo para que, ao ser reduzido a 0 PV, exploda causando 1d6 de dano de fogo por nível do lacaio a todas as criaturas a até 3m."
    },
    @{
        id = "lamina_afiada_em_massa"
        nome = "Lâmina Afiada em Massa"
        nivel = 6
        tipo = "arcana"
        escola = "Transmutação"
        tempoExecucao = "Ação padrão"
        alcance = "9m"
        alvoAreaEfeito = "Até 5 armas"
        duracao = "1 hora"
        resistencia = "Nenhum"
        descricao = "Como lâmina afiada (dobra margem de ameaça), mas afeta até cinco armas simultaneamente."
    },
    @{
        id = "lamina_afiada_suprema"
        nome = "Lâmina Afiada Suprema"
        nivel = 8
        tipo = "arcana"
        escola = "Transmutação"
        tempoExecucao = "Ação padrão"
        alcance = "Toque"
        alvoAreaEfeito = "1 arma"
        duracao = "1 hora"
        resistencia = "Nenhum"
        descricao = "A arma tem sua margem de ameaça dobrada e recebe o poder vorpal (ao rolar 20 natural no ataque, decepa a cabeça do oponente, matando-o instantaneamente)."
    },
    @{
        id = "lamina_invisivel"
        nome = "Lâmina Invisível"
        nivel = 4
        tipo = "arcana"
        escola = "Evocação"
        tempoExecucao = "Ação padrão"
        alcance = "12m"
        alvoAreaEfeito = "Lâmina de ar"
        duracao = "1 minuto"
        resistencia = "Nenhum"
        descricao = "Cria lâmina de ar no antebraço: com ação padrão faz ataque de toque à distância até 12m causando 4d8 + mod Int/Car pontos de dano de corte com crítico 18-20."
    },
    @{
        id = "lamina_invisivel_maior"
        nome = "Lâmina Invisível Maior"
        nivel = 6
        tipo = "arcana"
        escola = "Evocação"
        tempoExecucao = "Ação padrão"
        alcance = "18m"
        alvoAreaEfeito = "Lâmina de ar"
        duracao = "1 minuto"
        resistencia = "Nenhum"
        descricao = "Como lâmina invisível, mas com alcance de 18m, dano 6d8 + mod Int/Car e crítico 17-20."
    },
    @{
        id = "lamina_invisivel_menor"
        nome = "Lâmina Invisível Menor"
        nivel = 2
        tipo = "arcana"
        escola = "Evocação"
        tempoExecucao = "Ação padrão"
        alcance = "6m"
        alvoAreaEfeito = "Lâmina de ar"
        duracao = "1 minuto"
        resistencia = "Nenhum"
        descricao = "Como lâmina invisível, mas com alcance de 6m, dano 2d8 + mod Int/Car e crítico 19-20."
    },
    @{
        id = "levitacao_em_massa"
        nome = "Levitação em Massa"
        nivel = 5
        tipo = "arcana"
        escola = "Transmutação"
        tempoExecucao = "Ação padrão"
        alcance = "9m"
        alvoAreaEfeito = "Até 5 criaturas ou objetos de até 200kg"
        duracao = "1 minuto"
        resistencia = "Nenhum"
        descricao = "Como levitação, mas afeta até cinco criaturas voluntárias ou objetos livres simultaneamente."
    },
    @{
        id = "lingua_louca"
        nome = "Língua Louca"
        nivel = 2
        tipo = "arcana"
        escola = "Ilusão"
        tempoExecucao = "Ação padrão"
        alcance = "9m"
        alvoAreaEfeito = "Até 5 criaturas"
        duracao = "1 hora"
        resistencia = "Nenhum"
        descricao = "A comunicação entre as criaturas afetadas é embaralhada para os outros ao redor, que apenas escutam sons incompreensíveis."
    },
    @{
        id = "manopla_de_trevas"
        nome = "Manopla de Trevas"
        nivel = 3
        tipo = "arcana"
        escola = "Necromancia"
        tempoExecucao = "Ação completa"
        alcance = "Pessoal"
        alvoAreaEfeito = "Você"
        duracao = "1 dia"
        resistencia = "Nenhum"
        descricao = "Manoplas de sombras que causam 5 pontos de dano de energia negativa por toque (acumula com magias de toque), curando você em 1 PV temporário por dano causado."
    },
    @{
        id = "mapear"
        nome = "Mapear"
        nivel = 2
        tipo = "arcana"
        escola = "Adivinhação"
        tempoExecucao = "1 minuto"
        alcance = "Toque"
        alvoAreaEfeito = "1 pergaminho"
        duracao = "1 minuto"
        resistencia = "Nenhum"
        descricao = "Uma fagulha queima o pergaminho desenhando um mapa da região circundante (quadrado de até 10km de lado ou planta do andar atual de uma masmorra/castelo)."
    },
    @{
        id = "medo_do_escuro"
        nome = "Medo do Escuro"
        nivel = 3
        tipo = "arcana/divina"
        escola = "Necromancia"
        tempoExecucao = "Ação padrão"
        alcance = "9m"
        alvoAreaEfeito = "1 criatura"
        duracao = "1 minuto"
        resistencia = "Vontade anula"
        descricao = "Alvo sofre –3 na CA e testes de resistência contra oponentes camuflados ou escondidos, e fica abalado se deixado em escuridão completa."
    },
    @{
        id = "meteorito_de_vectorius"
        nome = "Meteorito de Vectorius"
        nivel = 1
        tipo = "arcana"
        escola = "Invocação"
        tempoExecucao = "Ação completa"
        alcance = "90m"
        alvoAreaEfeito = "Pequeno meteorito"
        duracao = "Instantânea"
        resistencia = "Reflexos reduz à metade"
        descricao = "Invoca uma pedra do céu que cai na rodada seguinte causando 4d20 pontos de dano a qualquer criatura no ponto de impacto (com leve desvio em 1d10). Apenas a céu aberto."
    },
    @{
        id = "misseis_magicos_maior"
        nome = "Mísseis Mágicos Maior"
        nivel = 3
        tipo = "arcana"
        escola = "Evocação"
        tempoExecucao = "Ação padrão"
        alcance = "30m"
        alvoAreaEfeito = "Até 3 criaturas"
        duracao = "Instantânea"
        resistencia = "Nenhum"
        descricao = "Dispara três setas certeiras de energia pura causando 1d6+2 pontos de dano com cada uma."
    },
    @{
        id = "misseis_magicos_supremo"
        nome = "Mísseis Mágicos Supremo"
        nivel = 5
        tipo = "arcana"
        escola = "Evocação"
        tempoExecucao = "Ação padrão"
        alcance = "30m"
        alvoAreaEfeito = "Até 4 criaturas"
        duracao = "Instantânea"
        resistencia = "Nenhum"
        descricao = "Dispara quatro setas certeiras de energia pura causando 1d8+3 pontos de dano com cada uma."
    },
    @{
        id = "montaria_fantasmagorica_maior"
        nome = "Montaria Fantasmagórica Maior"
        nivel = 7
        tipo = "arcana"
        escola = "Invocação"
        tempoExecucao = "Ação completa"
        alcance = "9m"
        alvoAreaEfeito = "1 criatura"
        duracao = "1 dia"
        resistencia = "Nenhum"
        descricao = "Cria um grifo negro cinzento (CA, PV e resistências iguais aos seus, deslocamento 18m voando ou por terra, carrega até 300kg)."
    },
    @{
        id = "muralha_de_relampagos"
        nome = "Muralha de Relâmpagos"
        nivel = 8
        tipo = "arcana"
        escola = "Abjuração"
        tempoExecucao = "Ação padrão"
        alcance = "30m"
        alvoAreaEfeito = "Cortina de 60m de comprimento e 9m de altura"
        duracao = "Concentração + 1 minuto, até 1 hora"
        resistencia = "Reflexos reduz à metade"
        descricao = "Muralha elétrica que atinge com relâmpago (6d6 de dano) quem se aproxima a até 15m e dispara 3 relâmpagos em quem a atravessa."
    },
    @{
        id = "muralha_sonica"
        nome = "Muralha Sônica"
        nivel = 4
        tipo = "arcana"
        escola = "Abjuração"
        tempoExecucao = "Ação padrão"
        alcance = "30m"
        alvoAreaEfeito = "Barreira invisível de 60m x 6m"
        duracao = "Concentração + 1 minuto, até 1 hora"
        resistencia = "Fortitude parcial"
        descricao = "Barreira sônica invisível: quem a atravessar sofre 4d10 pontos de dano sônico e fica surdo por 1 minuto (metade do dano e surdez por 1 rodada se passar em Fortitude)."
    },
    @{
        id = "muralha_de_trevas"
        nome = "Muralha de Trevas"
        nivel = 6
        tipo = "arcana"
        escola = "Abjuração"
        tempoExecucao = "Ação padrão"
        alcance = "30m"
        alvoAreaEfeito = "Cortina de 60m x 6m"
        duracao = "Concentração + 1 minuto, até 1 hora"
        resistencia = "Vontade parcial"
        descricao = "Muralha de escuridão impenetrável: criaturas que passarem sofrem 1d4+1 níveis negativos por 1 hora e ficam cegas por 1 minuto."
    },
    @{
        id = "paradoxo_dos_gemeos"
        nome = "Paradoxo dos Gêmeos"
        nivel = 7
        tipo = "arcana"
        escola = "Transmutação"
        tempoExecucao = "Ação padrão"
        alcance = "Pessoal"
        alvoAreaEfeito = "Você"
        duracao = "Instantânea"
        resistencia = "Nenhum"
        descricao = "Na rodada seguinte duas cópias suas de realidades paralelas surgem e lançam uma magia diferente cada uma antes de desaparecerem. Envelhece você em 1 mês."
    },
    @{
        id = "peconha_caotica_de_nimb"
        nome = "Peçonha Caótica de Nimb"
        nivel = 5
        tipo = "arcana/divina"
        escola = "Evocação"
        tempoExecucao = "Ação padrão"
        alcance = "9m"
        alvoAreaEfeito = "1 criatura"
        duracao = "1d12 rodadas"
        resistencia = "Nenhum"
        descricao = "Causa 1d12 pontos de dano de veneno a cada rodada. Rolar 12 permite rolar novamente e somar ao dano recursivamente."
    },
    @{
        id = "perecer_preservar"
        nome = "Perecer/Preservar"
        nivel = 5
        tipo = "arcana"
        escola = "Transmutação"
        tempoExecucao = "1 minuto"
        alcance = "Toque"
        alvoAreaEfeito = "1 objeto orgânico não vivo de até 1.000kg"
        duracao = "Instantânea / 1 ano"
        resistencia = "Nenhum"
        descricao = "Perecer apodrece matéria orgânica instantaneamente. Preservar torna matéria orgânica imune à ação do tempo por 1 ano."
    },
    @{
        id = "porta_dimensional_menor"
        nome = "Porta Dimensional Menor"
        nivel = 3
        tipo = "arcana"
        escola = "Invocação"
        tempoExecucao = "Ação de movimento"
        alcance = "15m"
        alvoAreaEfeito = "Você"
        duracao = "Instantânea"
        resistencia = "Nenhum"
        descricao = "Teletransporta o conjurador como uma ação de movimento para qualquer ponto visível e desobstruído a até 15m."
    },
    @{
        id = "polvo_humanoide"
        nome = "Polvo Humanoide"
        nivel = 4
        tipo = "arcana"
        escola = "Transmutação"
        tempoExecucao = "Ação padrão"
        alcance = "Pessoal"
        alvoAreaEfeito = "Você"
        duracao = "1 minuto"
        resistencia = "Nenhum"
        descricao = "Faz brotar 4 braços extras: +4 em Atletismo para escalar/nadar, combate com duas armas com penalidade de apenas –2 e mãos livres para manipular itens e magias."
    },
    @{
        id = "portal_para_o_saber"
        nome = "Portal para o Saber"
        nivel = 4
        tipo = "arcana"
        escola = "Invocação"
        tempoExecucao = "Ação padrão"
        alcance = "30m"
        alvoAreaEfeito = "Portal planar"
        duracao = "1 minuto"
        resistencia = "Nenhum"
        descricao = "Abre um portal planar que conecta diretamente a área à entrada da Grande Academia Arcana."
    },
    @{
        id = "procrastinar_ferimentos"
        nome = "Procrastinar Ferimentos"
        nivel = 4
        tipo = "arcana"
        escola = "Transmutação"
        tempoExecucao = "Ação padrão"
        alcance = "Pessoal"
        alvoAreaEfeito = "Você"
        duracao = "1d4+1 rodadas"
        resistencia = "Fortitude reduz à metade"
        descricao = "Todo dano sofrido durante a magia é desviado para uma dimensão paralela. Ao fim da duração, o conjurador recebe todo o dano acumulado de uma vez (ou metade se passar em Fortitude)."
    },
    @{
        id = "protecao_contra_flechas_maior"
        nome = "Proteção contra Flechas Maior"
        nivel = 4
        tipo = "arcana"
        escola = "Abjuração"
        tempoExecucao = "Ação padrão"
        alcance = "Toque"
        alvoAreaEfeito = "1 criatura"
        duracao = "12 horas ou até ser descarregada"
        resistencia = "Nenhum"
        descricao = "Absorve até 70 pontos de dano por ataques à distância e, quando absorve todo o dano de um ataque, reflete o projétil contra o atacante."
    },
    @{
        id = "protecao_contra_raios"
        nome = "Proteção contra Raios"
        nivel = 3
        tipo = "arcana"
        escola = "Abjuração"
        tempoExecucao = "Ação padrão"
        alcance = "Toque"
        alvoAreaEfeito = "1 criatura"
        duracao = "12 horas ou até ser descarregada"
        resistencia = "Nenhum"
        descricao = "Concede imunidade contra magias do tipo raio ou que exijam ataques de toque à distância, absorvendo até 10 níveis de magia."
    },
    @{
        id = "raio_de_acido_maior"
        nome = "Raio de Ácido Maior"
        nivel = 2
        tipo = "arcana"
        escola = "Evocação"
        tempoExecucao = "Ação padrão"
        alcance = "15m"
        alvoAreaEfeito = "Raio"
        duracao = "1 rodada"
        resistencia = "Reflexos"
        descricao = "Causa 2d8 pontos de dano de ácido imediatos e 1d8 na rodada seguinte. Danifica armaduras reduzindo CA em 1."
    },
    @{
        id = "raio_de_acido_supremo"
        nome = "Raio de Ácido Supremo"
        nivel = 4
        tipo = "arcana"
        escola = "Evocação"
        tempoExecucao = "Ação padrão"
        alcance = "30m"
        alvoAreaEfeito = "Raio"
        duracao = "1 rodada"
        resistencia = "Reflexos"
        descricao = "Causa 4d8 pontos de dano de ácido imediatos e 2d8 na rodada seguinte. Danifica armaduras reduzindo CA em 2."
    },
    @{
        id = "raio_fardo"
        nome = "Raio-Fardo"
        nivel = 5
        tipo = "arcana"
        escola = "Transmutação"
        tempoExecucao = "Ação padrão"
        alcance = "90m"
        alvoAreaEfeito = "1 criatura"
        duracao = "1 minuto"
        resistencia = "Veja texto"
        descricao = "Multiplica a gravidade do alvo: criaturas voadoras caem sofrendo 1d6 dano por 1,5m de queda (até 40d6), criaturas em solo sofrem penalidades em ataque e deslocamento."
    },
    @{
        id = "raio_gosmento"
        nome = "Raio Gosmento"
        nivel = 2
        tipo = "arcana"
        escola = "Invocação"
        tempoExecucao = "Ação padrão"
        alcance = "30m"
        alvoAreaEfeito = "Raio de gosma"
        duracao = "Instantânea"
        resistencia = "Reflexos anula"
        descricao = "Ataque de toque à distância que enreda o alvo por 1 minuto (–2 ataque, –4 Des, metade do deslocamento, Vontade CD 10 + nível para lançar magias)."
    },
    @{
        id = "raio_gravitacional"
        nome = "Raio Gravitacional"
        nivel = 4
        tipo = "arcana"
        escola = "Transmutação"
        tempoExecucao = "Ação padrão"
        alcance = "30m"
        alvoAreaEfeito = "Raio"
        duracao = "Instantânea"
        resistencia = "Nenhum"
        descricao = "Ataque de toque à distância que distorce a gravidade causando implosão e 6d8 pontos de dano no alvo atingido."
    },
    @{
        id = "raio_sonico"
        nome = "Raio Sônico"
        nivel = 4
        tipo = "arcana"
        escola = "Evocação"
        tempoExecucao = "Ação padrão"
        alcance = "30m"
        alvoAreaEfeito = "Raio"
        duracao = "Instantânea"
        resistencia = "Nenhum"
        descricao = "Ataque de toque à distância que causa 8d4 pontos de dano sônico e deixa a vítima atordoada por 1d3–1 rodadas."
    },
    @{
        id = "reduzir_defesas"
        nome = "Reduzir Defesas"
        nivel = 2
        tipo = "arcana"
        escola = "Transmutação"
        tempoExecucao = "Ação padrão"
        alcance = "30m"
        alvoAreaEfeito = "1 criatura"
        duracao = "1 hora"
        resistencia = "Vontade parcial"
        descricao = "Redução de dano e resistências a energia são reduzidas em 5 pontos por 1 hora (1 rodada se passar em Vontade)."
    },
    @{
        id = "relampago_flamejante_de_reynard"
        nome = "Relâmpago Flamejante de Reynard"
        nivel = 7
        tipo = "arcana"
        escola = "Evocação"
        tempoExecucao = "2 rodadas"
        alcance = "30m"
        alvoAreaEfeito = "Linha"
        duracao = "1 minuto ou até consumido"
        resistencia = "Reflexos reduz à metade"
        descricao = "Prepara chamas e relâmpagos nas mãos: pode disparar rajada de fogo (6d12) ou relâmpago (6d12), ou ambas juntas como rajada mista (12d12)."
    },
    @{
        id = "remover_da_realidade"
        nome = "Remover da Realidade"
        nivel = 9
        tipo = "arcana"
        escola = "Transmutação"
        tempoExecucao = "Ação livre"
        alcance = "9m"
        alvoAreaEfeito = "1 criatura de nível igual ou menor, ou objeto Enorme"
        duracao = "1d3 rodadas"
        resistencia = "Nenhum"
        descricao = "Remove completamente o alvo da realidade e do Plano por 1d3 rodadas, retornando exatamente na mesma posição e condição."
    },
    @{
        id = "reparar_objetos"
        nome = "Reparar Objetos"
        nivel = 3
        tipo = "arcana"
        escola = "Transmutação"
        tempoExecucao = "Ação padrão"
        alcance = "Toque"
        alvoAreaEfeito = "1 objeto Enorme ou menor"
        duracao = "Instantânea"
        resistencia = "Nenhum"
        descricao = "Repara completamente um objeto mundano quebrado ou restaura 20 PV de um construto."
    },
    @{
        id = "reparar_objetos_maior"
        nome = "Reparar Objetos Maior"
        nivel = 7
        tipo = "arcana"
        escola = "Transmutação"
        tempoExecucao = "Ação padrão"
        alcance = "Toque"
        alvoAreaEfeito = "1 objeto de qualquer tamanho"
        duracao = "Instantânea"
        resistencia = "Nenhum"
        descricao = "Como reparar objetos, mas afeta objetos mágicos e restaura 100 PV a construtos (podendo até recuperar um construto destruído com 1 PV)."
    },
    @{
        id = "retirada_estrategica"
        nome = "Retirada Estratégica"
        nivel = 1
        tipo = "arcana"
        escola = "Transmutação"
        tempoExecucao = "Ação livre"
        alcance = "Pessoal"
        alvoAreaEfeito = "Você"
        duracao = "1 minuto"
        resistencia = "Nenhum"
        descricao = "Seu deslocamento aumenta em +9m enquanto estiver se movendo na direção oposta de criaturas hostis."
    },
    @{
        id = "reverter_magia_menor"
        nome = "Reverter Magia Menor"
        nivel = 4
        tipo = "arcana"
        escola = "Abjuração"
        tempoExecucao = "Ação padrão"
        alcance = "Pessoal"
        alvoAreaEfeito = "Você"
        duracao = "1 hora ou até descarregada"
        resistencia = "Nenhum"
        descricao = "Como reverter magia, mas permite reverter até 1d4+2 níveis de magia contra o atacante."
    },
    @{
        id = "servo_invisivel_maior"
        nome = "Servo Invisível Maior"
        nivel = 4
        tipo = "arcana"
        escola = "Invocação"
        tempoExecucao = "Ação padrão"
        alcance = "9m"
        alvoAreaEfeito = "Servos invisíveis"
        duracao = "1 dia"
        resistencia = "Nenhum"
        descricao = "Conjura 10 servos invisíveis para tarefas simples de rotina, ou 1 servo invisível capaz de tarefas complexas (+15 em todas as perícias, +2 em pesquisas/laboratório)."
    },
    @{
        id = "simbolo_de_sangue"
        nome = "Símbolo de Sangue"
        nivel = 4
        tipo = "arcana/divina"
        escola = "Necromancia"
        tempoExecucao = "10 minutos"
        alcance = "Toque"
        alvoAreaEfeito = "Runa mágica"
        duracao = "Permanente até ativada, então 1 hora"
        resistencia = "Fortitude parcial"
        componenteMaterial = "Pó de pedras preciosas no valor de 100 TO"
        descricao = "Runa ativada faz criaturas a até 18m sangrarem pelos olhos e nariz perdendo 1 PV por nível a cada rodada (ou a cada 2 rodadas com sucesso em Fortitude)."
    },
    @{
        id = "super_arcano"
        nome = "Super-Arcano"
        nivel = 9
        tipo = "arcana"
        escola = "Transmutação"
        tempoExecucao = "10 minutos"
        alcance = "Pessoal"
        alvoAreaEfeito = "Você"
        duracao = "1 hora"
        resistencia = "Nenhum"
        componenteMaterial = "Pedaço de meteorito no valor de 1.000 TO"
        descricao = "Concede voo 18m, redução de dano 10 e capacidade de disparar sopro de gelo (como cone glacial) ou visão de calor (como raio ardente) com ação padrão (recarga 1d4 rodadas)."
    },
    @{
        id = "teletransporte_ilusorio"
        nome = "Teletransporte Ilusório"
        nivel = 4
        tipo = "arcana"
        escola = "Ilusão"
        tempoExecucao = "Ação padrão"
        alcance = "Toque"
        alvoAreaEfeito = "1 criatura"
        duracao = "1 hora"
        resistencia = "Vontade anula"
        descricao = "O alvo acredita ter sido teletransportado para uma área inóspita e perigosa (geleira, vulcão, fundo do mar), reagindo e podendo ferir-se ou desmaiar se 'morrer' na ilusão."
    },
    @{
        id = "toque_chocante_maior"
        nome = "Toque Chocante Maior"
        nivel = 3
        tipo = "arcana"
        escola = "Evocação"
        tempoExecucao = "Ação padrão"
        alcance = "Toque"
        alvoAreaEfeito = "1 criatura"
        duracao = "Instantânea"
        resistencia = "Nenhum"
        descricao = "Como toque chocante, mas causa 4d8 pontos de dano elétrico (+6 no ataque se o alvo usar armadura ou metal)."
    },
    @{
        id = "toque_da_entropia"
        nome = "Toque da Entropia"
        nivel = 9
        tipo = "arcana"
        escola = "Necromancia"
        tempoExecucao = "Ação padrão"
        alcance = "Toque"
        alvoAreaEfeito = "1 criatura"
        duracao = "Instantânea"
        resistencia = "Fortitude anula / Vontade parcial"
        descricao = "O toque parte todos os ossos do corpo do alvo de forma instantânea: o corpo colapsa e morre em agonia (aliados da vítima devem passar em Vontade ou ficam apavorados)."
    },
    @{
        id = "toque_do_inumano"
        nome = "Toque do Inumano"
        nivel = 4
        tipo = "arcana"
        escola = "Necromancia"
        tempoExecucao = "Ação padrão"
        alcance = "Toque"
        alvoAreaEfeito = "Você"
        duracao = "1 minuto"
        resistencia = "Nenhum"
        descricao = "Toques transmitem 1 nível negativo a criaturas vivas por 1 hora, concedendo 5 PV temporários ao conjurador por nível drenado."
    },
    @{
        id = "toque_da_mumia"
        nome = "Toque da Múmia"
        nivel = 7
        tipo = "arcana"
        escola = "Necromancia"
        tempoExecucao = "Ação padrão"
        alcance = "Toque"
        alvoAreaEfeito = "Até 5 criaturas dentro de 9m"
        duracao = "Instantânea"
        resistencia = "Fortitude anula"
        descricao = "Transmite a doença podridão da múmia (1d6 dano de Con imediato e diário) ao alvo tocado e a até 4 outras criaturas a até 9m dele."
    },
    @{
        id = "toque_do_nada"
        nome = "Toque do Nada"
        nivel = 3
        tipo = "arcana"
        escola = "Encantamento"
        tempoExecucao = "Ação padrão"
        alcance = "Toque"
        alvoAreaEfeito = "1 criatura"
        duracao = "1 minuto"
        resistencia = "Vontade anula"
        descricao = "Isola a mente do alvo de seu corpo: perde os cinco sentidos (cegueira, surdez, sem tato/paladar/olfato), 50% de chance de soltar objetos ou errar ataques, e –8 em testes de Força e Destreza."
    },
    @{
        id = "traicao_magica"
        nome = "Traição Mágica"
        nivel = 3
        tipo = "arcana"
        escola = "Evocação"
        tempoExecucao = "Ação padrão"
        alcance = "9m"
        alvoAreaEfeito = "1 criatura"
        duracao = "Instantânea"
        resistencia = "Nenhum"
        descricao = "Torna instáveis as magias ativas no alvo: causa 1d8 pontos de dano de essência para cada nível somado de magias ativas afetando-o."
    },
    @{
        id = "tranquilidade_impassivel"
        nome = "Tranquilidade Impassível"
        nivel = 3
        tipo = "arcana"
        escola = "Encantamento"
        tempoExecucao = "Ação padrão"
        alcance = "Toque"
        alvoAreaEfeito = "1 criatura"
        duracao = "1 minuto"
        resistencia = "Nenhum"
        descricao = "Concede +10 em testes de Vontade para lançar magias e imunidade a medo e qualquer manipulação de emoções."
    },
    @{
        id = "transferir_culpa"
        nome = "Transferir Culpa"
        nivel = 3
        tipo = "arcana"
        escola = "Encantamento"
        tempoExecucao = "Reação"
        alcance = "9m"
        alvoAreaEfeito = "1 criatura inteligente"
        duracao = "Instantânea"
        resistencia = "Vontade anula"
        descricao = "Como reação ao ser pego fazendo algo indevido, convence o observador de que a culpa é de outra pessoa presente no encontro."
    },
    @{
        id = "transmutar_metais"
        nome = "Transmutar Metais"
        nivel = 5
        tipo = "arcana"
        escola = "Transmutação"
        tempoExecucao = "Ação padrão"
        alcance = "Toque"
        alvoAreaEfeito = "1 objeto"
        duracao = "Permanente"
        resistencia = "Nenhum"
        custoXp = "100 XP"
        componenteMaterial = "Pedra filosofal (não consumida)"
        descricao = "Transforma 1 kg de qualquer metal em 1 kg de cobre, prata ou ouro."
    },
    @{
        id = "transmutar_metais_maior"
        nome = "Transmutar Metais Maior"
        nivel = 9
        tipo = "arcana"
        escola = "Transmutação"
        tempoExecucao = "Ação padrão"
        alcance = "Toque"
        alvoAreaEfeito = "1 objeto"
        duracao = "Permanente"
        resistencia = "Nenhum"
        custoXp = "200 XP"
        componenteMaterial = "Pedra filosofal (não consumida)"
        descricao = "Como transmutar metais, mas transforma 1 kg de qualquer metal em metais especiais como aço-rubi, adamante ou mitral."
    },
    @{
        id = "velocidade_do_relampago"
        nome = "Velocidade do Relâmpago"
        nivel = 8
        tipo = "arcana"
        escola = "Evocação"
        tempoExecucao = "Ação padrão"
        alcance = "Pessoal"
        alvoAreaEfeito = "Você"
        duracao = "1 minuto"
        resistencia = "Reflexos parcial"
        descricao = "Permite teletransportar-se até 12m com ação de movimento deixando rastro elétrico que causa 6d6 de dano de eletricidade a quem estiver no caminho."
    },
    @{
        id = "vento_dilacerador"
        nome = "Vento Dilacerador"
        nivel = 6
        tipo = "arcana"
        escola = "Evocação"
        tempoExecucao = "Ação padrão"
        alcance = "18m"
        alvoAreaEfeito = "Explosão em cone"
        duracao = "Instantânea"
        resistencia = "Reflexos parcial"
        descricao = "Cone de vento cortante em alta velocidade: causa 8d8 pontos de dano e empurra até o limite do cone e derruba alvos que falhem no teste (4d8 e caem se passarem)."
    },
    @{
        id = "viagem_no_tempo"
        nome = "Viagem no Tempo"
        nivel = 9
        tipo = "arcana"
        escola = "Transmutação"
        tempoExecucao = "Ação completa"
        alcance = "Toque"
        alvoAreaEfeito = "Até 5 criaturas Médias"
        duracao = "Instantânea"
        resistencia = "Nenhum"
        custoXp = "1.000 XP"
        descricao = "Transporta o conjurador e até quatro aliados de mãos dadas para qualquer ponto do passado ou futuro de Arton."
    },
    @{
        id = "vinganca_final"
        nome = "Vingança Final"
        nivel = 9
        tipo = "arcana"
        escola = "Evocação"
        tempoExecucao = "Ação padrão"
        alcance = "Pessoal"
        alvoAreaEfeito = "Você"
        duracao = "Permanente até ser descarregada"
        resistencia = "Reflexos parcial"
        descricao = "Ao ser reduzido a 0 PV ou com comando mental, o conjurador é consumido por um buraco negro que explode causando 20d6 dano de essência em 60m de raio (não pode ser revivido exceto por desejo ou milagre)."
    },
    @{
        id = "visao_do_cacador"
        nome = "Visão do Caçador"
        nivel = 3
        tipo = "arcana"
        escola = "Transmutação"
        tempoExecucao = "Ação padrão"
        alcance = "Pessoal"
        alvoAreaEfeito = "Você"
        duracao = "1 hora"
        resistencia = "Nenhum"
        descricao = "Visão infravermelha: detecta criaturas por calor, ignora camuflagem e invisibilidade, concede +5 em Percepção visual, +5 em Sobrevivência para rastrear e +2 em jogadas de ataque."
    },
    @{
        id = "visao_no_escuro_em_massa"
        nome = "Visão no Escuro em Massa"
        nivel = 5
        tipo = "arcana"
        escola = "Transmutação"
        tempoExecucao = "Ação padrão"
        alcance = "Toque"
        alvoAreaEfeito = "Até 5 criaturas"
        duracao = "1 hora"
        resistencia = "Nenhum"
        descricao = "Como visão no escuro, mas afeta até cinco criaturas simultaneamente."
    },
    @{
        id = "visao_suprema"
        nome = "Visão Suprema"
        nivel = 8
        tipo = "arcana/divina"
        escola = "Adivinhação"
        tempoExecucao = "Ação padrão"
        alcance = "Toque"
        alvoAreaEfeito = "1 criatura"
        duracao = "1 hora"
        resistencia = "Nenhum"
        descricao = "Vê a forma real de todas as coisas: enxerga através de escuridão mágica, ilusões e transformações, +15 em Percepção visual, quadruplica alcance da visão e dobra incremento de distância."
    },
    @{
        id = "voltar_no_tempo"
        nome = "Voltar no Tempo"
        nivel = 3
        tipo = "arcana"
        escola = "Transmutação"
        tempoExecucao = "Ação padrão"
        alcance = "Pessoal"
        alvoAreaEfeito = "Você"
        duracao = "Instantânea"
        resistencia = "Nenhum"
        custoXp = "100 XP"
        descricao = "Volta no tempo para qualquer momento dos últimos 10 minutos para refazer uma ação (não utilizável em combate)."
    },
    @{
        id = "voltar_no_tempo_maior"
        nome = "Voltar no Tempo Maior"
        nivel = 5
        tipo = "arcana"
        escola = "Transmutação"
        tempoExecucao = "Ação padrão"
        alcance = "Toque"
        alvoAreaEfeito = "Até 5 criaturas voluntárias"
        duracao = "Instantânea"
        resistencia = "Nenhum"
        custoXp = "400 XP"
        descricao = "Volta no tempo até 1 hora com aliados, ou volta 1 rodada inteira no combate para refazer as ações sabendo o que os inimigos farão."
    }
)

$adicionados = 0
foreach ($m in $arcanoMagias2) {
    if (-not $existingMap.ContainsKey($m.id)) {
        $existing += [PSCustomObject]$m
        $existingMap[$m.id] = $m
        $adicionados++
    }
}

$existing = $existing | Sort-Object id
$json = $existing | ConvertTo-Json -Depth 5
[System.IO.File]::WriteAllText($path, $json, [System.Text.Encoding]::UTF8)

Write-Host "Total magias apos Arcano Parte 2: $($existing.Count) (Adicionados: $adicionados)"
