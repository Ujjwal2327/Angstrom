New-Item -ItemType Directory -Force -Path "ALL FILES" | Out-Null

$projectRoot = (Get-Location).Path

$excludeDirs = @(
    ".next",
    "node_modules",
    "public",
    "docs",
    "ALL FILES",
    ".git",
    "prisma/migrations"
)

$excludeFiles = @(
    ".gitignore",
    "components.json",
    "eslint.config.mjs",
    "jsconfig.json",
    "next.config.mjs",
    "package-lock.json",
    "postcss.config.mjs",
    "README.md"
)

$extraIncludeFiles = @(
    # "docs/terminal-command.sh"
)

$files = Get-ChildItem -Recurse -File | Where-Object {

    $relativePath = $_.FullName.Substring($projectRoot.Length).TrimStart('\')
    $normalized = $relativePath.Replace('\', '/')

    if ($extraIncludeFiles -contains $normalized) {
        return $true
    }

    $isExcluded = $false

    foreach ($dir in $excludeDirs) {
        if (
            $normalized.StartsWith("$dir/") -or
            $normalized -eq $dir
        ) {
            $isExcluded = $true
            break
        }
    }

    if ($normalized -match '(^|/)components/ui(/|$)') {
        $isExcluded = $true
    }

    (-not $isExcluded) -and ($excludeFiles -notcontains $_.Name)
}

# Copy files with unique names
$usedNames = @{}

foreach ($file in $files) {

    $relativePath = $file.FullName.Substring($projectRoot.Length).TrimStart('\')

    $cleanName = $relativePath `
        -replace '[\\/]', '_' `
        -replace '\[', '(' `
        -replace '\]', ')' `
        -replace '[:*?"<>|]', '_'

    if ($usedNames.ContainsKey($cleanName)) {

        $usedNames[$cleanName]++

        $base = [System.IO.Path]::GetFileNameWithoutExtension($cleanName)
        $ext  = [System.IO.Path]::GetExtension($cleanName)

        $cleanName = "${base}_$($usedNames[$cleanName])$ext"
    }
    else {
        $usedNames[$cleanName] = 0
    }

    Copy-Item `
        -LiteralPath $file.FullName `
        -Destination (Join-Path "ALL FILES" $cleanName) `
        -Force
}

# Build tree structure
$root = @{}

foreach ($file in $files) {

    $relativePath = $file.FullName.Substring($projectRoot.Length).TrimStart('\')
    $parts = $relativePath -split '[\\/]'

    $current = $root

    foreach ($part in $parts) {

        if (-not $current.ContainsKey($part)) {
            $current[$part] = @{}
        }

        $current = $current[$part]
    }
}

function Convert-Tree {
    param($Node)

    $result = @()

    foreach ($key in ($Node.Keys | Sort-Object)) {

        $result += [PSCustomObject]@{
            Name     = $key
            Children = Convert-Tree $Node[$key]
        }
    }

    return $result
}

$treeOutput = New-Object System.Collections.Generic.List[string]

function Add-ToTree {
    param(
        [array]$Items,
        [string]$Prefix = ""
    )

    for ($i = 0; $i -lt $Items.Count; $i++) {

        $item = $Items[$i]
        $isLast = ($i -eq ($Items.Count - 1))

        if ($isLast) {
            $treeOutput.Add("$Prefix└── $($item.Name)")
            $newPrefix = "$Prefix    "
        }
        else {
            $treeOutput.Add("$Prefix├── $($item.Name)")
            $newPrefix = "$Prefix│   "
        }

        if ($item.Children.Count -gt 0) {
            Add-ToTree -Items $item.Children -Prefix $newPrefix
        }
    }
}

$treeOutput.Add(".")

$treeData = Convert-Tree $root
Add-ToTree -Items $treeData

$treeFile = "ALL FILES\project-structure.txt"

# Force UTF-8 so box characters display correctly
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllLines(
    (Join-Path $PWD $treeFile),
    $treeOutput,
    $utf8NoBom
)

Write-Host ""
Write-Host "Tree structure saved to: $treeFile"
Write-Host "Project files copied: $($files.Count)"
Write-Host "Files in ALL FILES: $((Get-ChildItem 'ALL FILES' -File).Count)"