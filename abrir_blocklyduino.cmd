@echo off
setlocal EnableDelayedExpansion
chcp 65001 >nul
title BlocklyDuino - abrir en navegador compatible

rem ============================================================
rem  PLAN B (sin permisos de administrador).
rem  Abre Chrome o Edge ya configurado con WebUSB/WebSerial para
rem  el servidor de la clase. No necesita instalacion y no toca
rem  el sistema: usa un perfil de navegador aparte.
rem
rem  Mostrara un aviso "You are using an unsupported command-line
rem  flag". Es normal e inofensivo; ignoralo.
rem
rem  EDITAR ORIGEN y URL para tu clase.
rem ============================================================

rem -- URL del servidor (la que usas en la barra de direcciones) --
set "URL=http://192.168.101.8:8080"
set "ORIGEN=http://192.168.101.8:8080"
rem ============================================================

rem Perfil aislado para que la flag aplique aunque Chrome ya este abierto
set "PROFILE_DIR=%USERPROFILE%\.blocklyduino_webusb"

rem Buscar Chrome
set "CHROME="
for %%P in (
  "%ProgramFiles%\Google\Chrome\Application\chrome.exe"
  "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
  "%LocalAppData%\Google\Chrome\Application\chrome.exe"
) do if exist "%%~P" set "CHROME=%%~P"

rem Buscar Edge
set "EDGE="
for %%P in (
  "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"
  "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe"
) do if exist "%%~P" set "EDGE=%%~P"

set "BROWSER="
if defined CHROME set "BROWSER=!CHROME!"
if not defined BROWSER if defined EDGE set "BROWSER=!EDGE!"

if not defined BROWSER (
    echo [!] No se encontro Chrome ni Edge.
    echo     Instala Chrome o Edge y vuelve a ejecutar.
    echo.
    pause
    exit /b 1
)

echo Abriendo!BROWSER! para %URL%
start "" "!BROWSER!" --user-data-dir="!PROFILE_DIR!" --unsafely-treat-insecure-origin-as-secure="!ORIGEN!" "!URL!"
endlocal