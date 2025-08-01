# Script PowerShell pour démarrer tous les services
Write-Host "🚀 Démarrage des services..." -ForegroundColor Green

# Fonction pour démarrer un service
function Start-Service {
    param(
        [string]$ServiceName,
        [string]$ServicePath,
        [int]$Port
    )
    
    Write-Host "Starting $ServiceName on port $Port..." -ForegroundColor Yellow
    
    # Démarrer le service en arrière-plan
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$ServicePath'; npm run dev" -WindowStyle Minimized
    
    # Attendre un peu pour que le service démarre
    Start-Sleep -Seconds 3
    
    Write-Host "$ServiceName started successfully" -ForegroundColor Green
}

# Démarrer tous les services
$projectPath = Get-Location

Start-Service -ServiceName "User Service" -ServicePath "$projectPath\backend\user-service" -Port 3001
Start-Service -ServiceName "Student Service" -ServicePath "$projectPath\backend\student-service" -Port 3002
Start-Service -ServiceName "Company Service" -ServicePath "$projectPath\backend\company-service" -Port 3003
Start-Service -ServiceName "Committee Service" -ServicePath "$projectPath\backend\committee-service" -Port 3004
Start-Service -ServiceName "Interview Service" -ServicePath "$projectPath\backend\interview-service" -Port 3005

Write-Host "✅ Tous les services sont démarrés" -ForegroundColor Green
Write-Host ""
Write-Host "Services disponibles:" -ForegroundColor Cyan
Write-Host "- User Service: http://localhost:3001" -ForegroundColor White
Write-Host "- Student Service: http://localhost:3002" -ForegroundColor White
Write-Host "- Company Service: http://localhost:3003" -ForegroundColor White
Write-Host "- Committee Service: http://localhost:3004" -ForegroundColor White
Write-Host "- Interview Service: http://localhost:3005" -ForegroundColor White
Write-Host ""
Write-Host "Appuyez sur une touche pour fermer cette fenêtre..." -ForegroundColor Yellow
Read-Host 