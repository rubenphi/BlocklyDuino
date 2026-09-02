/* 
 * This file is part of the ESP32-DMX distribution (https://github.com/luksal/ESP32-DMX).
 * Copyright (c) 2021 Lukas Salomon.
 * 
 * This program is free software: you can redistribute it and/or modify  
 * it under the terms of the GNU General Public License as published by  
 * the Free Software Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful, but 
 * WITHOUT ANY WARRANTY; without even the implied warranty of 
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU 
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License 
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
#include <Arduino.h>
#include <stdint.h>
#include <string.h>

#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/queue.h"
#include "driver/uart.h"

//>=2.0.17
#if (ESP_ARDUINO_VERSION_MAJOR == 2) && (ESP_ARDUINO_VERSION_MINOR == 0) && (ESP_ARDUINO_VERSION_PATCH >= 17)
#include "driver/gpio.h"
#endif

#ifndef DMX_ESP32_h
#define DMX_ESP32_h

enum DMXDirection { input, output };
enum DMXState { DMX_IDLE, DMX_BREAK, DMX_DATA, DMX_OUTPUT };

class DMX_ESP32
{
    public:
        static void Initialize(DMXDirection direction, gpio_num_t _rxpin, gpio_num_t _txpin, gpio_num_t _iopin, uart_port_t _uartn);     // initialize library

        static uint8_t Read(uint16_t channel);              // returns the dmx value for the givven address (values from 1 to 512)

        static void ReadAll(uint8_t * data, uint16_t start, size_t size);   // copies the defined channels from the read buffer

        static void Write(uint16_t channel, uint8_t value); // writes the dmx value to the buffer
        
        static void WriteAll(uint8_t * data, uint16_t start, size_t size);  // copies the defined channels into the write buffer

        static uint8_t IsHealthy();                            // returns true, when a valid DMX signal was received within the last 500ms

        static gpio_num_t DMX_SERIAL_INPUT_PIN;         //   GPIO_NUM_3 
        static gpio_num_t DMX_SERIAL_OUTPUT_PIN;        //   GPIO_NUM_1 
        static gpio_num_t DMX_SERIAL_IO_PIN;            //   GPIO_NUM_26 
        static uart_port_t DMX_UART_NUM;                //  UART_NUM_0; 

    private:
        DMX_ESP32();                                              // hide constructor

        static QueueHandle_t dmx_rx_queue;                  // queue for uart rx events
        
        static SemaphoreHandle_t sync_dmx;                  // semaphore for syncronising access to dmx array

        static DMXState dmx_state;                           // status, in which recevied state we are

        static uint16_t current_rx_addr;                    // last received dmx channel

        static long last_dmx_packet;                        // timestamp for the last received packet

        static uint8_t dmx_data[513];                       // stores the received dmx data

        static void uart_event_task(void *pvParameters);    // event task

        static void uart_send_task(void*pvParameters);      // transmit task


};

#endif