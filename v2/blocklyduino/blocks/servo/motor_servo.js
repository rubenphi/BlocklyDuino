/**
 * @license
 * Copyright 2012 Fred Lin
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview ESP32 Servomotor blocks for Blockly.
 * @author gasolin@gmail.com (Fred Lin)
 * @author scanet@libreduc.cc (Sébastien Canet)
 */
 
'use strict';

goog.provide('Blockly.Constants.motor_servo');

goog.require('Blockly.Blocks');
goog.require('Blockly');

var motorServoMediaFolder = "./blocklyduino/blocks/servo/";

function getDigitalPins() {
    return profile.default.dropdownDigital || [["0", "0"]];
}

Blockly.Blocks['motor_servo_move'] = {
    init: function () {
        this.appendDummyInput()
                .appendField("Servo")
                .appendField(new Blockly.FieldImage(motorServoMediaFolder + "servo.png", 32, 32))
                .appendField("Pin")
                .appendField(new Blockly.FieldDropdown(getDigitalPins()), "PIN");
        this.appendValueInput("DEGREE")
                .setCheck("Number")
                .setAlign(Blockly.ALIGN_RIGHT)
                .appendField("Ángulo");
        this.appendValueInput("DELAY_TIME")
                .setCheck("Number")
                .setAlign(Blockly.ALIGN_RIGHT)
                .appendField("Retardo (ms)");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip("Mover servo a un ángulo específico con retardo opcional");
        this.setHelpUrl("");
        this.setStyle('servo_blocks');
    }
};

Blockly.Blocks['motor_servo_oscillator_set'] = {
    init: function () {
        this.appendDummyInput()
                .appendField("Servo-Oscilador")
                .appendField(new Blockly.FieldImage(motorServoMediaFolder + "servo.png", 32, 32))
                .appendField("Pin")
                .appendField(new Blockly.FieldDropdown(getDigitalPins()), "PIN");
        this.appendDummyInput()
                .appendField(new Blockly.FieldDropdown([
                    ["Amplitud", "AMPLITUDE"],
                    ["Frecuencia", "FREQUENCY"],
                    ["Phase", "PHASE"]
                ]), "PARAM");
        this.appendValueInput("VALUE")
                .setCheck("Number");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip("Configurar parámetro del oscilador del servo");
        this.setHelpUrl("");
        this.setStyle('servo_blocks');
    }
};

Blockly.Blocks['motor_servo_oscillator_action'] = {
    init: function () {
        this.appendDummyInput()
                .appendField("Servo-Oscilador")
                .appendField(new Blockly.FieldImage(motorServoMediaFolder + "servo.png", 32, 32))
                .appendField("Pin")
                .appendField(new Blockly.FieldDropdown(getDigitalPins()), "PIN");
        this.appendDummyInput()
                .appendField(new Blockly.FieldDropdown([
                    ["Iniciar", "START"],
                    ["Detener", "STOP"],
                    ["Restablecer", "RESET"]
                ]), "ACTION");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip("Controlar acción del oscilador del servo");
        this.setHelpUrl("");
        this.setStyle('servo_blocks');
    }
};

Blockly.Blocks['motor_servo_move_i2c'] = {
    init: function () {
        this.appendDummyInput()
                .appendField("Servo I2C")
                .appendField(new Blockly.FieldImage(motorServoMediaFolder + "servo.png", 32, 32))
                .appendField("Canal")
                .appendField(new Blockly.FieldDropdown([
                    ["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"],
                    ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"]
                ]), "CHANNEL");
        this.appendValueInput("DEGREE")
                .setCheck("Number")
                .setAlign(Blockly.ALIGN_RIGHT)
                .appendField("Ángulo");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip("Mover servo I2C a un ángulo específico");
        this.setHelpUrl("");
        this.setStyle('servo_blocks');
    }
};
