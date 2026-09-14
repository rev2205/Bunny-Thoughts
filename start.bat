@echo off
title Starting Bunny Thoughts...
echo ===================================================
echo 🐰 Starting Bunny Thoughts Full-Stack Application...
echo ===================================================
echo.

cd /d "%~dp0"

:: 1. Backend Setup & Seeding
echo [1/4] Checking Backend environment...
cd backend
if not exist "venv" (
    echo Creating Python virtual environment...
    python -m venv venv
)
call .\venv\Scripts\activate.bat
echo Installing backend dependencies if needed...
python -m pip install -r requirements.txt --quiet

echo Seeding database...
python seed.py

echo Starting FastAPI Backend server on http://127.0.0.1:8000 ...
start "Bunny Thoughts - Backend (FastAPI)" cmd /k "cd /d "%~dp0backend" && call .\venv\Scripts\activate.bat && uvicorn app.main:app --reload --host 127.0.0.1 --port 8000"

:: 2. Frontend Setup
cd /d "%~dp0frontend"
echo [2/4] Checking Frontend environment...
if not exist "node_modules" (
    echo Installing frontend node packages...
    npm install
)

echo Starting Vite Frontend server on http://localhost:5173 ...
start "Bunny Thoughts - Frontend (Vite)" cmd /k "cd /d "%~dp0frontend" && npm run dev"

:: 3. Launch Browser
echo [3/4] Waiting for services to initialize...
timeout /t 3 /nobreak >nul

echo [4/4] Opening Bunny Thoughts in your default browser...
start http://localhost:5173

echo.
echo ===================================================
echo 🚀 Bunny Thoughts is running!
echo 🌐 Frontend:     http://localhost:5173
echo ⚡ Backend API:   http://localhost:8000
echo 📄 Swagger Docs: http://localhost:8000/docs
echo ===================================================
echo To stop all servers, run .\stop.bat or close the opened command windows.
echo.
pause
