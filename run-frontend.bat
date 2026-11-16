@echo off
title CineLedger Frontend [Port 5173]
echo ========================================================
echo  Starting CineLedger Vite Frontend (Port 5173)
echo ========================================================
cd /d "%~dp0cineledger\frontend"
call npm run dev
pause
