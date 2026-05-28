#requires -Version 5.1
<#
.SYNOPSIS
K-Ramie font helper for Windows / PowerShell.

.DESCRIPTION
Native PowerShell equivalent of scripts/ensure-fonts.sh. Auto-fetches
fonts that have stable, redistribution-friendly mirrors (currently
Pretendard via GitHub raw). Prints manual-install instructions for the
rest. Uses curl.exe with --ssl-no-revoke to avoid Schannel CRL offline
failures common on Windows.

Body / heading rendering will fall back to system fonts (Noto Serif KR,
Apple SD Gothic Neo, Malgun Gothic) when web fonts are absent — pages
still render, just with a different optical rhythm.

.EXAMPLE
pwsh scripts/ensure-fonts.ps1
#>

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent (Split-Path -Parent $PSCommandPath)
$fontDir = Join-Path $root "assets\fonts"

# Tuple format: [subdir, filename, url, attribution_note]
# Empty url = manual install only.
$specs = @(
    @{ Subdir = "Pretendard";              File = "PretendardVariable.woff2";       Url = "https://github.com/orioncactus/pretendard/raw/main/packages/pretendard/dist/web/variable/woff2/PretendardVariable.woff2"; Note = "SIL OFL 1.1, orioncactus/pretendard" }
    @{ Subdir = "D2Coding";                File = "D2Coding.woff2";                  Url = ""; Note = "SIL OFL 1.1, NaverCloudPlatform/d2codingfont — manual download required (zip distributes TTF only)" }
    @{ Subdir = "ChosunilboMyungjo";       File = "ChosunilboMyungjo.woff2";         Url = ""; Note = "Free commercial via Chosun Ilbo — download from https://noonnu.cc/font_page/63" }
    @{ Subdir = "BareunBatang";            File = "BareunBatang.woff2";              Url = ""; Note = "Free commercial via 대한인쇄문화협회 — download from https://noonnu.cc/font_page/30" }
    @{ Subdir = "KoPubWorldBatang";        File = "KoPubWorldBatang.woff2";          Url = ""; Note = "Free commercial (Korean Govt) — download from https://www.kopus.org/biz/electronic/font.aspx" }
    @{ Subdir = "SandollGukdaeTteokbokki"; File = "SandollGukdaeTteokbokki.woff2";   Url = ""; Note = "Free commercial display-only (CI/BI prohibited) — download from https://noonnu.cc/font_page/3" }
)

$minSize = 10000  # 10KB sanity threshold

function Test-FontFile {
    param([string]$Path)
    if (-not (Test-Path -LiteralPath $Path)) { return $false }
    return (Get-Item -LiteralPath $Path).Length -ge $minSize
}

function Get-Font {
    param([string]$Subdir, [string]$File, [string]$Url)
    $targetDir = Join-Path $fontDir $Subdir
    New-Item -ItemType Directory -Force -Path $targetDir | Out-Null
    $target = Join-Path $targetDir $File

    if (Test-FontFile -Path $target) {
        Write-Output "  OK: $Subdir/$File already present"
        return 0
    }

    if ([string]::IsNullOrEmpty($Url)) {
        Write-Output "  SKIP: $Subdir/$File has no auto-download source"
        return 2
    }

    Write-Output "  Fetching $Subdir/$File"
    & curl.exe --ssl-no-revoke --retry 2 --connect-timeout 15 --max-time 300 -fSL $Url -o $target 2>&1 | Out-Null
    if (Test-FontFile -Path $target) {
        $size = (Get-Item -LiteralPath $target).Length
        Write-Output ("  OK: $Subdir/$File downloaded ({0:N0} bytes)" -f $size)
        return 0
    } else {
        if (Test-Path -LiteralPath $target) { Remove-Item -LiteralPath $target -Force }
        Write-Output "  ERROR: download failed for $Subdir/$File"
        return 1
    }
}

New-Item -ItemType Directory -Force -Path $fontDir | Out-Null

$failed = 0
$manual = 0
foreach ($s in $specs) {
    $rc = Get-Font -Subdir $s.Subdir -File $s.File -Url $s.Url
    if ($rc -eq 2) {
        $manual++
        Write-Output "    note: $($s.Note)"
    } elseif ($rc -eq 1) {
        $failed++
        Write-Output "    note: $($s.Note)"
    }
}

Write-Output ""
if ($failed -gt 0) {
    Write-Output "Some auto-fetchable fonts could not be downloaded."
    Write-Output "K-Ramie will still render via system fallbacks (Noto Serif KR, Apple SD Gothic Neo, Malgun Gothic)."
    Write-Output "See FONTS.md for licensing and source URLs."
    exit 1
}

if ($manual -gt 0) {
    Write-Output "OK: auto-fetched fonts present."
    Write-Output "$manual manual-install font(s) above — download per the linked source and place under assets/fonts/<Subdir>/<Filename>.woff2."
    Write-Output "Until then, K-Ramie renders via the system fallback chain. See FONTS.md."
    exit 0
}

Write-Output "OK: all K-Ramie fonts ready"
