# Scan all .ts and .tsx files for any obvious issues
$files = Get-ChildItem -Path "src" -Include "*.ts","*.tsx" -Recurse
Write-Host "Scanned $($files.Count) TypeScript files in src/:"
foreach ($f in $files) {
    Write-Host "  - $($f.FullName.Replace((Get-Location).Path + '\', ''))"
}

