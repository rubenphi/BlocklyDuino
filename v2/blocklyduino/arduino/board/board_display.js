/**
 * @license
 * Copyright 2020 Sébastien CANET
 * SPDX-License-Identifier: BSD-3-Clause
 */

/**
 * @fileoverview Generating Arduino code for Display blocks.
 * @author scanet@libreduc.cc (Sébastien Canet)
 */

'use strict';

goog.provide('Blockly.Arduino.board_display');

goog.require('Blockly.Arduino');

function arduino_lcd_includes() {
    if (!Blockly.Arduino.includes_['Wire']) {
        Blockly.Arduino.includes_['Wire'] = '#include <Wire.h>';
        Blockly.Arduino.includes_['LiquidCrystal_I2C'] = '// Library: LiquidCrystal_I2C by Frank de Brabander\n// https://github.com/johnrickman/LiquidCrystal_I2C\n#include <ABlocks_LiquidCrystal_I2C.h>';
    }
}

function arduino_lcd_dims(type) {
    if (type === '4x20') {
        return [20, 4];
    }
    return [16, 2];
}

Blockly.Arduino['lcd2_begin_i2c'] = function (block) {
    var num = block.getFieldValue('NUM');
    var addr = block.getFieldValue('ADDR');
    var type = block.getFieldValue('TYPE');
    var dims = arduino_lcd_dims(type);
    arduino_lcd_includes();
    Blockly.Arduino.definitions_['lcd_' + num] = 'LiquidCrystal_I2C lcd_' + num + '(' + addr + ',' + dims[0] + ',' + dims[1] + ');';
    Blockly.Arduino.setups_['setup_lcd_' + num] = 'lcd_' + num + '.begin();\n  lcd_' + num + '.noCursor();\n  lcd_' + num + '.backlight();';
    var code = '';
    return code;
};

Blockly.Arduino['lcd2_clear'] = function (block) {
    var num = block.getFieldValue('NUM');
    arduino_lcd_includes();
    var code = 'lcd_' + num + '.clear();\n';
    return code;
};

Blockly.Arduino['lcd2_print'] = function (block) {
    var num = block.getFieldValue('NUM');
    var cursor_row = block.getFieldValue('CURSOR_ROW');
    var cursor_column = block.getFieldValue('CURSOR_COLUMN');
    var stringoutput = Blockly.Arduino.valueToCode(block, 'STRINGOUTPUT', Blockly.Arduino.ORDER_NONE) || '""';
    arduino_lcd_includes();
    var code = 'lcd_' + num + '.setCursor(' + cursor_column + ', ' + cursor_row + ');\n';
    code += 'lcd_' + num + '.print(' + stringoutput + ');\n';
    return code;
};

Blockly.Arduino['lcd2_print_customchar'] = function (block) {
    var num = block.getFieldValue('NUM');
    var cursor_row = block.getFieldValue('CURSOR_ROW');
    var cursor_column = block.getFieldValue('CURSOR_COLUMN');
    var stringoutput = Blockly.Arduino.valueToCode(block, 'STRINGOUTPUT', Blockly.Arduino.ORDER_NONE) || '""';
    arduino_lcd_includes();
    var code = 'lcd_' + num + '.setCursor(' + cursor_column + ', ' + cursor_row + ');\n';
    code += 'lcd_' + num + '.print(' + stringoutput + ');\n';
    return code;
};

Blockly.Arduino['lcd2_print2'] = function (block) {
    var num = block.getFieldValue('NUM');
    var cursor_row = Blockly.Arduino.valueToCode(block, 'CURSOR_ROW', Blockly.Arduino.ORDER_NONE) || '0';
    var cursor_column = Blockly.Arduino.valueToCode(block, 'CURSOR_COLUMN', Blockly.Arduino.ORDER_NONE) || '0';
    var stringoutput = Blockly.Arduino.valueToCode(block, 'STRINGOUTPUT', Blockly.Arduino.ORDER_NONE) || '""';
    arduino_lcd_includes();
    var code = 'lcd_' + num + '.setCursor(' + cursor_column + ', ' + cursor_row + ');\n';
    code += 'lcd_' + num + '.print(' + stringoutput + ');\n';
    return code;
};

Blockly.Arduino['lcd2_print2_customchar'] = function (block) {
    var num = block.getFieldValue('NUM');
    var cursor_row = Blockly.Arduino.valueToCode(block, 'CURSOR_ROW', Blockly.Arduino.ORDER_NONE) || '0';
    var cursor_column = Blockly.Arduino.valueToCode(block, 'CURSOR_COLUMN', Blockly.Arduino.ORDER_NONE) || '0';
    var stringoutput = Blockly.Arduino.valueToCode(block, 'STRINGOUTPUT', Blockly.Arduino.ORDER_NONE) || '""';
    arduino_lcd_includes();
    var code = 'lcd_' + num + '.setCursor(' + cursor_column + ', ' + cursor_row + ');\n';
    code += 'lcd_' + num + '.print(' + stringoutput + ');\n';
    return code;
};

Blockly.Arduino['lcd2_backlight'] = function (block) {
    var num = block.getFieldValue('NUM');
    var state = block.getFieldValue('STATE');
    arduino_lcd_includes();
    var code = 'lcd_' + num + '.' + (state === 'true' ? 'backlight()' : 'noBacklight()') + ';\n';
    return code;
};

Blockly.Arduino['lcd2_cursor'] = function (block) {
    var num = block.getFieldValue('NUM');
    var mode = block.getFieldValue('MODE');
    var method = mode === 'show' ? 'cursor()' :
        mode === 'noCursor' ? 'noCursor()' :
        mode === 'blink' ? 'blink()' : 'noBlink()';
    arduino_lcd_includes();
    var code = 'lcd_' + num + '.' + method + ';\n';
    return code;
};

Blockly.Arduino['lcd2_display'] = function (block) {
    var num = block.getFieldValue('NUM');
    var state = block.getFieldValue('STATE');
    arduino_lcd_includes();
    var code = 'lcd_' + num + '.' + (state === 'true' ? 'display()' : 'noDisplay()') + ';\n';
    return code;
};

Blockly.Arduino['lcd2_scroll'] = function (block) {
    var num = block.getFieldValue('NUM');
    var direction = block.getFieldValue('DIRECTION');
    arduino_lcd_includes();
    var code = 'lcd_' + num + '.' + direction + '();\n';
    return code;
};

Blockly.Arduino['lcd2_customchar'] = function (block) {
    var num = block.getFieldValue('NUM');
    var position = block.getFieldValue('POSITION');
    var data = Blockly.Arduino.valueToCode(block, 'DATA', Blockly.Arduino.ORDER_NONE) || '0';
    arduino_lcd_includes();
    var code = 'lcd_' + num + '.createChar(' + position + ', ' + data + ');\n';
    return code;
};

// ===================== OLED =====================

function arduino_oled_includes() {
    Blockly.Arduino.includes_['Wire'] = '#include <Wire.h>';
    Blockly.Arduino.includes_['Adafruit_GFX'] = '#include <Adafruit_GFX.h>';
    Blockly.Arduino.includes_['Adafruit_SSD1306'] = '#include <Adafruit_SSD1306.h>';
}

// Refresco condicional: cada operación de dibujo muestra el buffer solo si
// el refresco automático está activado (oled_N_autoshow es mutable en runtime).
function arduino_oled_display(num) {
    return 'if(oled_' + num + '_autoshow)oled_' + num + '.display();\n';
}

Blockly.Arduino['oled_init'] = function (block) {
    var num = block.getFieldValue('NUM');
    var addr = block.getFieldValue('ADDR');
    var autoshow = block.getFieldValue('AUTOSHOW') === 'TRUE' ? 'true' : 'false';
    arduino_oled_includes();
    Blockly.Arduino.definitions_['oled_' + num] =
        'Adafruit_SSD1306 oled_' + num + '(128,64, &Wire,-1);\nbool oled_' + num + '_autoshow=' + autoshow + ';';
    Blockly.Arduino.setups_['setup_oled_' + num] =
        'oled_' + num + '.begin(SSD1306_SWITCHCAPVCC,' + addr + ');';
    return '';
};

// Bloque "Activar/Desactivar refresco automático": cambia oled_N_autoshow
// en cualquier punto del flujo.
Blockly.Arduino['oled_autoshow'] = function (block) {
    var num = block.getFieldValue('NUM');
    var on = block.getFieldValue('ON') === '1';
    return 'oled_' + num + '_autoshow=' + (on ? 'true' : 'false') + ';\n';
};

Blockly.Arduino['oled_rotation'] = function (block) {
    var num = block.getFieldValue('NUM');
    var rotation = block.getFieldValue('ROTATION');
    arduino_oled_includes();
    var code = 'oled_' + num + '.setRotation(' + rotation + ');\n';
    code += arduino_oled_display(num);
    return code;
};

Blockly.Arduino['oled_clear'] = function (block) {
    var num = block.getFieldValue('NUM');
    arduino_oled_includes();
    var code = 'oled_' + num + '.clearDisplay();\n';
    code += arduino_oled_display(num);
    return code;
};

// Bloque "Refrescar": acción puntual e incondicional (muestra el buffer siempre).
Blockly.Arduino['oled_show'] = function (block) {
    var num = block.getFieldValue('NUM');
    arduino_oled_includes();
    return 'oled_' + num + '.display();\n';
};

Blockly.Arduino['oled_drawtext'] = function (block) {
    var num = block.getFieldValue('NUM');
    var led = block.getFieldValue('LED');
    var x = Blockly.Arduino.valueToCode(block, 'X', Blockly.Arduino.ORDER_NONE) || '0';
    var y = Blockly.Arduino.valueToCode(block, 'Y', Blockly.Arduino.ORDER_NONE) || '0';
    var txt = Blockly.Arduino.valueToCode(block, 'TXT', Blockly.Arduino.ORDER_NONE) || '""';
    var size = block.getFieldValue('SIZE') || '1';
    arduino_oled_includes();
    var color = (led === '0') ? 'BLACK' : 'WHITE';
    var code = 'oled_' + num + '.setTextSize(' + size + ');\n';
    code += 'oled_' + num + '.setTextColor(' + color + ');\n';
    code += 'oled_' + num + '.setCursor(' + x + ',' + y + ');\n';
    code += 'oled_' + num + '.print(String(' + txt + '));\n';
    code += arduino_oled_display(num);
    return code;
};

Blockly.Arduino['oled_drawbitmap'] = function (block) {
    var num = block.getFieldValue('NUM');
    var x = Blockly.Arduino.valueToCode(block, 'X', Blockly.Arduino.ORDER_NONE) || '0';
    var y = Blockly.Arduino.valueToCode(block, 'Y', Blockly.Arduino.ORDER_NONE) || '0';
    var code;
    var dataName = 'oled_data_' + num;
    // El campo de datos es un arreglo PROGMEM estilo Ablocks:
    // [0]=ancho, [1]=alto, [2..]=bits. Si está vacío se usa un bitmap 8x8 en blanco.
    if (!block.getField('DATA') || !(block.getFieldValue('DATA') || '').trim()) {
        Blockly.Arduino.definitions_[dataName] =
            'static const uint8_t ' + dataName + '[] PROGMEM = {8,8,' +
            '0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00};';
        code = 'oled_' + num + '.drawBitmap(' + x + ',' + y + ',&' + dataName + '[2],' + dataName + '[0], ' + dataName + '[1],WHITE);\n';
    } else {
        var data = block.getFieldValue('DATA');
        Blockly.Arduino.definitions_[dataName] =
            'static const uint8_t ' + dataName + '[] PROGMEM = {' + data + '};';
        code = 'oled_' + num + '.drawBitmap(' + x + ',' + y + ',&' + dataName + '[2],' + dataName + '[0], ' + dataName + '[1],WHITE);\n';
    }
    arduino_oled_includes();
    code += arduino_oled_display(num);
    return code;
};

Blockly.Arduino['oled_drawpixel'] = function (block) {
    var num = block.getFieldValue('NUM');
    var led = block.getFieldValue('LED');
    var x = Blockly.Arduino.valueToCode(block, 'X', Blockly.Arduino.ORDER_NONE) || '0';
    var y = Blockly.Arduino.valueToCode(block, 'Y', Blockly.Arduino.ORDER_NONE) || '0';
    arduino_oled_includes();
    var color = (led === '0') ? 'BLACK' : 'WHITE';
    var code = 'oled_' + num + '.drawPixel(' + x + ',' + y + ',' + color + ');\n';
    code += arduino_oled_display(num);
    return code;
};

Blockly.Arduino['oled_drawline'] = function (block) {
    var num = block.getFieldValue('NUM');
    var led = block.getFieldValue('LED');
    var x1 = Blockly.Arduino.valueToCode(block, 'X1', Blockly.Arduino.ORDER_NONE) || '0';
    var y1 = Blockly.Arduino.valueToCode(block, 'Y1', Blockly.Arduino.ORDER_NONE) || '0';
    var x2 = Blockly.Arduino.valueToCode(block, 'X2', Blockly.Arduino.ORDER_NONE) || '0';
    var y2 = Blockly.Arduino.valueToCode(block, 'Y2', Blockly.Arduino.ORDER_NONE) || '0';
    arduino_oled_includes();
    var color = (led === '0') ? 'BLACK' : 'WHITE';
    var code = 'oled_' + num + '.drawLine(' + x1 + ',' + y1 + ',' + x2 + ',' + y2 + ',' + color + ');\n';
    code += arduino_oled_display(num);
    return code;
};

Blockly.Arduino['oled_drawrectangle'] = function (block) {
    var num = block.getFieldValue('NUM');
    var led = block.getFieldValue('LED');
    var fill = block.getFieldValue('FILL');
    var x1 = Blockly.Arduino.valueToCode(block, 'X1', Blockly.Arduino.ORDER_NONE) || '0';
    var y1 = Blockly.Arduino.valueToCode(block, 'Y1', Blockly.Arduino.ORDER_NONE) || '0';
    var w = Blockly.Arduino.valueToCode(block, 'W', Blockly.Arduino.ORDER_NONE) || '0';
    var h = Blockly.Arduino.valueToCode(block, 'H', Blockly.Arduino.ORDER_NONE) || '0';
    arduino_oled_includes();
    var color = (led === '0') ? 'BLACK' : 'WHITE';
    var method = (fill === 'TRUE') ? 'fillRect' : 'drawRect';
    var code = 'oled_' + num + '.' + method + '(' + x1 + ',' + y1 + ',' + w + ',' + h + ',' + color + ');\n';
    code += arduino_oled_display(num);
    return code;
};

Blockly.Arduino['oled_drawcircle'] = function (block) {
    var num = block.getFieldValue('NUM');
    var led = block.getFieldValue('LED');
    var fill = block.getFieldValue('FILL');
    var x = Blockly.Arduino.valueToCode(block, 'X', Blockly.Arduino.ORDER_NONE) || '0';
    var y = Blockly.Arduino.valueToCode(block, 'Y', Blockly.Arduino.ORDER_NONE) || '0';
    var r = Blockly.Arduino.valueToCode(block, 'R', Blockly.Arduino.ORDER_NONE) || '0';
    arduino_oled_includes();
    var color = (led === '0') ? 'BLACK' : 'WHITE';
    var method = (fill === 'TRUE') ? 'fillCircle' : 'drawCircle';
    var code = 'oled_' + num + '.' + method + '(' + x + ',' + y + ',' + r + ',' + color + ');\n';
    code += arduino_oled_display(num);
    return code;
};
