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
        Blockly.Arduino.includes_['LiquidCrystal_I2C'] = '#include <LiquidCrystal_I2C.h>';
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
    Blockly.Arduino.setups_['setup_lcd_' + num] = 'Wire.begin();\n  lcd_' + num + '.init();\n  lcd_' + num + '.backlight();';
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
