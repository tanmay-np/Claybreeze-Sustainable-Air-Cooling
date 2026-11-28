/*
 * ClayBreeze controller — ESP32 + DHT11 + 3-channel relay module
 *
 * Pins
 *   DHT11 DATA          GPIO32  (breadboard 7A)
 *   Relay IN1 – Fan 1   GPIO25  (9A)
 *   Relay IN2 – Fan 2   GPIO26  (10A)
 *   Relay IN3 – Motor   GPIO27  (11A)
 *   GND                 common ground (14A)
 *
 * Relay module is ACTIVE-LOW: LOW = ON, HIGH = OFF.
 *
 * Control logic with hysteresis (between the limits each output keeps its state)
 *   Fan 1: ON when T > 26 °C, OFF when T <= 25 °C
 *   Fan 2: ON when T > 30 °C, OFF when T <= 29 °C
 *   Motor: ON when RH < 75 %, OFF when RH >= 77 %
 *
 * The DHT11 is read about every 2 s (millis(), no blocking delay).
 * A failed reading (NaN) is skipped and the outputs stay as they are.
 *
 * Library: "DHT sensor library" by Adafruit (+ "Adafruit Unified Sensor").
 */

#include "DHT.h"

// ===== PINS =====
const uint8_t DHT_PIN   = 32;
const uint8_t FAN1_PIN  = 25;  // relay IN1
const uint8_t FAN2_PIN  = 26;  // relay IN2
const uint8_t MOTOR_PIN = 27;  // relay IN3

#define DHTTYPE DHT11
DHT dht(DHT_PIN, DHTTYPE);

// ===== ACTIVE-LOW RELAY MODULE =====
const uint8_t RELAY_ON  = LOW;
const uint8_t RELAY_OFF = HIGH;

// ===== THRESHOLDS =====
const float FAN1_ON_ABOVE_C      = 26.0;
const float FAN1_OFF_AT_OR_BELOW = 25.0;
const float FAN2_ON_ABOVE_C      = 30.0;
const float FAN2_OFF_AT_OR_BELOW = 29.0;
const float MOTOR_ON_RH  = 75.0;  // motor ON below this RH (%)
const float MOTOR_OFF_RH = 77.0;  // motor OFF at or above this RH (%)

const unsigned long READ_INTERVAL_MS = 2000;

// ===== STATE =====
bool fan1On = false;
bool fan2On = false;
bool motorOn = false;
unsigned long lastReadMs = 0;

void setRelay(uint8_t pin, bool on) {
  digitalWrite(pin, on ? RELAY_ON : RELAY_OFF);
}

void setupRelayPin(uint8_t pin) {
  digitalWrite(pin, RELAY_OFF);  // set HIGH (OFF) first ...
  pinMode(pin, OUTPUT);          // ... then make it an output, so the relay never clicks on at boot
}

void setup() {
  setupRelayPin(FAN1_PIN);
  setupRelayPin(FAN2_PIN);
  setupRelayPin(MOTOR_PIN);

  Serial.begin(115200);
  dht.begin();

  Serial.println("==================================");
  Serial.println("     CLAYBREEZE CONTROLLER");
  Serial.println("==================================");
  Serial.println("All relays OFF. Reading DHT11 every 2 s.");
  Serial.println("Fan 1: ON > 26 C, OFF <= 25 C | Fan 2: ON > 30 C, OFF <= 29 C | Motor: ON < 75 % RH, OFF >= 77 % RH");

  lastReadMs = millis() - READ_INTERVAL_MS;  // first reading straight away
}

void loop() {
  unsigned long now = millis();
  if (now - lastReadMs < READ_INTERVAL_MS) return;
  lastReadMs = now;

  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();

  if (isnan(temperature) || isnan(humidity)) {
    Serial.println("DHT11 read failed - outputs unchanged");
    return;
  }

  // ===== FAN 1 =====
  if (temperature > FAN1_ON_ABOVE_C) fan1On = true;
  else if (temperature <= FAN1_OFF_AT_OR_BELOW) fan1On = false;

  // ===== FAN 2 =====
  if (temperature > FAN2_ON_ABOVE_C) fan2On = true;
  else if (temperature <= FAN2_OFF_AT_OR_BELOW) fan2On = false;

  // ===== WATER MOTOR =====
  if (humidity < MOTOR_ON_RH) motorOn = true;
  else if (humidity >= MOTOR_OFF_RH) motorOn = false;

  setRelay(FAN1_PIN, fan1On);
  setRelay(FAN2_PIN, fan2On);
  setRelay(MOTOR_PIN, motorOn);

  // ===== SERIAL =====
  Serial.print("T: ");
  Serial.print(temperature, 1);
  Serial.print(" C | RH: ");
  Serial.print(humidity, 1);
  Serial.print(" % | Fan1: ");
  Serial.print(fan1On ? "ON" : "OFF");
  Serial.print(" | Fan2: ");
  Serial.print(fan2On ? "ON" : "OFF");
  Serial.print(" | Motor: ");
  Serial.println(motorOn ? "ON" : "OFF");
}
