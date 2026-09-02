@echo off
setlocal EnableDelayedExpansion
chcp 65001 >nul
title Configurar WebUSB BlocklyDuino (una vez por PC)

rem ============================================================
rem  Configura Chrome y Edge para permitir WebUSB/WebSerial
rem  hacia el servidor de BlocklyDuino en esta red local.
rem
rem  EJECUTAR UNA SOLA VEZ COMO ADMINISTRADOR por cada PC de
rem  alumno: clic derecho sobre el archivo > "Ejecutar como
rem  administrador".
rem
rem  No instala drivers ni programas. Solo escribe una clave de
rem  registro estandar de Chrome/Edge limitada al origin del
rem  servidor de la clase. Reversible con el script
rem  "quitar_configuracion_webusb.cmd".
rem
rem  EDITAR la linea ORIGEN para que coincida con la URL del
rem  servidor (IP y puerto) de tu clase.
rem ============================================================

rem -- URL del servidor (esquema + IP/nombre + puerto) --
set "ORIGEN=http://192.168.0.100:81"
rem -- Opcional: mas origins separados (max 5) --
set "ORIGEN2="
set "ORIGEN3="
set "ORIGEN4="
set "ORIGEN5="
rem ============================================================

rem -- Comprobar permisos de administrador --
net session >nul 2>&1
if errorlevel 1 (
    echo [!] Necesitas permisos de administrador.
    echo     Clic derecho sobre este archivo y elige:
    echo     "Ejecutar como administrador".
    echo.
    pause
    exit /b 1
)

if "%ORIGEN%"=="" (
    echo [!] La variable ORIGEN esta vacia. Edita el archivo primero.
    pause
    exit /b 1
)

echo Configurando Chrome y Edge para: %ORIGEN%
echo.

set "CHROME_KEY=HKLM\Software\Policies\Google\Chrome\UnsafelyTreatInsecureOriginAsSecure"
set "EDGE_POL=HKLM\Software\Policies\Microsoft\Edge\UnsafelyTreatInsecureOriginAsSecure"
reg add "%CHROME_KEY%" /f >nul
reg add "%EDGE_POL%" /f >nul

set /a cnt=0
for %%O in ("%ORIGEN%" "%ORIGEN2%" "%ORIGEN3%" "%ORIGEN4%" "%ORIGEN5%") do (
    if not "%%~O"=="" (
        set /a cnt+=1
        reg add "%CHROME_KEY%" /v !cnt! /t REG_SZ /d "%%~O" /f >nul
        reg add "%EDGE_POL%" /v !cnt! /t REG_SZ /d "%%~O" /f >nul
    )
)

echo.
echo Verificacion (debe aparecer el origin configurado):
reg query "HKLM\Software\Policies\Google\Chrome\UnsafelyTreatInsecureOriginAsSecure" 2>nul | findstr /R "1 ". >nul && (
    echo [OK] Politica de Chrome aplicada.
) || (
    echo [!] No se pudo verificar la politica de Chrome.
)
reg query "HKLM\Software\Policies\Microsoft\Edge\UnsafelyTreatInsecureOriginAsSecure" 2>nul | findstr /R "." >nul && (
    echo [OK] Politica de Edge aplicada.
) || (
    echo [!] No se pudo verificar la politica de Edge.
)
echo.
echo [LISTO] Cierra Chrome y Edge por completo y vuelve
echo     a abrirlo. Ya no hace falta ninguna flag.
echo     El origin "http://IP:8080" se tratara como seguro.
echo.
echo     Para revertir: ejecuta quitar_configuracion_webusb.cmd
echo.
pause