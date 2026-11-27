
#include "DHT.h"

// ===== DHT11 SENSOR =====
#define DHTPIN 4
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

// ===== RELAY GPIO PINS =====
#define FAN1_RELAY 19
#define FAN2_RELAY 21
#define WATER_RELAY 22

// ===== ACTIVE LOW RELAY =====
#define RELAY_ON LOW
#define RELAY_OFF HIGH

// ===== RELAY STATES =====
bool fan1State = false;
bool fan2State = false;
bool waterState = false;

void setup() {
  Serial.begin(115200);

  // Configure relay pins
  pinMode(FAN1_RELAY, OUTPUT);
  pinMode(FAN2_RELAY, OUTPUT);
  pinMode(WATER_RELAY, OUTPUT);

  // Keep all relays OFF at startup
  digitalWrite(FAN1_RELAY, RELAY_OFF);
  digitalWrite(FAN2_RELAY, RELAY_OFF);
  digitalWrite(WATER_RELAY, RELAY_OFF);

  // Initialize DHT11
  dht.begin();

  Serial.println("==================================");
  Serial.println("     CLAYBREEZE CONTROLLER");
  Serial.println("==================================");
  Serial.println("System Started");
}

void loop() {

  // Read sensor
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();

  // Check sensor reading
  if (isnan(temperature) || isnan(humidity)) {
    Serial.println("ERROR: DHT11 reading failed!");
    delay(2000);
    return;
  }

  // ===== FAN 1 CONTROL =====
  // ON above 26 C
  // OFF at or below 25 C
  if (temperature > 26.0) {
    fan1State = true;
  }
  else if (temperature <= 25.0) {
    fan1State = false;
  }

  // ===== FAN 2 CONTROL =====
  // ON above 30 C
  // OFF at or below 29 C
  if (temperature > 30.0) {
    fan2State = true;
  }
  else if (temperature <= 29.0) {
    fan2State = false;
  }

  // ===== WATER MOTOR CONTROL =====
  // ON below 60% humidity
  // OFF at or above 62% humidity
  if (humidity < 60.0) {
    waterState = true;
  }
  else if (humidity >= 62.0) {
    waterState = false;
  }

  // ===== APPLY RELAY OUTPUTS =====
  digitalWrite(FAN1_RELAY,
               fan1State ? RELAY_ON : RELAY_OFF);

  digitalWrite(FAN2_RELAY,
               fan2State ? RELAY_ON : RELAY_OFF);

  digitalWrite(WATER_RELAY,
               waterState ? RELAY_ON : RELAY_OFF);

  // ===== SERIAL MONITOR DISPLAY =====
  Serial.println("----------------------------------");

  Serial.print("Temperature: ");
  Serial.print(temperature);
  Serial.println(" C");

  Serial.print("Humidity: ");
  Serial.print(humidity);
  Serial.println(" %");

  Serial.print("Fan 1: ");
  Serial.println(fan1State ? "ON" : "OFF");

  Serial.print("Fan 2: ");
  Serial.println(fan2State ? "ON" : "OFF");

  Serial.print("Water Motor: ");
  Serial.println(waterState ? "ON" : "OFF");

  Serial.println("----------------------------------");

  delay(2000);
}
