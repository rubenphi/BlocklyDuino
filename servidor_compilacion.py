#!/usr/bin/env python3
"""
BlocklyDuino Compilation Server

Compila código .ino usando arduino-cli y sirve la aplicación web.
El navegador del alumno se conecta vía WebSocket para enviar el código,
recibe el binario compilado, y flashea el dispositivo vía WebUSB.

Uso:
    python servidor_compilacion.py [--port 8080] [--cli-path arduino-cli]

Requisitos:
    - Python 3.6+
    - pip install websockets
    - arduino-cli instalado (o especificar ruta con --cli-path)
"""

import argparse
import asyncio
import json
import logging
import os
import platform
import shutil
import subprocess
import sys
import tempfile
import binascii

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s'
)
log = logging.getLogger('blocklyduino')

try:
    import websockets
except ImportError:
    log.error('Falta la libreria websockets. Instala con: pip install websockets')
    sys.exit(1)


# ─── Board definitions ───────────────────────────────────────────────
BOARD_MAP = {
    'arduino_uno':       'arduino:avr:uno',
    'arduino_nano':      'arduino:avr:nano:cpu=atmega328old',
    'arduino_mega':      'arduino:avr:mega:cpu=atmega2560',
    'arduino_leonardo':  'arduino:avr:leonardo',
    'arduino_micro':     'arduino:avr:micro',
    'arduino_mini':      'arduino:avr:mini',
    'arduino_pro8':      'arduino:avr:pro:cpu=8MHzatmega328',
    'arduino_pro16':     'arduino:avr:pro:cpu=16MHzatmega328',
    'arduino_yun':       'arduino:avr:yun',
    'lilypad':           'arduino:avr:lilypad',
    'esp32_devkit':      'esp32:esp32:esp32',
    'esp32_c3_mini':     'esp32:esp32:esp32c3',
}

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))


def get_arduino_library_paths():
    """Return (config_file, ablibs_dir) for arduino-cli compile.

    Sets directories.user to a folder owned by the project so arduino-cli
    resolves libraries from v2/ablibs_cli (--libraries) instead of the
    teacher's personal Arduino sketchbook. Personal libraries such as the
    Windows 'Documentos/Arduino/libraries' folder are then never scanned,
    even when a library there shares the name/header of one shipped here.
    """
    ablibs_dir = os.path.join(SCRIPT_DIR, 'v2', 'ablibs_cli')
    data_dir = os.path.join(SCRIPT_DIR, 'servidor_data')
    user_dir = os.path.join(data_dir, 'arduino_user')
    os.makedirs(os.path.join(user_dir, 'libraries'), exist_ok=True)

    config_file = os.path.join(data_dir, 'arduino-cli-config.json')
    if not os.path.isfile(config_file):
        config = {'directories': {'user': user_dir.replace('\\', '/')}}
        with open(config_file, 'w', encoding='utf-8') as f:
            json.dump(config, f, indent=2)
        log.info('Config arduino-cli generado en: %s (user=%s)', config_file, user_dir)

    return config_file, ablibs_dir


def find_arduino_cli(path=None):
    """Find arduino-cli executable."""
    if path and os.path.isfile(path):
        return path

    # Check PATH
    found = shutil.which('arduino-cli')
    if found:
        return found

    # Common install locations
    system = platform.system()
    candidates = []
    if system == 'Windows':
        candidates = [
            os.path.expanduser('~\\arduino-cli\\arduino-cli.exe'),
            'C:\\Program Files\\arduino-cli\\arduino-cli.exe',
            'C:\\Program Files (x86)\\arduino-cli\\arduino-cli.exe',
        ]
    elif system == 'Linux':
        candidates = [
            os.path.expanduser('~/bin/arduino-cli'),
            '/usr/local/bin/arduino-cli',
            '/usr/bin/arduino-cli',
        ]
    else:  # macOS
        candidates = [
            os.path.expanduser('~/bin/arduino-cli'),
            '/usr/local/bin/arduino-cli',
        ]

    for c in candidates:
        if os.path.isfile(c):
            return c

    return None


def ensure_core_installed(cli_path):
    """Check that arduino-cli core is installed, warn if not."""
    try:
        result = subprocess.run(
            [cli_path, 'core', 'list', '--format', 'json'],
            capture_output=True, text=True, timeout=30
        )
        if result.returncode != 0:
            log.warning('arduino-cli core list fallo: %s', result.stderr)
            return

        cores = json.loads(result.stdout) if result.stdout.strip() else []
        installed_ids = [c.get('id', '') for c in cores]

        # Check if any of our boards need missing cores
        needed_cores = set()
        for board_id in BOARD_MAP.values():
            core = board_id.split(':')[0] + ':' + board_id.split(':')[1]
            needed_cores.add(core)

        for core in needed_cores:
            if core not in installed_ids:
                log.warning(
                    'Core "%s" no instalado. Ejecuta: arduino-cli core install %s',
                    core, core
                )

    except Exception as e:
        log.warning('No se pudieron verificar cores instalados: %s', e)


def compile_sketch(cli_path, code, board_fqbn, verbose=False):
    """
    Compile .ino code and return (success, output, binary_data).

    For ESP32 boards, uses the merged.bin that arduino-cli generates
    (bootloader + partitions + boot_app0 + app, all from the build output),
    so the server never touches installed core files directly.

    Returns:
        (True, build_output, bytes) on success
        (False, error_output, error_message) on failure
    """
    tmpdir = tempfile.mkdtemp(prefix='blocklyduino_')
    build_dir = os.path.join(tmpdir, 'build')
    os.makedirs(build_dir, exist_ok=True)
    try:
        sketch_name = os.path.basename(tmpdir)
        sketch_path = os.path.join(tmpdir, sketch_name + '.ino')

        with open(sketch_path, 'w', encoding='utf-8') as f:
            f.write(code)
            f.write('\n')

        log.info('Sketch guardado en: %s', sketch_path)

        # Build command with --build-path for predictable output
        config_file, ablibs_dir = get_arduino_library_paths()
        cmd = [cli_path, 'compile',
               '--config-file', config_file,
               '--libraries', ablibs_dir,
               '--fqbn', board_fqbn,
               '--build-path', build_dir]
        if verbose:
            cmd.append('--verbose')
        cmd.append(tmpdir)

        log.info('Compilando: %s', ' '.join(cmd))
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=180)

        if result.returncode != 0:
            error_msg = result.stderr or result.stdout
            log.error('Compilacion fallida:\n%s', error_msg)
            return False, result.stdout + result.stderr, error_msg

        prefix = sketch_name + '.ino.'

        if 'esp32' in board_fqbn:
            # arduino-cli/ESP32 core generates: {sketch}.ino.merged.bin with
            # bootloader@0x1000, partitions@0x8000, boot_app0@0xe000, app@0x10000
            # already merged and padded to the full flash size (zeros).
            merged_path = os.path.join(build_dir, prefix + 'merged.bin')
            if not os.path.isfile(merged_path):
                log.error('No se encontro merged.bin en build')
                return False, result.stdout, 'No se encontro {sketch}.ino.merged.bin'

            with open(merged_path, 'rb') as f:
                binary_data = f.read()
            # Trim trailing 0xFF padding (merge_bin pads to the full flash size
            # with 0xFF, the erased-flash state). Trailing 0xFF is "not
            # programmed", so dropping it does not change what runs on device.
            trimmed = binary_data.rstrip(b'\xff')
            log.info('merged.bin: %d bytes -> %d bytes tras recortar padding',
                     len(binary_data), len(trimmed))
            binary_data = trimmed
            return True, result.stdout, binary_data

        # Non-ESP32 boards: locate the compiled binary
        hex_path = None
        for root, dirs, files in os.walk(build_dir):
            for f in files:
                if f.endswith(('.hex', '.bin', '.elf', '.uf2')):
                    hex_path = os.path.join(root, f)
                    break
            if hex_path:
                break

        if not hex_path:
            return False, result.stdout, 'No se encontro archivo compilado (.hex/.bin/.elf)'

        log.info('Compilacion exitosa: %s', hex_path)
        with open(hex_path, 'rb') as f:
            binary_data = f.read()
        log.info('Binario leido: %d bytes', len(binary_data))
        return True, result.stdout, binary_data

    except subprocess.TimeoutExpired:
        return False, '', 'Tiempo de compilacion agotado (180s)'
    except Exception as e:
        return False, '', str(e)
    finally:
        shutil.rmtree(tmpdir, ignore_errors=True)


async def handle_compile(ws, cli_path):
    """Handle a WebSocket connection for compilation."""
    log.info('Cliente conectado: %s', ws.remote_address)

    try:
        async for message in ws:
            try:
                request = json.loads(message)
            except json.JSONDecodeError:
                await ws.send(json.dumps({
                    'status': 'error',
                    'error': 'JSON invalido'
                }))
                continue

            action = request.get('action', '')
            request_id = request.get('id', '')

            if action == 'compile':
                await handle_compile_action(ws, cli_path, request, request_id)
            else:
                await ws.send(json.dumps({
                    'status': 'error',
                    'error': 'Accion desconocida: ' + action,
                    'id': request_id
                }))

    except websockets.exceptions.ConnectionClosed:
        log.info('Cliente desconectado: %s', ws.remote_address)
    except Exception as e:
        log.error('Error manejando conexion: %s', e)


async def handle_compile_action(ws, cli_path, request, request_id):
    """Handle a compile request."""
    code = request.get('code', '')
    fqbn = request.get('fqbn', '')
    verbose = request.get('verbose', False)

    if not code.strip():
        await ws.send(json.dumps({
            'status': 'error',
            'error': 'Codigo vacio',
            'id': request_id
        }))
        return

    if not fqbn or fqbn == 'none':
        board_id = request.get('board', '')
        fqbn = BOARD_MAP.get(board_id, '')
    if fqbn not in BOARD_MAP.values():
        await ws.send(json.dumps({
            'status': 'error',
            'error': 'Placa no seleccionada o no soportada. '
                     'Elige una placa (por ejemplo ESP32 DevKit) antes de compilar.',
            'id': request_id
        }))
        return

    await ws.send(json.dumps({
        'status': 'compiling',
        'fqbn': fqbn,
        'id': request_id
    }))

    loop = asyncio.get_event_loop()
    success, output, result = await loop.run_in_executor(
        None, compile_sketch, cli_path, code, fqbn, verbose
    )

    if success:
        binary_data = result
        hex_data = binascii.hexlify(binary_data).decode('ascii')
        log.info('Compilacion exitosa: %d bytes', len(binary_data))

        await ws.send(json.dumps({
            'status': 'compiled',
            'output': output,
            'binary_hex': hex_data,
            'fqbn': fqbn,
            'id': request_id
        }))
    else:
        await ws.send(json.dumps({
            'status': 'error',
            'error': result,
            'output': output,
            'id': request_id
        }))


async def main():
    parser = argparse.ArgumentParser(
        description='BlocklyDuino Compilation Server'
    )
    parser.add_argument(
        '--port', type=int, default=8080,
        help='Puerto del servidor HTTP (default: 8080)'
    )
    parser.add_argument(
        '--ws-port', type=int, default=8081,
        help='Puerto del servidor WebSocket (default: 8081)'
    )
    parser.add_argument(
        '--cli-path', type=str, default=None,
        help='Ruta a arduino-cli'
    )
    parser.add_argument(
        '--host', type=str, default='0.0.0.0',
        help='Host del servidor (default: 0.0.0.0)'
    )
    parser.add_argument(
        '--verbose', action='store_true',
        help='Compilacion verbose por defecto'
    )
    parser.add_argument(
        '--web-dir', type=str, default=None,
        help='Directorio de archivos web (default: v2/)'
    )

    args = parser.parse_args()

    # Find arduino-cli
    cli_path = find_arduino_cli(args.cli_path)
    if not cli_path:
        log.error(
            'No se encontro arduino-cli.\n'
            'Instala desde: https://arduino.github.io/arduino-cli/installation/\n'
            'O especifica la ruta con: --cli-path /ruta/a/arduino-cli'
        )
        sys.exit(1)

    log.info('Usando arduino-cli: %s', cli_path)

    # Check installed cores
    ensure_core_installed(cli_path)

    # Determine web directory
    web_dir = args.web_dir
    if not web_dir:
        script_dir = os.path.dirname(os.path.abspath(__file__))
        v2_dir = os.path.join(script_dir, 'v2')
        if os.path.isdir(v2_dir):
            web_dir = v2_dir
        else:
            web_dir = script_dir

    log.info('Sirviendo archivos desde: %s', web_dir)

    # Create HTTP server for static files
    # We use a simple approach: serve files from the web directory
    import http.server
    import functools

    handler = functools.partial(
        http.server.SimpleHTTPRequestHandler,
        directory=web_dir
    )

    # Start HTTP server in a thread
    import threading
    http_server = http.server.HTTPServer((args.host, args.port), handler)
    http_thread = threading.Thread(target=http_server.serve_forever, daemon=True)
    http_thread.start()
    log.info('Servidor HTTP en http://%s:%d/', args.host, args.port)

    # Start WebSocket server
    log.info('Servidor WebSocket en ws://%s:%d/', args.host, args.ws_port)

    async with websockets.serve(
        lambda ws: handle_compile(ws, cli_path),
        args.host,
        args.ws_port
    ):
        log.info('=== BlocklyDuino Server listo ===')
        log.info('Abre http://localhost:%d en el navegador', args.port)
        await asyncio.Future()  # Run forever


if __name__ == '__main__':
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        log.info('Servidor detenido.')
