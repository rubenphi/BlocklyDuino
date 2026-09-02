/**
 * @fileoverview Compilacion vía WebSocket y flasheo via WebUSB.
 * Se conecta al servidor de compilacion (servidor_compilacion.py)
 * para compilar .ino y recibir el binario.
 */

'use strict';

var Compiler = {
    ws: null,
    wsUrl: null,
    isCompiling: false,
    pendingResolve: null,
    pendingReject: null,

    /**
     * Initialize the compiler connection.
     * Auto-detects the WebSocket URL from the current page.
     */
    init: function () {
        var loc = window.location;
        var wsPort = parseInt(loc.port) + 1 || 8081;
        this.wsUrl = 'ws://' + loc.hostname + ':' + wsPort;
        console.log('Compiler WebSocket URL:', this.wsUrl);
    },

    /**
     * Connect to the compilation server.
     */
    connect: function () {
        return new Promise(function (resolve, reject) {
            if (Compiler.ws && Compiler.ws.readyState === WebSocket.OPEN) {
                resolve();
                return;
            }

            try {
                Compiler.ws = new WebSocket(Compiler.wsUrl);
            } catch (e) {
                reject(new Error('No se pudo crear conexion WebSocket: ' + e.message));
                return;
            }

            Compiler.ws.onopen = function () {
                console.log('Conectado al servidor de compilacion');
                resolve();
            };

            Compiler.ws.onerror = function (err) {
                console.error('Error de conexion WebSocket:', err);
                reject(new Error(
                    'No se pudo conectar al servidor de compilacion.\n' +
                    'Asegurate de que servidor_compilacion.py esta ejecutandose en el PC del profesor.'
                ));
            };

            Compiler.ws.onmessage = function (event) {
                var data;
                try {
                    data = JSON.parse(event.data);
                } catch (e) {
                    console.error('Mensaje JSON invalido:', event.data);
                    return;
                }

                Compiler.handleMessage(data);
            };

            Compiler.ws.onclose = function () {
                console.log('Conexion WebSocket cerrada');
                Compiler.ws = null;
            };
        });
    },

    /**
     * Handle a message from the server.
     */
    handleMessage: function (data) {
        switch (data.status) {
            case 'compiling':
                Compiler.updateStatus('Compilando ' + (data.fqbn || '') + '...');
                break;

            case 'compiled':
                Compiler.updateStatus('Compilacion exitosa');
                if (Compiler.pendingResolve) {
                    Compiler.pendingResolve(data);
                    Compiler.pendingResolve = null;
                }
                break;

            case 'error':
                Compiler.updateStatus('Error de compilacion');
                if (Compiler.pendingReject) {
                    Compiler.pendingReject(new Error(data.error));
                    Compiler.pendingReject = null;
                }
                break;
        }
    },

    /**
     * Compile code on the server.
     * @param {string} code - The .ino source code
     * @param {string} fqbn - Fully qualified board name (e.g., 'esp32:esp32:esp32')
     * @param {boolean} verbose - Verbose compilation output
     * @returns {Promise} Resolves with compilation result including binary_hex
     */
    compile: function (code, fqbn, verbose) {
        var self = this;

        if (this.isCompiling) {
            return Promise.reject(new Error('Ya hay una compilacion en progreso'));
        }

        this.isCompiling = true;

        return this.connect().then(function () {
            return new Promise(function (resolve, reject) {
                self.pendingResolve = resolve;
                self.pendingReject = reject;

                self.ws.send(JSON.stringify({
                    action: 'compile',
                    code: code,
                    fqbn: fqbn,
                    verbose: verbose || false
                }));

                // Timeout after 120 seconds
                setTimeout(function () {
                    if (self.pendingResolve === resolve) {
                        self.pendingResolve = null;
                        self.pendingReject = null;
                        self.isCompiling = false;
                        reject(new Error('Tiempo de compilacion agotado'));
                    }
                }, 125000);
            });
        }).finally(function () {
            self.isCompiling = false;
        });
    },

    /**
     * Update status display.
     */
    updateStatus: function (message) {
        var statusEl = document.getElementById('content_serial');
        if (statusEl) {
            statusEl.textContent = message;
        }
        console.log('Compiler:', message);
    },

    /**
     * Convert hex string to Uint8Array.
     */
    hexToBytes: function (hex) {
        var bytes = new Uint8Array(hex.length / 2);
        for (var i = 0; i < hex.length; i += 2) {
            bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
        }
        return bytes;
    },

    /**
     * Flash ESP32 using esptool-js via dynamic import.
     * The binary is the merged firmware (bootloader+partitions+boot_app0+app)
     * generated by arduino-cli, flashed at address 0x0.
     * @param {string} binaryHex - Hex string of the merged firmware binary
     */
    flashESP32: async function (binaryHex) {
        var binaryData = this.hexToBytes(binaryHex);

        // Dynamic import of the ES module
        var module = await import('./esp32flasher.js');
        var ESP32Flasher = module.ESP32Flasher;

        Compiler.updateStatus('Flasheando ESP32...');
        await ESP32Flasher.flash([{ data: binaryData, address: 0x0 }], function (pct) {
            Compiler.updateStatus('Flasheando ESP32... ' + pct + '%');
        }, function (msg) {
            Compiler.updateStatus(msg);
        });
    },

    /**
     * Flash AVR (Arduino) using WebSerial STK500 protocol.
     */
    flashAVR: async function (binaryHex) {
        // AVR flashing via browser is not yet implemented.
        // For Arduino AVR boards, use Arduino IDE to upload.
        throw new Error(
            'Flasheo AVR no soportado desde el navegador.\n' +
            'Usa Arduino IDE para subir a Arduino Uno/Nano/Mega.'
        );
    },

    disconnect: function () {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        this.isCompiling = false;
    }
};
