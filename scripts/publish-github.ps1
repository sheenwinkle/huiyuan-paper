param(
  [string]$RepoName = "huiyuan-paper",
  [switch]$Private
)

$ErrorActionPreference = "Stop"

$Gh = "C:\Program Files\GitHub CLI\gh.exe"
if (-not (Test-Path $Gh)) {
  throw "GitHub CLI not found at $Gh"
}

& $Gh auth status

$visibility = if ($Private) { "--private" } else { "--public" }

if (-not (git remote get-url origin 2>$null)) {
  & $Gh repo create $RepoName $visibility --source . --remote origin --push
} else {
  git push -u origin main
}

& $Gh repo view --web

