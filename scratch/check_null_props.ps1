$path = "src/data/magias/magias.json"
$magias = Get-Content -Path $path -Raw -Encoding UTF8 | ConvertFrom-Json

$nullTypes = @{}
foreach ($m in $magias) {
    foreach ($prop in $m.PSObject.Properties) {
        if ($null -eq $prop.Value) {
            if (-not $nullTypes.ContainsKey($prop.Name)) {
                $nullTypes[$prop.Name] = 0
            }
            $nullTypes[$prop.Name]++
        }
    }
}
Write-Host "Properties with null values:"
$nullTypes.GetEnumerator() | Format-Table

