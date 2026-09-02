// project-specific definitions

//#define CFG_eu868 1
//#define CFG_us915 1

//#define LMIC_REGION_eu868 1
//#define LMIC_REGION_us915 2
//#define LMIC_REGION_cn783 3
//#define LMIC_REGION_eu433 4
//#define LMIC_REGION_au915 5
//#define LMIC_REGION_cn490 6
//#define LMIC_REGION_as923 7
//#define LMIC_REGION_kr920 8
//#define LMIC_REGION_in866 9
//#define CFG_au921 1
//#define CFG_as923 1
//#define LMIC_COUNTRY_CODE LMIC_COUNTRY_CODE_JP	/* for as923-JP */
//#define CFG_kr920 1
//#define CFG_in866 1

//LoRa RADIO
#define CFG_sx1276_radio 1

//#define LMIC_USE_INTERRUPTS
#define LMIC_LORAWAN_SPEC_VERSION    LMIC_LORAWAN_SPEC_VERSION_1_0_3
#define LMIC_MAX_FRAME_LENGTH 64
#define hal_init LMICHAL_init