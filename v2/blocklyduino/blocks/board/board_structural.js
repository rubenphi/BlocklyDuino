/**
 * @license
 * Copyright 2020 Sébastien CANET
 * SPDX-License-Identifier: BSD-3-Clause
 */

/**
 * @fileoverview Structural blocks for setup/loop separation in BlocklyDuino.
 */

'use strict';

goog.provide('Blockly.Constants.board_structural');

goog.require('Blockly.Blocks');
goog.require('Blockly');

Blockly.Blocks['board_setup'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(Blockly.Msg.ARDUINO_SETUP_TITLE);
        this.appendStatementInput('SETUP_BODY');
        this.setTooltip(Blockly.Msg.ARDUINO_SETUP_TOOLTIP);
        this.setHelpUrl(Blockly.Msg.ARDUINO_SETUP_HELPURL);
        this.setStyle('hat_blocks');
    }
};

Blockly.Blocks['board_loop'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(Blockly.Msg.ARDUINO_LOOP_TITLE);
        this.appendStatementInput('LOOP_BODY');
        this.setTooltip(Blockly.Msg.ARDUINO_LOOP_TOOLTIP);
        this.setHelpUrl(Blockly.Msg.ARDUINO_LOOP_HELPURL);
        this.setStyle('hat_blocks');
    }
};
