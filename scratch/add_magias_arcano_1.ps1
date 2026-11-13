# Batch 1 of Manual do Arcano spells
$path = "src/data/magias/magias.json"
$existing = Get-Content -Path $path -Raw -Encoding UTF8 | ConvertFrom-Json

$existingMap = @{}
foreach ($item in $existing) {
    $existingMap[$item.id] = $item
}

$arcanoMagias1 = @(
    @{
        id = "abraco_gelido"
        nome = "Abraço Gélido"
        nivel = 2
        tipo = "arcana"
        escola = "Evocação"
        tempoExecucao = "Ação padrão"
        alcance = "Pessoal"
        alvoAreaEfeito = "1 criatura que esteja agarrando o conjurador"
        duracao = "1 minuto"
        resistencia = "Fortitude parcial"
        descricao = "Lançável enquanto agarrado sem teste de Vontade. O oponente sofre 4d8 pontos de dano de frio e faz teste de Fortitude: se falhar, fica atordoado por 1 rodada e enredado por 1 minuto."
    },
    @{
        id = "abraco_gelido_maior"
        nome = "Abraço Gélido Maior"
        nivel = 6
        tipo = "arcana"
        escola = "Evocação"
        tempoExecucao = "Ação padrão"
        alcance = "Pessoal"
        alvoAreaEfeito = "1 criatura que esteja agarrando o conjurador"
        duracao = "1 minuto"
        resistencia = "Fortitude parcial"
        descricao = "Como abraço gélido, mas causa 8d8 pontos de dano de frio e, se falhar na Fortitude, o alvo fica congelado (efeito de carne para pedra). Sucesso deixa apenas enredado por 1 minuto."
    },
    @{
        id = "alarme_maior"
        nome = "Alarme Maior"
        nivel = 4
        tipo = "arcana"
        escola = "Abjuração"
        tempoExecucao = "1 minuto"
        alcance = "9m"
        alvoAreaEfeito = "Emanação de 90m de raio"
        duracao = "1 dia"
        resistencia = "Especial"
        descricao = "Como alarme, mas o primeiro intruso tem luz centrada em seus pés por 1 hora, deve passar em Vontade ou fica paralisado por 3 rodadas, e aliados ganham +10 em Sobrevivência para rastreá-lo por 1 dia."
    },
    @{
        id = "animar_corrente"
        nome = "Animar Corrente"
        nivel = 3
        tipo = "arcana"
        escola = "Transmutação"
        tempoExecucao = "Ação padrão"
        alcance = "9m"
        alvoAreaEfeito = "1 corrente de até 15m"
        duracao = "1 minuto"
        resistencia = "Nenhum"
        descricao = "Anima uma corrente sob seus comandos mentais (ação de movimento). Pode mover 9m, atacar a até 3m (ataque bba+4, dano 1d6 normal ou 2d4 com cravos + mod Int/Car + metade nível) ou enroscar para enredar."
    },
    @{
        id = "aprimorar_familiar"
        nome = "Aprimorar Familiar"
        nivel = 1
        tipo = "arcana"
        escola = "Transmutação"
        tempoExecucao = "Ação padrão"
        alcance = "9m"
        alvoAreaEfeito = "Seu familiar"
        duracao = "1 hora"
        resistencia = "Nenhum"
        descricao = "Seu familiar recebe +2 em jogadas de ataque e dano, testes de resistência e perícias."
    },
    @{
        id = "ardil_do_conjurador"
        nome = "Ardil do Conjurador"
        nivel = 4
        tipo = "arcana"
        escola = "Abjuração"
        tempoExecucao = "Ação padrão"
        alcance = "9m"
        alvoAreaEfeito = "1 criatura"
        duracao = "1 minuto"
        resistencia = "Nenhum"
        descricao = "Armadilha mágica latente: quando o alvo lança uma magia, sofre 1d4 dano de essência por nível da magia e deve passar em Vontade (CD 10 + dano + nível da magia) ou a magia é perdida."
    },
    @{
        id = "ardil_do_guerreiro"
        nome = "Ardil do Guerreiro"
        nivel = 4
        tipo = "arcana"
        escola = "Abjuração"
        tempoExecucao = "Ação padrão"
        alcance = "Pessoal"
        alvoAreaEfeito = "Você"
        duracao = "1 minuto"
        resistencia = "Vontade anula"
        descricao = "O primeiro ataque corpo-a-corpo sofrido é anulado e revertido contra o atacante na forma de energia arcana pura (dano de essência automático igual ao dano do ataque)."
    },
    @{
        id = "arma_de_energia"
        nome = "Arma de Energia"
        nivel = 3
        tipo = "arcana"
        escola = "Transmutação"
        tempoExecucao = "Ação padrão"
        alcance = "Toque"
        alvoAreaEfeito = "1 arma"
        duracao = "1 minuto"
        resistencia = "Nenhum"
        descricao = "Concede o poder energia brilhante à arma afetada (ignora armadura e escudo mundanos, ataques de toque e emana luz como tocha)."
    },
    @{
        id = "arma_elemental"
        nome = "Arma Elemental"
        nivel = 1
        tipo = "arcana"
        escola = "Evocação"
        tempoExecucao = "Ação padrão"
        alcance = "9m"
        alvoAreaEfeito = "1 arma"
        duracao = "1 minuto"
        resistencia = "Nenhum"
        descricao = "Concede o poder congelante, elétrica ou flamejante (+1d6 de dano de frio, eletricidade ou fogo) à arma. Acumula se a arma já possuir o poder (+2d6)."
    },
    @{
        id = "arma_elemental_em_massa"
        nome = "Arma Elemental em Massa"
        nivel = 5
        tipo = "arcana"
        escola = "Evocação"
        tempoExecucao = "Ação padrão"
        alcance = "9m"
        alvoAreaEfeito = "Até 5 armas"
        duracao = "1 minuto"
        resistencia = "Nenhum"
        descricao = "Concede o poder explosão congelante, explosão elétrica ou explosão flamejante (+1d6 normal, +1d10 a +3d10 em acertos críticos) a até 5 armas."
    },
    @{
        id = "arma_vampirica"
        nome = "Arma Vampírica"
        nivel = 4
        tipo = "arcana"
        escola = "Necromancia"
        tempoExecucao = "Ação padrão"
        alcance = "Toque"
        alvoAreaEfeito = "1 arma"
        duracao = "1 minuto"
        resistencia = "Nenhum"
        descricao = "O usuário da arma recebe PV temporários em valor igual à metade do dano físico causado por ela (não afeta dano contra construtos, elementais ou mortos-vivos)."
    },
    @{
        id = "armadura_arcana_maior"
        nome = "Armadura Arcana Maior"
        nivel = 3
        tipo = "arcana"
        escola = "Transmutação"
        tempoExecucao = "Ação padrão"
        alcance = "Toque"
        alvoAreaEfeito = "1 criatura"
        duracao = "1 hora"
        resistencia = "Nenhum"
        descricao = "Como armadura arcana, mas fornece +5 na classe de armadura."
    },
    @{
        id = "armadura_arcana_suprema"
        nome = "Armadura Arcana Suprema"
        nivel = 5
        tipo = "arcana"
        escola = "Transmutação"
        tempoExecucao = "Ação padrão"
        alcance = "Toque"
        alvoAreaEfeito = "1 criatura"
        duracao = "1 hora"
        resistencia = "Nenhum"
        descricao = "Como armadura arcana, mas fornece +6 na classe de armadura."
    },
    @{
        id = "aspecto_do_dragao"
        nome = "Aspecto do Dragão"
        nivel = 5
        tipo = "arcana"
        escola = "Transmutação"
        tempoExecucao = "Ação padrão"
        alcance = "Pessoal"
        alvoAreaEfeito = "Você"
        duracao = "1 dia"
        resistencia = "Nenhum"
        componenteMaterial = "Escama de dragão da cor correspondente no valor de 100 TO"
        descricao = "Concede +2 em Força, Constituição e Carisma, +2 na CA e resistência 10 contra a energia do dragão correspondente. Pode ser tornada permanente sacrificando 100 TO diariamente por um ano."
    },
    @{
        id = "aspecto_da_nagah"
        nome = "Aspecto da Nagah"
        nivel = 7
        tipo = "arcana"
        escola = "Transmutação"
        tempoExecucao = "Ação padrão"
        alcance = "Pessoal"
        alvoAreaEfeito = "Você"
        duracao = "1 dia"
        resistencia = "Nenhum"
        componenteMaterial = "Escama de nagah no valor de 100 TO"
        descricao = "Concede imunidade a veneno, cura acelerada 5 e +4 na CA. Pode ser tornada permanente sacrificando 100 TO a Sszzaas diariamente por um ano."
    },
    @{
        id = "aspecto_das_sombras"
        nome = "Aspecto das Sombras"
        nivel = 6
        tipo = "arcana"
        escola = "Ilusão"
        tempoExecucao = "Ação padrão"
        alcance = "Pessoal"
        alvoAreaEfeito = "Você"
        duracao = "1 dia"
        resistencia = "Nenhum"
        componenteMaterial = "Máscara ornamentada no valor de 100 TO"
        descricao = "Como ação completa você pode assumir forma sombria e translúcida: parcialmente incorpóreo (50% chance de falha em ataques contra você, seus ataques viram ataques de toque; sofre 1 dano/rodada sob luz solar)."
    },
    @{
        id = "aspecto_do_vampiro"
        nome = "Aspecto do Vampiro"
        nivel = 4
        tipo = "arcana/divina"
        escola = "Necromancia"
        tempoExecucao = "Ação padrão"
        alcance = "Pessoal"
        alvoAreaEfeito = "Você"
        duracao = "1 dia"
        resistencia = "Nenhum"
        componenteMaterial = "Caixão no valor de 100 TO"
        descricao = "Concede +2 em Destreza e Carisma, +4 em Furtividade, Iniciativa e Percepção, e capacidade de drenar sangue com mordida (1d4 dano de Con por rodada agarrado, curando 5 PV por ponto drenado)."
    },
    @{
        id = "atacar_a_sorte"
        nome = "Atacar a Sorte"
        nivel = 2
        tipo = "arcana/divina"
        escola = "Adivinhação"
        tempoExecucao = "Ação padrão"
        alcance = "15m"
        alvoAreaEfeito = "1 criatura"
        duracao = "1 dia"
        resistencia = "Vontade anula"
        descricao = "Altera a sorte do alvo tornando-o azarado: recebe –1 em todas as jogadas e testes e na CA durante um dia."
    },
    @{
        id = "ataque_certeiro_maior"
        nome = "Ataque Certeiro Maior"
        nivel = 4
        tipo = "arcana"
        escola = "Adivinhação"
        tempoExecucao = "Ação padrão"
        alcance = "Pessoal"
        alvoAreaEfeito = "Você"
        duracao = "Até 3 ataques ou 1 minuto"
        resistencia = "Nenhum"
        descricao = "Como ataque certeiro (+20 no ataque), mas o bônus dura até você realizar três ataques (ou 1 minuto)."
    },
    @{
        id = "aura_de_morte"
        nome = "Aura de Morte"
        nivel = 4
        tipo = "arcana"
        escola = "Necromancia"
        tempoExecucao = "Ação padrão"
        alcance = "Pessoal"
        alvoAreaEfeito = "Emanação com 6m de raio"
        duracao = "1 minuto"
        resistencia = "Nenhum"
        descricao = "Emana energia negativa: causa 1d6 dano de energia negativa ao conjurador e 2d8 dano de energia negativa a todas as criaturas na área a cada rodada."
    },
    @{
        id = "barco_voador"
        nome = "Barco Voador"
        nivel = 8
        tipo = "arcana"
        escola = "Transmutação"
        tempoExecucao = "10 minutos"
        alcance = "Toque"
        alvoAreaEfeito = "1 barco"
        duracao = "1 dia"
        resistencia = "Nenhum"
        descricao = "Encanta uma embarcação de tamanho até Descomunal para que voe com deslocamento de 9m (aumentável com velas e teste de marinheiro)."
    },
    @{
        id = "calafrio_caotico_de_nimb"
        nome = "Calafrio Caótico de Nimb"
        nivel = 1
        tipo = "arcana/divina"
        escola = "Evocação"
        tempoExecucao = "Ação de movimento"
        alcance = "9m"
        alvoAreaEfeito = "1 criatura"
        duracao = "1d4 rodadas"
        resistencia = "Nenhum"
        descricao = "Ondas de frio causam 1d4 pontos de dano de frio a cada rodada. Rolar 4 permite rolar o dado novamente e somar ao dano recursivamente."
    },
    @{
        id = "campo_de_forca"
        nome = "Campo de Força"
        nivel = 5
        tipo = "arcana"
        escola = "Abjuração"
        tempoExecucao = "Ação livre"
        alcance = "Pessoal"
        alvoAreaEfeito = "Você"
        duracao = "1 minuto"
        resistencia = "Nenhum"
        descricao = "Cria película protetora que absorve todos os golpes físicos (até 40 pontos de dano antes de se dissipar)."
    },
    @{
        id = "campo_de_forca_maior"
        nome = "Campo de Força Maior"
        nivel = 7
        tipo = "arcana"
        escola = "Abjuração"
        tempoExecucao = "Ação livre"
        alcance = "Pessoal"
        alvoAreaEfeito = "Você"
        duracao = "1 minuto"
        resistencia = "Nenhum"
        descricao = "Como campo de força, mas absorve até 60 pontos de dano físico."
    },
    @{
        id = "campo_de_forca_menor"
        nome = "Campo de Força Menor"
        nivel = 3
        tipo = "arcana"
        escola = "Abjuração"
        tempoExecucao = "Ação livre"
        alcance = "Pessoal"
        alvoAreaEfeito = "Você"
        duracao = "1 minuto"
        resistencia = "Nenhum"
        descricao = "Como campo de força, mas absorve até 20 pontos de dano físico."
    },
    @{
        id = "canhao_de_forca"
        nome = "Canhão de Força"
        nivel = 5
        tipo = "arcana"
        escola = "Evocação"
        tempoExecucao = "Ação completa"
        alcance = "60m"
        alvoAreaEfeito = "Linha"
        duracao = "Instantânea"
        resistencia = "Reflexos evita"
        componenteMaterial = "Cristal de quartzo puro no valor de 100 TO (não consumido)"
        descricao = "Dispara um feixe devastador de pura essência arcana causando 8d10 pontos de dano em linha a criaturas e objetos. Conjurador deve passar em Força CD 15 ou é derrubado 1,5m para trás."
    },
    @{
        id = "choque_estatico"
        nome = "Choque Estático"
        nivel = 2
        tipo = "arcana"
        escola = "Evocação"
        tempoExecucao = "Ação padrão"
        alcance = "15m"
        alvoAreaEfeito = "Arcos de eletricidade"
        duracao = "1 minuto"
        resistencia = "Fortitude parcial"
        componenteMaterial = "5 anéis metálicos no valor de 20 TO (não consumidos)"
        descricao = "Durante a duração, com ação padrão pode atingir alvos a até 6m com arco elétrico causando 2d8 dano e atordoando por 1 rodada (metade e não atordoa se passar em Fortitude)."
    },
    @{
        id = "choque_estatico_maior"
        nome = "Choque Estático Maior"
        nivel = 6
        tipo = "arcana"
        escola = "Evocação"
        tempoExecucao = "Ação padrão"
        alcance = "15m"
        alvoAreaEfeito = "Arcos de eletricidade"
        duracao = "1 minuto"
        resistencia = "Fortitude parcial"
        componenteMaterial = "5 anéis metálicos no valor de 200 TO (não consumidos)"
        descricao = "Como choque estático, mas cada arco de eletricidade causa 8d8 pontos de dano."
    },
    @{
        id = "chuva_de_sangue"
        nome = "Chuva de Sangue"
        nivel = 2
        tipo = "arcana"
        escola = "Necromancia"
        tempoExecucao = "Ação completa"
        alcance = "30m"
        alvoAreaEfeito = "Emanação de 30m de raio"
        duracao = "1 minuto"
        resistencia = "Nenhum"
        componenteMaterial = "Sangue do conjurador (perde 2d4 PV) ou frasco de sangue fresco"
        descricao = "Chuva de sangue queima seres vivos na área causando 2d10 dano por rodada a céu aberto (armaduras e escudos reduzem o dano na proporção do bônus de CA)."
    },
    @{
        id = "clarao_do_esquecimento"
        nome = "Clarão do Esquecimento"
        nivel = 3
        tipo = "arcana"
        escola = "Encantamento"
        tempoExecucao = "Ação padrão"
        alcance = "9m"
        alvoAreaEfeito = "Explosão em cone"
        duracao = "Instantânea"
        resistencia = "Vontade anula"
        descricao = "Cone de luz intensa faz os alvos na área esquecerem tudo das últimas 24 horas e ficarem cegos por 1d4 rodadas."
    },
    @{
        id = "combustao"
        nome = "Combustão"
        nivel = 2
        tipo = "arcana"
        escola = "Evocação"
        tempoExecucao = "Ação livre"
        alcance = "9m"
        alvoAreaEfeito = "1 criatura ou objeto"
        duracao = "Permanente até ser apagado"
        resistencia = "Nenhum"
        descricao = "Estalo de dedos que faz o alvo entrar em chamas, sofrendo 1d6 dano no lançamento e +1d6 no início de cada turno até apagar com ação completa."
    },
    @{
        id = "combustao_em_massa"
        nome = "Combustão em Massa"
        nivel = 3
        tipo = "arcana"
        escola = "Evocação"
        tempoExecucao = "Ação padrão"
        alcance = "9m"
        alvoAreaEfeito = "Até 5 criaturas ou objetos"
        duracao = "Permanente até ser apagado"
        resistencia = "Nenhum"
        descricao = "Como combustão, mas incendeia até cinco criaturas ou objetos simultaneamente."
    },
    @{
        id = "contatar_mestre"
        nome = "Contatar Mestre"
        nivel = 3
        tipo = "arcana"
        escola = "Adivinhação"
        tempoExecucao = "1 minuto"
        alcance = "Pessoal"
        alvoAreaEfeito = "Seu mestre ou mentor"
        duracao = "Decidida pelo mentor"
        resistencia = "Nenhum"
        descricao = "Cria uma imagem de comunicação direta com seu professor/mentor de magia (ou patrono de linhagem para feiticeiros) no mesmo Plano para consultas e conselhos."
    },
    @{
        id = "coordenar_a_batalha"
        nome = "Coordenar a Batalha"
        nivel = 3
        tipo = "arcana"
        escola = "Encantamento"
        tempoExecucao = "Ação padrão"
        alcance = "9m"
        alvoAreaEfeito = "1 criatura"
        duracao = "1 rodada"
        resistencia = "Vontade anula"
        descricao = "Você determina quem o alvo atacará ou curará na próxima rodada usando sua melhor opção disponível."
    },
    @{
        id = "coordenar_a_batalha_em_massa"
        nome = "Coordenar a Batalha em Massa"
        nivel = 7
        tipo = "arcana"
        escola = "Encantamento"
        tempoExecucao = "Ação padrão"
        alcance = "9m"
        alvoAreaEfeito = "Até 5 criaturas"
        duracao = "1 rodada"
        resistencia = "Vontade anula"
        descricao = "Como coordenar a batalha, mas afeta até cinco criaturas simultaneamente."
    },
    @{
        id = "coracao_de_galinha"
        nome = "Coração de Galinha"
        nivel = 3
        tipo = "arcana"
        escola = "Necromancia"
        tempoExecucao = "Ação de movimento"
        alcance = "9m"
        alvoAreaEfeito = "1 criatura"
        duracao = "1 minuto"
        resistencia = "Vontade anula"
        descricao = "Remove imunidade a medo e impõe –4 em testes de resistência a medo do alvo por 1 minuto."
    },
    @{
        id = "criar_esqueletos_arcanos"
        nome = "Criar Esqueletos Arcanos"
        nivel = 5
        tipo = "arcana"
        escola = "Necromancia"
        tempoExecucao = "1 hora"
        alcance = "Toque"
        alvoAreaEfeito = "1 ossada"
        duracao = "Instantânea"
        resistencia = "Nenhum"
        componenteMaterial = "Pedra preciosa de 100 TO de acordo com o elemento"
        descricao = "Anima esqueletos arcanos impregnados com poderes elementais (fogo, eletricidade, gelo ou ar) sob seu comando."
    },
    @{
        id = "criar_esqueletos_arcanos_maior"
        nome = "Criar Esqueletos Arcanos Maior"
        nivel = 8
        tipo = "arcana"
        escola = "Necromancia"
        tempoExecucao = "1 hora"
        alcance = "Toque"
        alvoAreaEfeito = "1 ossada gigante"
        duracao = "Instantânea"
        resistencia = "Nenhum"
        componenteMaterial = "Pedra preciosa de 200 TO de acordo com o elemento"
        descricao = "Como criar esqueletos arcanos, mas ergue esqueletos elementais gigantescos."
    },
    @{
        id = "cura_arcana"
        nome = "Cura Arcana"
        nivel = 5
        tipo = "arcana"
        escola = "Transmutação"
        tempoExecucao = "Ação padrão"
        alcance = "Toque"
        alvoAreaEfeito = "1 criatura"
        duracao = "Instantânea"
        resistencia = "Fortitude anula"
        descricao = "Como cura arcana menor, mas o alvo recupera 3 PV por nível e envelhece um mês."
    },
    @{
        id = "cura_arcana_maior"
        nome = "Cura Arcana Maior"
        nivel = 8
        tipo = "arcana"
        escola = "Transmutação"
        tempoExecucao = "Ação padrão"
        alcance = "Toque"
        alvoAreaEfeito = "1 criatura"
        duracao = "Instantânea"
        resistencia = "Fortitude anula"
        descricao = "Como cura arcana menor, mas o alvo recupera 5 PV por nível e envelhece um ano."
    },
    @{
        id = "cura_arcana_menor"
        nome = "Cura Arcana Menor"
        nivel = 2
        tipo = "arcana"
        escola = "Transmutação"
        tempoExecucao = "Ação padrão"
        alcance = "Toque"
        alvoAreaEfeito = "1 criatura"
        duracao = "Instantânea"
        resistencia = "Fortitude anula"
        descricao = "Acelera o tempo biológico: o alvo recupera 1 PV por nível, mas envelhece uma semana e sente muita fome."
    },
    @{
        id = "dedo_duro"
        nome = "Dedo Duro"
        nivel = 2
        tipo = "arcana"
        escola = "Adivinhação"
        tempoExecucao = "Ação padrão"
        alcance = "Pessoal"
        alvoAreaEfeito = "Você"
        duracao = "Instantânea"
        resistencia = "Nenhum"
        descricao = "O conjurador gira com o dedo estendido; o dedo para apontando na direção de algo de seu interesse a até 60m (tesouro, perigo, passagem, etc.)."
    },
    @{
        id = "desmetamorfosear"
        nome = "Desmetamorfosear"
        nivel = 3
        tipo = "arcana"
        escola = "Abjuração"
        tempoExecucao = "Ação padrão"
        alcance = "9m"
        alvoAreaEfeito = "1 criatura sob metamorfose/forma selvagem"
        duracao = "Instantânea"
        resistencia = "Fortitude parcial"
        descricao = "Força o alvo a reverter à sua forma natural, sofrendo 3d8 pontos de dano e ficando impedido de mudar de forma por 1 minuto (sucesso mantém a forma mas sofre o dano)."
    },
    @{
        id = "despertar_morto_vivo"
        nome = "Despertar Morto-Vivo"
        nivel = 5
        tipo = "arcana"
        escola = "Necromancia"
        tempoExecucao = "10 minutos"
        alcance = "9m"
        alvoAreaEfeito = "1 morto-vivo"
        duracao = "Permanente"
        resistencia = "Nenhum"
        componenteMaterial = "Ônix negro no valor de 25 TO por nível do morto-vivo"
        descricao = "Concede inteligência ao morto-vivo afetado, elevando Inteligência, Sabedoria e Carisma para no mínimo 10, permitindo seguir ordens complexas e táticas."
    },
    @{
        id = "determinacao"
        nome = "Determinação"
        nivel = 2
        tipo = "arcana"
        escola = "Encantamento"
        tempoExecucao = "Ação padrão"
        alcance = "9m"
        alvoAreaEfeito = "1 criatura ferida no combate"
        duracao = "1 minuto"
        resistencia = "Nenhum"
        descricao = "Renova a determinação do combatente concedendo 10 PV temporários e o talento Duro de Matar."
    },
    @{
        id = "determinacao_em_massa"
        nome = "Determinação em Massa"
        nivel = 6
        tipo = "arcana"
        escola = "Encantamento"
        tempoExecucao = "Ação padrão"
        alcance = "9m"
        alvoAreaEfeito = "Até 5 criaturas feridas"
        duracao = "1 minuto"
        resistencia = "Nenhum"
        descricao = "Como determinação, mas afeta até cinco criaturas simultaneamente."
    },
    @{
        id = "disco_voador"
        nome = "Disco Voador"
        nivel = 5
        tipo = "arcana"
        escola = "Invocação"
        tempoExecucao = "Ação padrão"
        alcance = "18m"
        alvoAreaEfeito = "Disco de energia de 4,5m de diâmetro"
        duracao = "1 dia"
        resistencia = "Nenhum"
        descricao = "Cria plataforma de energia que carrega até 1.000 kg, flutuando a 1m do chão e voando 9m/rodada sob concentração."
    },
    @{
        id = "dizimar_defesas"
        nome = "Dizimar Defesas"
        nivel = 5
        tipo = "arcana"
        escola = "Transmutação"
        tempoExecucao = "Ação padrão"
        alcance = "30m"
        alvoAreaEfeito = "1 criatura"
        duracao = "1 hora"
        resistencia = "Vontade parcial"
        descricao = "Redução de dano e resistências a energias do alvo são diminuídas em 10 pontos (e imunidade torna-se resistência 20). Dura 1 rodada se passar em Vontade."
    }
)

$adicionados = 0
foreach ($m in $arcanoMagias1) {
    if (-not $existingMap.ContainsKey($m.id)) {
        $existing += [PSCustomObject]$m
        $existingMap[$m.id] = $m
        $adicionados++
    }
}

$existing = $existing | Sort-Object id
$json = $existing | ConvertTo-Json -Depth 5
[System.IO.File]::WriteAllText($path, $json, [System.Text.Encoding]::UTF8)

Write-Host "Total magias apos Arcano Parte 1: $($existing.Count) (Adicionados: $adicionados)"

