/**
 * @fileoverview WebUSB connection management for BlocklyDuino.
 * Allows connecting to serial devices (ESP32, Arduino) directly from the browser.
 */

'use strict';

var WebUSB = {
    port: null,
    reader: null,
    writer: null,
    readableStream: null,
    writableStream: null,
    isConnected: false,
    deviceInfo: null,

    /**
     * Check if WebUSB is supported by the browser.
     */
    isSupported: function () {
        return 'serial' in navigator;
    },

    /**
     * Known USB-to-serial chips for device filter.
     */
    KNOWN_FILTERS: [
        { usbVendorId: 0x303A, usbProductId: 0x0002 },  // ESP32-S2
        { usbVendorId: 0x303A, usbProductId: 0x0012 },  // ESP32-S3
        { usbVendorId: 0x303A, usbProductId: 0x1001 },  // ESP32-C3
        { usbVendorId: 0x303A, usbProductId: 0x800C },  // ESP32-C3
        { usbVendorId: 0x1A86, usbProductId: 0x7523 },  // CH340
        { usbVendorId: 0x1A86, usbProductId: 0x5523 },  // CH341
        { usbVendorId: 0x1A86, usbProductId: 0x55D4 },  // CH9102
        { usbVendorId: 0x10C4, usbProductId: 0xEA60 },  // CP2102
        { usbVendorId: 0x10C4, usbProductId: 0xEA71 },  // CP2105
        { usbVendorId: 0x0403, usbProductId: 0x6001 },  // FTDI FT232R
        { usbVendorId: 0x0403, usbProductId: 0x6015 },  // FTDI FT232H
        { usbVendorId: 0x2341, usbProductId: 0x0036 },  // Arduino Mega
        { usbVendorId: 0x2341, usbProductId: 0x0037 },  // Arduino Micro
        { usbVendorId: 0x2341, usbProductId: 0x0042 },  // Arduino Mega 2560 R3
        { usbVendorId: 0x2341, usbProductId: 0x0001 },  // Arduino Uno R3
        { usbVendorId: 0x2A03, usbProductId: 0x0036 },  // Arduino Leonardo
        { usbVendorId: 0x2A03, usbProductId: 0x0037 },  // Arduino Micro
        { usbVendorId: 0x2A03, usbProductId: 0x0042 },  // Arduino Mega
        { usbVendorId: 0x2A03, usbProductId: 0x0001 },  // Arduino Uno
    ],

    /**
     * Request a serial port from the user.
     * Tries with filters first, then without filters as fallback.
     */
    connect: async function () {
        if (!this.isSupported()) {
            alert('WebUSB no es compatible con este navegador.\nUsa Chrome, Edge o Opera.');
            return false;
        }

        try {
            try {
                this.port = await navigator.serial.requestPort({
                    filters: this.KNOWN_FILTERS
                });
            } catch (e) {
                if (e.name === 'NotFoundError') return false;
                console.log('Filtros no funcionaron, intentando sin filtros...');
                this.port = await navigator.serial.requestPort();
            }
        } catch (err) {
            if (err.name === 'NotFoundError') return false;
            console.error('Error al seleccionar puerto:', err);
            return false;
        }

        try {
            await this.port.open({ baudRate: 115200 });
        } catch (err) {
            console.error('Error al abrir puerto:', err);
            var msg = 'No se pudo abrir el puerto serial.\n\n';
            if (err.message && err.message.indexOf('could not open') !== -1) {
                msg += 'Causa comun: Otra aplicacion tiene el puerto abierto.\n\n';
                msg += 'Cierra estas aplicaciones:\n';
                msg += '- Arduino IDE (Monitor Serial)\n';
                msg += '- PlatformIO\n';
                msg += '- Putty / Terminals seriales\n\n';
                msg += 'Si el problema persiste, reconecta el cable USB.';
            } else {
                msg += 'Error: ' + (err.message || err);
            }
            alert(msg);
            this.port = null;
            return false;
        }

        this.isConnected = true;
        this.deviceInfo = this.port.getInfo();
        this.updateUI();

        console.log('Dispositivo conectado:', this.deviceInfo);
        return true;
    },

    /**
     * Disconnect from the current serial device.
     */
    disconnect: async function () {
        try {
            if (this.reader) {
                try { await this.reader.cancel(); } catch (e) {}
                this.reader = null;
            }
            if (this.readableStream) {
                try { await this.readableStream.cancel(); } catch (e) {}
                this.readableStream = null;
            }
            if (this.writer) {
                try { this.writer.releaseLock(); } catch (e) {}
                this.writer = null;
            }
            if (this.writableStream) {
                try { await this.writableStream.close(); } catch (e) {}
                this.writableStream = null;
            }
            if (this.port) {
                try { await this.port.close(); } catch (e) {}
                this.port = null;
            }
        } catch (err) {
            console.error('Error al desconectar:', err);
        }

        this.isConnected = false;
        this.deviceInfo = null;
        this.updateUI();
    },

    /**
     * Toggle connection: connect if disconnected, disconnect if connected.
     */
    toggle: async function () {
        if (this.isConnected) {
            await this.disconnect();
        } else {
            await this.connect();
        }
    },

    /**
     * Send data to the connected device.
     */
    send: async function (data) {
        if (!this.isConnected || !this.port) {
            console.error('No hay dispositivo conectado');
            return false;
        }

        try {
            if (!this.writableStream) {
                this.writableStream = this.port.writable;
            }
            if (!this.writer) {
                this.writer = this.writableStream.getWriter();
            }

            var encoder = new TextEncoder();
            await this.writer.write(encoder.encode(data));
            return true;
        } catch (err) {
            console.error('Error al enviar datos:', err);
            return false;
        }
    },

    /**
     * Start listening for data from the device.
     * Calls callback(data) with each line received.
     */
    startListening: async function (callback) {
        if (!this.isConnected || !this.port) {
            console.error('No hay dispositivo conectado');
            return;
        }

        try {
            this.readableStream = this.port.readable;
            this.reader = this.readableStream.getReader();

            var decoder = new TextDecoder();
            var buffer = '';

            while (true) {
                var result = await this.reader.read();
                if (result.done) break;

                buffer += decoder.decode(result.value, { stream: true });
                var lines = buffer.split('\n');
                buffer = lines.pop();

                for (var i = 0; i < lines.length; i++) {
                    if (callback) callback(lines[i]);
                }
            }
        } catch (err) {
            if (err.name !== 'NetworkError') {
                console.error('Error leyendo datos:', err);
            }
        }
    },

    /**
     * Update UI elements to reflect connection state.
     */
    updateUI: function () {
        var btn = document.getElementById('serialButton');
        var icon = btn ? btn.querySelector('i') : null;
        var label = document.getElementById('serialButton_span_menu');

        if (this.isConnected) {
            btn.title = 'Desconectar dispositivo';
            btn.className = 'iconButtons connected';
            if (icon) {
                icon.className = 'fas fa-usb';
            }

            var deviceName = this.getDeviceName();
            if (label) label.textContent = deviceName;

            var modalBody = document.getElementById('portListModalBody');
            if (modalBody) {
                var vendorId = this.deviceInfo ? this.deviceInfo.usbVendorId : '?';
                var productId = this.deviceInfo ? this.deviceInfo.usbProductId : '?';
                modalBody.innerHTML =
                    '<div style="padding:10px;">' +
                    '<p><strong>Estado:</strong> <span style="color:green">Conectado</span></p>' +
                    '<p><strong>Dispositivo:</strong> ' + deviceName + '</p>' +
                    '<p><strong>Vendor ID:</strong> 0x' + vendorId.toString(16).toUpperCase() +
                    ' <strong>Product ID:</strong> 0x' + productId.toString(16).toUpperCase() + '</p>' +
                    '</div>';
            }
        } else {
            btn.title = 'Conectar dispositivo';
            btn.className = 'iconButtons';
            if (icon) {
                icon.className = 'fab fa-usb';
            }
            if (label) label.textContent = '';

            var modalBody = document.getElementById('portListModalBody');
            if (modalBody) {
                modalBody.innerHTML =
                    '<div style="padding:10px;">' +
                    '<p>No hay dispositivo conectado.</p>' +
                    '<p>Haz clic en el boton USB para conectar.</p>' +
                    '<p style="font-size:0.85em;color:#888;margin-top:10px;">' +
                    'En Windows aparecera como "COM{número}". ' +
                    'Asegurate de cerrar Arduino IDE antes de conectar.</p>' +
                    '</div>';
            }
        }
    },

    getDeviceName: function () {
        if (!this.deviceInfo) return 'Desconocido';

        var vid = this.deviceInfo.usbVendorId;
        var pid = this.deviceInfo.usbProductId;

        var knownDevices = [
            { vid: 0x303A, pids: [0x0002, 0x0012, 0x1001], name: 'ESP32' },
            { vid: 0x1A86, pids: [0x7523, 0x5523], name: 'CH340' },
            { vid: 0x10C4, pids: [0xEA60], name: 'CP2102' },
            { vid: 0x2341, pids: [0x0036, 0x0037, 0x0042, 0x0001], name: 'Arduino' },
            { vid: 0x2A03, pids: [0x0036, 0x0037, 0x0042], name: 'Arduino (Genuine)' },
            { vid: 0x1A86, pids: [0x55D4], name: 'CH9102' },
        ];

        for (var i = 0; i < knownDevices.length; i++) {
            var d = knownDevices[i];
            if (d.vid === vid && d.pids.indexOf(pid) !== -1) {
                return d.name;
            }
        }

        return 'USB 0x' + vid.toString(16).toUpperCase();
    }
};
