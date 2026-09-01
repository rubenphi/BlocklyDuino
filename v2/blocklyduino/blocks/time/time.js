/**
 * @license
 * Time and control blocks for BlocklyDuino.
 * @author scanet@libreduc.cc (Sébastien CANET)
 */

'use strict';

goog.provide('Blockly.Constants.time');

goog.require('Blockly.Blocks');
goog.require('Blockly');

Blockly.Blocks['time_delay'] = {
    init: function () {
        this.appendDummyInput()
                .appendField('Esperar');
        this.appendValueInput('DELAY_TIME_MILI')
                .setCheck('Number');
        this.appendDummyInput()
                .appendField('milisegundos');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setStyle('time_blocks');
        this.setTooltip('Retrasa la ejecución durante N milisegundos');
    }
};

Blockly.Blocks['time_delaymicros'] = {
    init: function () {
        this.appendDummyInput()
                .appendField('Esperar');
        this.appendValueInput('DELAY_TIME_MICRO')
                .setCheck('Number');
        this.appendDummyInput()
                .appendField('microsegundos');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setStyle('time_blocks');
        this.setTooltip('Retrasa la ejecución durante N microsegundos');
    }
};

Blockly.Blocks['time_millis'] = {
    init: function () {
        this.appendDummyInput()
                .appendField('Tiempo transcurrido (milisegundos)');
        this.setOutput(true, 'Number');
        this.setStyle('time_blocks');
        this.setTooltip('Devuelve los milisegundos transcurridos desde el inicio');
    }
};

Blockly.Blocks['time_micros'] = {
    init: function () {
        this.appendDummyInput()
                .appendField('Tiempo transcurrido (microsegundos)');
        this.setOutput(true, 'Number');
        this.setStyle('time_blocks');
        this.setTooltip('Devuelve los microsegundos transcurridos desde el inicio');
    }
};

Blockly.Blocks['time_runeveryms'] = {
    init: function () {
        this.appendDummyInput()
                .appendField('Ejecutar cada');
        this.appendValueInput('MS')
                .setCheck('Number');
        this.appendDummyInput()
                .appendField('ms');
        this.appendStatementInput('DO')
                .appendField('hacer');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setStyle('time_blocks');
        this.setTooltip('Ejecuta un bloque periódicamente cada N milisegundos');
    }
};

Blockly.Blocks['infinite_loop'] = {
    init: function () {
        this.appendStatementInput('DO')
                .appendField('Esperar por siempre (fin)');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setStyle('time_blocks');
        this.setTooltip('Espera indefinidamente');
    }
};

Blockly.Blocks['time_timer'] = {
    init: function () {
        this.appendDummyInput()
                .appendField('Cronómetro')
                .appendField(new Blockly.FieldDropdown([
                    ['ms', 'ms'],
                    ['s', 's']
                ]), 'UNIT');
        this.setOutput(true, 'Number');
        this.setStyle('time_blocks');
        this.setTooltip('Devuelve el valor del cronómetro');
    }
};

Blockly.Blocks['time_timer_reset'] = {
    init: function () {
        this.appendDummyInput()
                .appendField('Reiniciar el cronómetro');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setStyle('time_blocks');
        this.setTooltip('Reinicia el cronómetro');
    }
};

Blockly.Blocks['tasks_esp32_task2'] = {
    init: function () {
        this.appendDummyInput()
                .appendField('tarea ESP32')
                .appendField(new Blockly.FieldDropdown([
                    ['1', '1'], ['2', '2'], ['3', '3'], ['4', '4'], ['5', '5'],
                    ['6', '6'], ['7', '7'], ['8', '8'], ['9', '9'], ['10', '10'],
                    ['11', '11'], ['12', '12'], ['13', '13'], ['14', '14'], ['15', '15'],
                    ['16', '16'], ['17', '17'], ['18', '18'], ['19', '19'], ['20', '20'],
                    ['21', '21'], ['22', '22'], ['23', '23'], ['24', '24'], ['25', '25']
                ]), 'PRIORITY');
        this.appendStatementInput('DO')
                .appendField('hacer');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setStyle('time_blocks');
        this.setTooltip('Crea una tarea en el ESP32 con prioridad');
    }
};

Blockly.Blocks['tasks_esp32_delay'] = {
    init: function () {
        this.appendValueInput('DELAY_TIME_MILI')
                .setCheck('Number')
                .appendField('delay tarea');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setStyle('time_blocks');
        this.setTooltip('Retraso dentro de una tarea del ESP32');
    }
};

Blockly.Blocks['tasks_esp32_mutex'] = {
    init: function () {
        this.appendDummyInput()
                .appendField('mutex ESP32');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setStyle('time_blocks');
        this.setTooltip('Crea o usa un mutex en el ESP32');
    }
};

Blockly.Blocks['tasks_esp32_set_stacksize'] = {
    init: function () {
        this.appendValueInput('STACKSIZE')
                .setCheck('Number')
                .appendField('tamaño pila');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setStyle('time_blocks');
        this.setTooltip('Configura el tamaño de pila para una tarea');
    }
};

Blockly.Blocks['tasks_esp32_get_core'] = {
    init: function () {
        this.appendDummyInput()
                .appendField('núcleo actual');
        this.setOutput(true, 'Number');
        this.setStyle('time_blocks');
        this.setTooltip('Devuelve el núcleo actual del ESP32');
    }
};

Blockly.Blocks['tasks_esp32_destroy'] = {
    init: function () {
        this.appendDummyInput()
                .appendField('destruir tarea');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setStyle('time_blocks');
        this.setTooltip('Destruye una tarea del ESP32');
    }
};

Blockly.Blocks['control_wait_whileUntil'] = {
    init: function () {
        this.appendValueInput('CONDITION')
                .setCheck('Boolean')
                .appendField(new Blockly.FieldDropdown([
                    ['esperar mientras', 'WHILE'],
                    ['esperar hasta', 'UNTIL']
                ]), 'MODE');
        this.appendStatementInput('DO')
                .appendField('hacer');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setStyle('time_blocks');
        this.setTooltip('Espera mientras o hasta que se cumpla una condición');
    }
};

Blockly.Blocks['control_break_continue'] = {
    init: function () {
        this.appendDummyInput()
                .appendField(new Blockly.FieldDropdown([
                    ['romper', 'BREAK'],
                    ['continuar', 'CONTINUE']
                ]), 'ACTION');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setStyle('time_blocks');
        this.setTooltip('Rompe o continúa un bucle');
    }
};

Blockly.Blocks['control_group'] = {
    init: function () {
        this.appendStatementInput('STACK')
                .appendField('agrupar');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setStyle('time_blocks');
        this.setTooltip('Agrupa bloques');
    }
};
