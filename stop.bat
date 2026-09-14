@echo off
title Stopping Bunny Thoughts...
echo ===================================================
echo 🐰 Stopping Bunny Thoughts Application...
echo ===================================================
echo.

:: Kill processes matching window titles
taskkill /FI "WINDOWTITLE eq Bunny Thoughts - Backend*" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq Bunny Thoughts - Frontend*" /F >nul 2>&1

:: Kill processes listening on ports 8000 (FastAPI) and 5173 (Vite)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8000" ^| findstr "LISTENING"') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173" ^| findstr "LISTENING"') do taskkill /F /PID %%a >nul 2>&1

echo ✅ Bunny Thoughts backend and frontend servers have been stopped.
echo.
pause
