/*
Librería para gestión de la matriz de neopixel 5x5 de microSTEAMakers
Juanjo López
*/

#ifndef _MICRO_MATRIX_H
#define _MICRO_MATRIX_H

#if ARDUINO >= 100
 #include "Arduino.h"
 #include "Print.h"
#else
 #include "WProgram.h"
#endif

#include <FastLED.h>
#include <FastLED_GFX.h>
#include <FontsFL/Font5x5Fixed.h>
#include <Ticker.h>

class MicroMatrix{

public:
  MicroMatrix();

  void SetBrightness(int _b);
  void Clear();

  void Text(int _x, int _y, String _t, CRGB _c);
  void TextScroll(String _t, CRGB _c, int _delay=100);
  void CancelTextScroll();
  bool isTextScrolling();

  void Bitmap(CRGB pixels[25]);

  void FillColor(CRGB _c);
  void Pixel(int _pixel, CRGB _c);
  void PixelXY(int _x, int _y, CRGB _c);

  void Line(int _x1,int _y1,int _x2,int _y2, CRGB _c);
  void Rect(int _x,int _y,int _w,int _h, CRGB _c, bool _fill);
  void Circle(int _x,int _y, int _radio, CRGB _c, bool _fill);

  uint16_t m_width=5;
  uint16_t m_height=5;
  GFXcanvas *m_canvas;
  CRGB *m_leds;

  Ticker m_ticker_scroll;
  bool m_scrolling;
  String m_scroll_text;
  int m_scroll_width;
  int m_scroll_x;
  int m_scroll_step;

private: 

};

#endif