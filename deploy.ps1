[CmdletBinding()]
param(
    [string]$SshHost = "195.179.237.17",
    [int]$Port = 65002,
    [string]$SshUser = "u761714745",
    [string]$RemoteSite = "domains/44studiosdesign.com/public_html"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    throw "Git is required."
}
if (-not (Get-Command scp -ErrorAction SilentlyContinue)) {
    throw "OpenSSH scp is required."
}
if (-not (Get-Command ssh -ErrorAction SilentlyContinue)) {
    throw "OpenSSH ssh is required."
}

$insideRepository = (& git rev-parse --is-inside-work-tree 2>$null)
if ($LASTEXITCODE -ne 0 -or $insideRepository -ne "true") {
    throw "Run this script from the 44-STUDIOS Git repository."
}

$dirtyFiles = @(& git status --porcelain)
if ($dirtyFiles.Count -gt 0) {
    Write-Warning "Uncommitted changes will not be deployed. This script deploys the current Git HEAD."
}

$commit = (& git rev-parse --short HEAD).Trim()
$archiveName = "44-studios-site-$commit.tar.gz"
$archivePath = Join-Path $env:TEMP $archiveName
$target = "${SshUser}@${SshHost}"

try {
    Write-Host "Packaging commit $commit..."
    & git archive --format=tar.gz --output=$archivePath HEAD
    if ($LASTEXITCODE -ne 0) {
        throw "Git archive failed."
    }

    Write-Host "Uploading to Hostinger..."
    & scp -P $Port $archivePath "${target}:~/$archiveName"
    if ($LASTEXITCODE -ne 0) {
        throw "Upload failed."
    }

    $remoteScript = @'
set -eu
site="$HOME/{0}"
archive="$HOME/{1}"
test -d "$site"
test -f "$archive"
mkdir -p "$HOME/site-backups"
backup="$HOME/site-backups/44-studios-$(date +%Y%m%d-%H%M%S).tar.gz"
tar -czf "$backup" -C "$site" .
tar -xzf "$archive" -C "$site"
grep -q "crm.44studiosdesign.com" "$site/contact/index.html"
grep -q "matchingSurveyLink" "$site/services/index.html"
rm -f "$archive"
printf "Deployment complete. Backup: %s\n" "$backup"
'@ -f $RemoteSite, $archiveName

    Write-Host "Backing up and deploying on Hostinger..."
    & ssh -p $Port $target $remoteScript
    if ($LASTEXITCODE -ne 0) {
        throw "Remote deployment failed. The existing site backup was retained."
    }

    $stamp = [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()
    $headers = @{
        "Cache-Control" = "no-cache, no-store"
        "Pragma" = "no-cache"
    }
    $contact = Invoke-WebRequest -Uri "https://44studiosdesign.com/contact/?deploy=$stamp" -Headers $headers -UseBasicParsing
    $services = Invoke-WebRequest -Uri "https://44studiosdesign.com/services/?deploy=$stamp" -Headers $headers -UseBasicParsing

    if ($contact.Content -notmatch "crm\.44studiosdesign\.com") {
        throw "Live Contact page verification failed."
    }
    if ($services.Content -notmatch "matchingSurveyLink") {
        throw "Live Services page verification failed."
    }

    Write-Host "Live verification passed for Contact and Services."
    Write-Host "If a device still shows old content, purge Hostinger cache and refresh that device."
}
finally {
    if (Test-Path -LiteralPath $archivePath) {
        Remove-Item -LiteralPath $archivePath -Force
    }
}
