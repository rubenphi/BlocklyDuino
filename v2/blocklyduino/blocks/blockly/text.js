/**
 * @license
 * Custom text blocks for BlocklyDuino.
 * @author scanet@libreduc.cc (Sébastien CANET)
 */

'use strict';

Blockly.Blocks['text_format'] = {
    init: function () {
        this.appendValueInput('NUM')
                .setCheck('Number')
                .appendField('formatear');
        this.setOutput(true, 'String');
        this.setStyle('text_blocks');
        this.setTooltip('Convierte un número a texto');
    }
};

Blockly.Blocks['text_format_decimal'] = {
    init: function () {
        this.appendValueInput('NUM')
                .setCheck('Number')
                .appendField('formatear decimal');
        this.appendDummyInput()
                .appendField('decimales')
                .appendField(new Blockly.FieldDropdown([
                    ['0', '0'], ['1', '1'], ['2', '2'], ['3', '3'], ['4', '4'],
                    ['5', '5'], ['6', '6'], ['7', '7'], ['8', '8'], ['9', '9'],
                    ['10', '10']
                ]), 'DECIMALS');
        this.setInputsInline(true);
        this.setOutput(true, 'String');
        this.setStyle('text_blocks');
        this.setTooltip('Convierte un número a texto con N decimales');
    }
};

Blockly.Blocks['text_tonumber'] = {
    init: function () {
        this.appendValueInput('TXT')
                .setCheck('String')
                .appendField('convertir a número');
        this.setOutput(true, 'Number');
        this.setStyle('text_blocks');
        this.setTooltip('Convierte texto a número');
    }
};

Blockly.Blocks['text_escape'] = {
    init: function () {
        this.appendValueInput('TEXT')
                .setCheck('String')
                .appendField('escapar texto');
        this.setOutput(true, 'String');
        this.setStyle('text_blocks');
        this.setTooltip('Escapa caracteres especiales HTML/JSON');
    }
};

Blockly.Blocks['text_join_csv'] = {
    init: function () {
        this.appendValueInput('A')
                .setCheck('String');
        this.appendValueInput('B')
                .setCheck('String')
                .appendField('unir con');
        this.setInputsInline(true);
        this.setOutput(true, 'String');
        this.setStyle('text_blocks');
        this.setTooltip('Une dos textos con separador CSV (coma)');
    }
};

Blockly.Blocks['text_compare'] = {
    init: function () {
        this.appendValueInput('A')
                .setCheck('String');
        this.appendValueInput('B')
                .setCheck('String')
                .appendField('comparar con');
        this.setInputsInline(true);
        this.setOutput(true, 'Number');
        this.setStyle('text_blocks');
        this.setTooltip('Compara dos textos. Devuelve 0 si son iguales, <0 si A<B, >0 si A>B');
    }
};

Blockly.Blocks['text_contains'] = {
    init: function () {
        this.appendValueInput('TEXT')
                .setCheck('String');
        this.appendValueInput('FIND')
                .setCheck('String')
                .appendField('contiene');
        this.setInputsInline(true);
        this.setOutput(true, 'Boolean');
        this.setStyle('text_blocks');
        this.setTooltip('Verifica si el texto contiene la subcadena');
    }
};

Blockly.Blocks['text_indexof'] = {
    init: function () {
        this.appendValueInput('VALUE')
                .setCheck('String')
                .appendField('en texto');
        this.appendValueInput('FIND')
                .setCheck('String')
                .appendField('buscar');
        this.setInputsInline(true);
        this.setOutput(true, 'Number');
        this.setStyle('text_blocks');
        this.setTooltip('Busca la posición de una subcadena dentro de un texto. Devuelve -1 si no se encuentra.');
    }
};

Blockly.Blocks['text_substring'] = {
    init: function () {
        this.appendValueInput('STRING')
                .setCheck('String')
                .appendField('subcadena de');
        this.appendValueInput('FROM')
                .setCheck('Number')
                .appendField('desde');
        this.appendValueInput('TO')
                .setCheck('Number')
                .appendField('hasta');
        this.setInputsInline(true);
        this.setOutput(true, 'String');
        this.setStyle('text_blocks');
        this.setTooltip('Extrae una parte del texto entre las posiciones indicadas.');
    }
};

Blockly.Blocks['text_replace'] = {
    init: function () {
        this.appendValueInput('TEXT')
                .setCheck('String')
                .appendField('en texto');
        this.appendValueInput('FROM')
                .setCheck('String')
                .appendField('reemplazar');
        this.appendValueInput('TO')
                .setCheck('String')
                .appendField('por');
        this.setInputsInline(true);
        this.setOutput(true, 'String');
        this.setStyle('text_blocks');
        this.setTooltip('Reemplaza todas las ocurrencias de un texto por otro.');
    }
};

Blockly.Blocks['text_ascii'] = {
    init: function () {
        this.appendValueInput('TEXT')
                .setCheck('String')
                .appendField('ASCII de');
        this.setOutput(true, 'Number');
        this.setStyle('text_blocks');
        this.setTooltip('Obtiene el código ASCII del primer carácter');
    }
};
