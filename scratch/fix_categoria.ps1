$path = "src/data/talentos/talentos.json"
$talentos = Get-Content -Path $path -Raw -Encoding UTF8 | ConvertFrom-Json

foreach ($t in $talentos) {
    if ($t.categoria -eq "Poder Concedido") {
        $t.categoria = "Poderes Concedidos"
    }
}

$json = $talentos | ConvertTo-Json -Depth 5
[System.IO.File]::WriteAllText($path, $json, [System.Text.Encoding]::UTF8)
Write-Host "Talentos categoria standardized successfully!"

