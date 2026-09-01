/**
 * @license
 * Stub block definitions for blocks not yet implemented.
 * These are visual placeholders so the toolbox can display them.
 * Functional code will be added incrementally.
 */

// ===================== LOGIC =====================
// logic_compare_bool and logic_boolean2 are now implemented in blockly/logic.js

// ===================== CONTROL =====================
// control_wait_whileUntil, control_break_continue, control_group
// are now implemented in time/time.js

// ===================== MATH =====================
// math_number_hex, math_angle, math_atan2, math_isnan, math_map,
// math_to_int, math_to_uint, math_bitwise, filter_median_add,
// filter_median_window are now implemented in blockly/math.js

// ===================== TEXT =====================
// text_format, text_format_decimal, text_tonumber, text_escape,
// text_join_csv, text_compare, text_contains, text_ascii,
// text_indexof, text_substring, text_replace
// are now implemented in blockly/text.js
// JSON blocks remain as stubs

// ===================== JSON =====================
var jsonBlocks = [
  'json_parse_data', 'json_parse_result', 'json_contains_key',
  'json_get_key_text', 'json_get_key_number', 'json_get_key_bool',
  'json_get_array_size', 'json_get_index_text', 'json_get_index_number',
  'json_get_index_bool', 'json_foreach_key', 'json_key',
  'json_value_is_type', 'json_value_str', 'json_value_num', 'json_value_bool',
  'json_encode_kv', 'json_encode_kv_value'
];
jsonBlocks.forEach(function(name) {
  if (!Blockly.Blocks[name]) {
    Blockly.Blocks[name] = {
      init: function() {
        this.appendDummyInput().appendField(name.replace(/_/g, ' '));
        this.setColour(60);
        this.setTooltip('JSON block (stub)');
      }
    };
  }
});

// ===================== ESP =====================
var espBlocks = ['esp_restart', 'esp_yield', 'esp_freeheapmemory'];
espBlocks.forEach(function(name) {
  if (!Blockly.Blocks[name]) {
    Blockly.Blocks[name] = {
      init: function() {
        this.appendDummyInput().appendField(name.replace(/_/g, ' '));
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(205);
        this.setTooltip('ESP block (stub)');
      }
    };
  }
});

// ===================== IO =====================
var _ioDropdown = function(fieldName) {
    var val = profile.default[fieldName];
    if (Array.isArray(val) && val.length > 0) {
        return val;
    }
    return [['0', '0'], ['1', '1'], ['2', '2'], ['3', '3'], ['4', '4'], ['5', '5'], ['6', '6'], ['7', '7'], ['8', '8'], ['9', '9'], ['10', '10'], ['11', '11'], ['12', '12'], ['13', '13']];
};

Blockly.Blocks['io_digital_read'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(Blockly.Msg.ARDUINO_INOUT_DIGITAL_READ_INPUT || 'Digital Read')
            .appendField(new Blockly.FieldDropdown(function() { return _ioDropdown('dropdownDigital'); }), "PIN");
        this.setOutput(true, 'Boolean');
        this.setTooltip('Read digital value from a pin');
        this.setColour(230);
    }
};

Blockly.Blocks['io_digital_write'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(Blockly.Msg.ARDUINO_INOUT_DIGITAL_WRITE_INPUT1 || 'Digital Write')
            .appendField(new Blockly.FieldDropdown(function() { return _ioDropdown('dropdownDigital'); }), "PIN")
            .appendField(Blockly.Msg.ARDUINO_INOUT_DIGITAL_WRITE_INPUT2 || 'to')
            .appendField(new Blockly.FieldDropdown(Blockly.Msg.FIELDDROPDOWN), 'STAT');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip('Write digital value to a pin');
        this.setColour(230);
    }
};

Blockly.Blocks['io_analog_read'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(Blockly.Msg.ARDUINO_INOUT_ANALOG_READ_INPUT || 'Analog Read')
            .appendField(new Blockly.FieldDropdown(function() { return _ioDropdown('dropdownAnalog'); }), "PIN");
        this.setOutput(true, 'int');
        this.setTooltip('Read analog value from a pin');
        this.setColour(230);
    }
};

Blockly.Blocks['io_analog_write'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(Blockly.Msg.ARDUINO_INOUT_ANALOG_WRITE_INPUT1 || 'Analog Write')
            .appendField(new Blockly.FieldDropdown(function() { return _ioDropdown('dropdownPWM'); }), "PIN")
            .appendField(Blockly.Msg.ARDUINO_INOUT_ANALOG_WRITE_INPUT2 || 'value');
        this.appendValueInput("NUM", 'Number')
            .setCheck('Number');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip('Write analog value to a pin');
        this.setColour(230);
    }
};

Blockly.Blocks['io_analog_write_dac'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('DAC Write')
            .appendField(new Blockly.FieldDropdown(function() { return _ioDropdown('dropdownPWM'); }), "PIN");
        this.appendValueInput("NUM", 'Number')
            .setCheck('Number');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip('Write DAC value to a pin');
        this.setColour(230);
    }
};

Blockly.Blocks['io_digital_read2'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(Blockly.Msg.ARDUINO_INOUT_DIGITAL_READ_INPUT || 'Digital Read');
        this.appendValueInput("PIN")
            .setCheck('Number')
            .appendField(Blockly.Msg.ARDUINO_INOUT_DIGITAL_WRITE_INPUT1 || 'Pin');
        this.setOutput(true, 'Boolean');
        this.setTooltip('Read digital value from a pin');
        this.setColour(230);
    }
};

Blockly.Blocks['io_digital_write2'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(Blockly.Msg.ARDUINO_INOUT_DIGITAL_WRITE_INPUT1 || 'Digital Write');
        this.appendValueInput("PIN")
            .setCheck('Number')
            .appendField(Blockly.Msg.ARDUINO_INOUT_DIGITAL_WRITE_INPUT1 || 'Pin');
        this.appendValueInput("STAT")
            .setCheck('Boolean')
            .appendField(Blockly.Msg.ARDUINO_INOUT_DIGITAL_WRITE_INPUT2 || 'to');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip('Write digital value to a pin');
        this.setColour(230);
    }
};

Blockly.Blocks['io_analog_read2'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(Blockly.Msg.ARDUINO_INOUT_ANALOG_READ_INPUT || 'Analog Read');
        this.appendValueInput("PIN")
            .setCheck('Number')
            .appendField(Blockly.Msg.ARDUINO_INOUT_DIGITAL_WRITE_INPUT1 || 'Pin');
        this.setOutput(true, 'int');
        this.setTooltip('Read analog value from a pin');
        this.setColour(230);
    }
};

Blockly.Blocks['io_analog_write2'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(Blockly.Msg.ARDUINO_INOUT_ANALOG_WRITE_INPUT1 || 'Analog Write');
        this.appendValueInput("PIN")
            .setCheck('Number')
            .appendField(Blockly.Msg.ARDUINO_INOUT_DIGITAL_WRITE_INPUT1 || 'Pin');
        this.appendValueInput("NUM")
            .setCheck('Number')
            .appendField(Blockly.Msg.ARDUINO_INOUT_ANALOG_WRITE_INPUT2 || 'value');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip('Write analog value to a pin');
        this.setColour(230);
    }
};

Blockly.Blocks['io_pull'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('Set Pull')
            .appendField(new Blockly.FieldDropdown(function() { return _ioDropdown('dropdownDigital'); }), "PIN")
            .appendField(new Blockly.FieldDropdown([['INPUT_PULLUP', 'INPUT_PULLUP'], ['INPUT', 'INPUT'], ['OUTPUT', 'OUTPUT']]), 'MODE');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip('Set pull-up/pull-down resistor');
        this.setColour(230);
    }
};

Blockly.Blocks['io_capacitive_read'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(Blockly.Msg.ARDUINO_INOUT_ANALOG_READ_INPUT || 'Capacitive Read')
            .appendField(new Blockly.FieldDropdown(function() { return _ioDropdown('dropdownAnalog'); }), "PIN");
        this.setOutput(true, 'int');
        this.setTooltip('Read capacitive sensor value');
        this.setColour(230);
    }
};

Blockly.Blocks['io_pulsein'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('Pulse In')
            .appendField(new Blockly.FieldDropdown(function() { return _ioDropdown('dropdownDigital'); }), "PIN");
        this.appendValueInput("TIMEOUT", 'Number')
            .setCheck('Number')
            .appendField('timeout');
        this.setOutput(true, 'int');
        this.setTooltip('Read pulse width');
        this.setColour(230);
    }
};

Blockly.Blocks['io_interrupt'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('Interrupt')
            .appendField(new Blockly.FieldDropdown(function() { return _ioDropdown('dropdownDigital'); }), "PIN")
            .appendField(new Blockly.FieldDropdown([['RISING', 'RISING'], ['FALLING', 'FALLING'], ['CHANGE', 'CHANGE']]), 'MODE');
        this.appendStatementInput("DO")
            .appendField('do');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip('Attach interrupt to a pin');
        this.setColour(230);
    }
};

Blockly.Blocks['io_digital_read_i2c'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('I2C Digital Read')
            .appendField(new Blockly.FieldDropdown(function() { return _ioDropdown('dropdownDigital'); }), "PIN");
        this.setOutput(true, 'Boolean');
        this.setTooltip('Read digital value via I2C');
        this.setColour(230);
    }
};

Blockly.Blocks['io_digital_write_i2c'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('I2C Digital Write')
            .appendField(new Blockly.FieldDropdown(function() { return _ioDropdown('dropdownDigital'); }), "PIN")
            .appendField(Blockly.Msg.ARDUINO_INOUT_DIGITAL_WRITE_INPUT2 || 'to')
            .appendField(new Blockly.FieldDropdown(Blockly.Msg.FIELDDROPDOWN), 'STAT');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip('Write digital value via I2C');
        this.setColour(230);
    }
};

Blockly.Blocks['io_digital_read2_i2c'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('I2C Digital Read');
        this.appendValueInput("PIN")
            .setCheck('Number')
            .appendField(Blockly.Msg.ARDUINO_INOUT_DIGITAL_WRITE_INPUT1 || 'Pin');
        this.setOutput(true, 'Boolean');
        this.setTooltip('Read digital value via I2C');
        this.setColour(230);
    }
};

Blockly.Blocks['io_digital_write2_i2c'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('I2C Digital Write');
        this.appendValueInput("PIN")
            .setCheck('Number')
            .appendField(Blockly.Msg.ARDUINO_INOUT_DIGITAL_WRITE_INPUT1 || 'Pin');
        this.appendValueInput("STAT")
            .setCheck('Boolean')
            .appendField(Blockly.Msg.ARDUINO_INOUT_DIGITAL_WRITE_INPUT2 || 'to');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip('Write digital value via I2C');
        this.setColour(230);
    }
};

Blockly.Blocks['io_analog_read_i2c'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('I2C Analog Read');
        this.setOutput(true, 'int');
        this.setTooltip('Read analog value via I2C');
        this.setColour(230);
    }
};

Blockly.Blocks['io_analog_read2_i2c'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('I2C Analog Read');
        this.appendValueInput("PIN")
            .setCheck('Number')
            .appendField(Blockly.Msg.ARDUINO_INOUT_DIGITAL_WRITE_INPUT1 || 'Pin');
        this.setOutput(true, 'int');
        this.setTooltip('Read analog value via I2C');
        this.setColour(230);
    }
};

Blockly.Blocks['io_analog_read_dif_i2c'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('I2C Analog Diff Read');
        this.setOutput(true, 'int');
        this.setTooltip('Read differential analog via I2C');
        this.setColour(230);
    }
};

Blockly.Blocks['io_i2c_scanner'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('I2C Scanner');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip('Scan I2C bus');
        this.setColour(230);
    }
};

// Sensor blocks
var sensorBlocks = [
  'sensor_potentiometer', 'sensor_button', 'sensor_button_debounced',
  'sensor_touch', 'sensor_pir', 'sensor_dht11', 'sensor_dht22',
  'sensor_ldr', 'sensor_ntc', 'sensor_ultrasonic', 'sensor_rotary_encoder',
  'sensor_rotary_encoder_set2', 'sensor_joystick', 'sensor_obstacle',
  'sensor_sound', 'sensor_linetracking', 'sensor_photoint',
  'sensor_soilhumidity', 'sensor_water', 'sensor_knock', 'sensor_tilt',
  'sensor_hall', 'sensor_vibration', 'sensor_flame', 'sensor_gas',
  'sensor_alcohol', 'sensor_TEMT6000', 'sensor_lm35', 'sensor_tmp36',
  'sensor_nunchuk', 'sensor_pm25', 'sensor_pm_particles',
  'sensor_mics4514', 'sensor_bmp180', 'sensor_bme280', 'sensor_ds18b20',
  'sensor_ccs811', 'sensor_pressure', 'sensor_MLX90614', 'sensor_GUVAS12SD',
  'sensor_irremote_decode_txt', 'sensor_irremote_keys_txt',
  'sensor_irremote_value', 'sensor_irremote_bits', 'sensor_irremote_protocol',
  'sensor_adxl345', 'sensor_mpu6050',
  'sensor_color_tcs34725', 'sensor_color_tcs34725_value', 'sensor_color_tcs34725_iscolor',
  'sensor_paj7620', 'sensor_paj7620_gesture'
];
sensorBlocks.forEach(function(name) {
  if (!Blockly.Blocks[name]) {
    Blockly.Blocks[name] = {
      init: function() {
        this.appendDummyInput().appendField(name.replace(/_/g, ' '));
        this.setColour(230);
        this.setTooltip('Sensor block (stub)');
      }
    };
  }
});

// ===================== ACTUATORS =====================
var actuatorBlocks = [
  'actuator_led', 'actuator_led_pwm', 'actuator_led_rgb', 'actuator_led_rgb2',
  'actuator_relay', 'actuator_irtx', 'actuator_buzzer', 'actuator_buzzer_tone',
  'actuator_buzzer_rttl', 'actuator_buzzer_rttl_melody', 'actuator_fanmotor'
];
actuatorBlocks.forEach(function(name) {
  if (!Blockly.Blocks[name]) {
    Blockly.Blocks[name] = {
      init: function() {
        this.appendDummyInput().appendField(name.replace(/_/g, ' '));
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(15);
        this.setTooltip('Actuator block (stub)');
      }
    };
  }
});

// ===================== MOTOR =====================
var motorBlocks = [
  'motor_servo_move', 'motor_servo_oscillator_set', 'motor_servo_oscillator_action',
  'motor_servo_move_i2c',
  'motor_stepper_init', 'motor_stepper_setspeed', 'motor_stepper_step',
  'motor_dcpwm', 'motor_l298n_init', 'motor_l298n_move',
  'motor_l298p_init', 'motor_l298p_move'
];
motorBlocks.forEach(function(name) {
  if (!Blockly.Blocks[name]) {
    Blockly.Blocks[name] = {
      init: function() {
        this.appendDummyInput().appendField(name.replace(/_/g, ' '));
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(310);
        this.setTooltip('Motor block (stub)');
      }
    };
  }
});

// ===================== PERIPHERALS =====================
var peripheralBlocks = [
  'gps_init', 'gps_validdata', 'gps_getposition', 'gps_getspeed',
  'gps_getaltitude', 'gps_getcourse', 'gps_getdatetime', 'gps_date_string',
  'gps_time_string', 'gps_satellites', 'gps_distancebetween',
  'rtc_set_time', 'rtc_set', 'rtc_get', 'rtc_get_time_text', 'rtc_get_date_text',
  'rfid_init', 'rfid_newcardpresent', 'rfid_readuid',
  'mp3_init', 'mp3_volume', 'mp3_eq', 'mp3_play_file', 'mp3_play_folderfile',
  'mp3_control', 'mp3_reset'
];
peripheralBlocks.forEach(function(name) {
  if (!Blockly.Blocks[name]) {
    Blockly.Blocks[name] = {
      init: function() {
        this.appendDummyInput().appendField(name.replace(/_/g, ' '));
        this.setColour(180);
        this.setTooltip('Peripheral block (stub)');
      }
    };
  }
});

// ===================== DISPLAY =====================

var lcd_deviceDropdown = [['1', '1'], ['2', '2']];
var lcd_typeDropdown = [['2x16', '2x16'], ['4x20', '4x20']];
var lcd_addrDropdown = [
    ['0x27 *', '0x27'], ['0x20', '0x20'], ['0x21', '0x21'], ['0x22', '0x22'],
    ['0x23', '0x23'], ['0x24', '0x24'], ['0x25', '0x25'], ['0x26', '0x26'],
    ['0x28', '0x28'], ['0x29', '0x29'], ['0x2A', '0x2A'], ['0x2B', '0x2B'],
    ['0x2C', '0x2C'], ['0x2D', '0x2D'], ['0x2E', '0x2E'], ['0x2F', '0x2F'],
    ['0x30', '0x30'], ['0x31', '0x31'], ['0x32', '0x32'], ['0x33', '0x33'],
    ['0x34', '0x34'], ['0x35', '0x35'], ['0x36', '0x36'], ['0x37', '0x37'],
    ['0x38', '0x38'], ['0x39', '0x39'], ['0x3A', '0x3A'], ['0x3B', '0x3B'],
    ['0x3C', '0x3C'], ['0x3D', '0x3D'], ['0x3E', '0x3E'], ['0x3F *', '0x3F']
];
var lcd_colDropdown = [
    ['0', '0'], ['1', '1'], ['2', '2'], ['3', '3'], ['4', '4'], ['5', '5'],
    ['6', '6'], ['7', '7'], ['8', '8'], ['9', '9'], ['10', '10'], ['11', '11'],
    ['12', '12'], ['13', '13'], ['14', '14'], ['15', '15'], ['16', '16'],
    ['17', '17'], ['18', '18'], ['19', '19']
];
var lcd_rowDropdown = [['0', '0'], ['1', '1'], ['2', '2'], ['3', '3']];

Blockly.Blocks['lcd2_begin_i2c'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('LCD')
            .appendField(new Blockly.FieldDropdown(lcd_deviceDropdown), 'NUM')
            .appendField('Iniciar')
            .appendField(new Blockly.FieldDropdown(lcd_typeDropdown), 'TYPE')
            .appendField('I2C ADDR')
            .appendField(new Blockly.FieldDropdown(lcd_addrDropdown), 'ADDR');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(130);
        this.setTooltip('Inicializar LCD I2C');
    }
};

Blockly.Blocks['lcd2_clear'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('LCD')
            .appendField(new Blockly.FieldDropdown(lcd_deviceDropdown), 'NUM')
            .appendField('Limpiar');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(130);
        this.setTooltip('Limpiar pantalla LCD');
    }
};

Blockly.Blocks['lcd2_print'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('LCD')
            .appendField(new Blockly.FieldDropdown(lcd_deviceDropdown), 'NUM')
            .appendField('Imprimir')
            .appendField('Columna')
            .appendField(new Blockly.FieldDropdown(lcd_colDropdown), 'CURSOR_COLUMN')
            .appendField('Fila')
            .appendField(new Blockly.FieldDropdown(lcd_rowDropdown), 'CURSOR_ROW');
        this.appendValueInput('STRINGOUTPUT')
            .setCheck('String')
            .appendField('texto');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(130);
        this.setTooltip('Imprimir en LCD');
    }
};

Blockly.Blocks['lcd2_print_customchar'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('LCD')
            .appendField(new Blockly.FieldDropdown(lcd_deviceDropdown), 'NUM')
            .appendField('Imprimir Caracter Custom')
            .appendField('Columna')
            .appendField(new Blockly.FieldDropdown(lcd_colDropdown), 'CURSOR_COLUMN')
            .appendField('Fila')
            .appendField(new Blockly.FieldDropdown(lcd_rowDropdown), 'CURSOR_ROW');
        this.appendValueInput('STRINGOUTPUT')
            .setCheck('String')
            .appendField('texto');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(130);
        this.setTooltip('Imprimir caracter custom en LCD');
    }
};

Blockly.Blocks['lcd2_print2'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('LCD')
            .appendField(new Blockly.FieldDropdown(lcd_deviceDropdown), 'NUM')
            .appendField('Imprimir');
        this.appendValueInput('CURSOR_COLUMN')
            .setCheck('Number')
            .appendField('Columna');
        this.appendValueInput('CURSOR_ROW')
            .setCheck('Number')
            .appendField('Fila');
        this.appendValueInput('STRINGOUTPUT')
            .setCheck('String')
            .appendField('texto');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(130);
        this.setTooltip('Imprimir en LCD');
    }
};

Blockly.Blocks['lcd2_print2_customchar'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('LCD')
            .appendField(new Blockly.FieldDropdown(lcd_deviceDropdown), 'NUM')
            .appendField('Imprimir Caracter Custom');
        this.appendValueInput('CURSOR_COLUMN')
            .setCheck('Number')
            .appendField('Columna');
        this.appendValueInput('CURSOR_ROW')
            .setCheck('Number')
            .appendField('Fila');
        this.appendValueInput('STRINGOUTPUT')
            .setCheck('String')
            .appendField('texto');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(130);
        this.setTooltip('Imprimir caracter custom en LCD');
    }
};

Blockly.Blocks['lcd2_backlight'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('LCD')
            .appendField(new Blockly.FieldDropdown(lcd_deviceDropdown), 'NUM')
            .appendField('Retroiluminación')
            .appendField(new Blockly.FieldDropdown([['ENCENDIDO', 'true'], ['APAGADO', 'false']]), 'STATE');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(130);
        this.setTooltip('Controlar retroiluminación LCD');
    }
};

Blockly.Blocks['lcd2_cursor'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('LCD')
            .appendField(new Blockly.FieldDropdown(lcd_deviceDropdown), 'NUM')
            .appendField('Cursor')
            .appendField(new Blockly.FieldDropdown([['MOSTRAR', 'show'], ['OCULTAR', 'noCursor'], ['BLOQUEO', 'blink'], ['SIN BLOQUEO', 'noBlink']]), 'MODE');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(130);
        this.setTooltip('Mostrar/ocultar cursor LCD');
    }
};

Blockly.Blocks['lcd2_display'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('LCD')
            .appendField(new Blockly.FieldDropdown(lcd_deviceDropdown), 'NUM')
            .appendField('Display')
            .appendField(new Blockly.FieldDropdown([['ENCENDIDO', 'true'], ['APAGADO', 'false']]), 'STATE');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(130);
        this.setTooltip('Encender/apagar display LCD');
    }
};

Blockly.Blocks['lcd2_scroll'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('LCD')
            .appendField(new Blockly.FieldDropdown(lcd_deviceDropdown), 'NUM')
            .appendField('Scroll')
            .appendField(new Blockly.FieldDropdown([['IZQUIERDA', 'scrollLeft'], ['DERECHA', 'scrollRight']]), 'DIRECTION');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(130);
        this.setTooltip('Scroll del LCD');
    }
};

Blockly.Blocks['lcd2_customchar'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('LCD')
            .appendField(new Blockly.FieldDropdown(lcd_deviceDropdown), 'NUM')
            .appendField('Custom Char')
            .appendField(new Blockly.FieldDropdown([['0', '0'], ['1', '1'], ['2', '2'], ['3', '3'], ['4', '4'], ['5', '5'], ['6', '6'], ['7', '7']]), 'POSITION');
        this.appendValueInput('DATA')
            .setCheck('Array')
            .appendField('datos');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(130);
        this.setTooltip('Definir caracter custom');
    }
};

// ===================== OLED =====================
Blockly.Blocks['oled_init'] = {
    init: function() {
        this.appendDummyInput().appendField('OLED Iniciar');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(160);
        this.setTooltip('Inicializar pantalla OLED');
    }
};
Blockly.Blocks['oled_rotation'] = {
    init: function() {
        this.appendDummyInput().appendField('OLED Rotación')
            .appendField(new Blockly.FieldDropdown([['0°', '0'], ['90°', '1'], ['180°', '2'], ['270°', '3']]), 'ROTATION');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(160);
    }
};
Blockly.Blocks['oled_clear'] = {
    init: function() {
        this.appendDummyInput().appendField('OLED Limpiar');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(160);
    }
};
Blockly.Blocks['oled_show'] = {
    init: function() {
        this.appendDummyInput().appendField('OLED Mostrar');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(160);
    }
};
Blockly.Blocks['oled_drawtext'] = {
    init: function() {
        this.appendDummyInput().appendField('OLED Texto');
        this.appendValueInput('X').setCheck('Number').appendField('X');
        this.appendValueInput('Y').setCheck('Number').appendField('Y');
        this.appendValueInput('TXT').setCheck('String').appendField('texto');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(160);
    }
};
Blockly.Blocks['oled_drawbitmap'] = {
    init: function() {
        this.appendDummyInput().appendField('OLED Bitmap');
        this.appendValueInput('X').setCheck('Number').appendField('X');
        this.appendValueInput('Y').setCheck('Number').appendField('Y');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(160);
    }
};
Blockly.Blocks['oled_drawpixel'] = {
    init: function() {
        this.appendDummyInput().appendField('OLED Pixel');
        this.appendValueInput('X').setCheck('Number').appendField('X');
        this.appendValueInput('Y').setCheck('Number').appendField('Y');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(160);
    }
};
Blockly.Blocks['oled_drawline'] = {
    init: function() {
        this.appendDummyInput().appendField('OLED Línea');
        this.appendValueInput('X1').setCheck('Number').appendField('X1');
        this.appendValueInput('Y1').setCheck('Number').appendField('Y1');
        this.appendValueInput('X2').setCheck('Number').appendField('X2');
        this.appendValueInput('Y2').setCheck('Number').appendField('Y2');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(160);
    }
};
Blockly.Blocks['oled_drawrectangle'] = {
    init: function() {
        this.appendDummyInput().appendField('OLED Rectángulo');
        this.appendValueInput('X1').setCheck('Number').appendField('X1');
        this.appendValueInput('Y1').setCheck('Number').appendField('Y1');
        this.appendValueInput('X2').setCheck('Number').appendField('X2');
        this.appendValueInput('Y2').setCheck('Number').appendField('Y2');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(160);
    }
};
Blockly.Blocks['oled_drawcircle'] = {
    init: function() {
        this.appendDummyInput().appendField('OLED Círculo');
        this.appendValueInput('X').setCheck('Number').appendField('X');
        this.appendValueInput('Y').setCheck('Number').appendField('Y');
        this.appendValueInput('R').setCheck('Number').appendField('R');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(160);
    }
};

// ===================== LED MATRIX =====================
Blockly.Blocks['ledmatrix_init'] = {
    init: function() {
        this.appendDummyInput().appendField('LedMatrix Iniciar');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(390);
    }
};
Blockly.Blocks['ledmatrix_rotation'] = {
    init: function() {
        this.appendDummyInput().appendField('LedMatrix Rotación')
            .appendField(new Blockly.FieldDropdown([['0°', '0'], ['90°', '1'], ['180°', '2'], ['270°', '3']]), 'ROTATION');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(390);
    }
};
Blockly.Blocks['ledmatrix_clear'] = {
    init: function() {
        this.appendDummyInput().appendField('LedMatrix Limpiar');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(390);
    }
};
Blockly.Blocks['ledmatrix_drawbitmap'] = {
    init: function() {
        this.appendDummyInput().appendField('LedMatrix Bitmap');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(390);
    }
};
Blockly.Blocks['ledmatrix_drawsprite'] = {
    init: function() {
        this.appendDummyInput().appendField('LedMatrix Sprite');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(390);
    }
};
Blockly.Blocks['ledmatrix_drawpixel'] = {
    init: function() {
        this.appendDummyInput().appendField('LedMatrix Pixel');
        this.appendValueInput('X').setCheck('Number').appendField('X');
        this.appendValueInput('Y').setCheck('Number').appendField('Y');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(390);
    }
};
Blockly.Blocks['ledmatrix_drawline'] = {
    init: function() {
        this.appendDummyInput().appendField('LedMatrix Línea');
        this.appendValueInput('X1').setCheck('Number').appendField('X1');
        this.appendValueInput('Y1').setCheck('Number').appendField('Y1');
        this.appendValueInput('X2').setCheck('Number').appendField('X2');
        this.appendValueInput('Y2').setCheck('Number').appendField('Y2');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(390);
    }
};
Blockly.Blocks['ledmatrix_drawrectangle'] = {
    init: function() {
        this.appendDummyInput().appendField('LedMatrix Rectángulo');
        this.appendValueInput('X1').setCheck('Number').appendField('X1');
        this.appendValueInput('Y1').setCheck('Number').appendField('Y1');
        this.appendValueInput('X2').setCheck('Number').appendField('X2');
        this.appendValueInput('Y2').setCheck('Number').appendField('Y2');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(390);
    }
};
Blockly.Blocks['ledmatrix_drawcircle'] = {
    init: function() {
        this.appendDummyInput().appendField('LedMatrix Círculo');
        this.appendValueInput('X').setCheck('Number').appendField('X');
        this.appendValueInput('Y').setCheck('Number').appendField('Y');
        this.appendValueInput('R').setCheck('Number').appendField('R');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(390);
    }
};
Blockly.Blocks['ledmatrix_drawtext'] = {
    init: function() {
        this.appendDummyInput().appendField('LedMatrix Texto');
        this.appendValueInput('X').setCheck('Number').appendField('X');
        this.appendValueInput('Y').setCheck('Number').appendField('Y');
        this.appendValueInput('TXT').setCheck('String').appendField('texto');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(390);
    }
};
Blockly.Blocks['ledmatrix_drawmatrix'] = {
    init: function() {
        this.appendDummyInput().appendField('LedMatrix Matriz');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(390);
    }
};

// ===================== NEOPIXEL =====================
Blockly.Blocks['neopixel_init'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('NeoPixel Iniciar')
            .appendField(new Blockly.FieldDropdown([['0', '0'], ['1', '1'], ['2', '2'], ['3', '3'], ['4', '4'], ['5', '5'], ['6', '6'], ['7', '7'], ['8', '8'], ['9', '9'], ['10', '10'], ['11', '11'], ['12', '12'], ['13', '13']]), 'PIN');
        this.appendValueInput('LEDCOUNT').setCheck('Number').appendField('led');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(210);
    }
};
Blockly.Blocks['neopixel_setbrightness'] = {
    init: function() {
        this.appendDummyInput().appendField('NeoPixel Brillo');
        this.appendValueInput('BRIGHTNESS').setCheck('Number').appendField('brillo');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(210);
    }
};
Blockly.Blocks['neopixel_clear'] = {
    init: function() {
        this.appendDummyInput().appendField('NeoPixel Limpiar');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(210);
    }
};
Blockly.Blocks['neopixel_setled'] = {
    init: function() {
        this.appendDummyInput().appendField('NeoPixel LED');
        this.appendValueInput('LEDNUMBER').setCheck('Number').appendField('nº');
        this.appendValueInput('R').setCheck('Number').appendField('R');
        this.appendValueInput('G').setCheck('Number').appendField('G');
        this.appendValueInput('B').setCheck('Number').appendField('B');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(210);
    }
};
Blockly.Blocks['neopixel_setledxy'] = {
    init: function() {
        this.appendDummyInput().appendField('NeoPixel LED XY');
        this.appendValueInput('X').setCheck('Number').appendField('X');
        this.appendValueInput('Y').setCheck('Number').appendField('Y');
        this.appendValueInput('R').setCheck('Number').appendField('R');
        this.appendValueInput('G').setCheck('Number').appendField('G');
        this.appendValueInput('B').setCheck('Number').appendField('B');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(210);
    }
};
Blockly.Blocks['neopixel_setled2'] = {
    init: function() {
        this.appendDummyInput().appendField('NeoPixel LED 2');
        this.appendValueInput('LEDNUMBER').setCheck('Number').appendField('nº');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(210);
    }
};
Blockly.Blocks['neopixel_setled2xy'] = {
    init: function() {
        this.appendDummyInput().appendField('NeoPixel LED 2 XY');
        this.appendValueInput('X').setCheck('Number').appendField('X');
        this.appendValueInput('Y').setCheck('Number').appendField('Y');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(210);
    }
};
Blockly.Blocks['neopixel_setdata'] = {
    init: function() {
        this.appendDummyInput().appendField('NeoPixel Datos');
        this.appendFieldInput('DATA');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(210);
    }
};
Blockly.Blocks['neopixel_show'] = {
    init: function() {
        this.appendDummyInput().appendField('NeoPixel Mostrar');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(210);
    }
};

// ===================== COMMUNICATIONS =====================
var commBlocks = [
  'serial_init', 'serial_timeout', 'serial_print', 'serial_write_byte',
  'serial_read_available', 'serial_read_string', 'serial_read_string_until',
  'serial_read_byte', 'serial_read_float', 'serial_plot',
  'bluetooth_init_esp32', 'bluetooth_print', 'bluetooth_write_byte',
  'bluetooth_read_available', 'bluetooth_read_string', 'bluetooth_read_string_until',
  'bluetooth_read_byte', 'bluetooth_read_float', 'bluetooth_timeout',
  'ble_init', 'ble_print', 'ble_write_byte', 'ble_read_available',
  'ble_read_string', 'ble_read_string_until', 'ble_read_byte', 'ble_read_float',
  'ble_keyboard_init', 'ble_keyboard_isconnected', 'ble_keyboard_print',
  'ble_keyboard_key', 'ble_keyboard_code',
  'ble_mouse_init', 'ble_mouse_isconnected', 'ble_mouse_press', 'ble_mouse_move',
  'espwifi_connect2', 'espwifi_connect_multi2', 'espwifi_is_connected',
  'espwifi_mdns2', 'espwifi_ip', 'espwifi_config2', 'espwifi_ap2',
  'espwifi_hostname2', 'espwifi_setmac2', 'espwifi_channel_from_ssd2',
  'espmqtt_init2', 'espmqtt_pub', 'espmqtt_sub_number', 'espmqtt_sub_text',
  'espmqtt_sub_novar', 'espmqtt_onreceive', 'espmqtt_topic',
  'espmqtt_message_str', 'espmqtt_message_number', 'espmqtt_isconnected',
  'mqtt_thingspeak_pub2', 'mqtt_thingspeak_sub2',
  'mqtt_thingspeak_pub2_multi_topic', 'mqtt_thingspeak_pub2_encode_kv',
  'mqtt_thingspeak_pub2_kv_value', 'mqtt_adafruit_pub', 'mqtt_adafruit_sub',
  'http_get', 'http_get_response', 'http_post', 'http_post_response',
  'httpserver_init2', 'httpserver_on', 'httpserver_parameter',
  'httpserver_parameter_int', 'httpserver_on_notfound', 'httpserver_send',
  'html_document', 'html_head', 'html_tag_link', 'html_tag_img',
  'html_tag_heading', 'html_tag_separator', 'html_tag_align',
  'html_tag_paragraph', 'html_tag_format', 'html_tag_font',
  'espalexa_device2', 'espalexa_event', 'espalexa_getonoff',
  'espalexa_getdimm', 'espalexa_getrgb',
  'telegram_init2', 'telegram_send', 'telegram_event_newmessage',
  'telegram_get_message', 'telegram_get_message_location',
  'ntp_init2', 'ntp_set_utc', 'ntp_get', 'ntp_get_time_text', 'ntp_get_date_text',
  'blynk_iot_init_esp32ks', 'blynk_iot_vpin_write', 'blynk_iot_app_write',
  'blynk_iot_param_read_int0', 'blynk_iot_param_read_int',
  'blynk_iot_param_read_string0', 'blynk_iot_param_read_string',
  'blynk_iot_timer', 'blynk_iot_set_property', 'blynk_iot_led_onoff',
  'blynk_iot_led', 'blynk_iot_terminal_print', 'blynk_iot_terminal_clear',
  'blynk_iot_lcd_print', 'blynk_iot_lcd_clear', 'blynk_iot_map',
  'blynk_iot_connected', 'blynk_iot_app_connected', 'blynk_iot_app_disconnected',
  'blynk_init_esp32ks', 'blynk_app_read', 'blynk_vpin_write',
  'blynk_app_write', 'blynk_param_read_int0', 'blynk_param_read_int',
  'blynk_param_read_string0', 'blynk_param_read_string',
  'blynk_timer', 'blynk_set_property', 'blynk_led_onoff', 'blynk_led',
  'blynk_terminal_print', 'blynk_terminal_clear', 'blynk_lcd_print',
  'blynk_lcd_clear', 'blynk_map', 'blynk_notify', 'blynk_email',
  'blynk_connected', 'blynk_app_connected', 'blynk_app_disconnected'
];
commBlocks.forEach(function(name) {
  if (!Blockly.Blocks[name]) {
    Blockly.Blocks[name] = {
      init: function() {
        this.appendDummyInput().appendField(name.replace(/_/g, ' '));
        this.setColour(170);
        this.setTooltip('Communication block (stub)');
      }
    };
  }
});

// ===================== SD =====================
var sdBlocks = [
  'sd_init', 'sd_print', 'sd_filesize', 'sd_remove', 'sd_writebyte',
  'sd_readbyte', 'sd_readloop', 'sd_exists'
];
sdBlocks.forEach(function(name) {
  if (!Blockly.Blocks[name]) {
    Blockly.Blocks[name] = {
      init: function() {
        this.appendDummyInput().appendField(name.replace(/_/g, ' '));
        this.setColour(290);
        this.setTooltip('SD block (stub)');
      }
    };
  }
});

// ===================== EEPROM =====================
var eepromBlocks = [
  'eeprom_esp32_clear', 'eeprom_esp32_remove_id', 'eeprom_esp32_read_double',
  'eeprom_esp32_write_double', 'eeprom_esp32_read_str', 'eeprom_esp32_write_str'
];
eepromBlocks.forEach(function(name) {
  if (!Blockly.Blocks[name]) {
    Blockly.Blocks[name] = {
      init: function() {
        this.appendDummyInput().appendField(name.replace(/_/g, ' '));
        this.setColour(220);
        this.setTooltip('EEPROM block (stub)');
      }
    };
  }
});
