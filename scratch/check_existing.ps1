$t = Get-Content -Path "src/data/talentos/talentos.json" -Raw -Encoding UTF8 | ConvertFrom-Json
$m = Get-Content -Path "src/data/magias/magias.json" -Raw -Encoding UTF8 | ConvertFrom-Json

$testTalentos = @(
  'Ataques Múltiplos', 'Código Militar', 'Destino', 'Escudo Fraterno', 'Escudo Veloz',
  'Falange', 'Formação Tartaruga', 'Heroísmo Rotineiro', 'Magia Camuflada', 'Médico de Campo',
  'Olho Marcial', 'Ousadia', 'Parede de Escudos', 'Asas de Aço', 'Asas de Morcego',
  'Craque Gu-On', 'Faro Aprimorado', 'Faro Discriminatório', 'Faro para Magia',
  'Grande Autômato', 'Ginga das Ondas', 'Herdeiro Aprimorado', 'Mandíbula de Aço',
  'Marrada Poderosa', 'Marrada Ligeira', 'Mestre em Customização', 'Pequeno Moreau',
  'Pontaria com Varinha', 'Amigo dos Animais', 'Companheiro Dracônico', 'Dom da Profecia',
  'Domínio das Ondas', 'Escamas do Dragão', 'Faca nas Costas', 'Força da Fé',
  'Forma Selvagem Adicional', 'Garras de Fera', 'Herbanário', 'Invocação de Monstros',
  'Memória Racial', 'Presença Aterradora', 'Presença Aterradora Aprimorada',
  'Saliva Venenosa', 'Vencedor de Limites', 'Voz de Allihanna', 'Voz de Megalokk',
  'Alcance Supremo', 'Animal Encurralado', 'Ataque com Escudo', 'Ataque Poderoso Aprimorado',
  'Até Acertar', 'Basta!', 'Bote da Víbora', 'Brecha na Guarda', 'Conhecimento de Golpes',
  'Conhecimento de Posturas', 'Duro de Ferir', 'Entrada Triunfal', 'Erosão',
  'Escudo Destemido', 'Escudo Heroico', 'Escudo Inteligente', 'Estocada Cruel',
  'Estocada Cruel Maior', 'Exterminador de Monstros', 'Foco em Escudo', 'Fúria Estendida',
  'Golpe Especial', 'Gritos de Poder', 'Impacto Estonteante', 'Impacto Estonteante Maior',
  'Imobilização', 'Investida Ricochete', 'Mobilidade Perfeita', 'Morte Vinda do Céu',
  'Olhos nas Costas', 'Retroceder Nunca, Render-se Jamais', 'Rigidez Raivosa',
  'Sucesso Atrai Sucesso', 'Tiro Especial', 'Treinado em Escola', 'Truque do Desarme',
  'Usar Escudo de Corpo', 'Artilharia Pesada', 'Dança do Leopardo',
  'Escola das Armas de Haste', 'Escola das Duas Mãos', 'Escudo de Tauron',
  'Guarda de Theudric', 'Mão de Hisoka', 'Mão Livre', 'Rosto de Azgher'
)

Write-Host "--- Checando talentos existentes ---"
foreach ($nome in $testTalentos) {
  $match = $t | Where-Object { $_.nome -eq $nome }
  if ($match) {
    Write-Host "Já existe talento: $nome (id: $($match.id))"
  }
}

$testMagias = @('Chamas de Tauron', 'Chamas de Tauron Maior', 'Servos de Tenebra')
Write-Host "--- Checando magias existentes ---"
foreach ($nome in $testMagias) {
  $match = $m | Where-Object { $_.nome -eq $nome }
  if ($match) {
    Write-Host "Já existe magia: $nome (id: $($match.id))"
  }
}
