$dir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location "$dir\backend"
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host " Starting CineLedger Backend with H2 Database (Port 8080)" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
$env:JAVA_HOME = "C:\Program Files\Java\jdk-23"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"

# Run Spring Boot via Maven wrapper with dev profile
.\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=dev -Dspring-boot.run.arguments="--server.port=8080 --spring.profiles.active=dev"
