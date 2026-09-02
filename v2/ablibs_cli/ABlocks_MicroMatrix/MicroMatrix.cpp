#include "MicroMatrix.h"

void _MicroMatrix_TextScrollStep(MicroMatrix *_micromatrix){
  if(_micromatrix->m_scrolling){
    FastLED.clear();
    _micromatrix->m_canvas->setCursor(_micromatrix->m_scroll_x,_micromatrix->m_height-1);
    if(_micromatrix->m_scroll_step<_micromatrix->m_scroll_width){
      _micromatrix->m_scroll_step++;
      _micromatrix->m_scroll_x--;
    }
    else{
      _micromatrix->m_ticker_scroll.detach();
      _micromatrix->m_scrolling=false;
    }
    _micromatrix->m_canvas->print(_micromatrix->m_scroll_text);
    FastLED.show();
  }
}

MicroMatrix::MicroMatrix() {
  m_scrolling=false;
  m_width=5;
  m_height=5;
  m_canvas=new GFXcanvas(m_width,m_height);
  m_leds=m_canvas->getBuffer();
  FastLED.addLeds<WS2812B, 13, GRB>(m_leds, 25);
  m_canvas->setFont(&Font5x5Fixed);
}

void MicroMatrix::SetBrightness(int _b){
    FastLED.setBrightness(_b);
    FastLED.show();
}

void MicroMatrix::Clear(){
    CancelTextScroll();

    FastLED.clear();
    FastLED.show();
}

void MicroMatrix::FillColor(CRGB _c){
    CancelTextScroll();

    for(int _i;_i<25;_i++){
      m_leds[_i]=_c;
    }
    FastLED.show();
}

void MicroMatrix::Pixel(int _i, CRGB _c){
  CancelTextScroll();

  m_leds[_i]=_c;
  FastLED.show();
}

void MicroMatrix::PixelXY(int _x, int _y, CRGB _c){
  CancelTextScroll();

  m_leds[(_y*m_width)+_x]=_c;
  FastLED.show();
}

void MicroMatrix::Bitmap(CRGB _bmp[25]){
  CancelTextScroll();

  for(int _i=0;_i<25;_i++){
    m_leds[_i]=_bmp[_i];
  }
  FastLED.show();
}


void MicroMatrix::Text(int _x, int _y,String _t, CRGB _c){
  
  CancelTextScroll();
  FastLED.clear();
  m_canvas->setTextColor(_c);
  m_canvas->setCursor(_x,_y+m_height-1);
  m_canvas->print(_t);
  FastLED.show();
}

void MicroMatrix::TextScroll(String _t, CRGB _c, int _delay){
  
  CancelTextScroll();

  //new scroll text
  int16_t x,y;
  uint16_t w,h;
  m_canvas->setTextWrap(false);
  m_canvas->getTextBounds((char*)_t.c_str(),0,0,&x,&y,&w,&h);
  m_canvas->setTextColor(_c);
  
  m_scrolling=true;
  m_scroll_text=_t;
  m_scroll_width=w+m_width;
  m_scroll_x=m_width;
  m_scroll_step=0;

  m_ticker_scroll.attach_ms(_delay, _MicroMatrix_TextScrollStep, this);
}

void MicroMatrix::CancelTextScroll(){
  if(m_scrolling){  //cancel previous scroll
    m_ticker_scroll.detach();
    m_scrolling=false;    
  }
}

bool MicroMatrix::isTextScrolling(){
  return m_scrolling;
}

void MicroMatrix::Line(int _x1,int _y1,int _x2,int _y2, CRGB _c){
  m_canvas->drawLine(_x1,_y1,_x2,_y2,_c);
  FastLED.show();
}

void MicroMatrix::Rect(int _x,int _y,int _w,int _h, CRGB _c, bool _fill){
  if(_fill)
    m_canvas->fillRect(_x,_y,_w,_h,_c);
  else
    m_canvas->drawRect(_x,_y,_w,_h,_c);
  FastLED.show();
}

void MicroMatrix::Circle(int _x,int _y, int _radio, CRGB _c, bool _fill){
  if(_fill)
    m_canvas->fillCircle(_x,_y,_radio,_c);
  else
    m_canvas->drawCircle(_x,_y,_radio,_c);
  FastLED.show();
}

