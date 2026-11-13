$m = Get-Content -Path "src/data/magias/magias.json" -Raw -Encoding UTF8 | ConvertFrom-Json
$m | Where-Object { $_.id -in @('chamas_de_tauron', 'chamas_de_tauron_maior', 'servos_de_tenebra') } | ForEach-Object {
    Write-Host "ID: $($_.id)"
    Write-Host "Nome: $($_.nome)"
    Write-Host "Nivel: $($_.nivel)"
    Write-Host "Tipo: $($_.tipo)"
    Write-Host "Escola: $($_.escola)"
    Write-Host "Desc: $($_.descricao.Substring(0, [Math]::Min(80, $_.descricao.Length)))..."
    Write-Host "--------------------"
}
