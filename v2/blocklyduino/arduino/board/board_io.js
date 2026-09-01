/**
 * @license
 * Copyright 2020 Sébastien CANET
 * SPDX-License-Identifier: BSD-3-Clause
 */

/**
 * @fileoverview Generating Arduino code for IO blocks.
 * @author scanet@libreduc.cc (Sébastien Canet)
 */

'use strict';

goog.provide('Blockly.Arduino.board_io');

goog.require('Blockly.Arduino');

Blockly.Arduino['io_digital_read'] = function (block) {
    var dropdown_pin = block.getFieldValue('PIN');
    Blockly.Arduino.setups_['setup_input_' + dropdown_pin] = 'pinMode(' + dropdown_pin + ', INPUT);';
    var code = 'digitalRead(' + dropdown_pin + ')';
    return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['io_digital_write'] = function (block) {
    var dropdown_pin = block.getFieldValue('PIN');
    var dropdown_stat = block.getFieldValue('STAT');
    Blockly.Arduino.setups_['setup_output_' + dropdown_pin] = 'pinMode(' + dropdown_pin + ', OUTPUT);';
    var code = 'digitalWrite(' + dropdown_pin + ', ' + dropdown_stat + ');\n';
    return code;
};

Blockly.Arduino['io_analog_read'] = function (block) {
    var dropdown_pin = block.getFieldValue('PIN');
    Blockly.Arduino.setups_['setup_input_' + dropdown_pin] = 'pinMode(' + dropdown_pin + ', INPUT);';
    var code = 'analogRead(' + dropdown_pin + ')';
    return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['io_analog_write'] = function (block) {
    var dropdown_pin = block.getFieldValue('PIN');
    var value_num = Blockly.Arduino.valueToCode(this, 'NUM', Blockly.Arduino.ORDER_ATOMIC) || '0';
    Blockly.Arduino.setups_['setup_output_' + dropdown_pin] = 'pinMode(' + dropdown_pin + ', OUTPUT);';
    var code = 'analogWrite(' + dropdown_pin + ', ' + value_num + ');\n';
    return code;
};

Blockly.Arduino['io_analog_write_dac'] = function (block) {
    var dropdown_pin = block.getFieldValue('PIN');
    var value_num = Blockly.Arduino.valueToCode(this, 'NUM', Blockly.Arduino.ORDER_ATOMIC) || '0';
    Blockly.Arduino.setups_['setup_dac_' + dropdown_pin] = 'pinMode(' + dropdown_pin + ', OUTPUT);';
    var code = 'dacWrite(' + dropdown_pin + ', ' + value_num + ');\n';
    return code;
};

Blockly.Arduino['io_digital_read2'] = function (block) {
    var value_pin = Blockly.Arduino.valueToCode(this, 'PIN', Blockly.Arduino.ORDER_ATOMIC) || '0';
    Blockly.Arduino.codeFunctions_['fnc_dynamic_digitalRead'] =
        'int fnc_dynamic_digitalRead(int _pin){\n' +
        '  pinMode(_pin,INPUT);\n' +
        '  return digitalRead(_pin);\n' +
        '}\n';
    var code = 'fnc_dynamic_digitalRead(' + value_pin + ')';
    return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['io_digital_write2'] = function (block) {
    var value_pin = Blockly.Arduino.valueToCode(this, 'PIN', Blockly.Arduino.ORDER_ATOMIC) || '0';
    var value_stat = Blockly.Arduino.valueToCode(this, 'STAT', Blockly.Arduino.ORDER_ATOMIC) || 'LOW';
    Blockly.Arduino.codeFunctions_['fnc_dynamic_digitalWrite'] =
        'void fnc_dynamic_digitalWrite(int _pin, int _e){\n' +
        '  pinMode(_pin,OUTPUT);\n' +
        '  digitalWrite(_pin,_e);\n' +
        '}\n';
    var code = 'fnc_dynamic_digitalWrite(' + value_pin + ', ' + value_stat + ');\n';
    return code;
};

Blockly.Arduino['io_analog_read2'] = function (block) {
    var value_pin = Blockly.Arduino.valueToCode(this, 'PIN', Blockly.Arduino.ORDER_ATOMIC) || '0';
    Blockly.Arduino.codeFunctions_['fnc_dynamic_analogRead'] =
        'float fnc_dynamic_analogRead(int _pin){\n' +
        '  pinMode(_pin,INPUT);\n' +
        '  return ((float)analogRead(_pin));\n' +
        '}\n';
    var code = 'fnc_dynamic_analogRead(' + value_pin + ')';
    return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['io_analog_write2'] = function (block) {
    var value_pin = Blockly.Arduino.valueToCode(this, 'PIN', Blockly.Arduino.ORDER_ATOMIC) || '0';
    var value_num = Blockly.Arduino.valueToCode(this, 'NUM', Blockly.Arduino.ORDER_ATOMIC) || '0';
    Blockly.Arduino.codeFunctions_['fnc_dynamic_analogWrite'] =
        'void fnc_dynamic_analogWrite(int _pin, int _e){\n' +
        '  pinMode(_pin,OUTPUT);\n' +
        '  analogWrite(_pin,(uint16_t)_e);\n' +
        '}\n';
    var code = 'fnc_dynamic_analogWrite(' + value_pin + ', ' + value_num + ');\n';
    return code;
};

Blockly.Arduino['io_pull'] = function (block) {
    var dropdown_pin = block.getFieldValue('PIN');
    var dropdown_mode = block.getFieldValue('MODE');
    var code = 'pinMode(' + dropdown_pin + ', ' + dropdown_mode + ');\n';
    return code;
};

Blockly.Arduino['io_capacitive_read'] = function (block) {
    var dropdown_pin = block.getFieldValue('PIN');
    var code = 'touchRead(' + dropdown_pin + ')';
    return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['io_pulsein'] = function (block) {
    var dropdown_pin = block.getFieldValue('PIN');
    var value_timeout = Blockly.Arduino.valueToCode(this, 'TIMEOUT', Blockly.Arduino.ORDER_ATOMIC) || '1000';
    var code = 'pulseIn(' + dropdown_pin + ', HIGH, ' + value_timeout + ')';
    return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['io_interrupt'] = function (block) {
    var dropdown_pin = block.getFieldValue('PIN');
    var dropdown_mode = block.getFieldValue('MODE');
    var statementCode = Blockly.Arduino.statementToCode(block, 'DO');
    Blockly.Arduino.setups_['setup_interrupt_' + dropdown_pin] =
        'attachInterrupt(digitalPinToInterrupt(' + dropdown_pin + '), fnc_interruptHandler_' + dropdown_pin + ', ' + dropdown_mode + ');';
    var handlerCode = 'void IRAM_ATTR fnc_interruptHandler_' + dropdown_pin + '(){\n' + statementCode + '}\n';
    Blockly.Arduino.codeFunctions_['int_handler_' + dropdown_pin] = handlerCode;
    return '';
};

Blockly.Arduino['io_digital_read_i2c'] = function (block) {
    var dropdown_pin = block.getFieldValue('PIN');
    Blockly.Arduino.setups_['setup_input_' + dropdown_pin] = 'pinMode(' + dropdown_pin + ', INPUT);';
    var code = 'digitalRead(' + dropdown_pin + ')';
    return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['io_digital_write_i2c'] = function (block) {
    var dropdown_pin = block.getFieldValue('PIN');
    var dropdown_stat = block.getFieldValue('STAT');
    Blockly.Arduino.setups_['setup_output_' + dropdown_pin] = 'pinMode(' + dropdown_pin + ', OUTPUT);';
    var code = 'digitalWrite(' + dropdown_pin + ', ' + dropdown_stat + ');\n';
    return code;
};

Blockly.Arduino['io_digital_read2_i2c'] = function (block) {
    var value_pin = Blockly.Arduino.valueToCode(this, 'PIN', Blockly.Arduino.ORDER_ATOMIC) || '0';
    var code = 'digitalRead(' + value_pin + ')';
    return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['io_digital_write2_i2c'] = function (block) {
    var value_pin = Blockly.Arduino.valueToCode(this, 'PIN', Blockly.Arduino.ORDER_ATOMIC) || '0';
    var value_stat = Blockly.Arduino.valueToCode(this, 'STAT', Blockly.Arduino.ORDER_ATOMIC) || 'LOW';
    Blockly.Arduino.setups_['setup_output_' + value_pin] = 'pinMode(' + value_pin + ', OUTPUT);';
    var code = 'digitalWrite(' + value_pin + ', ' + value_stat + ');\n';
    return code;
};

Blockly.Arduino['io_analog_read_i2c'] = function (block) {
    var code = 'analogRead(' + '0' + ')';
    return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['io_analog_read2_i2c'] = function (block) {
    var value_pin = Blockly.Arduino.valueToCode(this, 'PIN', Blockly.Arduino.ORDER_ATOMIC) || '0';
    var code = 'analogRead(' + value_pin + ')';
    return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['io_analog_read_dif_i2c'] = function (block) {
    var code = 'analogReadDiff()';
    return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['io_i2c_scanner'] = function (block) {
    var code = 'Wire.begin();\n';
    code += 'for (byte i = 1; i < 128; i++) {\n';
    code += '  Wire.beginTransmission(i);\n';
    code += '  if (Wire.endTransmission() == 0) {\n';
    code += '    Serial.print("Found I2C device at 0x");\n';
    code += '    if (i < 16) Serial.print("0");\n';
    code += '    Serial.println(i, HEX);\n';
    code += '  }\n';
    code += '}\n';
    return code;
};