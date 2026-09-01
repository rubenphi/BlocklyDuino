/**
 * @license
 * Copyright 2012 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Math blocks for Blockly.
 *
 * This file is scraped to extract a .json file of block definitions. The array
 * passed to defineBlocksWithJsonArray(..) must be strict JSON: double quotes
 * only, no outside references, no functions, no trailing commas, etc. The one
 * exception is end-of-line comments, which the scraper will remove.
 * @author q.neutron@gmail.com (Quynh Neutron)
 * @author scanet@libreduc.cc (Sébastien CANET)
 */
'use strict';

goog.provide('Blockly.Constants.MathArduino');

// goog.require('Blockly.Blocks');

Blockly.Blocks['math_single'] = {
    /**
     * Block for advanced math operators with single operand.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "message0": "%1 %2",
            "args0": [
                {
                    "type": "field_dropdown",
                    "name": "OP",
                    "options": [
                        [Blockly.Msg.MATH_SINGLE_OP_ROOT, 'ROOT'],
                        [Blockly.Msg.MATH_SINGLE_OP_ABSOLUTE, 'ABS'],
                        ['-', 'NEG'],
                        ['10^', 'POW10']
                    ]
                },
                {
                    "type": "input_value",
                    "name": "NUM",
                    "check": "Number"
                }
            ],
            "output": "Number",
            "style": "math_blocks",
            "helpUrl": Blockly.Msg.MATH_SINGLE_HELPURL
        });
        // Assign 'this' to a variable for use in the tooltip closure below.
        var thisBlock = this;
        this.setTooltip(function () {
            var mode = thisBlock.getFieldValue('OP');
            var TOOLTIPS = {
                'ROOT': Blockly.Msg.MATH_SINGLE_TOOLTIP_ROOT,
                'ABS': Blockly.Msg.MATH_SINGLE_TOOLTIP_ABS,
                'NEG': Blockly.Msg.MATH_SINGLE_TOOLTIP_NEG,
                'POW10': Blockly.Msg.MATH_SINGLE_TOOLTIP_POW10
            };
            return TOOLTIPS[mode];
        });
    }
};

Blockly.Blocks['math_trig'] = {
    /**
     * Block for trigonometry operators.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "message0": "%1 %2",
            "args0": [
                {
                    "type": "field_dropdown",
                    "name": "OP",
                    "options": [
                        [Blockly.Msg.MATH_TRIG_SIN, 'SIN'],
                        [Blockly.Msg.MATH_TRIG_COS, 'COS'],
                        [Blockly.Msg.MATH_TRIG_TAN, 'TAN']
                    ]
                },
                {
                    "type": "input_value",
                    "name": "NUM",
                    "check": "Number"
                }
            ],
            "output": "float",
            "style": "math_blocks",
            "helpUrl": Blockly.Msg.MATH_TRIG_HELPURL
        });
        // Assign 'this' to a variable for use in the tooltip closure below.
        var thisBlock = this;
        this.setTooltip(function () {
            var mode = thisBlock.getFieldValue('OP');
            var TOOLTIPS = {
                'SIN': Blockly.Msg.MATH_TRIG_TOOLTIP_SIN,
                'COS': Blockly.Msg.MATH_TRIG_TOOLTIP_COS,
                'TAN': Blockly.Msg.MATH_TRIG_TOOLTIP_TAN
            };
            return TOOLTIPS[mode];
        });
    }
};

Blockly.Blocks['math_constant'] = {
    /**
     * Block for constants: PI, E, the Golden Ratio, sqrt(2), 1/sqrt(2), INFINITY.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "message0": "%1",
            "args0": [
                {
                    "type": "field_dropdown",
                    "name": "CONSTANT",
                    "options": [
                        ['\u03c0', 'PI'],
                        ['\u03c6', 'GOLDEN_RATIO'],
                        ['sqrt(2)', 'SQRT2'],
                        ['sqrt(\u00bd)', 'SQRT1_2']
                    ]
                }
            ],
            "output": "float",
            "style": "math_blocks",
            "tooltip": Blockly.Msg.MATH_CONSTANT_TOOLTIP,
            "helpUrl": Blockly.Msg.MATH_CONSTANT_HELPURL
        });
    }
};

Blockly.Blocks['math_number_property'] = {
    /**
     * Block for checking if a number is even, odd, prime, whole, positive,
     * negative or if it is divisible by certain number.
     * @this Blockly.Block
     */
    init: function () {
        var PROPERTIES =
                [[Blockly.Msg.MATH_IS_EVEN, 'EVEN'],
                    [Blockly.Msg.MATH_IS_ODD, 'ODD'],
                    [Blockly.Msg.MATH_IS_PRIME, 'PRIME'],
                    [Blockly.Msg.MATH_IS_WHOLE, 'WHOLE'],
                    [Blockly.Msg.MATH_IS_POSITIVE, 'POSITIVE'],
                    [Blockly.Msg.MATH_IS_NEGATIVE, 'NEGATIVE'],
                    [Blockly.Msg.MATH_IS_DIVISIBLE_BY, 'DIVISIBLE_BY']];
        this.setStyle("math_blocks");
        this.appendValueInput('NUMBER_TO_CHECK')
                .setCheck('Number');
        var dropdown = new Blockly.FieldDropdown(PROPERTIES, function (option) {
            var divisorInput = (option == 'DIVISIBLE_BY');
            this.sourceBlock_.updateShape_(divisorInput);
        });
        this.appendDummyInput()
                .appendField(dropdown, 'PROPERTY');
        this.setInputsInline(true);
        this.setOutput(true, 'Boolean');
        this.setTooltip(Blockly.Msg.MATH_IS_TOOLTIP);
    },
    /**
     * Create XML to represent whether the 'divisorInput' should be present.
     * @return {Element} XML storage element.
     * @this Blockly.Block
     */
    mutationToDom: function () {
        var container = document.createElement('mutation');
        var divisorInput = (this.getFieldValue('PROPERTY') == 'DIVISIBLE_BY');
        container.setAttribute('divisor_input', divisorInput);
        return container;
    },
    /**
     * Parse XML to restore the 'divisorInput'.
     * @param {!Element} xmlElement XML storage element.
     * @this Blockly.Block
     */
    domToMutation: function (xmlElement) {
        var divisorInput = (xmlElement.getAttribute('divisor_input') == 'true');
        this.updateShape_(divisorInput);
    },
    /**
     * Modify this block to have (or not have) an input for 'is divisible by'.
     * @param {boolean} divisorInput True if this block has a divisor input.
     * @private
     * @this Blockly.Block
     */
    updateShape_: function (divisorInput) {
        // Add or remove a Value Input.
        var inputExists = this.getInput('DIVISOR');
        if (divisorInput) {
            if (!inputExists) {
                this.appendValueInput('DIVISOR')
                        .setCheck('Number');
            }
        } else if (inputExists) {
            this.removeInput('DIVISOR');
        }
    }
};

Blockly.Blocks['math_change'] = {
    /**
     * Block for adding to a variable in place.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "message0": Blockly.Msg.MATH_CHANGE_TITLE,
            "args0": [
                {
                    "type": "field_variable",
                    "name": "VAR",
                    "variable": Blockly.Msg.MATH_CHANGE_TITLE_ITEM
                },
                {
                    "type": "input_value",
                    "name": "DELTA",
                    "check": "Number"
                }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": Blockly.Blocks.variables.HUE,
            "helpUrl": Blockly.Msg.MATH_CHANGE_HELPURL
        });
        // Assign 'this' to a variable for use in the tooltip closure below.
        var thisBlock = this;
        this.setTooltip(function () {
            return Blockly.Msg.MATH_CHANGE_TOOLTIP.replace('%1',
                    thisBlock.getFieldValue('VAR'));
        });
    }
};

Blockly.Blocks['math_modulo'] = {
    /**
     * Block for remainder of a division.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "message0": Blockly.Msg.MATH_MODULO_TITLE,
            "args0": [
                {
                    "type": "input_value",
                    "name": "DIVIDEND",
                    "check": "Number"
                },
                {
                    "type": "input_value",
                    "name": "DIVISOR",
                    "check": "Number"
                }
            ],
            "inputsInline": true,
            "output": "Number",
            "style": "math_blocks",
            "tooltip": Blockly.Msg.MATH_MODULO_TOOLTIP,
            "helpUrl": Blockly.Msg.MATH_MODULO_HELPURL
        });
    }
};

Blockly.Blocks['math_random_int'] = {
    /**
     * Block for random integer between [X] and [Y].
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "message0": Blockly.Msg.MATH_RANDOM_INT_TITLE,
            "args0": [
                {
                    "type": "input_value",
                    "name": "FROM",
                    "check": "Number"
                },
                {
                    "type": "input_value",
                    "name": "TO",
                    "check": "Number"
                }
            ],
            "inputsInline": true,
            "output": "int",
            "style": "math_blocks",
            "tooltip": Blockly.Msg.MATH_RANDOM_INT_TOOLTIP,
            "helpUrl": Blockly.Msg.MATH_RANDOM_INT_HELPURL
        });
    }
};

Blockly.Blocks['math_number_hex'] = {
    init: function () {
        this.appendDummyInput()
                .appendField('0x')
                .appendField(new Blockly.FieldTextInput('00', function (text) {
                    text = text.replace(/[^0-9a-fA-F]/g, '');
                    return text;
                }), 'NUM');
        this.setOutput(true, 'Number');
        this.setStyle('math_blocks');
        this.setTooltip('Número hexadecimal (0x00 - 0xFF)');
    }
};

Blockly.Blocks['math_angle'] = {
    init: function () {
        this.appendDummyInput()
                .appendField('ángulo')
                .appendField(new Blockly.FieldAngle(90), 'ANGLE');
        this.setOutput(true, 'Number');
        this.setStyle('math_blocks');
        this.setTooltip('Ángulo en grados (0-360)');
    }
};

Blockly.Blocks['math_atan2'] = {
    init: function () {
        this.appendValueInput('X')
                .setCheck('Number')
                .appendField('atan2 de');
        this.appendValueInput('Y')
                .setCheck('Number')
                .appendField('y');
        this.setInputsInline(true);
        this.setOutput(true, 'Number');
        this.setStyle('math_blocks');
        this.setTooltip('Arcotangente de Y/X en radianes');
    }
};

Blockly.Blocks['math_isnan'] = {
    init: function () {
        this.appendValueInput('NUM')
                .setCheck('Number')
                .appendField('¿es NaN?');
        this.setOutput(true, 'Boolean');
        this.setStyle('math_blocks');
        this.setTooltip('Verifica si el número es NaN (Not a Number)');
    }
};

Blockly.Blocks['math_map'] = {
    init: function () {
        this.appendValueInput('VALUE')
                .setCheck('Number')
                .appendField('mapear');
        this.appendValueInput('FROMLOW')
                .setCheck('Number')
                .appendField('desde bajo');
        this.appendValueInput('FROMHIGH')
                .setCheck('Number')
                .appendField('desde alto');
        this.appendValueInput('TOLOW')
                .setCheck('Number')
                .appendField('hasta bajo');
        this.appendValueInput('TOHIGH')
                .setCheck('Number')
                .appendField('hasta alto');
        this.setInputsInline(true);
        this.setOutput(true, 'Number');
        this.setStyle('math_blocks');
        this.setTooltip('Mapea un valor de un rango a otro');
    }
};

Blockly.Blocks['math_to_int'] = {
    init: function () {
        this.appendValueInput('NUM')
                .setCheck('Number')
                .appendField('convertir a entero');
        this.setOutput(true, 'Number');
        this.setStyle('math_blocks');
        this.setTooltip('Convierte a entero (int)');
    }
};

Blockly.Blocks['math_to_uint'] = {
    init: function () {
        this.appendValueInput('NUM')
                .setCheck('Number')
                .appendField('convertir a entero sin signo');
        this.setOutput(true, 'Number');
        this.setStyle('math_blocks');
        this.setTooltip('Convierte a entero sin signo (unsigned int)');
    }
};

Blockly.Blocks['math_bitwise'] = {
    init: function () {
        this.appendValueInput('A')
                .setCheck('Number');
        this.appendDummyInput()
                .appendField(new Blockly.FieldDropdown([
                    ['AND', 'AND'],
                    ['OR', 'OR'],
                    ['XOR', 'XOR'],
                    ['NOT', 'NOT'],
                    ['<<', 'LSHIFT'],
                    ['>>', 'RSHIFT']
                ]), 'OP');
        this.appendValueInput('B')
                .setCheck('Number');
        this.setInputsInline(true);
        this.setOutput(true, 'Number');
        this.setStyle('math_blocks');
        this.setTooltip('Operación bitwise');
    }
};

Blockly.Blocks['filter_median_add'] = {
    init: function () {
        this.appendValueInput('VALUE')
                .setCheck('Number')
                .appendField('filtro mediana agregar');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setStyle('math_blocks');
        this.setTooltip('Agrega un valor al filtro de mediana');
    }
};

Blockly.Blocks['filter_median_window'] = {
    init: function () {
        this.appendValueInput('WINDOW')
                .setCheck('Number')
                .appendField('filtro mediana ventana');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setStyle('math_blocks');
        this.setTooltip('Configura el tamaño de ventana del filtro de mediana');
    }
};