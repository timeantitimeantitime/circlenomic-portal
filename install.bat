@echo off
echo === Circlenomic Portal Installer ===
echo.

REM Check for Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Node.js not found.
    echo Please install Node.js from https://nodejs.org
    echo Choose the LTS version, then run this script again.
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do echo Node.js found: %%i

REM Check for npm
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo npm not found. Please reinstall Node.js.
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('npm --version') do echo npm found: %%i
echo.

REM Setup ravend binary
set BIN_DIR=%~dp0mining-layer\bin
if not exist "%BIN_DIR%" mkdir "%BIN_DIR%"

if exist "%BIN_DIR%\ravend.exe" (
    echo ravend binaries found in %BIN_DIR%
) else (
    echo Please download Ravencoin from:
    echo https://github.com/RavenProject/Ravencoin/releases
    echo.
    echo Download raven-4.3.2.1-win64.zip
    echo Extract ravend.exe and raven-cli.exe to:
    echo   %BIN_DIR%
    echo.
    pause
)
echo.

REM Install npm dependencies
echo Installing dependencies...
cd /d "%~dp0portal"
call npm install
echo.

REM Create start script
(
    echo @echo off
    echo cd /d "%%~dp0"
    echo set PATH=%%~dp0mining-layer\bin;%%PATH%%
    echo cd portal
    echo echo Starting Circlenomic Portal...
    echo npm start
    echo pause
) > "%~dp0start.bat"

echo === Installation Complete ===
echo.
echo To start the portal:
echo   double-click start.bat
echo.
echo Or manually:
echo   cd portal ^&^& npm start
echo.
pause
