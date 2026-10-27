@echo off
cd /d "%~dp0"
title World Recipe Archive - Server Launcher
color 0A

echo Starting World Recipe Archive server...
echo.

:: Launch browser after a 2-second delay in background
start "" cmd /c "timeout /t 2 /nobreak >nul && start http://127.0.0.1:5000"

:: Start the Flask app
python\python.exe app.py

pause