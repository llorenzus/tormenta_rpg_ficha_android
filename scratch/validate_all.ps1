# Validation script for magias.json and talentos.json
$magiasPath = "src/data/magias/magias.json"
$talentosPath = "src/data/talentos/talentos.json"

$magias = Get-Content -Path $magiasPath -Raw -Encoding UTF8 | ConvertFrom-Json
$talentos = Get-Content -Path $talentosPath -Raw -Encoding UTF8 | ConvertFrom-Json

Write-Host "=== Magias Validation ==="
Write-Host "Total Magias: $($magias.Count)"

$magiaIds = @{}
$dupMagias = 0
foreach ($m in $magias) {
    if ($magiaIds.ContainsKey($m.id)) {
        Write-Warning "Duplicate magia id: $($m.id)"
        $dupMagias++
    }
    $magiaIds[$m.id] = $true
}

$magiasPorNivel = @{}
for ($i = 0; $i -le 9; $i++) {
    $magiasPorNivel[$i] = 0
}
foreach ($m in $magias) {
    $lvl = [int]$m.nivel
    if ($magiasPorNivel.ContainsKey($lvl)) {
        $magiasPorNivel[$lvl]++
    }
}
for ($i = 0; $i -le 9; $i++) {
    Write-Host "  Nivel ${i}: $($magiasPorNivel[$i]) magias"
}

Write-Host "`n=== Talentos Validation ==="
Write-Host "Total Talentos: $($talentos.Count)"

$talentoIds = @{}
$dupTalentos = 0
foreach ($t in $talentos) {
    if ($talentoIds.ContainsKey($t.id)) {
        Write-Warning "Duplicate talento id: $($t.id)"
        $dupTalentos++
    }
    $talentoIds[$t.id] = $true
}

$talentosPorCat = @{}
foreach ($t in $talentos) {
    $cat = $t.categoria
    if (-not $talentosPorCat.ContainsKey($cat)) {
        $talentosPorCat[$cat] = 0
    }
    $talentosPorCat[$cat]++
}
foreach ($cat in $talentosPorCat.Keys) {
    Write-Host "  Categoria '$cat': $($talentosPorCat[$cat]) talentos"
}

Write-Host "`nDuplicatas Magias: $dupMagias | Duplicatas Talentos: $dupTalentos"
