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

function arduino_lcd_setup(opt_addr) {
    if (!Blockly.Arduino.includes_['Wire']) {
        Blockly.Arduino.includes_['Wire'] = '#include <Wire.h>';
        Blockly.Arduino.includes_['ABlocks_LiquidCrystal_I2C'] = '#include "ABlocks_LiquidCrystal_I2C.h"';
    }
    var addr = opt_addr || '0x27';
    Blockly.Arduino.definitions_['lcd_1'] = 'LiquidCrystal_I2C lcd_1(' + addr + ',16,2);';
}

Blockly.Arduino['lcd2_begin_i2c'] = function (block) {
    var addr = block.getFieldValue('ADDR');
    arduino_lcd_setup(addr);
    var code = 'lcd_1.begin();\n';
    code += 'lcd_1.noCursor();\n';
    code += 'lcd_1.backlight();\n';
    return code;
};

Blockly.Arduino['lcd2_clear'] = function (block) {
    arduino_lcd_setup();
    var code = 'lcd_1.clear();\n';
    return code;
};

Blockly.Arduino['lcd2_print'] = function (block) {
    arduino_lcd_setup();
    var cursor_row = block.getFieldValue('CURSOR_ROW');
    var cursor_column = block.getFieldValue('CURSOR_COLUMN');
    var stringoutput = Blockly.Arduino.valueToCode(block, 'STRINGOUTPUT', Blockly.Arduino.ORDER_NONE) || '""';
    var code = 'lcd_1.setCursor(' + cursor_column + ', ' + cursor_row + ');\n';
    code += 'lcd_1.print(' + stringoutput + ');\n';
    return code;
};

Blockly.Arduino['lcd2_print_customchar'] = function (block) {
    arduino_lcd_setup();
    var cursor_row = block.getFieldValue('CURSOR_ROW');
    var cursor_column = block.getFieldValue('CURSOR_COLUMN');
    var stringoutput = Blockly.Arduino.valueToCode(block, 'STRINGOUTPUT', Blockly.Arduino.ORDER_NONE) || '""';
    var code = 'lcd_1.setCursor(' + cursor_column + ', ' + cursor_row + ');\n';
    code += 'lcd_1.print(' + stringoutput + ');\n';
    return code;
};

Blockly.Arduino['lcd2_print2'] = function (block) {
    arduino_lcd_setup();
    var cursor_row = Blockly.Arduino.valueToCode(block, 'CURSOR_ROW', Blockly.Arduino.ORDER_NONE) || '0';
    var cursor_column = Blockly.Arduino.valueToCode(block, 'CURSOR_COLUMN', Blockly.Arduino.ORDER_NONE) || '0';
    var stringoutput = Blockly.Arduino.valueToCode(block, 'STRINGOUTPUT', Blockly.Arduino.ORDER_NONE) || '""';
    var code = 'lcd_1.setCursor(' + cursor_column + ', ' + cursor_row + ');\n';
    code += 'lcd_1.print(' + stringoutput + ');\n';
    return code;
};

Blockly.Arduino['lcd2_print2_customchar'] = function (block) {
    arduino_lcd_setup();
    var cursor_row = Blockly.Arduino.valueToCode(block, 'CURSOR_ROW', Blockly.Arduino.ORDER_NONE) || '0';
    var cursor_column = Blockly.Arduino.valueToCode(block, 'CURSOR_COLUMN', Blockly.Arduino.ORDER_NONE) || '0';
    var stringoutput = Blockly.Arduino.valueToCode(block, 'STRINGOUTPUT', Blockly.Arduino.ORDER_NONE) || '""';
    var code = 'lcd_1.setCursor(' + cursor_column + ', ' + cursor_row + ');\n';
    code += 'lcd_1.print(' + stringoutput + ');\n';
    return code;
};

Blockly.Arduino['lcd2_backlight'] = function (block) {
    arduino_lcd_setup();
    var state = block.getFieldValue('STATE');
    var code = 'lcd_1.' + (state === 'true' ? 'backlight()' : 'noBacklight()') + ';\n';
    return code;
};

Blockly.Arduino['lcd2_cursor'] = function (block) {
    arduino_lcd_setup();
    var mode = block.getFieldValue('MODE');
    var code = '';
    if (mode === 'show') {
        code = 'lcd_1.cursor();\n';
    } else if (mode === 'noCursor') {
        code = 'lcd_1.noCursor();\n';
    } else if (mode === 'blink') {
        code = 'lcd_1.blink();\n';
    } else {
        code = 'lcd_1.noBlink();\n';
    }
    return code;
};

Blockly.Arduino['lcd2_display'] = function (block) {
    arduino_lcd_setup();
    var state = block.getFieldValue('STATE');
    var code = 'lcd_1.' + (state === 'true' ? 'display()' : 'noDisplay()') + ';\n';
    return code;
};

Blockly.Arduino['lcd2_scroll'] = function (block) {
    arduino_lcd_setup();
    var direction = block.getFieldValue('DIRECTION');
    var code = 'lcd_1.' + direction + '();\n';
    return code;
};

Blockly.Arduino['lcd2_customchar'] = function (block) {
    arduino_lcd_setup();
    var position = block.getFieldValue('POSITION');
    var data = Blockly.Arduino.valueToCode(block, 'DATA', Blockly.Arduino.ORDER_NONE) || '0';
    var code = 'lcd_1.createChar(' + position + ', ' + data + ');\n';
    return code;
};