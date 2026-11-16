@echo off
title CineLedger Backend [Port 8088]
echo ========================================================
echo  Starting CineLedger Spring Boot Backend (Port 8088)
echo ========================================================
cd /d "%~dp0cineledger\backend"
set "JAVA_HOME=C:\Program Files\Java\jdk-23"
set "PATH=%JAVA_HOME%\bin;%PATH%"
set "MAVEN_BASEDIR=%~dp0cineledger\backend"
call mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=dev -Dspring-boot.run.arguments="--server.port=8088 --spring.profiles.active=dev"
pause
