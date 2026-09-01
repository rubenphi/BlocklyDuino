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
var displayBlocks = [
  'lcd2_begin_i2c', 'lcd2_customchar', 'lcd2_clear', 'lcd2_print',
  'lcd2_print_customchar', 'lcd2_print2', 'lcd2_print2_customchar',
  'lcd2_backlight', 'lcd2_cursor', 'lcd2_display', 'lcd2_scroll',
  'oled_init', 'oled_rotation', 'oled_clear', 'oled_show',
  'oled_drawtext', 'oled_drawbitmap', 'oled_drawpixel', 'oled_drawline',
  'oled_drawrectangle', 'oled_drawcircle',
  'ledmatrix_init', 'ledmatrix_rotation', 'ledmatrix_clear',
  'ledmatrix_drawbitmap', 'ledmatrix_drawsprite', 'ledmatrix_drawpixel',
  'ledmatrix_drawline', 'ledmatrix_drawrectangle', 'ledmatrix_drawcircle',
  'ledmatrix_drawtext', 'ledmatrix_drawmatrix',
  'neopixel_init', 'neopixel_setbrightness', 'neopixel_clear',
  'neopixel_setled', 'neopixel_setledxy', 'neopixel_setled2',
  'neopixel_setled2xy', 'neopixel_setdata', 'neopixel_show'
];
displayBlocks.forEach(function(name) {
  if (!Blockly.Blocks[name]) {
    Blockly.Blocks[name] = {
      init: function() {
        this.appendDummyInput().appendField(name.replace(/_/g, ' '));
        this.setColour(130);
        this.setTooltip('Display block (stub)');
      }
    };
  }
});

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
