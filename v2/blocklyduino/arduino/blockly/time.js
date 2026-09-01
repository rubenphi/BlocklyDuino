/**
 * @license
 * Generating Arduino code for time and control blocks.
 * @author scanet@libreduc.cc (Sébastien CANET)
 */

'use strict';

goog.provide('Blockly.Arduino.time');

goog.require('Blockly.Arduino');

Blockly.Arduino['time_delay'] = function (block) {
    var delayTime = Blockly.Arduino.valueToCode(block, 'DELAY_TIME_MILI',
            Blockly.Arduino.ORDER_NONE) || '1000';
    return 'delay(' + delayTime + ');\n';
};

Blockly.Arduino['time_delaymicros'] = function (block) {
    var delayMicro = Blockly.Arduino.valueToCode(block, 'DELAY_TIME_MICRO',
            Blockly.Arduino.ORDER_NONE) || '1000';
    return 'delayMicroseconds(' + delayMicro + ');\n';
};

Blockly.Arduino['time_millis'] = function (block) {
    return ['millis()', Blockly.Arduino.ORDER_FUNCTION_CALL];
};

Blockly.Arduino['time_micros'] = function (block) {
    return ['micros()', Blockly.Arduino.ORDER_FUNCTION_CALL];
};

Blockly.Arduino['time_runeveryms'] = function (block) {
    var ms = Blockly.Arduino.valueToCode(block, 'MS',
            Blockly.Arduino.ORDER_NONE) || '1000';
    var doCode = Blockly.Arduino.statementToCode(block, 'DO');
    Blockly.Arduino.definitions_['task_time_ms'] = 'unsigned long task_time_ms = 0;\n';
    var code = 'if((millis()-task_time_ms)>=' + ms + '){\n' +
            '  task_time_ms=millis();\n' +
            doCode +
            '}\n';
    return code;
};

Blockly.Arduino['infinite_loop'] = function (block) {
    var doCode = Blockly.Arduino.statementToCode(block, 'DO');
    return 'while(true){\n  yield();\n' + doCode + '}\n';
};

Blockly.Arduino['time_timer'] = function (block) {
    Blockly.Arduino.definitions_['time_timer'] = 'unsigned long time_timer = millis();\n';
    var unit = block.getFieldValue('UNIT');
    var value = unit === 's' ? '(time_timer / 1000)' : 'time_timer';
    return [value, Blockly.Arduino.ORDER_UNARY_POSTFIX];
};

Blockly.Arduino['time_timer_reset'] = function (block) {
    return 'time_timer = millis();\n';
};

Blockly.Arduino['tasks_esp32_task2'] = function (block) {
    var priority = block.getFieldValue('PRIORITY');
    var doCode = Blockly.Arduino.statementToCode(block, 'DO');
    return 'xTaskCreatePinnedToCore(taskFunc, "task", 4096, NULL, ' +
            priority + ', NULL, 1);\n' + doCode + '\n';
};

Blockly.Arduino['tasks_esp32_delay'] = function (block) {
    var delayTime = Blockly.Arduino.valueToCode(block, 'DELAY_TIME_MILI',
            Blockly.Arduino.ORDER_NONE) || '1000';
    return 'vTaskDelay(' + delayTime + ' / portTICK_PERIOD_MS);\n';
};

Blockly.Arduino['tasks_esp32_mutex'] = function (block) {
    return 'xSemaphoreCreateMutex();\n';
};

Blockly.Arduino['tasks_esp32_set_stacksize'] = function (block) {
    var stackSize = Blockly.Arduino.valueToCode(block, 'STACKSIZE',
            Blockly.Arduino.ORDER_NONE) || '4096';
    return '/* Stack size: ' + stackSize + ' */\n';
};

Blockly.Arduino['tasks_esp32_get_core'] = function (block) {
    return ['xPortGetCoreID()', Blockly.Arduino.ORDER_FUNCTION_CALL];
};

Blockly.Arduino['tasks_esp32_destroy'] = function (block) {
    return 'vTaskDelete(NULL);\n';
};

Blockly.Arduino['control_wait_whileUntil'] = function (block) {
    var mode = block.getFieldValue('MODE');
    var condition = Blockly.Arduino.valueToCode(block, 'CONDITION',
            Blockly.Arduino.ORDER_NONE) || 'false';
    var doCode = Blockly.Arduino.statementToCode(block, 'DO');
    if (mode === 'WHILE') {
        return 'while (' + condition + ') {\n' + doCode + '}\n';
    } else {
        return 'while (!' + condition + ') {\n' + doCode + '}\n';
    }
};

Blockly.Arduino['control_break_continue'] = function (block) {
    var action = block.getFieldValue('ACTION');
    if (action === 'BREAK') {
        return 'break;\n';
    } else {
        return 'continue;\n';
    }
};

Blockly.Arduino['control_group'] = function (block) {
    var doCode = Blockly.Arduino.statementToCode(block, 'STACK');
    return doCode;
};
