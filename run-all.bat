@echo off
title CineLedger Full-Stack Launcher
echo ========================================================
echo   Launching CineLedger 2.0 (Backend + Frontend)
echo ========================================================
echo.
echo [1/2] Starting Backend in new window...
start "CineLedger Backend [Port 8088]" cmd /k "%~dp0run-backend.bat"

echo.
echo [2/2] Starting Frontend in new window...
start "CineLedger Frontend [Port 5173]" cmd /k "%~dp0run-frontend.bat"

echo.
echo ========================================================
echo   Services are starting up!
echo   ------------------------------------------------------
echo   Frontend Application: http://localhost:5173
echo   H2 Database Console:  http://localhost:8088/h2-console
echo   Backend Health API:   http://localhost:8088/api/health
echo ========================================================
echo.
timeout /t 5
