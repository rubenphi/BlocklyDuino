#include <Adafruit_GFX.h>
#include <Adafruit_ST7789.h>
#include <SPI.h>

// Pines TFT
static const int TFT_SCK  = 20;
static const int TFT_MOSI = 21;
static const int TFT_CS   = 41;
static const int TFT_DC   = 40;
static const int TFT_RST  = 38;
static const int TFT_BLK  = 42;

// Bus SPI #2 (global)
SPIClass spiTFT(1);

// TFT (global)
Adafruit_ST7789 tft(&spiTFT, TFT_CS, TFT_DC, TFT_RST);

static inline void TFT_Backlight(uint8_t on) {
  // Si tu BLK es invertido (muy probable por tus síntomas), deja esto:
  digitalWrite(TFT_BLK, on ? LOW : HIGH);
  // Si no es invertido, usa: digitalWrite(TFT_BLK, on ? HIGH : LOW);
}

void setup() {
  pinMode(TFT_BLK, OUTPUT);
  TFT_Backlight(0); // encender backlight

  // Importante: SS = -1 (no pasar CS aquí)
  spiTFT.begin(TFT_SCK, -1, TFT_MOSI, -1);

  tft.init(240, 240);
  tft.setRotation(0);
  tft.fillScreen(0xF800); // rojo
}

void loop() {}


