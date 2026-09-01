/**
 * @license
 * Copyright 2020 Sébastien CANET
 * SPDX-License-Identifier: BSD-3-Clause
 */

/**
 * @fileoverview Generating Arduino code for Digital sensor blocks.
 * @author scanet@libreduc.cc (Sébastien Canet)
 */

'use strict';

goog.provide('Blockly.Arduino.board_sensor');

goog.require('Blockly.Arduino');

var sensorDigitalNames = ['sensor_button', 'sensor_button_debounced', 'sensor_touch', 'sensor_pir',
    'sensor_obstacle', 'sensor_linetracking', 'sensor_photoint', 'sensor_knock', 'sensor_tilt',
    'sensor_vibration', 'sensor_sound', 'sensor_hall', 'sensor_flame', 'sensor_gas', 'sensor_alcohol'];

sensorDigitalNames.forEach(function(name) {
    Blockly.Arduino[name] = function(block) {
        var dropdown_pin = block.getFieldValue('PIN');
        Blockly.Arduino.setups_['setup_input_' + dropdown_pin] = 'pinMode(' + dropdown_pin + ', INPUT);';
        var invert = block.getFieldValue('INV');
        var code = 'digitalRead(' + dropdown_pin + ')';
        if (invert === 'TRUE') {
            code = '(!' + code + ')';
        }
        return [code, Blockly.Arduino.ORDER_ATOMIC];
    };
});
