@echo off
title CineLedger Production Preview [Port 4173]
echo ========================================================
echo  Starting CineLedger Production Build (Port 4173)
echo ========================================================
cd /d "%~dp0frontend"
call npm run preview
pause

