# CineLedger Full-Stack Launcher (PowerShell)
$root = Join-Path $PSScriptRoot "cineledger"
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "   Launching CineLedger Full-Stack System" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

Write-Host "`n[1/2] Starting Spring Boot Backend with H2 Database on port 8080..." -ForegroundColor Yellow
Start-Process -FilePath "cmd.exe" -ArgumentList "/c `"$root\run-backend.bat`""

Start-Sleep -Seconds 3

Write-Host "[2/2] Starting React Vite Frontend on port 5173..." -ForegroundColor Yellow
Start-Process -FilePath "cmd.exe" -ArgumentList "/c `"$root\run-frontend.bat`""

Write-Host "`n========================================================" -ForegroundColor Green
Write-Host "   Both services have been launched in separate windows!" -ForegroundColor Green
Write-Host "   Frontend App:   http://localhost:5173" -ForegroundColor White
Write-Host "   H2 DB Console:  http://localhost:8080/h2-console" -ForegroundColor White
Write-Host "   Backend API:    http://localhost:8080/api/health" -ForegroundColor White
Write-Host "========================================================" -ForegroundColor Green
