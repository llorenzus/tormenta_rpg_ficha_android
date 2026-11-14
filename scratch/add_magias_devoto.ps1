# Script to merge Devoto spells into src/data/magias/magias.json
$path = "src/data/magias/magias.json"
$existing = Get-Content -Path $path -Raw -Encoding UTF8 | ConvertFrom-Json

$existingMap = @{}
foreach ($item in $existing) {
    $existingMap[$item.id] = $item
}

$devotoMagias = @(
    @{
        id = "alterar_paisagem"
        nome = "Alterar Paisagem"
        nivel = 2
        tipo = "divina"
        escola = "Invocação"
        tempoExecucao = "Ação padrão"
        alcance = "30m"
        alvoAreaEfeito = "Até 4 objetos da lista de vegetação"
        duracao = "10 minutos"
        resistencia = "Nenhum"
        descricao = "Você pode alterar a vegetação da área afetada, inserindo até 4 elementos naturais (arbusto, árvore pequena, folhagem ou vegetação rasteira) que servem de esconderijo ou terreno difícil."
    },
    @{
        id = "arma_espinhenta"
        nome = "Arma Espinhenta"
        nivel = 1
        tipo = "divina"
        escola = "Transmutação"
        tempoExecucao = "Ação padrão"
        alcance = "Toque"
        alvoAreaEfeito = "1 cajado, clava ou porrete mundano"
        duracao = "1 hora"
        resistencia = "Nenhum"
        descricao = "A arma afetada cria espinhos afiados, causando +1d6 de dano de perfuração adicional (não multiplicado em crítico). Exclusiva de devotos de Allihanna, Megalokk ou Oceano."
    },
    @{
        id = "arma_espinhenta_maior"
        nome = "Arma Espinhenta Maior"
        nivel = 3
        tipo = "divina"
        escola = "Transmutação"
        tempoExecucao = "Ação padrão"
        alcance = "Toque"
        alvoAreaEfeito = "1 cajado, clava ou porrete mundano"
        duracao = "1 hora"
        resistencia = "Nenhum"
        descricao = "Como arma espinhenta, mas a arma causa +2d6 pontos de dano de perfuração adicional e sua margem de ameaça aumenta em +1."
    },
    @{
        id = "arma_espinhenta_suprema"
        nome = "Arma Espinhenta Suprema"
        nivel = 5
        tipo = "divina"
        escola = "Transmutação"
        tempoExecucao = "Ação padrão"
        alcance = "Toque"
        alvoAreaEfeito = "1 cajado, clava ou porrete mundano"
        duracao = "1 hora"
        resistencia = "Nenhum"
        descricao = "Como arma espinhenta, mas a arma causa +3d6 pontos de dano de perfuração adicional e sua margem de ameaça aumenta em +2."
    },
    @{
        id = "arma_gloriosa"
        nome = "Arma Gloriosa"
        nivel = 1
        tipo = "divina"
        escola = "Encantamento"
        tempoExecucao = "Ação padrão"
        alcance = "Toque"
        alvoAreaEfeito = "1 arma mágica"
        duracao = "1 minuto"
        resistencia = "Nenhum"
        descricao = "Abençoa sua arma, recobrindo-a de chama branca e aumentando o encantamento mágico em +1 e a margem de crítico em +1. Cada outra magia gloriosa ativa em você aumenta o bônus em +1. Exclusiva de paladinos."
    },
    @{
        id = "arma_magica_suprema"
        nome = "Arma Mágica Suprema"
        nivel = 5
        tipo = "arcana/divina"
        escola = "Transmutação"
        tempoExecucao = "Ação padrão"
        alcance = "Toque"
        alvoAreaEfeito = "1 arma"
        duracao = "1 hora"
        resistencia = "Nenhum"
        descricao = "Como arma mágica, mas fornece +3 nas jogadas de ataque e dano (Arcana 5 / Divina 6)."
    },
    @{
        id = "armadura_de_trevas"
        nome = "Armadura de Trevas"
        nivel = 5
        tipo = "divina"
        escola = "Abjuração"
        tempoExecucao = "Ação padrão"
        alcance = "Pessoal"
        alvoAreaEfeito = "Você"
        duracao = "1 dia"
        resistencia = "Nenhum"
        componenteMaterial = "Opala no valor de 500 TO (não consumida)"
        descricao = "Cria uma armadura etérea de sombras que concede +8 na CA, camuflagem (20% chance de erro) e imunidade a magias de luz de até 3º nível."
    },
    @{
        id = "armadura_gloriosa"
        nome = "Armadura Gloriosa"
        nivel = 2
        tipo = "divina"
        escola = "Encantamento"
        tempoExecucao = "Ação padrão"
        alcance = "Toque"
        alvoAreaEfeito = "1 armadura mágica"
        duracao = "1 minuto"
        resistencia = "Nenhum"
        descricao = "Abençoa sua armadura, emitindo brilho dourado e aumentando seu encantamento em +1 (+1 para cada outra magia gloriosa ativa). Exclusiva de paladinos."
    },
    @{
        id = "caveiras_tenebrosas"
        nome = "Caveiras Tenebrosas"
        nivel = 2
        tipo = "divina"
        escola = "Necromancia"
        tempoExecucao = "Ação padrão"
        alcance = "15m"
        alvoAreaEfeito = "1d4+1 caveiras flutuantes"
        duracao = "1 minuto"
        resistencia = "Nenhum"
        descricao = "Invoca 1d4+1 caveiras que causam 1 ponto de dano (sônico e necromancia) a criaturas a até 3m a cada turno, curando você na mesma quantidade. Exclusiva de Hyninn, Ragnar, Sszzaas e Tenebra."
    },
    @{
        id = "caveiras_tenebrosas_aprimoradas"
        nome = "Caveiras Tenebrosas Aprimoradas"
        nivel = 4
        tipo = "divina"
        escola = "Necromancia"
        tempoExecucao = "Ação padrão"
        alcance = "15m"
        alvoAreaEfeito = "1d4+1 caveiras flutuantes"
        duracao = "1 minuto"
        resistencia = "Nenhum"
        descricao = "Como caveiras tenebrosas, mas cada caveira drena 2 PV por turno e possui CA 15, 5 PV e redução de dano 10."
    },
    @{
        id = "caveiras_tenebrosas_maior"
        nome = "Caveiras Tenebrosas Maior"
        nivel = 6
        tipo = "divina"
        escola = "Necromancia"
        tempoExecucao = "Ação padrão"
        alcance = "15m"
        alvoAreaEfeito = "1d4+1 caveiras flutuantes"
        duracao = "1 minuto"
        resistencia = "Nenhum"
        descricao = "Como caveiras tenebrosas, mas cada caveira drena 3 PV por turno e possui CA 18, 10 PV e redução de dano 10."
    },
    @{
        id = "chamas_de_tauron"
        nome = "Chamas de Tauron"
        nivel = 4
        tipo = "arcana"
        escola = "Evocação"
        tempoExecucao = "Ação completa"
        alcance = "30m"
        alvoAreaEfeito = "Cubo com 9m de lado"
        duracao = "1 minuto"
        resistencia = "Nenhum"
        descricao = "Transforma o ar em labaredas. Criaturas na área sofrem 1d6 de dano por rodada e pegam fogo (+1d6/rodada)."
    },
    @{
        id = "chamas_de_tauron_maior"
        nome = "Chamas de Tauron Maior"
        nivel = 7
        tipo = "arcana"
        escola = "Evocação"
        tempoExecucao = "Ação completa"
        alcance = "90m"
        alvoAreaEfeito = "Cubo com 30m de lado"
        duracao = "10 minutos"
        resistencia = "Nenhum"
        descricao = "Como chamas de Tauron, mas causa 4d6 pontos de dano por rodada (+1d6 por fogo, total 5d6)."
    },
    @{
        id = "dano_ao_contrario"
        nome = "Dano ao Contrário"
        nivel = 5
        tipo = "divina"
        escola = "Transmutação"
        tempoExecucao = "1 ação padrão"
        alcance = "Toque"
        alvoAreaEfeito = "1 criatura"
        duracao = "1 hora ou até ser descarregada"
        resistencia = "Vontade anula"
        descricao = "O próximo dano que o alvo sofrer transforma-se em cura. Qualquer cura excedente torna-se PVs temporários por 1 hora."
    },
    @{
        id = "dano_ao_contrario_a_distancia"
        nome = "Dano ao Contrário à Distância"
        nivel = 6
        tipo = "divina"
        escola = "Transmutação"
        tempoExecucao = "1 ação padrão"
        alcance = "9m"
        alvoAreaEfeito = "1 criatura"
        duracao = "1 hora ou até ser descarregada"
        resistencia = "Vontade anula"
        descricao = "Como dano ao contrário, mas com alcance de 9m."
    },
    @{
        id = "detectar_aberracao"
        nome = "Detectar Aberração"
        nivel = 1
        tipo = "arcana/divina"
        escola = "Adivinhação"
        tempoExecucao = "Ação padrão"
        alcance = "9m"
        alvoAreaEfeito = "Emanação em cone"
        duracao = "Concentração, até 3 rodadas"
        resistencia = "Nenhum"
        descricao = "Detecta lefeu, criaturas da Tormenta e monstros descendentes de lefeu na área."
    },
    @{
        id = "elmo_glorioso"
        nome = "Elmo Glorioso"
        nivel = 3
        tipo = "divina"
        escola = "Encantamento"
        tempoExecucao = "Ação padrão"
        alcance = "Pessoal"
        alvoAreaEfeito = "Seu elmo"
        duracao = "1 dia"
        resistencia = "Nenhum"
        descricao = "Abençoa seu elmo com auréola, concedendo evasão, mente escorregadia, visão arcana maior, visão da verdade, luz do dia ou +4 em Percepção (+1 habilidade por outra magia gloriosa ativa). Exclusiva de paladinos."
    },
    @{
        id = "envenenamento_em_massa"
        nome = "Envenenamento em Massa"
        nivel = 6
        tipo = "divina"
        escola = "Necromancia"
        tempoExecucao = "Ação padrão"
        alcance = "Toque"
        alvoAreaEfeito = "1 criatura tocada e até 6 criaturas a até 12m"
        duracao = "Instantânea"
        resistencia = "Fortitude anula"
        descricao = "Como envenenamento (1d10 dano em Con), mas afeta o alvo tocado e até 6 outros a até 12m dele."
    },
    @{
        id = "espirito_animal_1"
        nome = "Espírito Animal I"
        nivel = 1
        tipo = "divina"
        escola = "Invocação"
        tempoExecucao = "Ação padrão"
        alcance = "30m"
        alvoAreaEfeito = "Criatura invocada"
        duracao = "Instantânea"
        resistencia = "Nenhum"
        descricao = "Invoca um espírito animal que realiza até três ataques distribuídos como quiser (ataque +5, dano 1d6+1 corte mágico, crítico 20/x2)."
    },
    @{
        id = "espirito_animal_2"
        nome = "Espírito Animal II"
        nivel = 3
        tipo = "divina"
        escola = "Invocação"
        tempoExecucao = "Ação padrão"
        alcance = "30m"
        alvoAreaEfeito = "Criatura invocada"
        duracao = "Instantânea"
        resistencia = "Nenhum"
        descricao = "Como espírito animal I, mas com ataque +10, dano 1d8+3 e crítico 19-20/x2."
    },
    @{
        id = "espirito_animal_3"
        nome = "Espírito Animal III"
        nivel = 5
        tipo = "divina"
        escola = "Invocação"
        tempoExecucao = "Ação padrão"
        alcance = "30m"
        alvoAreaEfeito = "Criatura invocada"
        duracao = "Instantânea"
        resistencia = "Nenhum"
        descricao = "Como espírito animal I, mas com ataque +15, dano 1d10+5 e crítico 18-20/x2."
    },
    @{
        id = "espirito_animal_4"
        nome = "Espírito Animal IV"
        nivel = 7
        tipo = "divina"
        escola = "Invocação"
        tempoExecucao = "Ação padrão"
        alcance = "30m"
        alvoAreaEfeito = "Criatura invocada"
        duracao = "Instantânea"
        resistencia = "Nenhum"
        descricao = "Como espírito animal I, mas com ataque +20, dano 1d12+7 e crítico 17-20/x2."
    },
    @{
        id = "espirito_animal_5"
        nome = "Espírito Animal V"
        nivel = 9
        tipo = "divina"
        escola = "Invocação"
        tempoExecucao = "Ação padrão"
        alcance = "30m"
        alvoAreaEfeito = "Criatura invocada"
        duracao = "Instantânea"
        resistencia = "Nenhum"
        descricao = "Como espírito animal I, mas com ataque +25, dano 3d6+9 e crítico 16-20/x2."
    },
    @{
        id = "explosao_de_energia"
        nome = "Explosão de Energia"
        nivel = 3
        tipo = "arcana/divina"
        escola = "Evocação"
        tempoExecucao = "Ação padrão"
        alcance = "Pessoal"
        alvoAreaEfeito = "Explosão com 9m de raio"
        duracao = "Instantânea"
        resistencia = "Reflexos ou Vontade parcial"
        descricao = "Causa 6d8 pontos de dano de essência em todas as criaturas na área (inclusive você). Falha em Reflexos atordoa por 1 rodada. Pode ser combinada como ação livre com implosão de energia."
    },
    @{
        id = "fisico_do_leao"
        nome = "Físico do Leão"
        nivel = 4
        tipo = "arcana/divina"
        escola = "Transmutação"
        tempoExecucao = "Ação padrão"
        alcance = "Toque"
        alvoAreaEfeito = "1 criatura"
        duracao = "1 minuto"
        resistencia = "Nenhum"
        descricao = "Concede +4 em Força, Destreza e Constituição ao alvo."
    },
    @{
        id = "fisico_do_leao_em_massa"
        nome = "Físico do Leão em Massa"
        nivel = 8
        tipo = "arcana/divina"
        escola = "Transmutação"
        tempoExecucao = "Ação padrão"
        alcance = "9m"
        alvoAreaEfeito = "Até 5 criaturas"
        duracao = "1 minuto"
        resistencia = "Nenhum"
        descricao = "Como físico do leão, mas afeta até cinco criaturas."
    },
    @{
        id = "geiser"
        nome = "Gêiser"
        nivel = 4
        tipo = "divina"
        escola = "Evocação"
        tempoExecucao = "Ação padrão"
        alcance = "15m"
        alvoAreaEfeito = "Área de 3m por 3m"
        duracao = "Instantânea"
        resistencia = "Reflexos reduz à metade"
        descricao = "Cria uma forte rajada de vapor e água fervente do solo, causando 6d8 pontos de dano de fogo e derrubando as criaturas na área. Exclusiva de druidas."
    },
    @{
        id = "imbuir_cura_acelerada"
        nome = "Imbuir Cura Acelerada"
        nivel = 2
        tipo = "divina"
        escola = "Cura"
        tempoExecucao = "Ação padrão"
        alcance = "9m"
        alvoAreaEfeito = "1 criatura viva"
        duracao = "1 minuto"
        resistencia = "Nenhum"
        descricao = "O alvo recebe cura acelerada 3 (recupera 3 PV no início de cada um de seus turnos)."
    },
    @{
        id = "imbuir_cura_acelerada_maior"
        nome = "Imbuir Cura Acelerada Maior"
        nivel = 5
        tipo = "divina"
        escola = "Cura"
        tempoExecucao = "Ação padrão"
        alcance = "9m"
        alvoAreaEfeito = "1 criatura viva"
        duracao = "1 minuto"
        resistencia = "Nenhum"
        descricao = "Como imbuir cura acelerada, mas o alvo recebe cura acelerada 7."
    },
    @{
        id = "imbuir_cura_acelerada_suprema"
        nome = "Imbuir Cura Acelerada Suprema"
        nivel = 8
        tipo = "divina"
        escola = "Cura"
        tempoExecucao = "Ação padrão"
        alcance = "9m"
        alvoAreaEfeito = "1 criatura viva"
        duracao = "1 minuto"
        resistencia = "Nenhum"
        descricao = "Como imbuir cura acelerada, mas o alvo recebe cura acelerada 12."
    },
    @{
        id = "implosao_de_energia"
        nome = "Implosão de Energia"
        nivel = 3
        tipo = "arcana/divina"
        escola = "Evocação"
        tempoExecucao = "Ação padrão"
        alcance = "Pessoal"
        alvoAreaEfeito = "Explosão com 9m de raio"
        duracao = "Instantânea"
        resistencia = "Reflexos ou Vontade parcial"
        descricao = "Puxa o ar em onda de choque, causando 6d8 pontos de dano sônico e derrubando as criaturas que falharem no teste. Pode ser combinada com explosão de energia."
    },
    @{
        id = "invocar_aspecto_divino"
        nome = "Invocar Aspecto Divino"
        nivel = 5
        tipo = "divina"
        escola = "Invocação"
        tempoExecucao = "Ação completa"
        alcance = "9m"
        alvoAreaEfeito = "1 aspecto divino invocado"
        duracao = "1 dia ou 1 minuto em combate"
        resistencia = "Nenhum"
        custoXp = "100 XP"
        descricao = "Invoca uma manifestação de sua divindade (70 PV, CA 20, redução de dano 10) com habilidades exclusivas de cada deus padroeiro."
    },
    @{
        id = "invocar_avatar"
        nome = "Invocar Avatar"
        nivel = 9
        tipo = "divina"
        escola = "Invocação"
        tempoExecucao = "Ação completa"
        alcance = "Pessoal"
        alvoAreaEfeito = "Avatar invocado"
        duracao = "Concentração"
        resistencia = "Nenhum"
        custoXp = "100 XP"
        descricao = "Invoca a encarnação idealizada de seu deus: espírito tamanho Grande invencível (imune a dano, CA 60, ataque +100 [4d10+20], iniciativa +33). Causa 1d20 dano não-letal por rodada no conjurador."
    },
    @{
        id = "luz_cegante_maior"
        nome = "Luz Cegante Maior"
        nivel = 4
        tipo = "divina"
        escola = "Evocação"
        tempoExecucao = "Ação padrão"
        alcance = "30m"
        alvoAreaEfeito = "Raio de sol"
        duracao = "Instantânea"
        resistencia = "Nenhum"
        descricao = "Ataque de toque à distância que causa 4d8 pontos de dano de luz (8d6 contra mortos-vivos). Paladinos causam +1 de dano a cada 2 níveis."
    },
    @{
        id = "magia_curinga_1"
        nome = "Magia Curinga I"
        nivel = 1
        tipo = "divina"
        escola = "Universal"
        tempoExecucao = "Igual à magia imitada"
        alcance = "Igual à magia imitada"
        alvoAreaEfeito = "Igual à magia imitada"
        duracao = "Igual à magia imitada"
        resistencia = "Igual à magia imitada"
        descricao = "Imita qualquer magia de 1º nível com 50% de chance de sucesso para divinas e 25% para arcanas (+25% se conhecida). Exclusiva de Wynna."
    },
    @{
        id = "magia_curinga_2"
        nome = "Magia Curinga II"
        nivel = 2
        tipo = "divina"
        escola = "Universal"
        tempoExecucao = "Igual à magia imitada"
        alcance = "Igual à magia imitada"
        alvoAreaEfeito = "Igual à magia imitada"
        duracao = "Igual à magia imitada"
        resistencia = "Igual à magia imitada"
        descricao = "Como magia curinga I, mas imita magias de 2º nível. Exclusiva de Wynna."
    },
    @{
        id = "magia_curinga_3"
        nome = "Magia Curinga III"
        nivel = 3
        tipo = "divina"
        escola = "Universal"
        tempoExecucao = "Igual à magia imitada"
        alcance = "Igual à magia imitada"
        alvoAreaEfeito = "Igual à magia imitada"
        duracao = "Igual à magia imitada"
        resistencia = "Igual à magia imitada"
        descricao = "Como magia curinga I, mas imita magias de 3º nível. Exclusiva de Wynna."
    },
    @{
        id = "magia_curinga_4"
        nome = "Magia Curinga IV"
        nivel = 4
        tipo = "divina"
        escola = "Universal"
        tempoExecucao = "Igual à magia imitada"
        alcance = "Igual à magia imitada"
        alvoAreaEfeito = "Igual à magia imitada"
        duracao = "Igual à magia imitada"
        resistencia = "Igual à magia imitada"
        descricao = "Como magia curinga I, mas imita magias de 4º nível. Exclusiva de Wynna."
    },
    @{
        id = "magia_curinga_5"
        nome = "Magia Curinga V"
        nivel = 5
        tipo = "divina"
        escola = "Universal"
        tempoExecucao = "Igual à magia imitada"
        alcance = "Igual à magia imitada"
        alvoAreaEfeito = "Igual à magia imitada"
        duracao = "Igual à magia imitada"
        resistencia = "Igual à magia imitada"
        descricao = "Como magia curinga I, mas imita magias de 5º nível. Exclusiva de Wynna."
    },
    @{
        id = "magia_curinga_6"
        nome = "Magia Curinga VI"
        nivel = 6
        tipo = "divina"
        escola = "Universal"
        tempoExecucao = "Igual à magia imitada"
        alcance = "Igual à magia imitada"
        alvoAreaEfeito = "Igual à magia imitada"
        duracao = "Igual à magia imitada"
        resistencia = "Igual à magia imitada"
        descricao = "Como magia curinga I, mas imita magias de 6º nível. Exclusiva de Wynna."
    },
    @{
        id = "magia_curinga_7"
        nome = "Magia Curinga VII"
        nivel = 7
        tipo = "divina"
        escola = "Universal"
        tempoExecucao = "Igual à magia imitada"
        alcance = "Igual à magia imitada"
        alvoAreaEfeito = "Igual à magia imitada"
        duracao = "Igual à magia imitada"
        resistencia = "Igual à magia imitada"
        descricao = "Como magia curinga I, mas imita magias de 7º nível. Exclusiva de Wynna."
    },
    @{
        id = "magia_curinga_8"
        nome = "Magia Curinga VIII"
        nivel = 8
        tipo = "divina"
        escola = "Universal"
        tempoExecucao = "Igual à magia imitada"
        alcance = "Igual à magia imitada"
        alvoAreaEfeito = "Igual à magia imitada"
        duracao = "Igual à magia imitada"
        resistencia = "Igual à magia imitada"
        descricao = "Como magia curinga I, mas imita magias de 8º nível. Exclusiva de Wynna."
    },
    @{
        id = "mente_do_golfinho"
        nome = "Mente do Golfinho"
        nivel = 4
        tipo = "arcana/divina"
        escola = "Transmutação"
        tempoExecucao = "Ação padrão"
        alcance = "Toque"
        alvoAreaEfeito = "1 criatura"
        duracao = "1 minuto"
        resistencia = "Nenhum"
        descricao = "Melhora as habilidades mentais do alvo, fornecendo +4 em Inteligência, Sabedoria e Carisma."
    },
    @{
        id = "mente_do_golfinho_em_massa"
        nome = "Mente do Golfinho em Massa"
        nivel = 8
        tipo = "arcana/divina"
        escola = "Transmutação"
        tempoExecucao = "Ação padrão"
        alcance = "9m"
        alvoAreaEfeito = "Até 5 criaturas"
        duracao = "1 minuto"
        resistencia = "Nenhum"
        descricao = "Como mente do golfinho, mas afeta até cinco criaturas."
    },
    @{
        id = "momento_glorioso_supremo"
        nome = "Momento Glorioso Supremo"
        nivel = 4
        tipo = "divina"
        escola = "Encantamento"
        tempoExecucao = "Ação padrão"
        alcance = "Pessoal"
        alvoAreaEfeito = "Você"
        duracao = "Instantânea"
        resistencia = "Nenhum"
        descricao = "Teletransporta-se até 30m adjacente a um inimigo e desfere um ataque corpo-a-corpo para cada magia gloriosa ativa sobre si sem penalidade por múltiplos ataques. Exclusiva de paladinos."
    },
    @{
        id = "pedra_encantada_maior"
        nome = "Pedra Encantada Maior"
        nivel = 4
        tipo = "divina"
        escola = "Transmutação"
        tempoExecucao = "Ação padrão"
        alcance = "Toque"
        alvoAreaEfeito = "Até 3 pedras"
        duracao = "1 hora"
        resistencia = "Nenhum"
        descricao = "Encanta até 3 pedras para causarem 3d6+5 de dano (crítico x2, bônus +3 no ataque, dano dobrado contra mortos-vivos)."
    },
    @{
        id = "perfeicao_dos_animais"
        nome = "Perfeição dos Animais"
        nivel = 6
        tipo = "arcana/divina"
        escola = "Transmutação"
        tempoExecucao = "Ação padrão"
        alcance = "Toque"
        alvoAreaEfeito = "1 criatura"
        duracao = "1 minuto"
        resistencia = "Nenhum"
        descricao = "Fornece +4 em todas as seis habilidades (Força, Destreza, Constituição, Inteligência, Sabedoria e Carisma)."
    },
    @{
        id = "presa_magica_suprema"
        nome = "Presa Mágica Suprema"
        nivel = 5
        tipo = "divina"
        escola = "Transmutação"
        tempoExecucao = "Ação padrão"
        alcance = "Toque"
        alvoAreaEfeito = "1 criatura"
        duracao = "1 hora"
        resistencia = "Nenhum"
        descricao = "O alvo recebe +3 nas jogadas de ataque e dano com todas as suas armas naturais."
    },
    @{
        id = "rogar_maldicao_em_massa"
        nome = "Rogar Maldição em Massa"
        nivel = 6
        tipo = "arcana/divina"
        escola = "Necromancia"
        tempoExecucao = "Ação padrão"
        alcance = "Toque"
        alvoAreaEfeito = "1 criatura tocada e até 6 outras a até 12m"
        duracao = "Permanente"
        resistencia = "Vontade anula"
        descricao = "Como rogar maldição, mas afeta o alvo tocado e até 6 outras criaturas a até 12m (Arcana 7 / Divina 6)."
    },
    @{
        id = "rosa_negra"
        nome = "Rosa Negra"
        nivel = 3
        tipo = "divina"
        escola = "Necromancia"
        tempoExecucao = "Ação padrão"
        alcance = "30m"
        alvoAreaEfeito = "1 criatura"
        duracao = "Instantânea"
        resistencia = "Nenhum"
        descricao = "Ataque de toque à distância; fixa rosa que cega o alvo e causa sangramento (1d4 PV/turno). Arrancá-la exige ação de movimento e causa 1d4 dano de Constituição."
    },
    @{
        id = "rosa_rubra"
        nome = "Rosa Rubra"
        nivel = 5
        tipo = "divina"
        escola = "Necromancia"
        tempoExecucao = "Ação padrão"
        alcance = "30m"
        alvoAreaEfeito = "1 criatura"
        duracao = "Instantânea"
        resistencia = "Nenhum"
        descricao = "Ataque de toque à distância; fixa rosa que drena 1 ponto de Constituição por rodada. Arrancá-la causa 1d8 dano de Constituição."
    },
    @{
        id = "rosa_turquesa"
        nome = "Rosa Turquesa"
        nivel = 4
        tipo = "divina"
        escola = "Invocação"
        tempoExecucao = "Ação padrão"
        alcance = "30m"
        alvoAreaEfeito = "1 criatura"
        duracao = "Instantânea"
        resistencia = "Nenhum"
        descricao = "Ataque de toque à distância; fixa rosa ácida que causa 2d8 pontos de dano por rodada. Arrancá-la causa 1d6 dano de Constituição."
    },
    @{
        id = "sacrificio_traicoeiro"
        nome = "Sacrifício Traiçoeiro"
        nivel = 5
        tipo = "divina"
        escola = "Necromancia"
        tempoExecucao = "Ação livre"
        alcance = "15m"
        alvoAreaEfeito = "Inimigos a até 15m"
        duracao = "Instantânea"
        resistencia = "Vontade parcial"
        descricao = "Fira um aliado desavisado para replicar o mesmo dano em todos os inimigos a até 15m (Vontade reduz à metade)."
    },
    @{
        id = "sangria_mistica"
        nome = "Sangria Mística"
        nivel = 3
        tipo = "divina"
        escola = "Transmutação"
        tempoExecucao = "Ação padrão"
        alcance = "Pessoal"
        alvoAreaEfeito = "Você"
        duracao = "Instantânea"
        resistencia = "Nenhum"
        componenteMaterial = "Objeto cortante"
        descricao = "Faça um corte na mão sofrendo 1d6 de dano por PM da magia recuperada para recuperar uma magia já gasta hoje (1x ao dia)."
    },
    @{
        id = "sangria_mistica_ofensiva"
        nome = "Sangria Mística Ofensiva"
        nivel = 6
        tipo = "divina"
        escola = "Transmutação"
        tempoExecucao = "Ação padrão"
        alcance = "6m"
        alvoAreaEfeito = "1 criatura"
        duracao = "Instantânea"
        resistencia = "Vontade anula"
        componenteMaterial = "Objeto cortante"
        descricao = "Drena a essência de um alvo causando 1d6 de dano por PM da magia recuperada e recupera a sua magia gasta. Se o alvo for conjurador, ele também perde os PMs (1x ao dia)."
    },
    @{
        id = "servos_de_tenebra"
        nome = "Servos de Tenebra"
        nivel = 5
        tipo = "arcana/divina"
        escola = "Necromancia"
        tempoExecucao = "1 minuto"
        alcance = "30m"
        alvoAreaEfeito = "1 unidade de mortos-vivos"
        duracao = "Instantânea"
        resistencia = "Nenhum"
        descricao = "Ergue uma unidade inteira de zumbis (70 PV, CA 11, RD 5/corte) para lutar sob seu comando até ser destruída. Exclusiva de devotos de Tenebra."
    },

    # --- MAGIAS ABSOLUTAS (NÍVEL 9 DIVINO) ---
    @{
        id = "chuva_restauradora_de_allihanna"
        nome = "Chuva Restauradora de Allihanna (Absoluta)"
        nivel = 9
        tipo = "divina"
        escola = "Cura"
        tempoExecucao = "1 minuto"
        alcance = "Pessoal"
        alvoAreaEfeito = "Nuvens com 1 km de raio"
        duracao = "1 hora"
        resistencia = "Nenhum"
        custoXp = "1.000 XP"
        descricao = "Restaura toda flora destruída no último ano. Bondosos e animais curam 10 PV/rodada e remove condições ruins; Malignos sofrem 10 dano sagrado/rodada."
    },
    @{
        id = "feixe_solar_de_azgher"
        nome = "Feixe Solar de Azgher (Absoluta)"
        nivel = 9
        tipo = "divina"
        escola = "Evocação"
        tempoExecucao = "Ação padrão"
        alcance = "30m"
        alvoAreaEfeito = "Raio de 30m varrível"
        duracao = "Instantânea"
        resistencia = "Reflexos"
        custoXp = "1.000 XP"
        descricao = "Feixe de sol cortante de 30m: objetos sofrem 100 dano; criaturas com nível menor que o conjurador são cortadas ao meio (morrem) ou sofrem 200 de dano."
    },
    @{
        id = "maquinacoes_de_hyninn"
        nome = "Maquinações de Hyninn (Absoluta)"
        nivel = 9
        tipo = "divina"
        escola = "Adivinhação"
        tempoExecucao = "1 dia"
        alcance = "Pessoal"
        alvoAreaEfeito = "Você"
        duracao = "Instantânea"
        resistencia = "Nenhum"
        custoXp = "1.000 XP"
        descricao = "Concede bônus de +10 em todos os testes de perícia ligados a um elaborado plano ou conspiração, enquanto opositores sofrem –10."
    },
    @{
        id = "invocacao_de_kallyadranoch"
        nome = "Invocação de Kallyadranoch (Absoluta)"
        nivel = 9
        tipo = "divina"
        escola = "Necromancia"
        tempoExecucao = "Ação padrão"
        alcance = "18m"
        alvoAreaEfeito = "Explosão em cone"
        duracao = "Instantânea"
        resistencia = "Nenhum"
        custoXp = "1.000 XP"
        descricao = "Cabeça de dragão bafora na área: todos sofrem 100 pontos de dano e 1d4 níveis negativos (+50 dano e +1d4 níveis negativos para criaturas Bondosas)."
    },
    @{
        id = "cavaleiros_da_tavola_de_keenn"
        nome = "Cavaleiros da Távola de Keenn (Absoluta)"
        nivel = 9
        tipo = "divina"
        escola = "Invocação"
        tempoExecucao = "Ação padrão"
        alcance = "30m"
        alvoAreaEfeito = "Quadrado com 30m de lado"
        duracao = "Instantânea"
        resistencia = "Reflexos reduz à metade"
        custoXp = "1.000 XP"
        descricao = "Horda de cavaleiros espectrais atropela a área causando 10 pontos de dano por nível do conjurador a todas as criaturas e objetos escolhidos."
    },
    @{
        id = "doutrinacao_de_khalmyr"
        nome = "Doutrinação de Khalmyr (Absoluta)"
        nivel = 9
        tipo = "divina"
        escola = "Abjuração"
        tempoExecucao = "Ação padrão"
        alcance = "Pessoal"
        alvoAreaEfeito = "Domo invisível com 60m de raio"
        duracao = "10 minutos"
        resistencia = "Nenhum"
        custoXp = "1.000 XP"
        descricao = "Domo que suprime itens mágicos e magias de não devotos de Khalmyr; magias lançadas dentro têm efeitos e durações reduzidos à metade."
    },
    @{
        id = "piedade_de_lena"
        nome = "Piedade de Lena (Absoluta)"
        nivel = 9
        tipo = "divina"
        escola = "Cura"
        tempoExecucao = "Ação padrão"
        alcance = "1km"
        alvoAreaEfeito = "Círculo com 1km de raio"
        duracao = "1 mês"
        resistencia = "Vontade anula"
        custoXp = "1.000 XP"
        descricao = "Cura todas as doenças e venenos; qualquer dano letal sofrido ou causado que fosse matar uma criatura é desconsiderado por 1 mês inteiro."
    },
    @{
        id = "heranca_de_lin_wu"
        nome = "Herança de Lin-Wu (Absoluta)"
        nivel = 9
        tipo = "divina"
        escola = "Encantamento"
        tempoExecucao = "1 dia"
        alcance = "Pessoal"
        alvoAreaEfeito = "Você e seu discípulo"
        duracao = "Permanente"
        resistencia = "Nenhum"
        custoXp = "1.000 XP"
        descricao = "Após sua morte, todo seu poder e conhecimento são transferidos para um discípulo, que ganha níveis de clérigo iguais ao seu nível –2."
    },
    @{
        id = "celebracao_de_marah"
        nome = "Celebração de Marah (Absoluta)"
        nivel = 9
        tipo = "divina"
        escola = "Encantamento"
        tempoExecucao = "Ação padrão"
        alcance = "30m"
        alvoAreaEfeito = "Círculo com 30m de raio"
        duracao = "Instantânea"
        resistencia = "Vontade parcial"
        custoXp = "1.000 XP"
        descricao = "Comida, bebida e música mágica forçam todos a festejar e rir. Atitude torna-se Amistosa e qualquer início de combate por 1 mês reinicia a festa."
    },
    @{
        id = "aparicao_de_megalokk"
        nome = "Aparição de Megalokk (Absoluta)"
        nivel = 9
        tipo = "divina"
        escola = "Invocação"
        tempoExecucao = "Ação completa"
        alcance = "90m"
        alvoAreaEfeito = "Besta descomunal invocada"
        duracao = "3 rodadas"
        resistencia = "Varia"
        custoXp = "1.000 XP"
        descricao = "Comande por 3 rodadas uma besta colossal que pode desferir Bote (40d6 dano), Dilacerar (200 de dano em área), Esmagar (100 dano ou morte) ou Mastigar e Engolir."
    },
    @{
        id = "zombaria_de_nimb"
        nome = "Zombaria de Nimb (Absoluta)"
        nivel = 9
        tipo = "divina"
        escola = "Transmutação"
        tempoExecucao = "Ação padrão"
        alcance = "18m"
        alvoAreaEfeito = "Círculo com 18m de raio"
        duracao = "1 hora"
        resistencia = "Nenhum"
        custoXp = "1.000 XP"
        descricao = "Caos total: 25% chance de sofrer 100 de dano por turno, 25% chance de curar 50 PV e confusão permanente gerando sequelas mentais de 3d6 Sab."
    },
    @{
        id = "tsunami_do_oceano"
        nome = "Tsunami do Oceano (Absoluta)"
        nivel = 9
        tipo = "divina"
        escola = "Evocação"
        tempoExecucao = "Ação padrão"
        alcance = "30m"
        alvoAreaEfeito = "Onda com 30m de comprimento e 12m de altura"
        duracao = "Instantânea"
        resistencia = "Nenhum"
        custoXp = "1.000 XP"
        descricao = "Onda avança por 60m causando 50 esmagamento + 50 frio, dissipando magias na área e forçando Fortitude para não virar estátua de gelo."
    },
    @{
        id = "massacre_de_ragnar"
        nome = "Massacre de Ragnar (Absoluta)"
        nivel = 9
        tipo = "divina"
        escola = "Necromancia"
        tempoExecucao = "1 hora"
        alcance = "Pessoal"
        alvoAreaEfeito = "Você"
        duracao = "1 dia"
        resistencia = "Nenhum"
        custoXp = "1.000 XP"
        descricao = "Ao matar criatura Bondosa em combate, acumula o dano como energia negativa para o próximo golpe; se este matar, o dano acumulado dobra recursivamente."
    },
    @{
        id = "engodo_de_sszzaas"
        nome = "Engodo de Sszzaas (Absoluta)"
        nivel = 9
        tipo = "divina"
        escola = "Encantamento"
        tempoExecucao = "Ação livre"
        alcance = "30m"
        alvoAreaEfeito = "1 criatura com Int 3+"
        duracao = "Instantânea"
        resistencia = "Vontade"
        custoXp = "1.000 XP"
        descricao = "Planta paranoia indetectável no alvo, fazendo-o acreditar permanentemente que todos seus amigos e familiares querem matá-lo."
    },
    @{
        id = "vazio_de_tanna_toh"
        nome = "Vazio de Tanna-Toh (Absoluta)"
        nivel = 9
        tipo = "divina"
        escola = "Transmutação"
        tempoExecucao = "Ação padrão"
        alcance = "Toque"
        alvoAreaEfeito = "1 criatura"
        duracao = "Instantânea"
        resistencia = "Nenhum"
        custoXp = "1.000 XP"
        descricao = "Apaga permanentemente todo o conhecimento do alvo: ele perde todos os níveis de classe, perícias e talentos, virando um plebeu de 1º nível."
    },
    @{
        id = "panoplia_de_tauron"
        nome = "Panóplia de Tauron (Absoluta)"
        nivel = 9
        tipo = "divina"
        escola = "Invocação"
        tempoExecucao = "Ação livre"
        alcance = "Pessoal"
        alvoAreaEfeito = "Você"
        duracao = "10 minutos"
        resistencia = "Nenhum"
        custoXp = "1.000 XP"
        descricao = "Substitui seu equipamento por armas divinas: arma da explosão flamejante +5 (+8 em Força), armadura completa +5 da fortificação moderada e elmo de dominar pessoa."
    },
    @{
        id = "maldicao_de_tenebra"
        nome = "Maldição de Tenebra (Absoluta)"
        nivel = 9
        tipo = "divina"
        escola = "Necromancia"
        tempoExecucao = "Ação padrão"
        alcance = "30m"
        alvoAreaEfeito = "1 criatura"
        duracao = "Permanente"
        resistencia = "Vontade"
        custoXp = "1.000 XP"
        descricao = "Condena o alvo a viver no escuro: sofre 50 dano imediato sob luz do sol e é desintegrado na segunda rodada de exposição solar."
    },
    @{
        id = "segunda_chance_de_thyatis"
        nome = "Segunda Chance de Thyatis (Absoluta)"
        nivel = 9
        tipo = "divina"
        escola = "Encantamento"
        tempoExecucao = "Ação livre"
        alcance = "30m"
        alvoAreaEfeito = "1 criatura"
        duracao = "Instantânea"
        resistencia = "Nenhum"
        custoXp = "1.000 XP"
        descricao = "Obriga o alvo a mudar uma ação violenta ou injusta recém-feita, e concede 1d6 intervenções futuras para mudar destinos do alvo durante toda a vida dele."
    },
    @{
        id = "deflagracao_magica_de_wynna"
        nome = "Deflagração Mágica de Wynna (Absoluta)"
        nivel = 9
        tipo = "divina"
        escola = "Evocação"
        tempoExecucao = "Ação padrão"
        alcance = "Pessoal"
        alvoAreaEfeito = "Explosão de 9m de raio"
        duracao = "Instantânea"
        resistencia = "Fortitude parcial"
        custoXp = "1.000 XP"
        descricao = "Explode em essência causando 200 pontos de dano e desativando permanentemente todos os itens mágicos não-artefatos na área (100 dano e desativação por 1 dia se passar no teste)."
    },
    @{
        id = "vitoria_de_valkaria"
        nome = "Vitória de Valkaria (Absoluta)"
        nivel = 9
        tipo = "divina"
        escola = "Encantamento"
        tempoExecucao = "Ação padrão"
        alcance = "18m"
        alvoAreaEfeito = "Todos seus aliados na área"
        duracao = "1 dia"
        resistencia = "Nenhum"
        custoXp = "1.000 XP"
        descricao = "Sempre que um aliado rolar o valor máximo em dados de teste ou dano (como 20 em d20), rola de novo e soma recursivamente, tornando possíveis feitos épicos."
    }
)

$adicionados = 0
foreach ($m in $devotoMagias) {
    if (-not $existingMap.ContainsKey($m.id)) {
        $existing += [PSCustomObject]$m
        $existingMap[$m.id] = $m
        $adicionados++
    }
}

$existing = $existing | Sort-Object id
$json = $existing | ConvertTo-Json -Depth 5
[System.IO.File]::WriteAllText($path, $json, [System.Text.Encoding]::UTF8)

Write-Host "Total magias apos Devoto: $($existing.Count) (Adicionados: $adicionados)"

