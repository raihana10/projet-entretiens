# Script pour démarrer le frontend React
Write-Host "🚀 Démarrage du Frontend Interview Manager..." -ForegroundColor Green

# Vérifier si Node.js est installé
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js n'est pas installé. Veuillez l'installer depuis https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Vérifier si npm est installé
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "❌ npm n'est pas installé. Veuillez l'installer avec Node.js." -ForegroundColor Red
    exit 1
}

# Aller dans le dossier frontend
Set-Location "frontend"

# Vérifier si node_modules existe
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installation des dépendances..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erreur lors de l'installation des dépendances" -ForegroundColor Red
        exit 1
    }
}

# Démarrer l'application
Write-Host "🌐 Démarrage de l'application React..." -ForegroundColor Green
Write-Host "📍 L'application sera accessible à: http://localhost:3000" -ForegroundColor Cyan
Write-Host "⏹️  Appuyez sur Ctrl+C pour arrêter" -ForegroundColor Yellow

npm start 