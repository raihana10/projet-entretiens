# Script pour démarrer tous les services (Backend + Frontend)
Write-Host "🚀 Démarrage complet du système Interview Manager..." -ForegroundColor Green

# Vérifier si les services backend sont démarrés
Write-Host "🔍 Vérification des services backend..." -ForegroundColor Yellow

$backendServices = @(
    @{ Name = "User Service"; Port = 3001 },
    @{ Name = "Student Service"; Port = 3002 },
    @{ Name = "Interview Service"; Port = 3003 },
    @{ Name = "Committee Service"; Port = 3004 },
    @{ Name = "Company Service"; Port = 3005 }
)

$allBackendRunning = $true

foreach ($service in $backendServices) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:$($service.Port)/health" -TimeoutSec 2 -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ $($service.Name) (Port $($service.Port)) - En cours d'exécution" -ForegroundColor Green
        } else {
            Write-Host "❌ $($service.Name) (Port $($service.Port)) - Erreur" -ForegroundColor Red
            $allBackendRunning = $false
        }
    } catch {
        Write-Host "❌ $($service.Name) (Port $($service.Port)) - Non démarré" -ForegroundColor Red
        $allBackendRunning = $false
    }
}

if (-not $allBackendRunning) {
    Write-Host "⚠️  Certains services backend ne sont pas démarrés." -ForegroundColor Yellow
    Write-Host "💡 Exécutez d'abord: .\start-services.ps1" -ForegroundColor Cyan
    $response = Read-Host "Voulez-vous continuer quand même ? (y/N)"
    if ($response -ne "y" -and $response -ne "Y") {
        Write-Host "❌ Arrêt du script" -ForegroundColor Red
        exit 1
    }
}

# Démarrer le frontend
Write-Host "🌐 Démarrage du frontend..." -ForegroundColor Green

# Aller dans le dossier frontend
Set-Location "frontend"

# Vérifier si node_modules existe
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installation des dépendances frontend..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erreur lors de l'installation des dépendances frontend" -ForegroundColor Red
        exit 1
    }
}

# Retourner au dossier racine
Set-Location ".."

Write-Host "🎉 Tous les services sont prêts !" -ForegroundColor Green
Write-Host "📍 Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🔧 Backend Services:" -ForegroundColor Cyan
foreach ($service in $backendServices) {
    Write-Host "   - $($service.Name): http://localhost:$($service.Port)" -ForegroundColor Gray
}

Write-Host "⏹️  Appuyez sur Ctrl+C pour arrêter le frontend" -ForegroundColor Yellow

# Démarrer le frontend
Set-Location "frontend"
npm start 