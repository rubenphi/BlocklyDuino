@echo off
setlocal
chcp 65001 >nul
title Quitar configuracion WebUSB BlocklyDuino

rem ============================================================
rem  Revierte la configuracion hecha por
rem  configurar_webusb_admin.cmd. Ejecutar como administrador.
rem  Chrome/Edge deben estar cerrados.
rem ============================================================

net session >nul 2>&1
if errorlevel 1 (
    echo [!] Necesitas permisos de administrador.
    echo     Clic derecho > "Ejecutar como administrador".
    echo.
    pause
    exit /b 1
)

reg delete "HKLM\Software\Policies\Google\Chrome\UnsafelyTreatInsecureOriginAsSecure" /f >nul 2>&1
reg delete "HKLM\Software\Policies\Microsoft\Edge\UnsafelyTreatInsecureOriginAsSecure" /f >nul 2>&1

echo [OK] Configuracion eliminada.
echo     Cierra y vuelve a abrir Chrome/Edge para aplicar.
echo.
pause