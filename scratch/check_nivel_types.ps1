$path = "src/data/magias/magias.json"
$magias = Get-Content -Path $path -Raw -Encoding UTF8 | ConvertFrom-Json

$nonNumberNivel = @()
foreach ($m in $magias) {
    if ($m.nivel -isnot [int] -and $m.nivel -isnot [long]) {
        $nonNumberNivel += $m
    }
}
Write-Host "Non-number nivel count: $($nonNumberNivel.Count)"
if ($nonNumberNivel.Count -gt 0) {
    $nonNumberNivel | Select-Object id, nome, nivel | Format-Table
}

