/**
 * @license
 * Copyright 2020 Sébastien CANET
 * SPDX-License-Identifier: BSD-3-Clause
 */

/**
 * @fileoverview Generating Arduino code for structural blocks (setup/loop).
 */

'use strict';

goog.provide('Blockly.Arduino.board_structural');

goog.require('Blockly.Arduino');

Blockly.Arduino['board_setup'] = function (block) {
    var setupBody = Blockly.Arduino.statementToCode(block, 'SETUP_BODY');
    Blockly.Arduino.setups_['userSetupCode_'] = setupBody;
    return '';
};

Blockly.Arduino['board_loop'] = function (block) {
    var loopBody = Blockly.Arduino.statementToCode(block, 'LOOP_BODY');
    Blockly.Arduino.loopCode_ = loopBody;
    return '';
};
