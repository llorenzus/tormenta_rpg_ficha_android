$path = "src/data/talentos/talentos.json"
$talentos = Get-Content -Path $path -Raw -Encoding UTF8 | ConvertFrom-Json

$validCategories = @('Combate', 'Perícia', 'Magia', 'Destino', 'Poderes Concedidos', 'Tormenta')
$invalidCat = @()
$missingFields = @()

foreach ($t in $talentos) {
    if ($validCategories -notcontains $t.categoria) {
        $invalidCat += $t
    }
    if (-not $t.id -or -not $t.nome -or -not $t.categoria -or $null -eq $t.preRequisitos -or $null -eq $t.beneficio -or $null -eq $t.descricao) {
        $missingFields += $t
    }
}

Write-Host "Invalid categories count: $($invalidCat.Count)"
Write-Host "Missing fields count: $($missingFields.Count)"

