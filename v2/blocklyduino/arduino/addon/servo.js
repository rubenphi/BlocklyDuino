/**
 * @license
 * Copyright 2012 Fred Lin
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Servomotor blocks for Blockly.
 * @author gasolin@gmail.com (Fred Lin)
 * @author scanet@libreduc.cc (Sébastien CANET)
 */

'use strict';

goog.provide('Blockly.Arduino.servo');

goog.require('Blockly.Arduino');

Blockly.Arduino['servo_move'] = function (block) {
    var dropdown_pin = block.getFieldValue('PIN');
    var value_degree = Blockly.Arduino.valueToCode(block, 'DEGREE', Blockly.Arduino.ORDER_ATOMIC);

    Blockly.Arduino.includes_['includes_servo'] = '#include <Servo.h>';
    Blockly.Arduino.definitions_['var_servo' + dropdown_pin] = 'Servo servo_' + dropdown_pin + ';';
    Blockly.Arduino.setups_['setup_servo_' + dropdown_pin] = 'servo_' + dropdown_pin + '.attach(' + dropdown_pin + ');';

    var code = 'servo_' + dropdown_pin + '.write(' + value_degree + ');\n';
    return code;
};

Blockly.Arduino['servo_read_degrees'] = function (block) {
    var dropdown_pin = block.getFieldValue('PIN');

    Blockly.Arduino.includes_['includes_servo'] = '#include <Servo.h>';
    Blockly.Arduino.definitions_['var_servo' + dropdown_pin] = 'Servo servo_' + dropdown_pin + ';';
    Blockly.Arduino.setups_['setup_servo_' + dropdown_pin] = 'servo_' + dropdown_pin + '.attach(' + dropdown_pin + ');';

    var code = 'servo_' + dropdown_pin + '.read()';
    return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['motor_servo_move'] = function (block) {
    var dropdown_pin = block.getFieldValue('PIN');
    var value_degree = Blockly.Arduino.valueToCode(block, 'DEGREE', Blockly.Arduino.ORDER_ATOMIC);
    var value_delay = Blockly.Arduino.valueToCode(block, 'DELAY_TIME', Blockly.Arduino.ORDER_ATOMIC);

    Blockly.Arduino.includes_['includes_esp32servo'] = '// Library: ESP32Servo by Kevin Harrington & John K. Bennett\n// https://github.com/madhephaestus/ESP32Servo\n#include <ESP32Servo.h>';
    Blockly.Arduino.definitions_['var_servo' + dropdown_pin] = 'Servo servo_' + dropdown_pin + ';';
    Blockly.Arduino.setups_['setup_servo_' + dropdown_pin] = 'servo_' + dropdown_pin + '.attach(' + dropdown_pin + ');';

    var code = 'servo_' + dropdown_pin + '.write(' + value_degree + ');\n';
    if (value_delay && value_delay !== '0') {
        code += 'delay(' + value_delay + ');\n';
    }
    return code;
};

Blockly.Arduino['motor_servo_oscillator_set'] = function (block) {
    var dropdown_pin = block.getFieldValue('PIN');
    var dropdown_param = block.getFieldValue('PARAM');
    var value_param = Blockly.Arduino.valueToCode(block, 'VALUE', Blockly.Arduino.ORDER_ATOMIC);

    Blockly.Arduino.includes_['includes_servoosc'] = '// Library: ServoOscESP32\n// Based on ServoOsc by Tom Coetser: https://github.com/fitzterra/ServoOsc\n// ESP32 port: replaced #include <Servo.h> with #include <ESP32Servo.h>\n#include <ServoOscESP32.h>';
    Blockly.Arduino.definitions_['var_oscillator' + dropdown_pin] = 'ServoOscESP32 oscillator_' + dropdown_pin + ';';
    Blockly.Arduino.setups_['setup_oscillator_' + dropdown_pin] = 'oscillator_' + dropdown_pin + '.attach(' + dropdown_pin + ');';

    var code = '';
    if (dropdown_param === 'AMPLITUDE') {
        code = 'oscillator_' + dropdown_pin + '.setAmplitude(' + value_param + ');\n';
    } else if (dropdown_param === 'FREQUENCY') {
        code = 'oscillator_' + dropdown_pin + '.setFrequency(' + value_param + ');\n';
    } else if (dropdown_param === 'PHASE') {
        code = 'oscillator_' + dropdown_pin + '.setPhase(' + value_param + ');\n';
    }
    return code;
};

Blockly.Arduino['motor_servo_oscillator_action'] = function (block) {
    var dropdown_pin = block.getFieldValue('PIN');
    var dropdown_action = block.getFieldValue('ACTION');

    Blockly.Arduino.includes_['includes_servoosc'] = '// Library: ServoOscESP32\n// Based on ServoOsc by Tom Coetser: https://github.com/fitzterra/ServoOsc\n// ESP32 port: replaced #include <Servo.h> with #include <ESP32Servo.h>\n#include <ServoOscESP32.h>';
    Blockly.Arduino.definitions_['var_oscillator' + dropdown_pin] = 'ServoOscESP32 oscillator_' + dropdown_pin + ';';
    Blockly.Arduino.setups_['setup_oscillator_' + dropdown_pin] = 'oscillator_' + dropdown_pin + '.attach(' + dropdown_pin + ');';

    var code = '';
    if (dropdown_action === 'START') {
        code = 'oscillator_' + dropdown_pin + '.start();\n';
    } else if (dropdown_action === 'STOP') {
        code = 'oscillator_' + dropdown_pin + '.stop();\n';
    } else if (dropdown_action === 'RESET') {
        code = 'oscillator_' + dropdown_pin + '.reset();\n';
    }
    return code;
};

Blockly.Arduino['motor_servo_move_i2c'] = function (block) {
    var dropdown_channel = block.getFieldValue('CHANNEL');
    var value_degree = Blockly.Arduino.valueToCode(block, 'DEGREE', Blockly.Arduino.ORDER_ATOMIC);

    Blockly.Arduino.includes_['includes_servo_i2c'] = '#include <Wire.h>';
    Blockly.Arduino.definitions_['var_servo_i2c'] = '// Servo I2C control';
    Blockly.Arduino.setups_['setup_wire'] = 'Wire.begin();';

    var code = 'Wire.beginTransmission(0x40);\n';
    code += 'Wire.write(6);\n';
    code += 'Wire.write(' + value_degree + ' * 4 >> 8);\n';
    code += 'Wire.write(' + value_degree + ' * 4 & 0xFF);\n';
    code += 'Wire.endTransmission();\n';
    return code;
};
