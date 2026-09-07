/**
 * @fileoverview ESP32 flasher using esptool-js (WebSerial + esptool protocol).
 * Handles proper reset sequence, bootloader sync, and flash writing.
 */

import { ESPLoader, Transport } from 'https://unpkg.com/esptool-js@0.6.1/bundle.js';

var ESP32Flasher = {
    esploader: null,
    transport: null,
    chipName: null,

    /**
     * Flash an ESP32 device with the given binary files.
     * Each file has a {data: Uint8Array, address: number}.
     * @param {Array<{data: Uint8Array, address: number}>} files - Individual flash files
     * @param {function} onProgress - callback(percent)
     * @param {function} onStatus - callback(message)
     */
    flash: async function (files, onProgress, onStatus) {
        if (!WebUSB.port) {
            throw new Error('No hay puerto serial conectado');
        }

        try {
            onStatus('Cerrando conexion actual...');
            // Close existing connection so esptool-js can manage the port
            var savedPort = WebUSB.port;
            WebUSB.isConnected = false;
            WebUSB.port = null;

            try {
                await savedPort.close();
            } catch (e) {}

            onStatus('Conectando con el bootloader...');

            // Create Transport from the raw port
            this.transport = new Transport(savedPort);

            // ESPLoader handles the esptool protocol
            this.esploader = new ESPLoader({
                transport: this.transport,
                baudrate: 115200,
                terminal: {
                    clean: function () {},
                    writeLine: function (data) { console.log('[ESP32]', data); },
                    write: function (data) { console.log('[ESP32]', data); }
                }
            });

            // Connect and identify chip
            var chip = await this.esploader.main();
            this.chipName = this.esploader.chipName || chip;
            onStatus('Chip detectado: ' + this.chipName);

            // Flash the binary files
            var totalSize = files.reduce(function (s, f) { return s + f.data.length; }, 0);
            onStatus('Escribiendo firmware (' + (totalSize / 1024).toFixed(1) + ' KB)...');
            // 'keep' conserva los parametros SPI de flash que arduino-cli ya
            // grabo en el bootloader del merged.bin para la placa elegida.
            // Forzar aqui un tamaño (4MB) o modo concretos rompe placas cuyo
            // modulo C3 trae 2MB/4MB o requiere otro modo SPI.
            var flashOptions = {
                fileArray: files,
                flashMode: 'keep',
                flashFreq: 'keep',
                flashSize: 'keep',
                eraseAll: false,
                compress: true,
                reportProgress: function (fileIndex, written, total) {
                    var pct = Math.round((written / total) * 100);
                    if (onProgress) onProgress(pct);
                }
            };

            await this.esploader.writeFlash(flashOptions);
            onStatus('Firmware escrito. Reiniciando...');

            // En placas con USB nativo (USB-Serial/JTAG, p.ej. ESP32-C3 Mini
            // conectado por su USB-C) el reset clasico por DTR/RTS no toca la
            // linea EN: hay que usar la secuencia USB-JTAG de esptool-js.
            // El PID 0x1001 es el mismo que esptool-js detecta internamente.
            if (this.transport.getPid && this.transport.getPid() === 0x1001 &&
                this.esploader.resetConstructors &&
                this.esploader.resetConstructors.usbJTAGSerialReset) {
                this.esploader.resetConstructors.hardReset =
                    this.esploader.resetConstructors.usbJTAGSerialReset;
            }

            // Reset the device
            await this.esploader.after('hard_reset');

            onStatus('Flasheo completado');
            return true;

        } catch (err) {
            console.error('ESP32 Flash error:', err);
            throw err;
        } finally {
            try {
                if (this.transport) {
                    await this.transport.disconnect();
                    this.transport = null;
                }
            } catch (e) {}
            this.esploader = null;

            // Restore WebUSB state (disconnected after flash)
            WebUSB.port = null;
            WebUSB.isConnected = false;
            WebUSB.deviceInfo = null;
            WebUSB.updateUI();
        }
    }
};

export { ESP32Flasher };
