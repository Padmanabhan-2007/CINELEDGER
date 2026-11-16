@echo off
title CineLedger Frontend [Port 5173]
echo ========================================================
echo  Starting CineLedger Vite Frontend (Port 5173)
echo ========================================================
cd /d "%~dp0frontend"
call npm run dev -- --host 0.0.0.0 --port 5173
pause
