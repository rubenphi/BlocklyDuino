@echo off
setlocal EnableDelayedExpansion

echo ============================================================
echo  Instalacion del Servidor de Compilacion BlocklyDuino
echo ============================================================
echo.

rem 1. Python y websockets
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] No se encontro Python. Instala Python 3.6+ desde
    echo         https://www.python.org/downloads/ y vuelve a ejecutar.
    pause
    exit /b 1
)
echo [1/4] Instalando la libreria websockets...
python -m pip install websockets
if errorlevel 1 (
    echo [ERROR] Fallo al instalar websockets.
    pause
    exit /b 1
)

rem 2. arduino-cli
where arduino-cli >nul 2>&1
if errorlevel 1 (
    echo [2/4] arduino-cli no encontrado en el PATH. Omitiendo pasos 3 y 4.
    echo        Descargalo desde: https://arduino.github.io/arduino-cli/installation/
    echo        Agrega el ejecutable al PATH o usa --cli-path al iniciar el servidor.
    echo.
    goto listo
)
echo [2/4] arduino-cli encontrado.

rem 3. Cores
echo [3/4] Instalando core esp32:esp32 (puede tardar varios minutos)...
arduino-cli core install esp32:esp32
echo.
echo [4/4] Instalando core arduino:avr...
arduino-cli core install arduino:avr

:listo
echo.
echo ============================================================
echo  Instalacion completa.
echo.
echo  Inicia el servidor con:
echo      python servidor_compilacion.py
echo.
echo  Y abre en el navegador (Chrome/Edge): http://localhost:8080
echo ============================================================
pause