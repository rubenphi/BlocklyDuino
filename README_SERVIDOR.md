# Servidor de Compilación BlocklyDuino

Servidor que compila código para Arduino/ESP32 con `arduino-cli` y sirve la
aplicación web BlocklyDuino v2. El navegador del alumno se conecta al servidor
vía HTTP y WebSocket, envía el código, recibe el binario compilado y flashea el
dispositivo conectado por USB usando WebUSB.

```
ESP32/Arduino ──USB──> Navegador del alumno ──HTTP/WebSocket──> Servidor (arduino-cli)
```

## Requisitos

### 1. Python 3.6 o superior

Incluido en Windows 10/11 si se marca durante la instalación, o desde
https://www.python.org/downloads/.

### 2. Librería `websockets`

```
pip install websockets
```

### 3. arduino-cli

Descargar el binario para tu sistema desde:
`https://arduino.github.io/arduino-cli/installation/`

Agregar el ejecutable al `PATH` para que el servidor lo encuentre, o
indicar la ruta al iniciar con `--cli-path`.

### 4. Cores (plataformas) de Arduino

Instalar los cores empleados por las placas soportadas:

```
arduino-cli core install esp32:esp32
arduino-cli core install arduino:avr
```

### 5. Navegador

La conexión WebSerial/WebUSB requiere un contexto seguro. Por eso Chrome o
Edge solo la exponen en `http://localhost` o en **HTTPS**. Para usar la
aplicación desde otros PCs de la red por `http://IP:8080` hay que decirle al
navegador que trate esa dirección como segura. No hace falta tocar
`chrome://flags` en cada alumno; se hace con un script (ver abajo).

## Puesta en marcha

```
python servidor_compilacion.py [--port 8080] [--cli-path ruta/arduino-cli]
```

Opciones:

| Opción         | Default   | Descripción                          |
|----------------|-----------|--------------------------------------|
| `--port`       | `8080`    | Puerto HTTP (sirve la web)           |
| `--ws-port`    | `8081`    | Puerto WebSocket (`port` + 1)        |
| `--host`       | `0.0.0.0` | IP a la que escucha                  |
| `--cli-path`   | auto      | Ruta al ejecutable de arduino-cli    |
| `--web-dir`    | `v2/`     | Carpeta con los archivos web         |
| `--verbose`    | off       | Compilación de Arduino en modo verbose |

## Navegadores de los alumnos (configuración en red local)

Para que WebSerial funcione desde la `http://IP:8080` del servidor en otros
equipos hay que marcar ese origin como seguro. Dos opciones:

### Opción A (recomendada): script de política, una vez por PC

En cada equipo de alumno, con permisos de administrador, ejecutar **una sola
vez**:

```
configurar_webusb_admin.cmd
```

(clic derecho > *Ejecutar como administrador*). Antes, editar la línea
`set "ORIGEN=http://IP:8080"` al inicio del archivo para que coincida con la
IP del servidor de la clase. El script escribe la política empresarial de
Chrome/Edge (`UnsafelyTreatInsecureOriginAsSecure`) limitada a ese origin:
no instala nada, no toca flags, y queda configurado de forma permanente.
Para revertir:

```
quitar_configuracion_webusb.cmd
```

### Opción B (sin administrador): lanzador

Si los alumnos no tienen permisos, distribuir el archivo
`abrir_blocklyduino.cmd` (editar también la IP) y hacer que lo ejecuten. Abre
Chrome o Edge con la bandera aplicada usando un perfil aparte; es inofensivo y
no modifica el sistema, aunque muestra un aviso de "flag experimental" que se
puede ignorar.

## Uso

1. Iniciar el servidor en el equipo del docente.
2. Cada alumno abre el navegador (Chrome/Edge) y conecta su placa por USB.
3. En BlocklyDuino, elegir la placa, armar el programa con bloques y pulsar
   **Subir**. El código `.ino` se envía al servidor, se compila, y el binario
   resultante se flashea en la placa.

### Placas soportadas

| Placa en BlocklyDuino | FQBN de arduino-cli             |
|-----------------------|---------------------------------|
| ESP32 DevKit          | `esp32:esp32:esp32`             |
| ESP32-C3 Mini         | `esp32:esp32:esp32c3`           |
| Arduino Uno           | `arduino:avr:uno`               |
| Arduino Nano          | `arduino:avr:nano:cpu=atmega328old` |
| Arduino Mega          | `arduino:avr:mega:cpu=atmega2560`   |

## Cómo compila el servidor

- Para ESP32 usa el archivo `*.ino.merged.bin` que genera `arduino-cli`
  (bootloader + tabla de particiones + aplicación ya combinadas) y lo envía
  al navegador, que lo flashea en la dirección `0x0` con esptool-js.
- Para AVR busca el binario `.hex`/`.bin` compilado (el flasheo en el
  navegador para AVR aún no está soportado).
- **Solo se usan las librerías del proyecto** (`v2/ablibs_cli`): cada
  compilación pasa `--libraries v2/ablibs_cli` y un `--config-file` propio del
  servidor (`servidor_data/arduino-cli-config.json`) que redefine
  `directories.user`, por lo que arduino-cli **ignora por completo la carpeta
  personal de Arduino** del ordenador (p. ej. `Documentos/Arduino/libraries`).
  Así, si hay una librería con el mismo nombre/header instalada en el PC
  personal, no interfiere con la del servidor.

## Solución de problemas

- **"No se encontro arduino-cli"**: instalar arduino-cli y añadirlo al `PATH`,
  o pasar `--cli-path`.
- **WebSerial no disponible (no aparece el puerto)**: usar Chrome/Edge con la
  configuración de la sección anterior (script de política o lanzador) y
  acceder por la URL exacta configurada.
- **La placa no aparece en el selector**: el USB bridge (p. ej. CH340) puede
  necesitar driver WinUSB (instalable con Zadig) para WebUSB.
- **Primera compilación lenta**: `arduino-cli core install` debe descargar las
  herramientas del core la primera vez.